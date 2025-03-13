import functools
import logging
import time
from functools import wraps

import pandas as pd
import polars as pl


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
                getattr(ulogger, level)("start", **extra)
            start_time = time.time()
            value = func(*args, **kwargs)
            end_time = time.time()
            extra["duration_"] = round((end_time - start_time), 3)
            if outputs:
                extra["return_"] = value
            getattr(ulogger, level)("tracker", **extra)

            return value

        return wrapper_logger

    if _func is None:
        return decorator_tracker
    else:
        return decorator_tracker(_func)


def migrate_polars(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        new_args = []
        for arg in args:
            if isinstance(arg, pd.DataFrame):
                new_args.append(pl.DataFrame(arg))
            else:
                new_args.append(arg)

        new_kwargs = {}
        for k, v in kwargs.items():
            if isinstance(v, pd.DataFrame):
                new_kwargs[k] = pl.DataFrame(v)
            else:
                new_kwargs[k] = v

        result = func(*new_args, **new_kwargs)

        if isinstance(result, pl.DataFrame):
            return result.to_pandas()
        return result

    return wrapper
