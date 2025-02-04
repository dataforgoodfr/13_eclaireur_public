# Projet "République Numérique" - Analyse de la transparence des collectivités locales

<span style="color: darkred">[WIP] - La description ci-dessous vient du POC initial.</span>
```
Ce projet vise à analyser la transparence des collectivités locales concernées par la loi "République Numérique" en cartographiant de manière ponctuelle la publication de certaines données jugées critiques en matière d'intérêt économique ou de probité politique (publication ou non, qualité des publications).
```


## Table des matières

1. [Contribuer](#contribuer)
2. [Template DataForGood](#template-dataforgood)
    - [Contributing](#contributing)
        - [Installer Poetry](#installer-poetry)
            - [Installation de Poetry avec pipx](#installation-de-poetry-avec-pipx)
            - [Installation de Poetry avec l'installateur officiel](#installation-de-poetry-avec-linstallateur-officiel)




## Contribuer


<span style="color: darkred">[WIP] - Section outdated</span>

```
1. Clonez ce dépôt : `git clone https://github.com/dataforgoodfr/13_eclaireur_public.git`

2. Installez les dépendances à l'aide de `pip install -r requirements.txt`.

3. Pour exécuter les scripts pour télécharger et traiter les données, executez ` python main.py config.yaml `
THE SOFTWARE.
```


## Structure du projet

```
13_eclaireur_public/
├── .github/
│   └── workflows/
│       ├── d4g-utils.yml
│       └── pre-commit.yaml
├── back/
├── d4g-utils/
├── front/
├── python_template
├── .pre-commit-config.yaml
├── LICENSE
├── poetry.lock
├── pyproject.toml
├── README.md
└── tox.ini
```

La structure du projet est organisée comme suit:

- `.github/workflows/`: Configuration des workflows GitHub Actions
- `back/`: Code backend du projet | Suivre la [Structure du backend](./back/BACK_STRUCTURE.md)
- `d4g-utils.yml`: Scripts utils D4G
- `front/`: Code frontend du projet
- `python_template`: Templates Python (à confirmer)
- `.gitignore`: Liste des fichiers à ignorer par Git
- `pre-commit-config.yaml`: Template vérificartion de spre-commit (à confirmer)
- `LICENSE`: Licence du projet
- `poetry.lock`: Fichier poetry Lock des dépendances
- `pyproject.toml`: Configuration de Poetry
- `README.md`: Documentation principale du projet
- `tox.ini`: Configuration de l'outil de test Tox




## Template DataForGood

This file will become your README and also the index of your
documentation.

### Contributing

#### Installer Poetry

Plusieurs [méthodes d'installation](https://python-poetry.org/docs/#installation) sont décrites dans la documentation de poetry dont:

- avec pipx
- avec l'installateur officiel

Chaque méthode a ses avantages et inconvénients. Par exemple, la méthode pipx nécessite d'installer pipx au préable, l'installateur officiel utilise curl pour télécharger un script qui doit ensuite être exécuté et comporte des instructions spécifiques pour la completion des commandes poetry selon le shell utilisé (bash, zsh, etc...).

L'avantage de pipx est que l'installation de pipx est documentée pour linux, windows et macos. D'autre part, les outils installées avec pipx bénéficient d'un environment d'exécution isolé, ce qui est permet de fiabiliser leur fonctionnement. Finalement, l'installation de poetry, voire d'autres outils est relativement simple avec pipx.

Cependant, libre à toi d'utiliser la méthode qui te convient le mieux ! Quelque soit la méthode choisie, il est important de ne pas installer poetry dans l'environnement virtuel qui sera créé un peu plus tard dans ce README pour les dépendances de la base de code de ce repo git.

##### Installation de Poetry avec pipx

Suivre les instructions pour [installer pipx](https://pipx.pypa.io/stable/#install-pipx) selon ta plateforme (linux, windows, etc...)

Par exemple pour Ubuntu 23.04+:

    sudo apt update
    sudo apt install pipx
    pipx ensurepath

[Installer Poetry avec pipx](https://python-poetry.org/docs/#installing-with-pipx):

    pipx install poetry

##### Installation de Poetry avec l'installateur officiel

L'installation avec l'installateur officiel nécessitant quelques étapes supplémentaires,
se référer à la [documentation officielle](https://python-poetry.org/docs/#installing-with-the-official-installer).

#### Utiliser un venv python

    python3 -m venv .venv

    source .venv/bin/activate

#### Utiliser Poetry

Installer les dépendances:

    poetry install

Ajouter une dépendance:

    poetry add pandas

Mettre à jour les dépendances:

    poetry update

#### Lancer les precommit-hook localement

[Installer les precommit](https://pre-commit.com/)

    pre-commit run --all-files

#### Utiliser Tox pour tester votre code

    tox -vv