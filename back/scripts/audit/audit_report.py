"""Automated audit report generation after each ETL run.

Collects key metrics from the warehouse parquet files (row counts, yearly
breakdowns, null rates, bareme score distributions) and saves them as a
timestamped JSON report plus a human-readable HTML dashboard.
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path

import polars as pl

LOGGER = logging.getLogger(__name__)


def generate_audit_report(config: dict) -> Path:
    """Generate an audit report from warehouse parquet files.

    Returns the path to the generated JSON report.
    """
    warehouse_folder = Path(config["warehouse"]["data_folder"])
    audit_folder = warehouse_folder / "audit"
    audit_folder.mkdir(exist_ok=True, parents=True)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")

    report = {
        "timestamp": timestamp,
        "tables": {},
    }

    table_configs = {
        "collectivites": {"year_col": None, "amount_col": None},
        "marches_publics": {
            "year_col": "annee_notification",
            "amount_col": "montant_du_marche_public",
        },
        "subventions": {"year_col": "annee", "amount_col": "montant"},
        "comptes_collectivites": {"year_col": "annee", "amount_col": None},
        "elus": {"year_col": None, "amount_col": None},
        "bareme": {"year_col": "annee", "amount_col": None},
        "declarations_interet": {"year_col": None, "amount_col": None},
        "communities_contacts": {"year_col": None, "amount_col": None},
    }

    for table_name, opts in table_configs.items():
        parquet_path = warehouse_folder / f"{table_name}.parquet"
        if not parquet_path.exists():
            LOGGER.warning("  Parquet file %s not found, skipping", parquet_path)
            report["tables"][table_name] = {"status": "missing"}
            continue

        df = pl.read_parquet(parquet_path)
        table_report = _collect_table_metrics(df, table_name, opts)
        report["tables"][table_name] = table_report
        LOGGER.info(
            "  %s: %d rows collected", table_name, table_report["row_count"]
        )

    json_path = audit_folder / f"audit_{timestamp}.json"
    json_path.write_text(json.dumps(report, indent=2, default=str))
    LOGGER.info("Audit JSON report saved to %s", json_path)

    html_path = audit_folder / f"audit_{timestamp}.html"
    html_path.write_text(_render_html(report))
    LOGGER.info("Audit HTML report saved to %s", html_path)

    _update_latest_symlink(audit_folder, json_path, html_path)

    return json_path


def _collect_table_metrics(
    df: pl.DataFrame, table_name: str, opts: dict
) -> dict:
    """Collect metrics for a single table."""
    metrics: dict = {
        "row_count": len(df),
        "column_count": len(df.columns),
        "columns": df.columns,
    }

    null_rates = {}
    for col in df.columns:
        null_count = df[col].null_count()
        null_rates[col] = round(null_count / max(len(df), 1) * 100, 2)
    metrics["null_rates_pct"] = null_rates

    year_col = opts.get("year_col")
    if year_col and year_col in df.columns:
        yearly = (
            df.group_by(year_col)
            .agg(pl.len().alias("count"))
            .sort(year_col)
        )
        metrics["yearly_breakdown"] = {
            str(row[year_col]): row["count"]
            for row in yearly.iter_rows(named=True)
        }

    amount_col = opts.get("amount_col")
    if amount_col and amount_col in df.columns:
        numeric = df[amount_col].drop_nulls().cast(pl.Float64, strict=False)
        if len(numeric) > 0:
            metrics["amount_stats"] = {
                "total": float(numeric.sum()),
                "mean": float(numeric.mean()),
                "median": float(numeric.median()),
                "min": float(numeric.min()),
                "max": float(numeric.max()),
                "null_count": df[amount_col].null_count(),
            }

    if table_name == "bareme":
        for score_col in ["mp_score", "subventions_score", "global_score"]:
            if score_col in df.columns:
                dist = (
                    df.group_by(score_col)
                    .agg(pl.len().alias("count"))
                    .sort(score_col)
                )
                metrics[f"{score_col}_distribution"] = {
                    str(row[score_col]): row["count"]
                    for row in dist.iter_rows(named=True)
                }

    return metrics


def _render_html(report: dict) -> str:
    """Render a simple HTML audit dashboard."""
    timestamp = report["timestamp"]
    rows_html = ""
    details_html = ""

    for table_name, metrics in report["tables"].items():
        if metrics.get("status") == "missing":
            rows_html += f"<tr><td>{table_name}</td><td colspan='3'>MISSING</td></tr>\n"
            continue

        row_count = metrics["row_count"]
        col_count = metrics["column_count"]
        high_null_cols = sum(
            1 for v in metrics.get("null_rates_pct", {}).values() if v > 50
        )
        rows_html += (
            f"<tr><td>{table_name}</td>"
            f"<td>{row_count:,}</td>"
            f"<td>{col_count}</td>"
            f"<td>{high_null_cols}</td></tr>\n"
        )

        detail = f'<div class="table-detail"><h3>{table_name}</h3>'

        if "yearly_breakdown" in metrics:
            detail += "<h4>Yearly Breakdown</h4><table><tr><th>Year</th><th>Count</th></tr>"
            for year, count in metrics["yearly_breakdown"].items():
                detail += f"<tr><td>{year}</td><td>{count:,}</td></tr>"
            detail += "</table>"

        if "amount_stats" in metrics:
            stats = metrics["amount_stats"]
            detail += "<h4>Amount Statistics</h4><table>"
            for k, v in stats.items():
                detail += f"<tr><td>{k}</td><td>{v:,.2f}</td></tr>"
            detail += "</table>"

        for score_col in ["mp_score_distribution", "subventions_score_distribution", "global_score_distribution"]:
            if score_col in metrics:
                detail += f"<h4>{score_col.replace('_', ' ').title()}</h4><table><tr><th>Score</th><th>Count</th></tr>"
                for score, count in metrics[score_col].items():
                    detail += f"<tr><td>{score}</td><td>{count:,}</td></tr>"
                detail += "</table>"

        if "null_rates_pct" in metrics:
            high_nulls = {
                k: v
                for k, v in metrics["null_rates_pct"].items()
                if v > 10
            }
            if high_nulls:
                detail += "<h4>Columns with >10% null rate</h4><table><tr><th>Column</th><th>Null %</th></tr>"
                for col, pct in sorted(high_nulls.items(), key=lambda x: -x[1]):
                    detail += f"<tr><td>{col}</td><td>{pct:.1f}%</td></tr>"
                detail += "</table>"

        detail += "</div>"
        details_html += detail

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ETL Audit Report – {timestamp}</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 2rem; background: #f8f9fa; }}
  h1 {{ color: #1a1a2e; }}
  h2 {{ color: #16213e; margin-top: 2rem; }}
  h3 {{ color: #0f3460; border-bottom: 2px solid #e94560; padding-bottom: .3rem; }}
  table {{ border-collapse: collapse; margin: 1rem 0; width: 100%; max-width: 800px; }}
  th, td {{ border: 1px solid #ddd; padding: 8px 12px; text-align: left; }}
  th {{ background: #1a1a2e; color: white; }}
  tr:nth-child(even) {{ background: #f2f2f2; }}
  .table-detail {{ background: white; border-radius: 8px; padding: 1rem 1.5rem; margin: 1rem 0; box-shadow: 0 1px 3px rgba(0,0,0,.1); }}
  .comparison {{ background: #fff3cd; padding: 1rem; border-radius: 8px; margin: 1rem 0; }}
  .delta-positive {{ color: #28a745; }}
  .delta-negative {{ color: #dc3545; }}
</style>
</head>
<body>
<h1>ETL Audit Report</h1>
<p>Generated: {timestamp}</p>

<h2>Summary</h2>
<table>
  <tr><th>Table</th><th>Rows</th><th>Columns</th><th>High-Null Cols (&gt;50%)</th></tr>
  {rows_html}
</table>

<h2>Details</h2>
{details_html}

<div id="comparison"></div>
</body>
</html>"""


def _update_latest_symlink(
    audit_folder: Path, json_path: Path, html_path: Path
) -> None:
    """Maintain 'latest' symlinks for easy access."""
    for suffix, path in [("json", json_path), ("html", html_path)]:
        link = audit_folder / f"audit_latest.{suffix}"
        if link.is_symlink() or link.exists():
            link.unlink()
        link.symlink_to(path.name)
