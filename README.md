#  Eclaireur public

Ce projet vise à analyser la transparence des collectivités locales concernées par la loi "République Numérique" en cartographiant de manière ponctuelle la publication de certaines données jugées critiques en matière d'intérêt économique ou de probité politique (publication ou non, qualité des publications).

## Structure du projet

- `back/` : Consolidation et préparation des données [README](back/README.md)
- `front/` : Développement du site web interactif [README](front/README.md)

## Release

Pour déployer une nouvelle version en production :

```bash
git tag v1.2.3
git push origin v1.2.3
```

Le workflow de release :
1. Attend une approbation manuelle (environnement GitHub `production`)
2. Exécute le pipeline de données
3. Déploie l'application sur Clever Cloud

> **Note** : Le tag doit suivre le format semver `vX.Y.Z` (ex: `v1.0.0`, `v2.1.3`)

## Nomenclature des PR


Front
```
[FRONT]:<type>[optional scope]: <description>
```
Back
```
[BACK]:<type>[optional scope]: <description>
```
