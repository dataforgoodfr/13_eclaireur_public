#!/bin/bash

# Function to check if a command is available
command_exists() {
    command -v "$1" &> /dev/null
}

# Check if Poetry is installed
if command_exists poetry && poetry --version &> /dev/null; then
    echo "Poetry is already installed. Version: $(poetry --version)"
else
    echo "Poetry is not installed. Installing now..."
    
    # Install Poetry
    curl -sSL https://install.python-poetry.org | python3 -
    
    # Add poetry to PATH
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
    source ~/.bashrc

    echo "Poetry has been installed."
fi

echo "Configuring Poetry to use virtual environment in project directory..."

# Configure Poetry to use a virtual environment in the project
poetry config virtualenvs.in-project true

echo "Poetry is now configured to use a virtual environment in the project directory."

# Navigate to the project directory
project_dir=$(pwd)

# Check if the virtual environment exists in the project directory
if [ -d ".venv" ]; then
    echo "Virtual environment in project directory exists."
fi

# Analyze project content and create pyproject.toml file if not exists
if [ ! -f pyproject.toml ]; then
    echo "Creating pyproject.toml file..."
    poetry init --no-interaction
else
    echo "pyproject.toml file already exists. Skipping initialization."
fi

# Install project dependencies
echo "Installing project dependencies..."
poetry install

echo "Script execution complete."
