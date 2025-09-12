import type { Metadata } from 'next';

import { SectionHeader } from '#app/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Licence d’utilisation',
  description: 'License d’utilisation',
};

export default function Page() {
  return (
    <main>
      <SectionHeader
        sectionTitle={
          <>
            Licence d'utilisation
            <br />
            <div className='text-base font-normal'>
              Dernière mise à jour : [à compléter par Anticor]
            </div>
          </>
        }
      />
      <article className='section-format'>
        <div className='mb-8 space-y-4'>
          <h2>1. Objet</h2>
          <p>
            La présente licence définit les conditions dans lesquelles vous pouvez utiliser les
            contenus et services proposés par Éclaireur Public. Elle vise à garantir un usage
            responsable, respectueux des règles en vigueur et cohérent avec les valeurs de
            transparence portées par le projet.
          </p>
        </div>
        <div className='mb-8 space-y-4'>
          <h2>2. Utilisation autorisée</h2>
          <div>Vous êtes autorisé·e à&nbsp;:</div>
          <ul className='list-disc pl-5'>
            <li>
              Consulter librement les données et informations mises à disposition sur le site,
            </li>
            <li>
              Réutiliser ces données à des fins personnelles, professionnelles ou de recherche, dans
              le respect de la législation applicable et des droits des tiers,
            </li>
            <li>Partager les contenus du site, à condition d’en mentionner la source.</li>
          </ul>
        </div>
        <div className='mb-8 space-y-4'>
          <h2>3. Restrictions</h2>
          <div>Vous n'êtes pas autorisé·e à&nbsp;:</div>
          <ul className='list-disc pl-5'>
            <li>
              Utiliser les données ou contenus à des fins illicites, discriminatoires ou contraires
              à l’intérêt général,
            </li>
            <li>Détourner ou modifier les informations publiées de manière à induire en erreur,</li>
            <li>
              Exploiter commercialement les contenus du site sans l’accord préalable de
              l’association Anticor, porteuse du projet.
            </li>
          </ul>
        </div>
        <div className='mb-8 space-y-4'>
          <h2>4. Propriété intellectuelle</h2>
          <p>
            Sauf mention contraire, les contenus du site (textes, visuels, éléments graphiques,
            code) sont protégés par le droit de la propriété intellectuelle. Leur réutilisation est
            possible uniquement dans les conditions prévues par la présente licence et avec mention
            de la source “Éclaireur Public”.
          </p>
        </div>
        <div className='mb-8 space-y-4'>
          <h2>5. Responsabilité</h2>
          <p>
            Les informations mises en ligne sont issues de sources fiables, mais Éclaireur Public ne
            peut garantir l’exhaustivité ni l’absence totale d’erreurs. L’association Anticor ne
            saurait être tenue responsable de l’usage qui pourrait être fait des données par des
            tiers.
          </p>
        </div>
        <div className='mb-8 space-y-4'>
          <h2>6. Modifications</h2>
          <p>
            L’association Anticor se réserve le droit de modifier à tout moment les termes de la
            présente licence afin de les adapter aux évolutions légales, techniques ou
            organisationnelles du projet. La date de mise à jour sera indiquée en haut de cette
            page.
          </p>
        </div>
        <div className='mb-8 space-y-4'>
          <h2>7. Contact</h2>
          <p>
            Pour toute question relative à la présente licence ou aux conditions d’utilisation des
            contenus, vous pouvez contacter l’équipe du projet Éclaireur Public à l’adresse suivante
            : [adresse e-mail à compléter par Anticor].
          </p>
        </div>
      </article>
    </main>
  );
}
