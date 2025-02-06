import argparse

class ArgumentParser:
    @staticmethod
    def parse_args(description:str):
        parser = argparse.ArgumentParser(description=description)

        # Update parser.add_argument: - Now have a defualt value
        #                             - The argument --filename is no longer required to execute the script if config.yaml is at the same location than main.py
        parser.add_argument("--filename",
                            type = str,
                            required = False,
                            default = "./back/config.yaml",
                            help = "Chemin vers le fichier de configuration, format yaml")   
        
        args = parser.parse_args()
        return args