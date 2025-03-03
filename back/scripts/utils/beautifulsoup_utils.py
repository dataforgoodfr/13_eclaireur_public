from datetime import datetime

from bs4.element import Tag


def get_tag_datetime(tag: Tag | None) -> datetime | None:
    if tag and tag.text:
        fmt = "%d/%m/%Y"
        if " " in tag.text:
            fmt += " %H:%M:%S"
        return datetime.strptime(tag.text, fmt)
    return None


def get_tag_text(tag: Tag | None) -> str | None:
    # TODO: [Données non publiées], trop spécifique pour être dans utils
    if tag and tag.text and (tag.text != "[Données non publiées]"):
        return tag.text
    return None


def get_tag_bool(tag: Tag | None) -> bool | None:
    txt = get_tag_text(tag)
    return txt == "true"


def get_tag_float(tag: Tag | None) -> float | None:
    if tag and tag.text:
        return float(
            tag.text.replace(" ", "")
            .replace("\u202f", "")
            .replace("\xa0", "")
            .replace(",", ".")
        )
    return None


def get_tag_int(tag: Tag | None) -> int | None:
    f = get_tag_float(tag)
    if f is not None:
        return int(f)
    return None
