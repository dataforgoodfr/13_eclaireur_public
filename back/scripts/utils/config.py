from pathlib import Path


def get_project_base_path():
    current_directory = Path.cwd()
    return current_directory
