import logging
import re
import tempfile
import urllib.request
import zipfile
from pathlib import Path
from typing import IO, Type
from urllib.parse import urlparse

from back.scripts.loaders import BaseLoader
from back.scripts.loaders.utils import LOADER_CLASSES, register_loader

LOGGER = logging.getLogger(__name__)


@register_loader
class ZipLoader(BaseLoader):
    file_extensions = {"zip"}
    file_media_type_regex = re.compile(r"zip", flags=re.IGNORECASE)

    def __init__(self, *args, archived_file_loader_class: Type | None = None, **kwargs):
        super().__init__(*args, **kwargs)
        self.archived_file_loader_class = archived_file_loader_class
        self.output_file_path = ""

    def process_data(self, stream: IO[bytes]):
        with tempfile.TemporaryDirectory() as tmpdir, zipfile.ZipFile(stream) as zip_ref:
            if self.archived_file_loader_class is None:
                can_be_loaded_filenames = zip_ref.namelist()
            else:
                can_be_loaded_filenames = [
                    filename
                    for filename in zip_ref.namelist()
                    if self.archived_file_loader_class.can_load_file(filename)
                ]

            match len(can_be_loaded_filenames):
                case 0:
                    raise RuntimeError(f"Could not match any file in {self.file_url}")
                case 1:
                    filename = can_be_loaded_filenames[0]
                case _:
                    # Too many files but if we're lucky, the file we're looking for has the same prefix as its archive
                    archive_filename = self.get_archive_prefix()
                    can_be_loaded_filenames = [
                        filename
                        for filename in can_be_loaded_filenames
                        if filename.startswith(archive_filename)
                    ]
                    if len(can_be_loaded_filenames) == 1:
                        filename = can_be_loaded_filenames[0]
                    else:
                        raise RuntimeError(f"Too many files to load from {self.file_url}.")

            zip_ref.extract(filename, tmpdir)
            output_file_path = Path(tmpdir) / filename

            if self.archived_file_loader_class is None:
                # TODO?: add a raw parameter in addition to the file_url
                loader_class = BaseLoader.loader_factory(
                    output_file_path, **self.get_loader_kwargs()
                )
            else:
                loader_class = self.archived_file_loader_class(
                    output_file_path, **self.get_loader_kwargs()
                )
            return loader_class.load()

    def _load_from_url(self):
        with tempfile.TemporaryDirectory() as tempdir:
            filename = Path(tempdir) / "null.zip"
            urllib.request.urlretrieve(self.file_url, filename)
            if self.archived_file_loader_class is None:
                self.archived_file_loader_class = self._loader_class_resolver_from_url()
            self.file_url = str(filename)
            return self._load_from_file()

    def _load_from_file(self):
        with open(self.file_url, "rb") as f:
            return self.process_data(f)

    def get_archive_prefix(self) -> str:
        """
        Get the archive prefix from the file_url, e.g. "path/file.zip" -> "file"
        """
        file_url = self.file_url
        if self.get_file_is_url(file_url):
            file_url = urlparse(file_url).path
        file_url = file_url.rsplit("/", 1)[-1]
        for extension in self.file_extensions or ():
            if file_url.endswith(f".{extension}"):
                file_url = file_url.removesuffix(f".{extension}")
                break
        return file_url

    def _loader_class_resolver_from_url(self) -> Type | None:
        """
        Resolve the archive file loader class based on the URL path.
        """
        # First, try to find the archive file loader class based on the filename
        filename = self.get_archive_prefix()
        loader_class = BaseLoader.search_loader_class(filename)
        if loader_class:
            return loader_class

        # Second, try to find the archive file loader class based on the url path
        url_path = urlparse(self.file_url).path
        # TODO: more robust method?
        url_path_parts = url_path.split("/")
        potential_extentions = set(url_path_parts) & LOADER_CLASSES.keys()
        match len(potential_extentions):
            case 0:
                LOGGER.warning(
                    f"Could not find any archive file loader for URL {self.file_url}."
                )
            case 1:
                return LOADER_CLASSES[next(iter(potential_extentions))]
            case _:
                LOGGER.warning(
                    f"Multiple archive file loaders found for URL {self.file_url}: {', '.join(potential_extentions)}."
                )

        return None
