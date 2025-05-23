import filecmp
import tempfile
from pathlib import Path

from back.scripts.loaders.excel_loader import ExcelLoader


class TestExcelLoader:
    def test_xls(self):
        filename = Path(__file__).parent / "fixtures" / "test_loader_xls.xls"
        out = ExcelLoader(filename).load()

        with tempfile.TemporaryDirectory() as tmpdirname:
            out_filename = Path(tmpdirname) / "test_loader_xls.csv"
            out.to_csv(out_filename, index=False)

            exp_filename = filename.parent / "test_loader_xls_exp.csv"
            assert filecmp.cmp(str(out_filename), str(exp_filename))

    def test_xls_with_columns(self):
        filename = Path(__file__).parent / "fixtures" / "test_loader_xls.xls"
        out = ExcelLoader(filename, columns=["CODE"]).load()

        with tempfile.TemporaryDirectory() as tmpdirname:
            out_filename = Path(tmpdirname) / "test_loader_xls.csv"
            out.to_csv(out_filename, index=False)

            exp_filename = filename.parent / "test_loader_xls_with_cols_exp.csv"
            assert filecmp.cmp(str(out_filename), str(exp_filename))
