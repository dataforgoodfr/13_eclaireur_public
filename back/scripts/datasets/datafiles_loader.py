import collections
import logging
import pandas as pd
from pathlib import Path

from scripts.utils.config import get_project_base_path

from scripts.loaders.csv_loader import CSVLoader
from scripts.loaders.excel_loader import ExcelLoader
from scripts.loaders.json_loader import JSONLoader
from scripts.utils.dataframe_operation import merge_duplicate_columns, safe_rename, cast_data


class DatafilesLoader():
    '''
    This class is responsible for loading the datafiles from the files_in_scope dataframe.
    It loads the schema of the topic, filters the readable files, loads the datafiles into dataframes, and normalizes the data according to the schema.
    TODO: Everything is done in the __init__ method, it should be refactored to be more readable and maintainable (or using external libraries).
    '''
    def __init__(self,files_in_scope, topic, topic_config, datafile_loader_config):
        self.logger = logging.getLogger(__name__)

        self.loader_classes = {
            'csv': CSVLoader,
            'xls': ExcelLoader,
            'xlsx': ExcelLoader,
            'excel': ExcelLoader,
            'json': JSONLoader,
        }

        # Load filtered datafiles list to explore 
        self.files_in_scope = files_in_scope
        # Load normalized data output schema
        self.schema = self._load_schema(topic_config["schema"])
        # Separate readable and unreadable files based on their format
        self.datafiles_out = pd.DataFrame()
        readable_files, self.datafiles_out = self._keep_readable_datafiles()
        # Load the readable files into dataframes
        self.corpus = self._load_datafiles(readable_files, datafile_loader_config)
        # Normalize the loaded data according to the defined schema
        self.normalized_data, self.datacolumns_out = self._normalize_data(topic, topic_config, datafile_loader_config)

    # Internal function to load the offical schema of the topic normalized data
    def _load_schema(self, schema_topic_config):
        json_schema_loader = JSONLoader(schema_topic_config["url"], key="fields")
        schema_df = json_schema_loader.load()
        self.logger.info("Schema loaded.")
        return schema_df

    # Internal function to keep only the readable files
    def _keep_readable_datafiles(self):
        preferred_formats = ["csv", "xls", "xlsx", "json", "zip"]     # TODO: Preferred formats should be defined in the config

        readable_files = self.files_in_scope[self.files_in_scope["format"].isin(preferred_formats)]
        datafiles_out = self.files_in_scope[~self.files_in_scope["format"].isin(preferred_formats)]
        self.logger.info(f"{len(readable_files)} readable files selected.")
        return readable_files, datafiles_out

    # Internal function to load the data from a single file, depending on its format
    def _load_file_data(self, file_info, datafile_loader_config):
        loader_class = self.loader_classes.get(file_info["format"].lower())
        if loader_class:
            loader = loader_class(file_info["url"])
            try:
                df = loader.load()
                if not df.empty:
                    for col in datafile_loader_config["file_info_columns"]:
                        if col in file_info:
                            df[col] = file_info[col]
                    self.logger.info(f"Data from {file_info['url']} loaded.")
                    return df
            except Exception as e:
                self.logger.error(f"Failed to load data from {file_info['url']} - {e}")
        else:
            self.logger.warning(f"Loader not found for format {file_info['format']}")
        
        # Add the file to the list of files that could not be loaded
        file_info_df = pd.DataFrame(file_info).transpose()
        self.datafiles_out = pd.concat([self.datafiles_out, file_info_df], ignore_index=True)
        return None

    # Internal function to load the datafiles into a dataframes list
    def _load_datafiles(self, readable_files, datafile_loader_config):
        len_out = len(self.datafiles_out)
        data = []

        for i, file_info in readable_files.iterrows():
            df = self._load_file_data(file_info, datafile_loader_config)
            if df is not None:
                data.append(df)

        self.logger.info("Number of dataframes loaded: %s", len(data))
        self.logger.info("Number of elements in data that are not dataframes: %s", sum([not isinstance(df, pd.DataFrame) for df in data]))
        self.logger.info("Number of files not loaded: %s", len(self.datafiles_out) - len_out)
        
        return data
    
    # Internal function to normalize the loaded data according to the defined schema
    # TODO: This function should be refactored to be more readable and maintainable (or using external libraries)
    def _normalize_data(self, topic, topic_config, datafile_loader_config):
        len_out = len(self.datafiles_out) # used to count the number of files not normalized during the process
        file_info_columns = datafile_loader_config["file_info_columns"] # additional columns to add to the official schema (e.g. siren, url, source, etc.)
        normalized_data = pd.DataFrame(columns=self.schema["name"]) # Initialize the normalized data with the schema columns
        # Add the additional columns to the normalized data
        for col in file_info_columns:
            normalized_data[col] = ""
        # Lower case schema names
        schema_lower = [col.lower() for col in self.schema["name"].values]

        # Create a mapping dictionary between lower case schema names and original schema names
        schema_mapping = dict(zip(schema_lower, self.schema["name"].values))

        # Load the schema dictionary to rename the columns
        schema_dict_file = Path(get_project_base_path())  / "data" / "datasets" / topic / "inputs" / topic_config["schema_dict_file"]
        schema_dict = pd.read_csv(schema_dict_file, sep=";").set_index('original_name')['official_name'].to_dict()
        
        # Initialize the output dataframe for columns not in the schema
        datacolumns_out = pd.DataFrame(columns=["filename", "column_name", "column_type", "nb_non_null_values"])

        for df in self.corpus:
            # Merge columns with the same name
            df = merge_duplicate_columns(df)
            # Rename columns using the schema dictionary
            safe_rename(df, schema_dict)
            # Lower case columns names
            df.columns = df.columns.astype(str)
            columns_lower = [col.lower() for col in df.columns]
            # Check if the dataframe has at least 1 column in common with the schema
            if len(set(columns_lower).intersection(set(schema_lower))) > 0:
                common_columns = [] # Initialize the list of common columns with the schema
                for col, col_lower in zip(df.columns, columns_lower):
                    if col_lower in schema_lower or col in file_info_columns:
                        common_columns.append(col)
                    else:
                        # Add the column to the output dataframe for columns not in the schema
                        out_col_df = pd.DataFrame({"filename":df["url"].iloc[0], "column_name":col, "column_type":df[col].dtype, "nb_non_null_values":df[col].count()}, index=[0])
                        datacolumns_out = pd.concat([datacolumns_out, out_col_df], ignore_index=True)
                
                # Filter the dataframe to keep only the common columns with the schema
                df_filtered = df[common_columns]
                # Rename the columns in df_filtered using the schema_mapping
                df_filtered.columns = [schema_mapping[col.lower()] if col.lower() in schema_mapping else col for col in df_filtered.columns]
                # Append df_filtered to normalized_data
                normalized_data = pd.concat([normalized_data, df_filtered], ignore_index=True)

                self.logger.info("Normalized dataframe %s", df["url"].iloc[0])
                self.logger.info("Number of datapoints in normalized_data: %s", len(normalized_data))
                self.logger.info("Number of columns in schema: %s", len(common_columns) - len(file_info_columns))
                self.logger.info("Number of columns not in schema: %s", len(df.columns)-len(common_columns) + len(file_info_columns))
            # If the dataframe has no column in common with the schema, add the dataframe to the output dataframe for files not in final data
            else:
                out_df = pd.DataFrame(df.iloc[0]).transpose()
                self.datafiles_out = pd.concat([self.datafiles_out, out_df], ignore_index=True)
                self.logger.warning("No column in common with schema for file %s", df["url"].iloc[0])
        
        # Cast data to schema types
        schema_selected = self.schema.loc[:, ['name', 'type']]        
        normalized_data = cast_data(normalized_data, schema_selected, 'name')

        self.logger.info("Data types per column after casting in normalized data: %s", normalized_data.dtypes)
        self.logger.info("Percentage of NaN values after casting, per column: %s", (normalized_data.isna().sum() / len(normalized_data)) * 100)

        # Drop potential duplicates (same values for schema & siren columns)
        subset_columns = list(self.schema["name"].values)
        subset_columns.append("siren")
        normalized_data = normalized_data.drop_duplicates(subset=subset_columns, keep="first")

        self.logger.info("Number of datapoints in normalized_data: %s", len(normalized_data))
        self.logger.info("Number of columns in normalized_data: %s", len(normalized_data.columns))
        self.logger.info("Number of files not normalized: %s", len(self.datafiles_out)-len_out)
        self.logger.info("Number of columns in datacolumns_out: %s", len(datacolumns_out))
        self.logger.info("Number of NaN values in normalized_data, per column: %s", normalized_data.isna().sum())

        return normalized_data, datacolumns_out