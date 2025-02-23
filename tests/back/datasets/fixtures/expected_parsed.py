import datetime

EXPECTED = [
    {
        "date_depot": datetime.datetime(2023, 12, 12, 11, 52, 37),
        "uuid": "78610b60-f6bc-4eeb-9f51-f3c28b11f23e",
        "complete": False,
        "nothing_to_declare": False,
        "type_declaration": "DIA",
        "mandat": "Député ou sénateur",
        "civilite": "M.",
        "nom": "LARCHER",
        "prenom": "Gérard",
        "date_naissance": datetime.datetime(1949, 9, 14, 0, 0),
        "type_mandat": "Sénateur",
        "qualite_mandat": None,
        "categorie_mandat": "PAR",
        "mandat_organe_type": "ZEP",
        "mandat_organe_code": "78",
        "debut_mandat": datetime.datetime(2023, 10, 2, 0, 0),
        "fin_mandat": None,
        "regime_matrimonial": None,
        "entreprise": None,
        "entreprise_mere": None,
        "entreprise_ca": None,
        "nb_logements": None,
        "to_parse": "activCollaborateursDto,activProfConjointDto,mandatElectifDto,participationDirigeantDto,participationFinanciereDto",
    }
]
