from pathlib import Path


def get_project_base_path():
    current_directory = Path.cwd()
    return current_directory


def get_project_data_path():
    return get_project_base_path() / "back" / "data"
