import math

import pytest

from back.scripts.enrichment.bareme_enricher import BaremeEnricher


class TestGetScoreFromTp:
    """Tests pour la fonction get_score_from_tp de scoring des subventions."""

    def test_score_e_for_zero_percent(self):
        """Score E pour exactement 0% (aucune donnée)."""
        assert BaremeEnricher.get_score_from_tp(0) == "E"
        assert BaremeEnricher.get_score_from_tp(0.0) == "E"

    def test_score_d_for_very_low_publication(self):
        """Score D pour >0% à 25% (effort minimal)."""
        assert BaremeEnricher.get_score_from_tp(0.001) == "D"
        assert BaremeEnricher.get_score_from_tp(1) == "D"
        assert BaremeEnricher.get_score_from_tp(10) == "D"
        assert BaremeEnricher.get_score_from_tp(24.99) == "D"
        assert BaremeEnricher.get_score_from_tp(25) == "D"

    def test_score_c_for_low_publication(self):
        """Score C pour >25% à 50% (sous-déclaration importante)."""
        assert BaremeEnricher.get_score_from_tp(25.01) == "C"
        assert BaremeEnricher.get_score_from_tp(30) == "C"
        assert BaremeEnricher.get_score_from_tp(40) == "C"
        assert BaremeEnricher.get_score_from_tp(49.99) == "C"
        assert BaremeEnricher.get_score_from_tp(50) == "C"

    def test_score_b_for_medium_to_good_publication(self):
        """Score B pour >50% à 95% (déclaration partielle à bonne)."""
        assert BaremeEnricher.get_score_from_tp(50.01) == "B"
        assert BaremeEnricher.get_score_from_tp(60) == "B"
        assert BaremeEnricher.get_score_from_tp(75) == "B"
        assert BaremeEnricher.get_score_from_tp(80) == "B"
        assert BaremeEnricher.get_score_from_tp(94.99) == "B"
        assert BaremeEnricher.get_score_from_tp(95) == "B"

    def test_score_a_for_excellent_publication(self):
        """Score A pour >95% à 105% (déclaration optimale)."""
        assert BaremeEnricher.get_score_from_tp(95.01) == "A"
        assert BaremeEnricher.get_score_from_tp(100) == "A"
        assert BaremeEnricher.get_score_from_tp(104.99) == "A"
        assert BaremeEnricher.get_score_from_tp(105) == "A"

    def test_score_b_for_over_declaration(self):
        """Score B pour >105% (sur-déclaration : effort de transparence réel)."""
        assert BaremeEnricher.get_score_from_tp(105.01) == "B"
        assert BaremeEnricher.get_score_from_tp(110) == "B"
        assert BaremeEnricher.get_score_from_tp(150) == "B"
        assert BaremeEnricher.get_score_from_tp(200) == "B"

    def test_negative_values_return_e(self):
        """Les valeurs négatives retournent E (données invalides)."""
        assert BaremeEnricher.get_score_from_tp(-1) == "E"
        assert BaremeEnricher.get_score_from_tp(-100) == "E"
        assert BaremeEnricher.get_score_from_tp(-0.001) == "E"

    def test_nan_values_return_e(self):
        """Les valeurs NaN retournent E (données invalides)."""
        assert BaremeEnricher.get_score_from_tp(float("nan")) == "E"

    def test_boundary_values(self):
        """Test des valeurs aux limites exactes."""
        # 0 -> E
        assert BaremeEnricher.get_score_from_tp(0) == "E"
        # 25 -> D (limite incluse)
        assert BaremeEnricher.get_score_from_tp(25) == "D"
        # 50 -> C (limite incluse)
        assert BaremeEnricher.get_score_from_tp(50) == "C"
        # 95 -> B (limite incluse)
        assert BaremeEnricher.get_score_from_tp(95) == "B"
        # 105 -> A (limite incluse)
        assert BaremeEnricher.get_score_from_tp(105) == "A"
        # 105.01 -> B (sur-déclaration : effort de transparence réel)
        assert BaremeEnricher.get_score_from_tp(105.01) == "B"
