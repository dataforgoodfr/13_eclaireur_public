from back.scripts.utils.config import project_config
from back.scripts.utils.config_manager import ConfigManager

config = ConfigManager.load_config("back/config-test.yaml")

project_config.load(config)
