import filecmp
import tempfile
from pathlib import Path

from back.scripts.loaders.json_loader import JSONLoader


def test_json_with_substructure():
    filename = Path(__file__).parent / "fixtures" / "test_json_features.json"
    out = JSONLoader(filename).load()

    with tempfile.TemporaryDirectory() as tmpdirname:
        out_filename = Path(tmpdirname) / "test.csv"
        out.to_csv(out_filename, index=False)

        exp_filename = filename.parent / "out_json_features.csv"
        assert filecmp.cmp(str(out_filename), str(exp_filename))


def test_decp():
    filename = Path(__file__).parent / "fixtures" / "reduced_decp_2019.json"
    out = JSONLoader(filename).load()

    with tempfile.TemporaryDirectory() as tmpdirname:
        out_filename = Path(tmpdirname) / "test.csv"
        out.to_csv(out_filename, index=False)

        exp_filename = Path(__file__).parent / "fixtures" / "out_decp-2019-10000.csv"
        assert filecmp.cmp(str(out_filename), str(exp_filename))
