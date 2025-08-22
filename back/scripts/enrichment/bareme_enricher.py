import typing
from datetime import datetime
from pathlib import Path

import math
import polars as pl

from back.scripts.communities.communities_selector import CommunitiesSelector
from back.scripts.enrichment.base_enricher import BaseEnricher
from back.scripts.enrichment.financial_account_enricher import FinancialEnricher
from back.scripts.enrichment.marches_enricher import MarchesPublicsEnricher
from back.scripts.enrichment.subventions_enricher import SubventionsEnricher


class BaremeEnricher(BaseEnricher):
    """
    Enrichisseur de données pour créer un barème de notation des collectivités.

    Cette classe combine les données de subventions et de marchés publics pour évaluer
    la transparence et la qualité de publication des données par les collectivités.
    Le barème génère des scores de A (excellent) à E (insuffisant) basés sur :
    - Le taux de déclaration des subventions (comparaison déclaré vs budget)
    - La qualité et complétude des données de marchés publics

    Hérite de BaseEnricher pour suivre le pattern d'enrichissement standardisé.
    """

    @classmethod
    def get_dataset_name(cls) -> str:
        """
        Retourne le nom du dataset pour l'identification du processus d'enrichissement.

        Returns:
            str: Nom du dataset "bareme"
        """
        return "bareme"

    @classmethod
    def get_input_paths(cls, main_config: dict) -> typing.List[Path]:
        """
        Définit les chemins des fichiers d'entrée nécessaires au calcul du barème.

        Args:
            main_config (dict): Configuration principale contenant les chemins de base

        Returns:
            typing.List[Path]: Liste des chemins vers :
                - Données des collectivités (communities)
                - Données des subventions enrichies
                - Données financières
                - Données des marchés publics enrichies
        """
        return [
            CommunitiesSelector.get_output_path(main_config),
            SubventionsEnricher.get_output_path(main_config),
            FinancialEnricher.get_output_path(main_config),
            MarchesPublicsEnricher.get_output_path(main_config),
        ]

    @classmethod
    def _clean_and_enrich(cls, inputs) -> pl.DataFrame:
        """
        Méthode principale d'enrichissement qui orchestre le calcul du barème.

        Processus :
        1. Validation des entrées (4 DataFrames attendus)
        2. Construction de la table de base (toutes collectivités × toutes années)
        3. Calcul du score subventions
        4. Calcul du score marchés publics
        5. Jointure finale des scores
        6. Calcul du score agrégé

        Args:
            inputs (typing.List[pl.DataFrame]): Liste des 4 DataFrames d'entrée :
                [communities, subventions, financial, marches_publics]

        Returns:
            pl.DataFrame: DataFrame final avec colonnes [siren, annee, subventions_score, mp_score]

        Raises:
            ValueError: Si le nombre d'inputs n'est pas égal à 4
        """

        # Décomposition des inputs pour plus de lisibilité
        communities, subventions, financial, marches_publics = inputs

        # Construction du tableau de base : matrice collectivités × années (2016 à aujourd'hui)
        bareme_communities = cls.build_bareme_table(communities)

        # Calcul du score basé sur la transparence des subventions
        bareme_subvention = cls.bareme_subventions(subventions, financial, bareme_communities)

        # Calcul du score basé sur la qualité des données marchés publics
        bareme_mp = cls.bareme_marchespublics(marches_publics, communities)

        # Jointure finale des deux scores sur (siren, annee)
        # Left join pour conserver toutes les collectivités même sans données MP
        bareme_final = bareme_subvention.join(bareme_mp, on=["siren", "annee"], how="left")

        # Calcul du score agrégé
        bareme_score_agrege = cls.bareme_agrege(bareme_final)

        return bareme_score_agrege

    @classmethod
    def build_bareme_table(cls, communities: pl.DataFrame) -> pl.DataFrame:
        """
        Construit la table de base du barème avec toutes les combinaisons collectivité × année.

        Crée un produit cartésien entre :
        - Toutes les collectivités (SIREN valides)
        - Toutes les années de 2016 à l'année courante

        Cette approche garantit qu'on évalue chaque collectivité pour chaque année
        de la période d'analyse, même en l'absence de données.

        Args:
            communities (pl.DataFrame): DataFrame des collectivités avec colonne 'siren'

        Returns:
            pl.DataFrame: Table avec colonnes [siren, annee] pour toutes les combinaisons
        """
        # Générer la liste des années valides (2016 à année courante incluse)
        current_year = datetime.now().year
        valid_years = pl.DataFrame({"annee": list(range(2016, current_year + 1))})

        # Produit cartésien : chaque SIREN × chaque année
        # Filtrage des SIREN null pour éviter les données corrompues
        bareme_table = (
            communities.select("siren")
            .filter(pl.col("siren") != "null")  # Exclusion des SIREN invalides
            .join(valid_years, how="cross")  # Produit cartésien
        )

        return bareme_table

    @classmethod
    def bareme_subventions(
        cls,
        subventions: pl.DataFrame,
        financial: pl.DataFrame,
        bareme_table: pl.DataFrame,
    ) -> pl.DataFrame:
        """
        Calcule le score de transparence basé sur la déclaration des subventions.

        Le score évalue la cohérence entre :
        - Les subventions effectivement déclarées (base de données publique)
        - Les subventions budgétées (données financières officielles)

        Logique du scoring :
        - Taux = (subventions déclarées / subventions budgétées) × 100
        - Score A : ]95%, 105%] (très bon)
        - Score B : ]75%, 95%] (bon)
        - Score C : ]50%, 75%] (moyen)
        - Score D : ]25%, 50%] (faible)
        - Score E : ≤25% ou >105% (insuffisant/suspect)

        Args:
            subventions (pl.DataFrame): Données des subventions déclarées
            financial (pl.DataFrame): Données budgétaires officielles
            bareme_table (pl.DataFrame): Table de base (siren × annee)

        Returns:
            pl.DataFrame: Scores avec colonnes [siren, annee, subventions_score]
        """
        # Filtrage sur la période d'analyse (2016 à aujourd'hui)
        current_year = datetime.now().year
        valid_years = list(range(2016, current_year + 1))
        subventions_Filtred = subventions.filter(pl.col("annee").is_in(valid_years))

        # Agrégation : somme des montants déclarés par collectivité et par année
        sub_agg = (
            subventions_Filtred.group_by(["id_attribuant", "annee"])
            .agg(pl.col("montant").sum().alias("total_subventions_declarees"))
            .rename({"id_attribuant": "siren"})  # Harmonisation nom colonne
        )

        # Extraction des données budgétaires (subventions prévues)
        budget = financial.select(["siren", "annee", "subventions"])

        # Double jointure pour récupérer subventions déclarées ET budgétées
        bareme_join = bareme_table.join(
            sub_agg,
            on=["siren", "annee"],
            how="left",  # Subventions déclarées
        ).join(budget, on=["siren", "annee"], how="left")  # Budget prévu

        # Nettoyage : remplacement des valeurs nulles par 0
        # Important pour le calcul du taux (éviter division par null)
        bareme_clean = bareme_join.with_columns(
            [
                pl.col("total_subventions_declarees").fill_null(0.0),
                pl.col("subventions").fill_null(0.0),
                (pl.col("subventions")).alias("subventions_budget"),  # Alias pour clarté
            ]
        )

        # Calcul du taux de déclaration (en pourcentage)
        # Gestion de la division par zéro : NaN si budget = 0
        bareme_taux = bareme_clean.with_columns(
            [
                pl.when(pl.col("subventions_budget") != 0)
                .then(
                    (pl.col("total_subventions_declarees") / pl.col("subventions_budget"))
                    * 100.0  # Conversion en pourcentage
                )
                .otherwise(float("nan"))  # Pas de budget = pas de score calculable
                .alias("taux_subventions")
            ]
        )

        # Application de la grille de scoring sur le taux calculé
        bareme_score = bareme_taux.with_columns(
            [
                pl.col("taux_subventions")
                .map_elements(cls.get_score_from_tp)  # Application fonction de scoring
                .cast(pl.Utf8)  # Score en format texte
                .alias("subventions_score")
            ]
        )

        # Retour des colonnes essentielles uniquement
        return bareme_score.select(["siren", "annee", "subventions_score"])

    @staticmethod
    def get_score_from_tp(tp: float) -> str:
        """
        Convertit un taux de publication en score de qualité.

        Règles métier pour l'évaluation de la transparence :
        - Un taux supérieur à 95% et jusqu'à 105% est considéré comme excellent (score A)
        - Un taux > 105% est suspect (possible double comptage ou erreur) → score E
        - Les taux très faibles indiquent une sous-déclaration importante

        Args:
            tp (float): Taux de publication en pourcentage
                       (subventions déclarées / subventions budgétées) × 100

        Returns:
            str: Score de A (excellent) à E (insuffisant)
                - E : ≤ 25% - Transparence insuffisante (sous-déclaration majeure)
                - D : ]25%, 50%] - Transparence faible (sous-déclaration importante)
                - C : ]50%, 75%] - Transparence moyenne (déclaration partielle)
                - B : ]75%, 95%] - Bonne transparence (bonne déclaration)
                - A : ]95%, 105%] - Très bonne transparence (déclaration optimale)
                - E : > 105% - Transparence suspecte (sur-déclaration anormale)

        Note:
            Les valeurs invalides (NaN, inf, négatives) retournent automatiquement E
            pour signaler un problème dans les données source.
        """
        if tp <= 25:
            return "E"  # Sous-déclaration majeure
        elif tp <= 50:
            return "D"  # Sous-déclaration importante
        elif tp <= 75:
            return "C"  # Déclaration partielle
        elif tp <= 95:
            return "B"  # Bonne déclaration
        elif tp <= 105:
            return "A"  # Déclaration optimale
        else:
            return "E"  # Sur-déclaration suspecte

    @classmethod
    def bareme_marchespublics(
        cls, marches_publics: pl.DataFrame, communities: pl.DataFrame
    ) -> pl.DataFrame:
        """
        Calcule le score de qualité basé sur les données de marchés publics.

        Évaluation progressive de la qualité des données selon 5 critères :
        E : Aucune donnée de marché public
        D : Présence de marchés soumis à obligation de publication
        C : Présence de marchés non soumis à obligation (publication volontaire)
        B : Données complètes (montant, dates, CPV, lieux, procédures, etc.)
        A : Respect des délais de publication (≤ 60 jours)

        La logique est cumulative : pour obtenir un score, il faut respecter
        tous les critères inférieurs.

        Args:
            marches_publics (pl.DataFrame): Données des marchés publics enrichies
            communities (pl.DataFrame): Référentiel des collectivités

        Returns:
            pl.DataFrame: Scores avec colonnes [siren, annee, mp_score]
        """
        # Préparation des données marchés publics
        # Filtrage : uniquement acheteurs identifiés + période 2016+
        # Ajout indicateur booléen pour obligation de publication
        marches = marches_publics.filter(
            pl.col("acheteur_id").is_not_null() & (pl.col("annee_notification") >= 2016)
        ).with_columns(
            pl.when(pl.col("obligation_publication") == "Obligatoire")
            .then(1)  # Marché soumis à obligation
            .otherwise(0)  # Marché publié volontairement
            .alias("obligation_publication_bool")
        )

        # Construction table de référence (comme pour subventions)
        current_year = datetime.now().year
        valid_years = pl.DataFrame({"annee": list(range(2016, current_year + 1))})
        communities_table = communities.select(["siren"])
        table = communities_table.join(valid_years, how="cross")

        # Jointure avec les données marchés
        # Left join pour conserver collectivités sans marchés (score E)
        merged_marches = table.join(
            marches,
            left_on=["siren", "annee"],
            right_on=["acheteur_id", "annee_notification"],
            how="left",
        )

        # Agrégations par collectivité et année
        # Comptage et vérification de complétude des champs obligatoires
        bareme_information = merged_marches.group_by(["siren", "annee"]).agg(
            [
                pl.count("id").alias("nombre_de_marches"),  # Nombre total
                pl.sum("obligation_publication_bool"),  # Marchés obligatoires
                pl.sum("montant"),  # Montant total
                pl.median("delai_publication_jours"),  # Délai médian publication
                # Comptage champs renseignés (pour évaluer complétude)
                *[
                    pl.count(col).alias(col)
                    for col in [
                        "date_notification",  # Date de notification
                        "cpv_8",  # Code CPV (classification)
                        "lieu_execution_nom",  # Lieu d'exécution
                        "forme_prix",  # Type de prix
                        "objet",  # Objet du marché
                        "nature",  # Nature du marché
                        "duree_mois",  # Durée
                        "procedure",  # Procédure utilisée
                        "titulaire_id",  # Titulaire
                    ]
                ],
            ]
        )

        # Mapping des critères de qualité (logique booléenne)
        bareme_mapped = bareme_information.with_columns(
            [
                # Critère E : Au moins un marché public référencé
                (pl.col("nombre_de_marches") > 0).cast(pl.Int8).alias("E"),
                # Critère D : Au moins un marché soumis à obligation de publication
                (pl.col("obligation_publication_bool") > 0).cast(pl.Int8).alias("D"),
                # Critère C : Publication volontaire (marchés non obligatoires)
                ((pl.col("nombre_de_marches") - pl.col("obligation_publication_bool")) > 0)
                .cast(pl.Int8)
                .alias("C"),
                # Critère B : Complétude des données essentielles
                # Tous les champs critiques doivent être renseignés
                (
                    (pl.col("montant") > 0)
                    & (pl.col("date_notification").is_not_null())
                    & (pl.col("cpv_8").is_not_null())
                    & (pl.col("lieu_execution_nom").is_not_null())
                    & (pl.col("forme_prix").is_not_null())
                    & (pl.col("objet").is_not_null())
                    & (pl.col("nature").is_not_null())
                    & (pl.col("duree_mois").is_not_null())
                    & (pl.col("procedure").is_not_null())
                    & (pl.col("titulaire_id").is_not_null())
                )
                .cast(pl.Int8)
                .alias("B"),
                # Critère A : Respect délai légal de publication (≤ 60 jours)
                (pl.col("delai_publication_jours") <= 60)
                .fill_null(False)  # Traiter les valeurs manquantes comme non-conformes
                .cast(pl.Int8)
                .alias("A"),
            ]
        )

        # Attribution du score final selon logique cumulative
        # Le score correspond au plus haut niveau atteint
        bareme_score = bareme_mapped.with_columns(
            [
                pl.when(pl.col("E") == 0)  # Pas de marchés
                .then(pl.lit("E"))
                .when(pl.col("D") == 0)  # Pas de marchés obligatoires
                .then(pl.lit("D"))
                .when(pl.col("C") == 0)  # Pas de marchés volontaires
                .then(pl.lit("C"))
                .when(pl.col("B") == 0)  # Données incomplètes
                .then(pl.lit("B"))
                .when(pl.col("A") == 1)  # Délais respectés
                .then(pl.lit("A"))
                .otherwise(pl.lit("B"))  # Cas par défaut : données complètes
                .alias("mp_score")
            ]
        )

        # Retour des colonnes essentielles uniquement
        return bareme_score.select(["siren", "annee", "mp_score"])

    @classmethod
    def bareme_agrege(cls, bareme_df: pl.DataFrame) -> pl.DataFrame:
        """
        Calcule le score agrégé en moyennant les scores subventions et marchés publics.

        Processus :
        1. Conversion des scores lettres (A-E) en valeurs numériques (4-0)
        2. Calcul de la moyenne des deux scores numériques
        3. Arrondi au supérieur de la moyenne
        4. Reconversion du score numérique en lettre
        5. Gestion des cas avec données manquantes

        Mapping utilisé :
        - E → 0, D → 1, C → 2, B → 3, A → 4
        - Moyenne arrondie au supérieur puis reconvertie

        Args:
            bareme_df (pl.DataFrame): DataFrame avec colonnes subventions_score et mp_score

        Returns:
            pl.DataFrame: DataFrame enrichi avec la colonne score_agrege

        Examples:
            subventions_score=A (4), mp_score=B (3) → moyenne=3.5 → ceil=4 → A
            subventions_score=C (2), mp_score=E (0) → moyenne=1.0 → ceil=1 → D
            subventions_score=B (3), mp_score=null → score_agrege=null
        """

        # Définition des mappings de conversion
        # Dictionnaire lettre → nombre pour le calcul numérique
        LETTER_TO_NUMBER = {"E": 0, "D": 1, "C": 2, "B": 3, "A": 4}

        # Dictionnaire nombre → lettre pour la reconversion finale
        NUMBER_TO_LETTER = {0: "E", 1: "D", 2: "C", 3: "B", 4: "A"}

        # Conversion des scores en valeurs numériques
        bareme_numeric = bareme_df.with_columns(
            [
                # Conversion subventions_score : A→4, B→3, etc.
                pl.col("subventions_score")
                .replace(LETTER_TO_NUMBER, default=None)
                .alias("subventions_numeric"),
                # Conversion mp_score : A→4, B→3, etc.
                pl.col("mp_score").replace(LETTER_TO_NUMBER, default=None).alias("mp_numeric"),
            ]
        )

        # Calcul de la moyenne et du score agrégé
        bareme_agrege = bareme_numeric.with_columns(
            [
                # Calcul de la moyenne uniquement si les deux scores sont présents
                pl.when(
                    pl.col("subventions_numeric").is_not_null()
                    & pl.col("mp_numeric").is_not_null()
                )
                .then(
                    # Moyenne des deux scores numériques
                    (pl.col("subventions_numeric") + pl.col("mp_numeric")) / 2.0
                )
                .otherwise(None)  # Si l'un des scores manque → score agrégé null
                .alias("moyenne_numeric")
            ]
        ).with_columns(
            [
                # Arrondi au supérieur et reconversion en lettre
                pl.col("moyenne_numeric")
                .map_elements(
                    lambda x: NUMBER_TO_LETTER.get(math.ceil(x)) if x is not None else None,
                    return_dtype=pl.Utf8,
                )
                .alias("score_agrege")
            ]
        )

        # Suppression des colonnes de calcul temporaires
        # Conservation uniquement des colonnes originales + score_agrege
        final_columns = [col for col in bareme_df.columns] + ["score_agrege"]

        return bareme_agrege.select(final_columns)
