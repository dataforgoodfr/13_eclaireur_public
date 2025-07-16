import pandera.polars as pa
from pandera.typing.polars import Series


class OfglRecordDataframe(pa.DataFrameModel):
    exer: Series[str] = pa.Field(
        nullable=True, description="Exercice budgétaire", title="Exercice", alias="Exercice"
    )
    outre_mer: Series[str] = pa.Field(
        nullable=True,
        description="Appartenance de la collectivité à l'outre-mer : oui/non",
        title="Outre-mer",
        alias="Outre-mer",
    )
    reg_code: Series[str] = pa.Field(
        nullable=True,
        description="Numéro Insee 2023 de la région ou assimilé",
        title="Code Insee 2023 Région",
        alias="Code Insee 2023 Région",
    )
    reg_name: Series[str] = pa.Field(
        nullable=True,
        description="Nom 2023 de la région ou assimilé",
        title="Nom 2023 Région",
        alias="Nom 2023 Région",
    )
    dep_code: Series[str] = pa.Field(
        nullable=True,
        description="Numéro Insee 2023 du département ou assimilé",
        title="Code Insee 2023 Département",
        alias="Code Insee 2023 Département",
    )
    dep_name: Series[str] = pa.Field(
        nullable=True,
        description="Nom 2023 du département ou assimilé",
        title="Nom 2023 Département",
        alias="Nom 2023 Département",
    )
    epci_code: Series[str] = pa.Field(
        nullable=True,
        description="Numéro Siren 2023 du groupement à fiscalité propre ou de l’établissement public territorial (EPT)",
        title="Code Siren 2023 EPCI",
        alias="Code Siren 2023 EPCI",
    )
    epci_name: Series[str] = pa.Field(
        nullable=True,
        description="Nom 2023 du groupement à fiscalité propre ou de l’établissement public territorial (EPT)",
        title="Nom 2023 EPCI",
        alias="Nom 2023 EPCI",
    )
    tranche_population: Series[str] = pa.Field(
        nullable=True,
        description="Strate de population au 1er janvier 2023 codée (0 si < 100 hab ; 1 si >= 100 hab et < 200 hab ; 2 si >= 200 hab et < 500 hab ; 3 si >= 500 hab et < 2 000 hab ; 4 si >= 2 000 hab et < 3 500 hab ; 5 si >= 3 500 hab et < 5 000 hab ; 6 si >= 5 000 hab et < 10 000 hab ; 7 si >= 10 000 hab et < 20 000 hab ; 8 si >= 20 000 hab et < 50 000 hab ; 9 si >= 50 000 hab et < 100 000 hab ; 10 si >= 100 000 hab)",
        title="Strate population 2023",
        alias="Strate population 2023",
    )
    rural: Series[str] = pa.Field(
        nullable=True,
        description="Commune classée comme rural : oui/non",
        title="Commune rurale",
        alias="Commune rurale",
    )
    montagne: Series[str] = pa.Field(
        nullable=True,
        description="Commune classée comme montagne : oui/non",
        title="Commune de montagne",
        alias="Commune de montagne",
    )
    touristique: Series[str] = pa.Field(
        nullable=True,
        description="Commune classée comme touristique : oui/non",
        title="Commune touristique",
        alias="Commune touristique",
    )
    tranche_revenu_imposable_par_habitant: Series[str] = pa.Field(
        nullable=True,
        description="Tranche de revenu imposable par habitant codée (0 si < 10 000€ ; 1 si >= 10 000€ et < 15 000€ ; 2 si >= 15 000€ et < 20 000 ; 3 si >= 20 000€ et < 25 000€ ; 4 si >= 25 000€ et < 30 000€ ; 5 si >= 30 000€)",
        title="Tranche revenu par habitant",
        alias="Tranche revenu par habitant",
    )
    qpv: Series[str] = pa.Field(
        nullable=True,
        description="Présence de quartiers prioritaires de la ville : oui/non",
        title="Présence QPV",
        alias="Présence QPV",
    )
    com_code: Series[str] = pa.Field(
        nullable=True,
        description="Numéro Insee 2023 de la commune",
        title="Code Insee 2023 Commune",
        alias="Code Insee 2023 Commune",
    )
    com_name: Series[str] = pa.Field(
        nullable=True,
        description="Nom 2023 de la commune",
        title="Nom 2023 Commune",
        alias="Nom 2023 Commune",
    )
    categ: Series[str] = pa.Field(
        nullable=True,
        description="Catégorie de collectivité : Commune pour commune, PARIS pour la ville de Paris",
        title="Catégorie",
        alias="Catégorie",
    )
    siren: Series[str] = pa.Field(
        nullable=True,
        description="Numéro Siren de la commune",
        title="Code Siren Collectivité",
        alias="Code Siren Collectivité",
    )
    insee: Series[str] = pa.Field(
        nullable=True,
        description="Code Insee de la commune",
        title="Code Insee Collectivité",
        alias="Code Insee Collectivité",
    )
    lbudg: Series[str] = pa.Field(
        nullable=True,
        description="Nom de la collectivité sur l'exercice",
        title="Libellé Budget",
        alias="Libellé Budget",
    )
    agregat: Series[str] = pa.Field(
        nullable=True,
        description="Nom de l'agrégat financier",
        title="Agrégat",
        alias="Agrégat",
    )
    montant_bp: Series[float] = pa.Field(
        nullable=True,
        coerce=True,
        description="Valeur de l'agrégat pour le budget principal",
        title="Montant BP",
        alias="Montant BP",
    )
    montant_ba: Series[float] = pa.Field(
        nullable=True,
        coerce=True,
        description="Valeur de l'agrégat pour les éventuels budgets annexes",
        title="Montant BA",
        alias="Montant BA",
    )
    montant_flux: Series[float] = pa.Field(
        nullable=True,
        coerce=True,
        description="Valeur des éventuels flux croisés entre le budget principal et les budgets annexes pour l'agrégat",
        title="Montant flux BP-BA",
        alias="Montant flux BP-BA",
    )
    montant: Series[float] = pa.Field(
        nullable=True,
        coerce=True,
        description="Valeur de l'agrégat en € (Montant BP + Montant BA - Montant croisés BP-BA)",
        title="Montant",
        alias="Montant",
    )
    montant_en_millions: Series[float] = pa.Field(
        nullable=True,
        coerce=True,
        description="Valeur de l'agrégat en millions d'€",
        title="Montant en millions",
        alias="Montant en millions",
    )
    ptot: Series[int] = pa.Field(
        nullable=True,
        coerce=True,
        description="Population Insee totale au 1er janvier de l'exercice",
        title="Population totale",
        alias="Population totale",
    )
    euros_par_habitant: Series[float] = pa.Field(
        nullable=True,
        coerce=True,
        description="Valeur de l'agrégat en € par habitant",
        title="Montant en € par habitant",
        alias="Montant en € par habitant",
    )
    presence_budget: Series[str] = pa.Field(
        nullable=True,
        description="Disponibilité du budget principal sur 2023 : 1=oui ; 0=non",
        title="Compte 2023 Disponible",
        alias="Compte 2023 Disponible",
    )
    ordre_analyse1_section1: Series[str] = pa.Field(
        nullable=True,
        description="Variable interne OFGL pour data visualisation",
        title="ordre_analyse1_section1",
        alias="ordre_analyse1_section1",
    )
    ordre_analyse1_section2: Series[str] = pa.Field(
        nullable=True,
        description="Variable interne OFGL pour data visualisation",
        title="ordre_analyse1_section2",
        alias="ordre_analyse1_section2",
    )
    ordre_analyse1_section3: Series[str] = pa.Field(
        nullable=True,
        description="Variable interne OFGL pour data visualisation",
        title="ordre_analyse1_section3",
        alias="ordre_analyse1_section3",
    )
    ordre_analyse2_section1: Series[str] = pa.Field(
        nullable=True,
        description="Variable interne OFGL pour data visualisation",
        title="ordre_analyse2_section1",
        alias="ordre_analyse2_section1",
    )
    ordre_analyse2_section2: Series[str] = pa.Field(
        nullable=True,
        description="Variable interne OFGL pour data visualisation",
        title="ordre_analyse2_section2",
        alias="ordre_analyse2_section2",
    )
    ordre_analyse2_section3: Series[str] = pa.Field(
        nullable=True,
        description="Variable interne OFGL pour data visualisation",
        title="ordre_analyse2_section3",
        alias="ordre_analyse2_section3",
    )
    ordre_analyse3_section1: Series[str] = pa.Field(
        nullable=True,
        description="Variable interne OFGL pour data visualisation",
        title="ordre_analyse3_section1",
        alias="ordre_analyse3_section1",
    )
    ordre_analyse3_section2: Series[str] = pa.Field(
        nullable=True,
        description="Variable interne OFGL pour data visualisation",
        title="ordre_analyse3_section2",
        alias="ordre_analyse3_section2",
    )
    ordre_analyse3_section3: Series[str] = pa.Field(
        nullable=True,
        description="Variable interne OFGL pour data visualisation",
        title="ordre_analyse3_section3",
        alias="ordre_analyse3_section3",
    )
    ordre_analyse4_section1: Series[str] = pa.Field(
        nullable=True,
        description="Variable interne OFGL pour data visualisation",
        title="ordre_analyse4_section1",
        alias="ordre_analyse4_section1",
    )
    annee_join: Series[str] = pa.Field(
        nullable=True, description="", title="annee_join", alias="annee_join"
    )
    ptot_n: Series[int] = pa.Field(
        nullable=True,
        coerce=True,
        description="",
        title="Population totale du dernier exercice",
        alias="Population totale du dernier exercice",
    )

    class Config:
        strict = "filter"
        coerce = True
