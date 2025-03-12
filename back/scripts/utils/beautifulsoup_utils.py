from datetime import datetime

from bs4.element import Tag


def get_tag_datetime(tag: Tag | None, exclude: list | None = None) -> datetime | None:
    txt = get_tag_text(tag, exclude=exclude)
    if txt:
        fmt = "%d/%m/%Y"
        if " " in txt:
            fmt += " %H:%M:%S"
        return datetime.strptime(txt, fmt)
    return None


def get_tag_text(tag: Tag | None, exclude: list | None = None) -> str | None:
    if tag and tag.text and (exclude is None or tag.text not in exclude):
        return tag.text
    return None


def get_tag_bool(tag: Tag | None, exclude: list | None = None) -> bool | None:
    txt = get_tag_text(tag, exclude=exclude)
    return txt and (txt == "true")


def get_tag_float(tag: Tag | None, exclude: list | None = None) -> float | None:
    txt = get_tag_text(tag, exclude=exclude)
    if txt:
        return float(
            txt.replace(" ", "").replace("\u202f", "").replace("\xa0", "").replace(",", ".")
        )
    return None


def get_tag_int(tag: Tag | None, exclude: list | None = None) -> int | None:
    f = get_tag_float(tag, exclude=exclude)
    if f is not None:
        return int(f)
    return None
