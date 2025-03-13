#  Eclaireur public

Ce projet vise à analyser la transparence des collectivités locales concernées par la loi "République Numérique" en cartographiant de manière ponctuelle la publication de certaines données jugées critiques en matière d'intérêt économique ou de probité politique (publication ou non, qualité des publications).

## Installation du projet

Le projet utilise python 3.13. 
Il est nécessaire d'avoir un version de python compatible installée.
One way to manage multiple python version is to use the [pyenv](https://github.com/pyenv/pyenv) library.


Sur ce projet, la librairie `poetry` est responsable de la gestion des dépendance. 
Il est d'abord nécessaire de l'installer dans l'environnement global de la machine.
```
pip install poetry
```

L'installation de toutes les dépendances python s'effectue alors simplement avec :
````
poetry install
````

Pour vérifier l'installation du projet, il est possible de lancer la pipeline de test : 
````
poetry run python back/main.py --filename back/config-test.yaml
```

## Structure du projet

- `back/` : Consolidation et préparation des données
- `front/` : Développement du site web interactif

## Nomencloture des PR


Front
```
[FRONT]:<type>[optional scope]: <description>
```
Back
```
[BACK]:<type>[optional scope]: <description>
```
