from pathlib import Path

import pytest

from back.scripts.datasets.common import DatasetsMixin as BaseDatasetsMixin
from back.scripts.utils.config import project_config
from back.scripts.utils.config_manager import ConfigManager

test_config = ConfigManager.load_config(Path(__file__).parent / "fixtures" / "test_config.yaml")
project_config.load(test_config)


class DatasetsMixin(BaseDatasetsMixin):
    config_key_name = "test"


class TestDatasetsMixin:
    @pytest.fixture
    def datasets(self):
        yield DatasetsMixin(create_data_folder=False)

    def test_datasets_config(self, datasets):
        assert datasets.config == test_config["test"]

    def test_datasets_url(self, datasets):
        assert datasets.url == "https://example.com"

    def test_datasets_data_folder(self, datasets):
        assert datasets.data_folder == Path("tests/back/datasets/fixtures/null")

    def test_create_data_folder_false(self, datasets):
        assert not datasets.data_folder.exists()

    def test_create_data_folder_true(self):
        datasets = DatasetsMixin(create_data_folder=True)
        assert datasets.data_folder.exists()
        datasets.data_folder.rmdir()
        assert not datasets.data_folder.exists()

    def test_set_force_config(self):
        tmp_config = {"test": {}}
        datasets = DatasetsMixin(create_data_folder=False, config=tmp_config)
        assert datasets.config == tmp_config

    def test_config_is_protected(self, datasets):
        assert datasets.config == test_config["test"]
        datasets.config["new_key"] = "value"
        assert "new_key" not in test_config
