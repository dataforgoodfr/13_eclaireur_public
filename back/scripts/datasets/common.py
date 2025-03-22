from functools import cached_property
from pathlib import Path
from typing import Type

from back.scripts.loaders import BaseLoader


class ProcessorMixin:
    def __init__(self, workflow, *args, **kwargs):
        self.workflow = workflow

    def run(self, *args, **kwargs) -> None:
        raise NotImplementedError("This method should be implemented by subclasses.")

    @property
    def config(self) -> dict:
        return self.workflow._config

    @property
    def data_folder(self) -> Path:
        return self.workflow.data_folder


class FetcherMixin(ProcessorMixin):
    """
    Équivalent du workflow actuel comme DeclaInteretWorkflow ou MarchesPublicsWorkflow
    Récupère le fichier (via son url), le reformate et le stocke
    Si le fichier existe déjà, ne fait rien
    Le reformatage au sein de cette classe doit être requestionné
    Géré par l'équipe DE
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.output_filename = ""


class FetcherBase(FetcherMixin):
    pass


class CleanerMixin(ProcessorMixin):
    """
    Lit le `Fetcher.output_filename` (accessible via `self.input_filename`).
    Nettoie les données, retire les lignes inutilisables, en doublon etc
    Les données clean sont sauvegardées dans `self.cleaned_data`
    Géré par l'équipe DA
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cleaned_data = None

    @property
    def input_filename(self):
        return self.workflow.fetcher.output_filename

    @cached_property
    def initial_data(self):
        return BaseLoader.loader_factory(self.input_filename).load()


class CleanerBase(CleanerMixin):
    pass


class UpdaterMixin(ProcessorMixin):
    """
    Depuis le `Cleaner.cleaned_data` (accessible via self.cleaned_data)
    Formate la structure du fichier
    Les données formatée sont sauvegardées dans `self.updated_data`
    Géré par l'équipe DA
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.updated_data = None

    @property
    def cleaner(self):
        return self.workflow.cleaner

    @property
    def cleaned_data(self):
        return self.workflow.cleaner.cleaned_data


class UpdaterBase(UpdaterMixin):
    pass


"""
Appelé par le WorkflowManager, le WorkflowMixin est un sous-manager qui gère 3 sous-rôles :
1. Récupération des données (Fetcher) → actuellement ce sont les classes Workflow (qui devront être renommées), formatage, sauvegarde
2. Nettoyage des données (Cleaner) → nettoie les données, retire les lignes inutilisables
3. Mise à jour de la structure des données (Updater) → merge/split des colonnes

Les differents rôles doivent pouvoir être facilement identifiables et contiennent leur propre logique sans interférer avec celle des autres
L'objectif est de pouvoir intégrer le travail des DA sans avoir à remodeler le travail des DE et inversement
⇒ Pour cela il faut restructurer un peu et uniformiser le coded

Chaque instance de rôle reçoit l'instance du workflow, qui à court terme, possède les attributs nécessaires (config, instances des autres rôles etc)
    Cela dans un objectif de faciliter le travail des DA, et de pouvoir identifier par la suite les vrais besoins pour faire le code qui va bien
Chaque rôle s'active grâce à sa méthode run()

"""


class WorkflowMixin:
    fetcher_class: Type = FetcherBase
    cleaner_class: Type = CleanerBase
    updater_class: Type | None = UpdaterBase

    def __init__(self, config: dict, *args, **kwargs):
        self._config = config
        self.data_folder = Path(config["data_folder"])
        self.data_folder.mkdir(exist_ok=True, parents=True)
        self.fetcher = None
        self.cleaner = None
        self.updater = None

    @property
    def config(self) -> dict:
        return self._config

    def run(self) -> None:
        self.fetcher = self.fetcher_class(self)
        self.fetcher.run()
        self.cleaner = self.cleaner_class(self)
        self.cleaner.run()
        if self.updater_class is not None:
            self.updater = self.updater_class(self)
            self.updater.run()
        # TODO: save dans un fichier ou push to db en fonction de la config
