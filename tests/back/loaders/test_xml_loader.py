import filecmp
import tempfile
from pathlib import Path

from back.scripts.loaders.xml_loader import XMLLoader


def test_json_with_substructure():
    filename = Path(__file__).parent / "fixtures" / "test_xml.rdf"
    out = XMLLoader(filename).load()

    with tempfile.TemporaryDirectory() as tmpdirname:
        out_filename = Path(tmpdirname) / "test.csv"
        out.to_csv(out_filename, index=False)

        exp_filename = filename.parent / "out_test_xml.rdf"
        assert filecmp.cmp(str(out_filename), str(exp_filename))
