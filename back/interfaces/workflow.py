from abc import ABC, abstractmethod


class Workflow(ABC):
    """
    An interface for all workflows in the project.
    """

    @abstractmethod
    def run(self) -> None:
        """
        Run the workflow.
        """
        pass
