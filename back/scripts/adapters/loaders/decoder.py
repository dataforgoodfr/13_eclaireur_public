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

    def decode(self, stream: IO[bytes]) -> TextIOWrapper:
        for encoding in AcceptedEncodings:
            try:
                # Wrap the byte stream in a text stream with the specified encoding
                text_stream = io.TextIOWrapper(stream, encoding=encoding.value)
                LOGGER.info(f"Successfully decoded using {encoding.value} encoding")
                # Return the stream without closing the underlying byte stream
                text_stream.detach()
                stream.seek(0)
                return io.TextIOWrapper(stream, encoding=encoding.value)
            except UnicodeDecodeError:
                LOGGER.debug(f"Failed to decode using {encoding.value} encoding")
                # Reset the stream position for the next attempt
                stream.seek(0)
                continue
            except Exception:
                # If any other error occurs, reset the stream and try the next encoding
                stream.seek(0)
                continue

        raise RuntimeError("Unable to decode the stream with any of the accepted encodings.")
