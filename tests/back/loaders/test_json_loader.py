import filecmp
import tempfile
from pathlib import Path

from back.scripts.loaders.json_loader import JSONLLoader, JSONLoader

fixtures_path = Path(__file__).parent / "fixtures"


def test_json_with_substructure():
    filename = fixtures_path / "test_json_features.json"
    out = JSONLoader(filename).load()

    with tempfile.TemporaryDirectory() as tmpdirname:
        out_filename = Path(tmpdirname) / "test.csv"
        out.to_csv(out_filename, index=False)

        exp_filename = filename.parent / "out_json_features.csv"
        assert filecmp.cmp(str(out_filename), str(exp_filename))


def test_decp():
    filename = fixtures_path / "reduced_decp_2019.json"
    out = JSONLoader(filename).load()

    with tempfile.TemporaryDirectory() as tmpdirname:
        out_filename = Path(tmpdirname) / "test.csv"
        out.to_csv(out_filename, index=False)

        exp_filename = fixtures_path / "out_decp-2019-10000.csv"
        assert filecmp.cmp(str(out_filename), str(exp_filename))


def test_jsonl():
    filename = fixtures_path / "test_jsonl_features.jsonl"
    result = JSONLLoader(filename).load()

    with tempfile.TemporaryDirectory() as tmpdirname:
        out_filename = Path(tmpdirname) / "test.csv"
        result.to_csv(out_filename, index=False)

        exp_filename = fixtures_path / "out_jsonl_features.csv"

        assert filecmp.cmp(str(out_filename), str(exp_filename))
