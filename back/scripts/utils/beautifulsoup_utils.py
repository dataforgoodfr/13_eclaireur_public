from datetime import datetime

from bs4 import BeautifulSoup


def get_tag_datetime(tag: BeautifulSoup) -> datetime:
    if tag and tag.text:
        fmt = "%d/%m/%Y"
        if " " in tag.text:
            fmt += " %H:%M:%S"
        return datetime.strptime(tag.text, fmt)
    return None


def get_tag_text(tag: BeautifulSoup) -> str | None:
    if tag and tag.text and (tag.text != "[Données non publiées]"):
        return tag.text
    return None


def get_tag_bool(tag: BeautifulSoup) -> str | None:
    txt = get_tag_text(tag)
    return txt and (txt == "true")


def get_tag_float(tag: BeautifulSoup) -> float | None:
    if tag and tag.text:
        return float(
            tag.text.replace(" ", "")
            .replace("\u202f", "")
            .replace("\xa0", "")
            .replace(",", ".")
        )
    return None


def get_tag_int(tag: BeautifulSoup) -> int | None:
    f = get_tag_float(tag)
    if f is not None:
        return int(f)
    return None
