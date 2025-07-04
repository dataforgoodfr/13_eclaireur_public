from pathlib import Path
from typing import Protocol


class IWorkflow(Protocol):
    """
    Generic interface for a workflow that can be executed.
    """

    def run(self) -> None:
        """
        Executes the workflow.
        """
        ...

    def get_output_path(self) -> Path:
        """
        Returns the primary output path of the workflow.
        """
        ...


class IWorkflowFactory(Protocol):
    """
    Generic interface for a factory that creates workflows.
    """

    @classmethod
    def from_config(cls, main_config: dict) -> IWorkflow:
        """
        Creates and configures a workflow instance from a configuration dictionary.
        """
        ...
