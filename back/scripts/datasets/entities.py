from dataclasses import dataclass, field
from typing import Any


@dataclass
class FileMetadata:
    """A generic container for file metadata, decoupled from any framework."""

    url: str
    format: str
    url_hash: str  # used a unique identifier for the file
    extra_data: dict[str, Any] = field(default_factory=dict)
