import pandera.polars as pa
import polars as pl
from pandera.typing.polars import Series


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


class Ofgl2023RecordDataframe(pa.DataFrameModel):
    exer: str = pa.Field(
        nullable=True, description="Exercice budgétaire", title="Exercice", alias="Exercice"
    )
    outre_mer: str = pa.Field(
        nullable=True,
        description="Appartenance de la collectivité à l'outre-mer : oui/non",
        title="Outre-mer",
        alias="Outre-mer",
    )
    reg_code: str = pa.Field(
        nullable=True,
        description="Numéro Insee 2023 de la région ou assimilé",
        title="Code Insee 2023 Région",
        alias="Code Insee 2023 Région",
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
    )
    ptot: int = pa.Field(
        nullable=True,
        coerce=True,
        description="Population Insee totale au 1er janvier de l'exercice",
        title="Population totale",
        alias="Population totale",
    )

    @pa.check("Exercice")
    @classmethod
    def check_exer_format(cls, series: pl.Series) -> pl.Series:
        return series.str.contains(r"^\d{4}$")

    @pa.check("Outre-mer")
    @classmethod
    def check_outre_mer_values(cls, series: pl.Series) -> pl.Series:
        return series.is_in(["Oui", "Non"])

    @pa.check("Code Insee 2023 Région")
    @classmethod
    def check_reg_code_format(cls, series: pl.Series) -> pl.Series:
        return series.str.contains(r"^\d{2,3}$")

    @pa.check("Code Siren Collectivité")
    @classmethod
    def check_siren_validity(cls, series: pl.Series) -> pl.Series:
        return series.map_elements(is_valid_siren, return_dtype=pl.Boolean)

    @pa.check("Population totale")
    @classmethod
    def check_ptot_positive(cls, series: pl.Series) -> pl.Series:
        return series >= 0

    class Config:
        strict = "filter"
        coerce = True


class Ofgl2024RecordDataframe(pa.DataFrameModel):
    exer: str = pa.Field(
        nullable=True, description="Exercice budgétaire", title="Exercice", alias="Exercice"
    )
    outre_mer: str = pa.Field(
        nullable=True,
        description="Appartenance de la collectivité à l'outre-mer : oui/non",
        title="Outre-mer",
        alias="Outre-mer",
    )
    reg_code: str = pa.Field(
        nullable=True,
        description="Numéro Insee 2024 de la région ou assimilé",
        title="Code Insee 2024 Région",
        alias="Code Insee 2024 Région",
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
    )
    ptot: int = pa.Field(
        nullable=True,
        coerce=True,
        description="Population Insee totale au 1er janvier de l'exercice",
        title="Population totale",
        alias="Population totale",
    )

    @pa.check("Exercice")
    @classmethod
    def check_exer_format(cls, series: pl.Series) -> pl.Series:
        return series.str.contains(r"^\d{4}$")

    @pa.check("Outre-mer")
    @classmethod
    def check_outre_mer_values(cls, series: pl.Series) -> pl.Series:
        return series.is_in(["Oui", "Non"])

    @pa.check("Code Insee 2024 Région")
    @classmethod
    def check_reg_code_format(cls, series: pl.Series) -> pl.Series:
        return series.str.contains(r"^\d{2,3}$")

    @pa.check("Code Siren Collectivité")
    @classmethod
    def check_siren_validity(cls, series: pl.Series) -> pl.Series:
        return series.map_elements(is_valid_siren, return_dtype=pl.Boolean)

    @pa.check("Population totale")
    @classmethod
    def check_ptot_positive(cls, series: pl.Series) -> pl.Series:
        return series >= 0

    class Config:
        strict = "filter"
        coerce = True
