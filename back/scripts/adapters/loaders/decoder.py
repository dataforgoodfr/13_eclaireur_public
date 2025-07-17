import io
import logging
from enum import StrEnum
from io import TextIOWrapper
from typing import IO

from back.scripts.interfaces.loader import IDecoder

LOGGER = logging.getLogger(__name__)


class AcceptedEncodings(StrEnum):
    UTF8_SIG = "utf-8-sig"
    WINDOWS_1252 = "windows-1252"
    LATIN1 = "latin1"
    UTF16 = "utf-16"


class StreamDecoder(IDecoder):
    """
    Decodes a byte stream into a text stream.
    """

    def decode(self, stream: IO[bytes], chunk_size: int = 4096) -> TextIOWrapper:
        """
        Decodes a byte stream into a text stream by testing a chunk of the stream
        against a list of accepted encodings.
        """
        chunk = stream.read(chunk_size)
        stream.seek(0)

        for encoding in AcceptedEncodings:
            try:
                # Attempt to decode the chunk
                chunk.decode(encoding.value)
                LOGGER.info(f"Successfully decoded using {encoding.value} encoding")
                return io.TextIOWrapper(stream, encoding=encoding.value)
            except UnicodeDecodeError:
                LOGGER.debug(f"Failed to decode using {encoding.value} encoding")
                continue

        raise RuntimeError("Unable to decode the stream with any of the accepted encodings.")
