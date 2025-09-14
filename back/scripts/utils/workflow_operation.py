import logging
from pathlib import Path

from back.scripts.datasets.dataset_aggregator import DatasetAggregator
from back.scripts.datasets.utils import BaseDataset
from back.scripts.interfaces.workflow import IWorkflow

LOGGER = logging.getLogger(__name__)


def _workflow_get_output_path(
    wf: IWorkflow | BaseDataset | DatasetAggregator, main_config: dict
) -> Path | None:
    """
    support for whatever workflow inheritance :)
    """
    if isinstance(wf, BaseDataset):
        return wf.get_output_path(main_config)
    if hasattr(wf, "get_output_path") and callable(wf.get_output_path):
        return wf.get_output_path()
    return None


def _workflow_clean_output(
    wf: IWorkflow | BaseDataset | DatasetAggregator, main_config: dict
) -> None:
    """
    delete output path of the specified workflow.
    """
    output_path = _workflow_get_output_path(wf, main_config)
    if output_path:
        LOGGER.info(f"remove {output_path} for {wf.__class__.__name__}")
        output_path.unlink(missing_ok=True)
    else:
        LOGGER.info(f"no 'output_path' declared for {wf.__class__.__name__}")


def _workflow_clean_raw(wf: IWorkflow | BaseDataset | DatasetAggregator) -> None:
    """
    delete all raw files of the speficied workflow
    """
    if hasattr(wf, "data_folder"):
        all_raw_files = list(wf.data_folder.glob("**/raw.*"))
        LOGGER.info(f"remove {len(all_raw_files)} raw files for {wf.__class__.__name__}")
        for p in all_raw_files:
            p.unlink()


def _workflow_clean_norm(wf: IWorkflow | BaseDataset | DatasetAggregator) -> None:
    """
    delete all norm files of the speficied workflow
    """
    if hasattr(wf, "data_folder"):
        all_norm_files = list(wf.data_folder.glob("**/norm.parquet"))
        all_interim_files = list(wf.data_folder.glob("**/interim.json"))  # marches specific
        LOGGER.info(
            f"remove {len(all_norm_files)} norm files {f'and {len(all_interim_files)} interims files ' if len(all_interim_files) > 0 else ''}for {wf.__class__.__name__}"
        )
        all_norm_files.extend(all_interim_files)
        for p in all_norm_files:
            p.unlink()
    else:
        LOGGER.info(f"no 'data_folder' declared for {wf.__class__.__name__}")


def prepare_workflow(
    wf: IWorkflow | BaseDataset | DatasetAggregator, main_config: dict
) -> None:
    """
    check configuration keys "download_all" and "normalize_all" and clear associated files.
    """
    clean_all = main_config["workflow"]["download_all"]
    build_all = (
        main_config["workflow"]["download_all"] or main_config["workflow"]["normalize_all"]
    )

    if clean_all:
        _workflow_clean_raw(wf)
    if build_all:
        _workflow_clean_norm(wf)
        _workflow_clean_output(wf, main_config)
