import pandera.polars as pa
from pandera import extensions


def is_valid_siren(siren: str) -> bool:
    """
    Check if a SIREN number is valid using the Luhn algorithm.
    """
    if not isinstance(siren, str) or not siren.isdigit() or len(siren) != 9:
        return False
    total = 0
    for i, digit in enumerate(reversed(siren)):
        n = int(digit)
        if i % 2 == 1:
            n *= 2
            if n > 9:
                n -= 9
        total += n
    return total % 10 == 0


@extensions.register_check_method(check_type="element_wise")
def siren_check_validity(siren: str) -> bool:
    """
    Vérifie la validité du numéro SIREN.
    """
    # Appelle la fonction is_valid_siren définie ci-dessus
    return is_valid_siren(siren)


class Ofgl2024RecordDataframe(pa.DataFrameModel):
    exer: str = pa.Field(
        nullable=True,
        description="Exercice budgétaire",
        title="Exercice",
        alias="Exercice",
        str_matches=r"^\d{4}$",
    )
    outre_mer: str = pa.Field(
        nullable=True,
        description="Appartenance de la collectivité à l'outre-mer : oui/non",
        title="Outre-mer",
        alias="Outre-mer",
        isin=["Oui", "Non"],
    )
    reg_code: str = pa.Field(
        nullable=True,
        description="Numéro Insee 2024 de la région ou assimilé. Attention : Peut contenir deux codes régions séparés par une virgule.",
        title="Code Insee 2024 Région",
        alias="Code Insee 2024 Région",
        str_matches=r"^\d{1,2}(,\d{1,2})*$",
    )

    dep_code: str | None = pa.Field(
        nullable=True,
        description="Numéro Insee 2024 du département ou assimilé. Attention : Peut contenir plusieurs codes départements séparés par une virgule.",
        title="Code Insee 2024 Département",
        alias="Code Insee 2024 Département",
        str_matches=r"^(0[1-9]|[1-8]\d|9[0-5]|97[1-46]|2[AB]|67A|691)(,(0[1-9]|[1-8]\d|9[0-5]|97[1-46]|2[AB]|67A|691))*$",
    )

    categ: str = pa.Field(
        nullable=True,
        description="Catégorie de collectivité : Commune pour commune, PARIS pour la ville de Paris",
        title="Catégorie",
        alias="Catégorie",
    )
    siren: str = pa.Field(
        nullable=True,
        description="Numéro Siren de la commune",
        title="Code Siren Collectivité",
        alias="Code Siren Collectivité",
        siren_check_validity=True,
    )

    ptot: int = pa.Field(
        nullable=True,
        coerce=True,
        description="Population Insee totale au 1er janvier de l'exercice",
        title="Population totale",
        alias="Population totale",
        ge=0,
    )

    insee: str | None = pa.Field(
        nullable=True,
        description="Code Insee de la commune",
        title="Code Insee Collectivité",
        alias="Code Insee Collectivité",
    )

    class Config:
        strict = True
        coerce = True
