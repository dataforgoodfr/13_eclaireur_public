from back.scripts.utils.argument_parser import ArgumentParser
from back.scripts.utils.config import project_config
from back.scripts.utils.config_manager import ConfigManager
from back.scripts.utils.logger_manager import LoggerManager
from back.scripts.workflow.data_warehouse import DataWarehouseWorkflow
from back.scripts.workflow.workflow_manager import WorkflowManager

if __name__ == "__main__":
    # Parse arguments, load config and configure logger
    args = ArgumentParser.parse_args("Gestionnaire du projet LocalOuvert")

    # Load config file
    config = ConfigManager.load_config(args.filename)

    # Load project configuration instance
    project_config.load(config)

    LoggerManager.configure_logger(config)

    workflow_manager = WorkflowManager(args, config)
    workflow_manager.run_workflow()

    data_warehouse_manager = DataWarehouseWorkflow(config)
    data_warehouse_manager.run()
