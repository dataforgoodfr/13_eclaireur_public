import functools
import logging
import time
from typing import Callable,Any

def tracker(
    _func:Callable[...,Any] | None = None, ulogger=None, inputs:bool=False, outputs:bool=False, log_start=False, level="info"
):
    """
    Create a Python factory decorator that returns a decorator to log the execution of a function. 

    Args:
        _func (Callable[...,Any] | None): if given, returns the decorated function. Else returns the decorator.
        ulogger: Logger to use.
        inputs (bool): if True, logs the arguments of the function.
        outputs (bool): if True, logs the values returned by the function.
        log_start (bool): if True, logs a "start" message before running the function.
        level (str): Logging level to use.

    Returns:
        Callable[...,Any]: returns a decorator or a decorated function if '_func' argument is given.
    """
    if ulogger is None:
        ulogger = logging.getLogger()

    def decorator_tracker(func: Callable[...,Any]) -> Callable[...,Any]:
        """
        Builds the decorator that wraps logging logic to a given function.
        Args: 
            func (Callable[...,Any]): The function to decorate.
        Returns: 
            Callable: The wrapped function with logging logic.
        """
        @functools.wraps(func)
        def wrapper_logger(*args, **kwargs) -> Any:
            """
            Executes the function and add logs.
            """
            # Initialize the dictionary that will store the logging metadata
            extra = {"function_": func.__name__}
            if inputs:
                for k, v in kwargs.items():
                    extra["args_" + k] = v

                for i, v in enumerate(args):
                    extra["args_" + str(i)] = v

            if log_start:
                _log(ulogger, level, "start", extra)
            start_time = time.time()
            value = func(*args, **kwargs)
            end_time = time.time()
            extra["duration_"] = round((end_time - start_time), 3)
            if outputs:
                extra["return_"] = value
            _log(ulogger, level=level, msg="tracker", extra=extra)

            return value

        return wrapper_logger

    if _func is None:
        return decorator_tracker
    else:
        return decorator_tracker(_func)


def _log(ulogger, level: str, msg: str, extra: dict):
    """
    Method that logs messages using a given logger.
    - With the standard Logger, the message is formatted as a flat string with extra fields.
    - With other structured loggers, extra metadata is given as keywords arguments.
    """
    if isinstance(ulogger, logging.Logger):
        msg = msg + " : " + "; ".join([f"{k}={v}" for k, v in extra.items()])
        getattr(ulogger, level)(msg)
    else:
        getattr(ulogger, level)(msg, **extra)