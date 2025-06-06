from typing import Any, NamedTuple


class PandasRow(NamedTuple):
    Index: int

    # Autorise les attributs dynamiques
    def __getattr__(self, name: str) -> Any: ...
