"""Compare the latest audit report with the previous one.

Computes deltas for row counts, score distributions and amount statistics,
and appends a comparison section to the HTML audit report.
"""

import json
import logging
from pathlib import Path

LOGGER = logging.getLogger(__name__)


def compare_with_previous(audit_json_path: Path) -> dict | None:
    """Compare *audit_json_path* with the most recent previous report.

    Returns a comparison dict or ``None`` when no previous report exists.
    """
    audit_folder = audit_json_path.parent
    all_reports = sorted(audit_folder.glob("audit_*.json"))

    previous = None
    for rp in all_reports:
        if rp.resolve() != audit_json_path.resolve():
            previous = rp

    if previous is None:
        LOGGER.info("No previous audit report found – skipping comparison")
        return None

    LOGGER.info("Comparing with previous report: %s", previous.name)

    with open(audit_json_path) as f:
        current = json.load(f)
    with open(previous) as f:
        prev = json.load(f)

    comparison = {
        "current_timestamp": current["timestamp"],
        "previous_timestamp": prev["timestamp"],
        "tables": {},
    }

    all_tables = set(current["tables"]) | set(prev["tables"])

    for table_name in sorted(all_tables):
        cur_t = current["tables"].get(table_name, {})
        prev_t = prev["tables"].get(table_name, {})

        if cur_t.get("status") == "missing" or prev_t.get("status") == "missing":
            comparison["tables"][table_name] = {"note": "table missing in one of the reports"}
            continue

        table_diff: dict = {}

        cur_rows = cur_t.get("row_count", 0)
        prev_rows = prev_t.get("row_count", 0)
        table_diff["row_count"] = {
            "current": cur_rows,
            "previous": prev_rows,
            "delta": cur_rows - prev_rows,
        }

        if "yearly_breakdown" in cur_t or "yearly_breakdown" in prev_t:
            cur_yb = cur_t.get("yearly_breakdown", {})
            prev_yb = prev_t.get("yearly_breakdown", {})
            all_years = set(cur_yb) | set(prev_yb)
            yearly_delta = {}
            for year in sorted(all_years):
                c = cur_yb.get(year, 0)
                p = prev_yb.get(year, 0)
                if c != p:
                    yearly_delta[year] = {"current": c, "previous": p, "delta": c - p}
            if yearly_delta:
                table_diff["yearly_changes"] = yearly_delta

        for score_key in ["mp_score_distribution", "subventions_score_distribution", "global_score_distribution"]:
            if score_key in cur_t or score_key in prev_t:
                cur_sd = cur_t.get(score_key, {})
                prev_sd = prev_t.get(score_key, {})
                all_scores = set(cur_sd) | set(prev_sd)
                score_delta = {}
                for score in sorted(all_scores):
                    c = cur_sd.get(score, 0)
                    p = prev_sd.get(score, 0)
                    if c != p:
                        score_delta[score] = {"current": c, "previous": p, "delta": c - p}
                if score_delta:
                    table_diff[f"{score_key}_changes"] = score_delta

        comparison["tables"][table_name] = table_diff

    return comparison


def append_comparison_to_html(html_path: Path, comparison: dict) -> None:
    """Inject a comparison section into an existing audit HTML report."""
    if comparison is None:
        return

    section = _render_comparison_html(comparison)

    html = html_path.read_text()
    placeholder = '<div id="comparison"></div>'
    if placeholder in html:
        html = html.replace(placeholder, section)
    else:
        html = html.replace("</body>", section + "\n</body>")

    html_path.write_text(html)
    LOGGER.info("Comparison section appended to %s", html_path.name)


def _render_comparison_html(comparison: dict) -> str:
    prev_ts = comparison["previous_timestamp"]

    tables_html = ""
    for table_name, diff in comparison["tables"].items():
        if "note" in diff:
            tables_html += f"<tr><td>{table_name}</td><td colspan='3'>{diff['note']}</td></tr>"
            continue

        rc = diff.get("row_count", {})
        delta = rc.get("delta", 0)
        css = "delta-positive" if delta >= 0 else "delta-negative"
        sign = "+" if delta > 0 else ""
        tables_html += (
            f"<tr><td>{table_name}</td>"
            f"<td>{rc.get('previous', '?'):,}</td>"
            f"<td>{rc.get('current', '?'):,}</td>"
            f'<td class="{css}">{sign}{delta:,}</td></tr>'
        )

    details_html = ""
    for table_name, diff in comparison["tables"].items():
        if "note" in diff:
            continue

        parts = []
        if "yearly_changes" in diff:
            rows = ""
            for year, vals in diff["yearly_changes"].items():
                d = vals["delta"]
                css = "delta-positive" if d >= 0 else "delta-negative"
                sign = "+" if d > 0 else ""
                rows += (
                    f"<tr><td>{year}</td>"
                    f"<td>{vals['previous']:,}</td>"
                    f"<td>{vals['current']:,}</td>"
                    f'<td class="{css}">{sign}{d:,}</td></tr>'
                )
            if rows:
                parts.append(
                    "<h4>Yearly Changes</h4>"
                    "<table><tr><th>Year</th><th>Previous</th><th>Current</th><th>Delta</th></tr>"
                    f"{rows}</table>"
                )

        for score_key in ["mp_score_distribution_changes", "subventions_score_distribution_changes", "global_score_distribution_changes"]:
            if score_key in diff:
                label = score_key.replace("_changes", "").replace("_", " ").title()
                rows = ""
                for score, vals in diff[score_key].items():
                    d = vals["delta"]
                    css = "delta-positive" if d >= 0 else "delta-negative"
                    sign = "+" if d > 0 else ""
                    rows += (
                        f"<tr><td>{score}</td>"
                        f"<td>{vals['previous']:,}</td>"
                        f"<td>{vals['current']:,}</td>"
                        f'<td class="{css}">{sign}{d:,}</td></tr>'
                    )
                if rows:
                    parts.append(
                        f"<h4>{label}</h4>"
                        "<table><tr><th>Score</th><th>Previous</th><th>Current</th><th>Delta</th></tr>"
                        f"{rows}</table>"
                    )

        if parts:
            details_html += f'<div class="table-detail"><h3>{table_name}</h3>{"".join(parts)}</div>'

    return f"""<div class="comparison">
<h2>Comparison with previous run ({prev_ts})</h2>
<table>
  <tr><th>Table</th><th>Previous Rows</th><th>Current Rows</th><th>Delta</th></tr>
  {tables_html}
</table>
{details_html}
</div>"""
