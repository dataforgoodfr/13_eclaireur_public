import functools
import logging
import time


def tracker(
    _func=None, ulogger=None, inputs=False, outputs=False, log_start=False, level="info"
):
    """Log the trace of the program"""
    if ulogger is None:
        ulogger = logging.getLogger()

    def decorator_tracker(func):
        @functools.wraps(func)
        def wrapper_logger(*args, **kwargs):
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
            _log(ulogger, level, "tracker", extra)

            return value

        return wrapper_logger

    if _func is None:
        return decorator_tracker
    else:
        return decorator_tracker(_func)


def _log(ulogger, level: str, msg: str, extra: dict):
    if isinstance(ulogger, logging.Logger):
        msg = msg + " : " + "; ".join([f"{k}={v}" for k, v in extra.items()])
        getattr(ulogger, level)(msg)
    else:
        getattr(ulogger, level)(msg, **extra)
