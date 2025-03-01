import pandas as pd

from back.scripts.utils.datagouv_api import normalize_formats_description


def test_clean_format():
    parameters = [
        ("csv", "csv"),
        ("json", "json"),
        ("xlsx", "excel"),
        ("xls", "excel"),
        ("pdf", "pdf"),
        ("file:///srv/udata/ftype/geojson", "file:///srv/udata/ftype/geojson"),
        ("file:///srv/udata/ftype/csv", "csv"),
        ("file:///srv/udata/ftype/html", "html"),
        ("shp", "shp"),
        ("zip", "zip"),
        ("web page", "web page"),
        ("file:///srv/udata/ftype/kml", "file:///srv/udata/ftype/kml"),
        ("file:///srv/udata/ftype/zip", "zip"),
        ("file:///srv/udata/ftype/json", "json"),
        ("page web", "page web"),
        ("parquet", "parquet"),
        ("ods", "ods"),
        ("microsoft excel", "excel"),
        ("turtle", "turtle"),
        ("n3", "n3"),
        ("xml", "xml"),
        (
            "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ),
        ("geojson", "geojson"),
        ("octet-stream", "octet-stream"),
        ("excel", "excel"),
        ("vnd.ms-excel", "excel"),
        ("ogc api features", "ogc api features"),
        ("subvention_donnees_essentielles", "subvention_donnees_essentielles"),
        ("fr", "fr"),
        ("png", "png"),
        ("html", "html"),
        ("odata", "odata"),
        ("arcgis geoservices rest api", "arcgis geoservices rest api"),
        (None, None),
    ]
    source, target = zip(*parameters, strict=True)
    out = normalize_formats_description(pd.Series(source))
    expected = pd.Series(target)
    pd.testing.assert_series_equal(out, expected)
