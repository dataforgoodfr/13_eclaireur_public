from back.scripts.utils.config import get_project_base_path
from back.scripts.utils.config_manager import ConfigManager

"""
Tests pour checker la cohérence structurelle entre les fichiers de configuration

Note : il faut pouvoir détecter des anomalies mais rester flexible pour éviter les faux-positifs qui bloqueraient une éventuelle CI

1. Le type des données doit être identique
2. Des clés de la configuration principale (`main_config_filename`) peuvent être absentes des configurations secondaires (`sub_config_filenames`) mais on considère cependant que toutes les clés des `sub_config_filenames` doivent être présentes dans `main_config_filename`
"""

main_config_filename = "config.yaml"
sub_config_filenames = ("config-test.yaml",)


def test_config_structure():
    def check_keys(main_config: dict, sub_config: dict, path: str) -> None:
        # Check missing keys
        diff_keys = set(sub_config) - set(main_config)
        diff_keys_str = ", ".join(f"{path}.{key}" for key in diff_keys)
        assert not diff_keys, (
            f"{sub_config_filename} file keys missing in {main_config_filename} : {diff_keys_str}"
        )

        # Check type keys
        for k, sub_config_value in sub_config.items():
            next_path = f"{path}.{k}"
            main_config_value = main_config[k]
            assert type(main_config_value) is type(sub_config_value), (
                f"Incorrect key type '{next_path}' : {type(main_config_value)} ({main_config_filename}) != {type(sub_config_value)} ({sub_config_filename})"
            )

            # Recursive check
            if isinstance(main_config_value, dict):
                check_keys(main_config_value, sub_config_value, next_path)

    config_folder = get_project_base_path() / "back"
    main_config = ConfigManager.load_config(config_folder / main_config_filename)
    path = ""
    for sub_config_filename in sub_config_filenames:
        sub_config = ConfigManager.load_config(config_folder / sub_config_filename)
        check_keys(main_config, sub_config, path)
