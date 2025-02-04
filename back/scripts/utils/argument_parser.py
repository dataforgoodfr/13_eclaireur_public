import argparse

class ArgumentParser:
    @staticmethod
    def parse_args(description):
        parser = argparse.ArgumentParser(description=description)
        parser.add_argument('filename')   
        args = parser.parse_args()
        return args