# Pipeline d'intégration des données

L'intégralité du contenu du dossier ./back/ concerne la partie backend du projet.



## Table des matières

1. [Structure](#structure-du-back)
2. [Contribuer](#contribuer)
    - 2.1 [Accès Repo](#acces-repo)
    - 2.2 [Environnement de développement](#environnement-de-développement)
        - 2.2.1 [Installer Poetry avec pipx](#installation-de-poetry-avec-pipx)
        - 2.2.2 [Installer Poetry avec le dépôt officiel](#installation-de-poetry-avec-le-depot-officiel)
        - 2.2.3 [Utiliser Poetry](#utiliser-poetry)
        - 2.2.4 [Utiliser un venv python](#utiliser-un-venv-python)
3. [Lancer les precommit hook localement](#lancer-les-precommit-hook-localement)
4. [Utiliser Tox pour tester votre code](#utiliser-tox-pour-test-votre-code)
5. [Lancer le script](#lancer-le-script)
6. [License](#license)
    - 5.1 [Code](#code)
    - 5.2 [Data and Analyses](#data-and-analyses)





## Structure du back

- `data/`: dossier pour stocker les données du projet, organisées en sous-dossiers

    - `communities/`: informations sur les collectivités
    - `datasets/`: données récupérées et filtrées
    - `processed_data/`: données traitées et prêtes pour l'analyse
- `scripts/`: dossier pour les scripts Python du projet, organisés en sous-dossiers
    - `workflow/` : script gérant le workflow général
    - `communities/`: scripts pour la gestion des collectivités
    - `datasets/`: scripts pour le scrapping et le filtrage des données
    - `data_processing/`: scripts pour le traitement des données
    - `analysis/`: scripts pour l'analyse des données (vide à date)
    - `loaders/`: scripts de téléchargement de fichiers
    - `utils/`: scripts utilitaires et helpers
- `main.py`: script principal pour exécuter les scripts du projet
- `config.yaml`: fichier de configuration pour faire tourner `main.py`.
 - `.gitignore`: fichier contenant les références ignorées par git
- `README.md`: ce fichier



## Contribuer

- Rappel: La contribution du projet se fait par l'intermédiaire de Data 4 Good. Il est nécessaire de se rapprocher du Slack dédié, canal 13_eclair_public, pour toutes questions.
- Pour les nouveaux arrivants: Pensez à vous présenter dans les canaux dédiés, participez aux points hebdo qui on lieu le jeudi.


### Acces Repo


``` bash
# Copier le repo en local
git clone https://github.com/dataforgoodfr/13_eclaireur_public.git
```


### Environnement de développement


Plusieurs [méthodes d'installation](https://python-poetry.org/docs/#installation) sont décrites dans la documentation de poetry dont:

- avec pipx
- avec l'installateur officiel

Chaque méthode a ses avantages et inconvénients. Par exemple, la méthode pipx nécessite d'installer pipx au préable, l'installateur officiel utilise curl pour télécharger un script qui doit ensuite être exécuté et comporte des instructions spécifiques pour la completion des commandes poetry selon le shell utilisé (bash, zsh, etc...).

L'avantage de pipx est que l'installation de pipx est documentée pour linux, windows et macos. D'autre part, les outils installées avec pipx bénéficient d'un environment d'exécution isolé, ce qui est permet de fiabiliser leur fonctionnement. Finalement, l'installation de poetry, voire d'autres outils est relativement simple avec pipx.

Cependant, libre à toi d'utiliser la méthode qui te convient le mieux ! Quelque soit la méthode choisie, il est important de ne pas installer poetry dans l'environnement virtuel qui sera créé un peu plus tard dans ce README pour les dépendances de la base de code de ce repo git.

#### Installation de Poetry avec pipx

Suivre les instructions pour [installer pipx](https://pipx.pypa.io/stable/#install-pipx) selon ta plateforme (linux, windows, etc...)

Par exemple pour Ubuntu 23.04+:

    sudo apt update
    sudo apt install pipx
    pipx ensurepath

Pour macos:

    brew install pipx
    pipx ensurepath

[Installer Poetry avec pipx](https://python-poetry.org/docs/#installing-with-pipx):

    pipx install poetry



#### Installation de Poetry avec le depot officiel

L'installation avec l'installateur officiel nécessitant quelques étapes supplémentaires,
se référer à la [documentation officielle](https://python-poetry.org/docs/#installing-with-the-official-installer).


#### Utiliser Poetry

``` bash
# Installer les dépendances
poetry install
# Mettre à jour les dépendances
poetry update
```


#### Utiliser un venv python

<span style="color: darkred;">Si vous préférez utiliser un venv python, suivez les instructions suivantes:</span>

``` bash
python3 -m venv .venv
source .venv/bin/activate
# Il vous sera necessaire de vous assurer d'installer les dépendances requises, poetry ne générant pas de requirements.txt par défaut.
# Actuellement, aucun support n'est proposé pour les venv python.
```



## Lancer les precommit hook localement

[Installer les precommit](https://pre-commit.com/)
``` bash
pre-commit run --all-files
```


## Utiliser Tox pour tester votre code
``` bash
tox -vv
```

## Executer PostgreSQL localement avec docker
Par défaut, le script sauvegarde ses résultats dans une base PostgreSQL locale. Il est donc nécésaire d'éxécuter localement une instance, ce qu'il est possible de faire avec docker.

> Vous pouvez désactiver cette fonctionnalité en changeant `workflow.save_to_db: False` dans la config.

### Installer docker
Se reporter à la [documentation](https://docs.docker.com/engine/install/) docker.

### Démarrer une instance
Depuis un terminal:

    docker compose -f docker-compose.yaml up -d

## Lancer le script
``` bash
poetry run python back/main.py

# Pour charger un config.yaml d'une autre source, utiliser --filename :
poetry run python back/main.py --filename <path_to_config.yaml>
```


## License

### Code

The code in this repository is licensed under the MIT License:

MIT License

Copyright (c) 2023 Max Lévy

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Data and Analyses

Unless otherwise stated, the data and analyses in this repository are licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) License. For more information, please visit [Creative Commons License](https://creativecommons.org/licenses/by/4.0/).
