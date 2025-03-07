from scripts.utils.argument_parser import ArgumentParser
from scripts.utils.config_manager import ConfigManager
from scripts.utils.logger_manager import LoggerManager
from scripts.workflow.workflow_manager import WorkflowManager

from back.scripts.workflow.data_warehouse import DataWarehouseWorkflow

if __name__ == "__main__":
    # Parse arguments, load config and configure logger
    args = ArgumentParser.parse_args("Gestionnaire du projet LocalOuvert")
    config = ConfigManager.load_config(args.filename)
    LoggerManager.configure_logger(config)

    workflow_manager = WorkflowManager(args, config)
    workflow_manager.run_workflow()

    data_warehouse_manager = DataWarehouseWorkflow(config).run()
