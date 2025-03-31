from .base_loader import BaseLoader
from .csv_loader import *  # noqa
from .excel_loader import *  # noqa
from .json_loader import *  # noqa
from .parquet_loader import *  # noqa
from .xml_loader import *  # noqa
from .zip_loader import *  # noqa

"""
Dictionary mapping file extensions to their corresponding loader classes.
"""
LOADER_CLASSES: dict[str, type[BaseLoader]] = {
    file_extension: subclass
    for subclass in BaseLoader.__subclasses__()
    for file_extension in subclass.file_extensions or ()
}
