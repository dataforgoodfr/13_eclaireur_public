# /// script
# requires-python = ">=3.8"
# dependencies = [
#   "pandas",
# ]
# ///

import pandas as pd

# Lire le CSV
df = pd.read_csv('collectivites_avec_scores.csv')

# Calculer le score agrégé comme dans notre code
def calculate_aggregated_score(sub_score, mp_score):
    if pd.isna(sub_score) and pd.isna(mp_score):
        return 'UNKNOWN'
    if pd.isna(sub_score):
        return mp_score
    if pd.isna(mp_score):
        return sub_score
    
    score_values = {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5}
    value_to_score = {1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E'}
    
    avg_value = round((score_values.get(sub_score, 5) + score_values.get(mp_score, 5)) / 2)
    return value_to_score[avg_value]

# Appliquer le calcul
df['aggregated_score'] = df.apply(lambda row: calculate_aggregated_score(row['score_sub'], row['score_marches_pub']), axis=1)

# Compter par score agrégé
print('=== RÉPARTITION DES SCORES AGRÉGÉS ===')
score_counts = df['aggregated_score'].value_counts().sort_index()
print(score_counts)

print('\n=== EXEMPLES PAR SCORE AGRÉGÉ ===')
for score in ['A', 'B', 'C', 'D', 'E', 'UNKNOWN']:
    examples = df[df['aggregated_score'] == score].head(5)
    if not examples.empty:
        print(f'\n--- Score {score} ---')
        for _, row in examples.iterrows():
            print(f'{row["Collectivite"]} (sub: {row["score_sub"]}, mp: {row["score_marches_pub"]})')