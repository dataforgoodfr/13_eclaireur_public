import polars as pl
import pytest

from back.scripts.enrichment.subventions_enricher import SubventionsEnricher


class TestHandleOutlierAmounts:
    def _make_frame(self, montants: list[float | None]) -> pl.LazyFrame:
        return pl.LazyFrame({"montant": montants})

    def test_normal_amount_kept(self):
        result = SubventionsEnricher.handle_outlier_amounts(
            self._make_frame([5_000.0])
        ).collect()
        assert result["montant"][0] == 5_000.0
        assert result["montant_aberrant"][0] is False

    def test_borderline_amount_kept_but_flagged(self):
        result = SubventionsEnricher.handle_outlier_amounts(
            self._make_frame([500_000_000.0])
        ).collect()
        assert result["montant"][0] == 500_000_000.0
        assert result["montant_aberrant"][0] is True

    def test_extreme_amount_nullified_and_flagged(self):
        result = SubventionsEnricher.handle_outlier_amounts(
            self._make_frame([50_000_000_000.0])
        ).collect()
        assert result["montant"][0] is None
        assert result["montant_aberrant"][0] is True

    def test_null_amount_stays_null(self):
        result = SubventionsEnricher.handle_outlier_amounts(self._make_frame([None])).collect()
        assert result["montant"][0] is None
        assert result["montant_aberrant"][0] is False

    def test_exactly_at_borderline_threshold(self):
        result = SubventionsEnricher.handle_outlier_amounts(
            self._make_frame([100_000_000.0])
        ).collect()
        assert result["montant"][0] == 100_000_000.0
        assert result["montant_aberrant"][0] is False

    def test_just_above_borderline_threshold(self):
        result = SubventionsEnricher.handle_outlier_amounts(
            self._make_frame([100_000_001.0])
        ).collect()
        assert result["montant"][0] == 100_000_001.0
        assert result["montant_aberrant"][0] is True
