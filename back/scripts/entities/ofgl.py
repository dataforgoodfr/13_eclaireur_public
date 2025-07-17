import pandera.polars as pa
from pandera.typing.polars import Series


class OfglCommuneRecordDataframe(pa.DataFrameModel):
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

    class Config:
        strict = "filter"
        coerce = True


class OfglDepartementRegionGfpRecordDataframe(pa.DataFrameModel):
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

    class Config:
        strict = "filter"
        coerce = True
