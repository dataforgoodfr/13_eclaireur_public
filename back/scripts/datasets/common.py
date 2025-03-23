from pathlib import Path
from typing import Type

from back.scripts.loaders import BaseLoader


class ProcessorMixin:
    def __init__(self, workflow, *args, **kwargs):
        # transmettre le workflow est overkill mais dans un premier temps on ne sait pas trop quelles informations seront réellement nécessaires, autant donner accès à toutes les infos, refactorisable plus tard grâce à `Workflow.get_fetcher_kwargs` et `Workflow.get_cleaner_kwargs`
        self.workflow = workflow
        self.args = args
        self.kwargs = kwargs

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
    Les données clean sont disponibles dans `self.cleaned_data`
    Géré par l'équipe DA
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initial_data = BaseLoader.loader_factory(self.input_filename).load()
        self.cleaned_data = None

    @property
    def input_filename(self):
        return self.fetcher.output_filename

    @property
    def fetcher(self):
        return self.workflow.fetcher


class CleanerBase(CleanerMixin):
    pass


"""
Appelé par le WorkflowManager, le WorkflowMixin est un sous-manager qui gère 2 sous-rôles :
1. Récupération des données (Fetcher) → actuellement ce sont les classes Workflow (qui devront être renommées), formatage, sauvegarde
2. Nettoyage des données (Cleaner) → nettoie les données, retire les lignes inutilisables

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

    def __init__(self, config: dict, *args, **kwargs):
        self._config = config
        self.data_folder = Path(config["data_folder"])
        self.data_folder.mkdir(exist_ok=True, parents=True)
        self.fetcher = None
        self.cleaner = None

    @property
    def config(self) -> dict:
        return self._config

    def get_fetcher_kwargs(self) -> dict:
        return dict()

    def get_cleaner_kwargs(self) -> dict:
        return dict()

    def run(self) -> None:
        self.fetcher = self.fetcher_class(self, **self.get_fetcher_kwargs())
        self.fetcher.run()
        self.cleaner = self.cleaner_class(self, **self.get_cleaner_kwargs())
        self.cleaner.run()
        data = self.cleaner.cleaned_data
        self._send_to_db(data)

    def _send_to_db(self, data) -> None:
        # TODO: save dans un fichier ou push to db en fonction de la config
        # Ajouter une classe Pusher dans le workflow pour gérer cette partie ?
        pass
