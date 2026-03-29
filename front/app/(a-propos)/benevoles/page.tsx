import type { Metadata } from 'next';

import { SectionHeader } from '#app/components/SectionHeader';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Remerciements',
  description:
    'Éclaireur Public a été construit par toute une équipe de bénévoles. Un grand merci à celles et ceux qui ont rendu cette application possible.',
  alternates: {
    canonical: '/benevoles',
  },
};

export default function Remerciement() {
  return (
    <div>
      <SectionHeader sectionTitle='Remerciements' />
      <div className='section-format'>
        <h2 className='mb-8'>
          Un immense merci à notre dream team{' '}
          <Sparkles className='align-text-center ml-1 inline text-secondary-400 md:align-text-top' />
        </h2>
        <p>Éclaireur Public, c’est avant tout une aventure humaine 💜</p>
        <p>
          Depuis des mois, une bande de bénévoles passionnés a donné son temps, son talent et son
          énergie pour rendre la transparence des collectivités… enfin accessible à tous !
        </p>
        <p>
          Que vous ayez codé jusqu’à pas d’heure 💻, dessiné des maquettes 🎨, trituré des datasets
          📊 ou juste apporté un coup de main ponctuel ✋ → vous faites partie de cette belle
          histoire.
        </p>
        <div className='mt-8 rounded-br-[30px] rounded-tl-[30px] bg-secondary-200'>
          <div className='my-4 grid grid-cols-1 gap-8 px-4 py-4 md:grid-cols-2 md:px-8 md:py-8'>
            <div className='space-y-8'>
              <h3>Notre équipe cœur de projet</h3>
              <div>
                <p>Antoine Quesnel</p>
                <p>Arnaud Leleu</p>
                <p>Benjamin Aubron</p>
                <p>Charlène Bottot</p>
                <p>Chloé Barré</p>
                <p>Christophe Goudet</p>
                <p>Coralie Clot</p>
                <p>Dimitar Grozev</p>
                <p>Guillaume Fontanet</p>
                <p>Jean-Baptiste Delafosse</p>
                <p>Léa Fedrigucci</p>
                <p>Maëva Phan</p>
                <p>Octave Le Tullier</p>
                <p>Olivier Prêtre</p>
                <p>Théo Campbell</p>
                <p>Thibault Debruyne</p>
                <p>Thomas Pedot</p>
                <p>Tony Chho</p>
              </div>
              <h3>Côté Anticor</h3>
              <div>
                <p>Cyrille Brun</p>
                <p>Emma Taillefer</p>
                <p>Marc Adrai</p>
                <p>Max Lévy</p>
                <p>Ronan Sy</p>
              </div>
            </div>
            <div className='space-y-8'>
              <h3>Contributeurs & coups de main</h3>
              <div>
                <p>Adrien Delannoy</p>
                <p>Alessandra Celani</p>
                <p>Alexandre Cornet</p>
                <p>Anissa Messad</p>
                <p>Antoine Ballagny</p>
                <p>Arnaud Mouttapa</p>
                <p>Arnaud Odet</p>
                <p>Assitan Niare</p>
                <p>Coline Babut</p>
                <p>Cyril Trichard</p>
                <p>Eddy Ponton</p>
                <p>Fred Tamiazzo</p>
                <p>Frédérik Varlet</p>
                <p>Gillian Law</p>
                <p>Guillaume Raverat</p>
                <p>Isabelle Dauchel</p>
                <p>Jean-Baptise Nez</p>
                <p>Johann Lord</p>
                <p>Kévin Héloise</p>
                <p>Ludovic Robin</p>
                <p>Mahaut De Dreuille</p>
                <p>Majda Naji</p>
                <p>Marjorie Janda</p>
                <p>Maryia Khalil</p>
                <p>Maxime Lévêque</p>
                <p>Nabil Alibou</p>
                <p>Olivier Picaud</p>
                <p>Oriana Berthomieu</p>
                <p>Prisca Viet</p>
                <p>Quentin Bonnemaison</p>
                <p>Sébastien Seguin</p>
                <p>Shamir Jailany</p>
                <p>Timothée Tardy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
