'use client';

import Link from 'next/link';
import { useState } from 'react';

import { ArrowRight } from 'lucide-react';

const CRITERIA = [
  'Identifiant marché',
  'Code CPV',
  'Montant',
  'Date de notification',
  'Type de code',
  'Lieu exécution code',
  'Lieu d\'exécution nom',
  'Forme de prix',
  'Objet',
  'Nature',
  'Durée en mois',
  'Procédure',
  'Titulaire'
]

const SCORES = {
  "A": {
    "title": "Score A - Exemplaire",
    "description": "Le score A reflète une exemplarité absolue, avec une publication complète des données pour les marchés de toutes tailles et une conformité totale aux 13 critères définis, garantissant une transparence optimale.",
    "picto": "/eclaireur/mascotte_a.png"
  },
  "B": {
    "title": "Score B - Satisfaisant",
    "description": "Le score B indique une conformité satisfaisante, avec une publication des données pour les marchés de toutes tailles et une conformité aux 13 critères définis, garantissant une transparence suffisante.",
    "picto": "/eclaireur/mascotte_b.png"
  },
  "C": {
    "title": "Score C - Moyen",
    "description": "Le score C indique une conformité moyenne, avec une publication des données pour les marchés de toutes tailles et une conformité aux 13 critères définis, garantissant une transparence suffisante.",
    "picto": "/eclaireur/mascotte_c.png"
  },
  "D": {
    "title": "Score D - Insuffisant",
    "description": "Le score D indique une conformité insuffisante, avec une publication des données pour les marchés de toutes tailles et une conformité aux 13 critères définis, garantissant une transparence insuffisante.",
    "picto": "/eclaireur/mascotte_d.png"
  },
  "E": {
    "title": "Score E - Très insuffisant",
    "description": "Le score E représente une transparence très insuffisante : les données publiées sont quasiment inexistantes, montrant un grave manquement aux exigences de publication et de communication.",
    "picto": "/eclaireur/mascotte_e.png"
  }
}

export default function OurMethodology() {
  const [selectedScore, setSelectedScore] = useState<keyof typeof SCORES>("A");

  return (
    <main
      className="w-full"
    >
      <article className='global-margin pb-20 px-4'>
          <h2 className='mb-5 text-h2'>Notre méthodologie</h2>
          <div className='grid gap-4'>
            <div>
              <div className='grid gap-4'>
                <p className='text-lg'>
                  L'indice de transparence des marchés publics repose sur trois facteurs clés :
                </p>
              </div> 
              <div className='flex flex-col gap-4 mt-6'>
                <MethodologyCard picto='/eclaireur/one.png' title='Publication de données sur les marchés inférieurs à 40 000 €' colorClassName='bg-brand-1' />
                <MethodologyCard picto='/eclaireur/two.png' title='Publication de données sur les marchés supérieurs à 40 000 €' colorClassName='bg-brand-2' />
                <MethodologyCard picto='/eclaireur/three.png' title='Publication de données sur les 13 critères suivants :' colorClassName='bg-brand-3' criteria={CRITERIA} />
              </div>
            </div>
          </div>
          

          <div className='flex md:flex-row flex-col gap-8 py-6'>

            <div className='md:w-1/3 flex items-center justify-center'>
              <img
                src={SCORES[selectedScore].picto}
                alt={SCORES[selectedScore].title}
                className="w-full max-w-48 aspect-square object-contain"
              />
            </div>

            <div className='md:w-2/3 flex flex-col gap-4'>
              
              {/* Score selector */}
              <div className='grid grid-cols-5 items-center mt-8 mb-8 w-full border-b border-primary-light'>
                {Object.keys(SCORES).map((score) => (
                  <div className='col-span-1 justify-self-center w-full'>
                    <button
                      key={score}
                      onClick={() => setSelectedScore(score as keyof typeof SCORES)}
                      className={`w-full py-2 font-bold text-2xl transition-all duration-200 ${
                        selectedScore === score 
                          ? 'text-primary border-b-2 border-primary' 
                          : 'text-primary-light hover:text-primary hover:border-b-2 hover:border-primary'
                      }`}
                    >
                      {score}
                    </button>
                  </div>
                ))}
              </div>

                {/* Score display */}

              <div className='w-full flex flex-col gap-4'>
                <h3 className='text-2xl font-bold text-primary'>{SCORES[selectedScore].title}</h3>
                <p className='text-lg leading-relaxed'>{SCORES[selectedScore].description}</p>
              </div>
            </div>
          </div>
          <div className='flex justify-center'>       
            <Link
                href={'/methodologie'}
                className='my-10 p-2 flex w-full md:w-80 items-center justify-center rounded-br-xl rounded-tl-xl bg-white border border-primary-light'
              >
                <span className='me-2 font-bold'>Découvrir notre méthodologie</span>
                <ArrowRight />
            </Link>
          </div>
      </article>
    </main>
  );
}

function MethodologyCard({picto, title, colorClassName, criteria}: {picto: string, title: string, colorClassName?: string, criteria?: string[]}) {
  return (
    <div className={`box-border justify-between flex h-full w-full flex-col gap-4 rounded-br-xl rounded-tl-xl p-4 ${colorClassName}`}>
      <div className='flex flex-row gap-4 items-center'>
        <img src={picto} alt={title} className='w-8 h-8' />
        <h4 className='text-h4'>{title}</h4>
      </div>
      {criteria && (
        <div className='flex flex-wrap gap-2'>
          {criteria.map((criterion) => (
            <div key={criterion}>
              <div className='flex flex-row gap-2'>
                <div className='px-4 py-2 bg-white rounded-full font-bold'>{criterion}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}