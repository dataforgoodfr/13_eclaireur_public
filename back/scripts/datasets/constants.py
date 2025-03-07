# Use the following regex to attribute an official name to a column
import re

TOPIC_COLUMNS_NORMALIZATION_REGEX = {
    r"(raison_sociale)": "nomBeneficiaire",
    r"(montant|euros)": "montant",
    r"collectivite": "nomAttribuant",
    r"(sire[nt])": "idBeneficiaire",
    r"nom[_ ].*attribu(ant|taire)": "nomAttribuant",
    r"nom[_ ].*(beneficiaire|association)": "nomBeneficiaire",
    r"association[_ ].*nom": "nomBeneficiaire",
    r"id(entification)?[_ ].*attribu(ant|taire)": "idAttribuant",
    r"id(entification)?[_ ].*beneficiaire": "idBeneficiaire",
    r"nature": "nature",
    r"date.*(convention|deliberation)": "dateConvention",
    r"ann[ez_]e": "dateConvention",
    r"pourcentage": "pourcentageSubvention",
    r"notif(ication)?.*[_ ]ue": "notificationUE",
    r"europeenne": "notificationUE",
    r"(date|periode).*versement": "datesPeriodeVersement",
    r"condition": "conditionsVersement",
    r"(description|objet).*(dossier)?": "objet",
    r"subvention.*accord": "montant",
    r"numero.*dossier": "referenceDecision",
    r"reference.*(deliberation|decision)": "referenceDecision",
    r"\brae\b": "idRAE",
    r"_rae_?": "idRAE",
    r"_?rae_": "idRAE",
}
TOPIC_COLUMNS_NORMALIZATION_REGEX = {
    re.compile(k): v for k, v in TOPIC_COLUMNS_NORMALIZATION_REGEX.items()
}

# TopicAggergator currently failes for a dataset if it has columns
# not in the official list after normalization.
# This is done in order to help treat datasets edge case.
# The following columns have been studied and should not lead to
# normalization failures.
TOPIC_IGNORE_EXTRA_COLUMNS = [
    "annee",
    "datedecision_tri",
    "objectif_id",
    "objectid",
    "nombreversements",
    "domaine",
    "sous_domaine",
    "secteur",
    "sous_secteur",
    "association_code",
    "unknown",
    "nb_adherents_isseens",
    "nb_adherents_totaux",
    "objet_1",
    "objet_2",
    "secteurs d'activités définies par l'association",
    "direction",
    "code_tranche",
    "cscollnom",
    "cscollsiret",
    "csmodificationdate",
    "nb adherents totaux",
    "attrib_type",
    "coll_type",
    "sub_date_debut",
    "sub_date_fin",
    "sub_dispositif",
    "siege",
    "intdomaine_id",
    "typetiers",
    "localisationprojetcommune",
    "localisationcodeinsee",
    "sous_theme",
    "nb_adherents_isseens",
    "geo_point_2d",
    "code_postal",
    "cp",
    "geometry",
    "code_commune",
    "libelle_commune",
    "point_geo",
    "datasetid",
    "naf_section_code",
    "nb adherents isseens",
]
