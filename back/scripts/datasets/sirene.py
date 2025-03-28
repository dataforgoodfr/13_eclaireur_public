import logging
import tempfile
import urllib.request
import zipfile
from pathlib import Path
import pandas as pd 

import polars as pl
from polars import col

from back.scripts.utils.decorators import tracker

LOGGER = logging.getLogger(__name__)

# Source : http://freturb.laet.science/tables/Sirextra.htm
EFFECTIF_CODE_TO_EMPLOYEES = {
    "00": 0,
    "01": 1,
    "02": 3,
    "03": 6,
    "11": 10,
    "12": 20,
    "21": 50,
    "22": 100,
    "31": 200,
    "41": 500,
    "42": 1000,
    "51": 2000,
    "52": 5000,
}


class SireneWorkflow:
    """
    https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/
    """

    def __init__(self, config: dict):
        self._config = config
        self.data_folder = Path(self._config["data_folder"])
        self.data_folder.mkdir(exist_ok=True, parents=True)

        self.filename = self.data_folder / "sirene.parquet"
        self.zip_filename = self.data_folder / "sirene.zip"

    @tracker(ulogger=LOGGER, log_start=True)
    def run(self) -> None:
        self._fetch_zip()
        self._fetch_xls_files()
        self._format_to_parquet()

    def _fetch_zip(self):
        if self.zip_filename.exists():
            return
        urllib.request.urlretrieve(self._config["url"], self.zip_filename)

    def _fetch_xls_files(self):
        xls_links = self._config.get("xls_urls_naf", [])  
        for file_url in xls_links:
            file_name = file_url.split('/')[-1]
            file_path = self.data_folder / file_name
            if not file_path.exists():
                urllib.request.urlretrieve(file_url, file_path)

        xls_url_cat_ju = self._config.get("xls_url_cat_ju") 

        if xls_url_cat_ju:
            file_name = xls_url_cat_ju.split('/')[-1]  
            file_path = self.data_folder / file_name 
            print(xls_url_cat_ju,file_path,file_path.exists()) 
            if not file_path.exists():
                print(file_path)
                urllib.request.urlretrieve(xls_url_cat_ju, file_path)

    def join_naf_level(self,base_df, level, nomenclature_filter_col="nomenclature_naf", nomenclature_value="NAFRev2"):
        """
        Effectue la jointure avec le fichier correspondant au niveau (n1, n2, n3, n4, n5) sur base_df.
        """

        naf_file_path = self.data_folder / f"naf2008_liste_n{level}.xls"

        naf_df = pd.read_excel(naf_file_path, header=2)
        naf_df["Code"] = naf_df["Code"].astype(str).str.replace('.', '', regex=False)
        naf_polars = pl.from_pandas(naf_df[['Code', 'Libellé']])

        if level == 5:
            slice_func = lambda x: x  
        elif level == 1:
            slice_func = lambda x: x.str.slice(-1)  
        elif level == 2:
            slice_func = lambda x: x.str.slice(0, 2) 
        elif level == 3:
            slice_func = lambda x: x.str.slice(0, 3)  
        elif level == 4:
            slice_func = lambda x: x.str.slice(0, 4)  

        column_name = f"naf8_prefix_{level}"
        base_df = base_df.with_columns(
            pl.when(pl.col("nomenclature_naf") == "NAFRev2")
            .then(slice_func(pl.col("naf8"))) 
            .otherwise(None)
            .alias(column_name)
        )

        merged_df = base_df.join(
            naf_polars.rename({"Libellé": f"Libellé_naf_n{level}"}),
            left_on=column_name,
            right_on="Code",
            how="left"
        ).drop(column_name)  
        return merged_df
    
    def join_juridical_level(self, base_df, level, code_ju_col="code_ju", categories_ju_data=None):
        """
        Effectue la jointure avec les données juridiques correspondant au niveau (niv1, niv2, niv3) sur base_df.
        """
        base_df = base_df.with_columns(
        pl.col(code_ju_col).cast(pl.Utf8) 
    )
        if level == 1:
            slice_func = lambda x: x.str.slice(0, 1)  
        elif level == 2:
            slice_func = lambda x: x.str.slice(0, 2) 
        elif level == 3:
            slice_func = lambda x: x 

        column_name = f"code_ju_part_{level}"
        base_df = base_df.with_columns(
            pl.when(pl.col(code_ju_col).is_not_null())
            .then(slice_func(pl.col(code_ju_col)))
            .otherwise(None)
            .alias(column_name)
        )

        juridical_data = categories_ju_data[level - 1]  
        juridical_polars = pl.from_pandas(juridical_data[['Code', 'Libellé']])

        juridical_polars = juridical_polars.with_columns(
            pl.col("Code").cast(pl.Utf8) 
        )

        merged_df = base_df.join(
            juridical_polars.rename({"Libellé": f"categorie_juridique_n{level}_name"}),
            left_on=column_name,
            right_on="Code",
            how="left"
        ).drop(column_name) 

        return merged_df
    
    def _format_to_parquet(self):
        if self.filename.exists():
            return

        with tempfile.TemporaryDirectory() as tmpdirname:
            with zipfile.ZipFile(self.zip_filename) as zip_ref:
                zip_ref.extractall(tmpdirname)
                csv_fn = Path(tmpdirname) / "StockUniteLegale_utf8.csv"
                base_df = pl.scan_csv(
                    csv_fn, schema_overrides={"trancheEffectifsUniteLegale": pl.String}
                ).select(
                    col("siren").cast(pl.String).str.zfill(9),
                    (col("etatAdministratifUniteLegale") == "A").alias("is_active"),
                    pl.coalesce(
                        col("nomUsageUniteLegale"),
                        col("denominationUniteLegale"),
                        col("nomUniteLegale"),
                    ).alias("raison_sociale"),
                    col("prenomUsuelUniteLegale").alias("raison_sociale_prenom"),
                    col("activitePrincipaleUniteLegale")
                    .str.replace_all(".", "", literal=True)
                    .alias("naf8"),
                    col("categorieJuridiqueUniteLegale").alias("code_ju"),
                    col("trancheEffectifsUniteLegale")
                    .replace_strict(EFFECTIF_CODE_TO_EMPLOYEES, default=None)
                    .cast(pl.Int32)
                    .alias("tranche_effectif"),
                    col("nomenclatureActivitePrincipaleUniteLegale").alias("nomenclature_naf"),
                ).collect()

    
        for level in range(1, 6): 
            base_df = self.join_naf_level(base_df, level)
    
        juridical_data_path = self.data_folder / "cj_septembre_2022.xls"
        categorie_juridique_niv1 = pd.read_excel(juridical_data_path, sheet_name="Niveau I", header=3)
        categorie_juridique_niv2 = pd.read_excel(juridical_data_path, sheet_name="Niveau II", header=3)
        categorie_juridique_niv3 = pd.read_excel(juridical_data_path, sheet_name="Niveau III", header=3)

        categories_ju_data = [categorie_juridique_niv1, categorie_juridique_niv2, categorie_juridique_niv3]

        for level in range(1, 4):
            base_df = self.join_juridical_level(base_df, level, categories_ju_data=categories_ju_data)

        base_df.write_parquet(self.filename)
