from .base_loader import BaseLoader
from .csv_loader import *  # noqa
from .excel_loader import *  # noqa
from .json_loader import *  # noqa
from .parquet_loader import *  # noqa

"""
Dictionary mapping file extensions to their corresponding loader classes.
"""
LOADER_CLASSES: dict = dict()

for subclass in BaseLoader.__subclasses__():
    if subclass.file_extensions:
        LOADER_CLASSES |= dict.fromkeys(subclass.file_extensions, subclass)
