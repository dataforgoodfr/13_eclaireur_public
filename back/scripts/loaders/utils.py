"""
Dictionary of loaders classes
{
    "extension": LoaderClass,
}
"""

LOADER_CLASSES: dict[str, type] = dict()


# Decorator used to register loaders in the LOADER_CLASSES dictionary
def register_loader(cls):
    for ext in cls.file_extensions:
        LOADER_CLASSES[ext] = cls
    return cls
