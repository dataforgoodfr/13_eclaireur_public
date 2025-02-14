import pandera as pa
from pandera.typing import DataFrame


class CommunitiesNocoordsDfSchema(pa.DataFrameModel):
    nom: str
    siren: int
    type: str
    cog: str
    cog_3digits: str
    code_departement: str
    code_departement_3digits: str
    code_region: str
    population: int
    epci: float
    url_ptf: str
    url_datagouv: str
    id_datagouv: str
    merge: str
    ptf: str
    trancheEffectifsUniteLegale: float
    EffectifsSup50: bool


class CommunitiesWithcoordsDfSchema(CommunitiesNocoordsDfSchema):
    latitude: float
    longitude: float


class EPCICoordsDfSchema(pa.DataFrameModel):
    type: str
    siren: int
    longitude: str
    latitude: str


class RegionDepartmentCoordsDfSchema(pa.DataFrameModel):
    type: str
    cog: str
    longitude: str
    latitude: str


CommunitiesNocoordsDf = DataFrame[CommunitiesNocoordsDfSchema]
CommunitiesWithcoordsDf = DataFrame[CommunitiesWithcoordsDfSchema]
EPCICoordsDf = DataFrame[EPCICoordsDfSchema]
RegionDepartmentCoordsDf = DataFrame[RegionDepartmentCoordsDfSchema]
