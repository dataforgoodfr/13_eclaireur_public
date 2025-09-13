import type { Metadata } from 'next';

import { SectionHeader } from '#app/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales',
};

export default function MentionsLegales() {
  return (
    <main>
      <SectionHeader sectionTitle='Mentions légales' />
      <article className='section-format space-y-8'>
        <div>
          <h2 className='mb-4'>1. Éditeur du site</h2>
          <p>
            Le site Éclaireur Public est édité par l’association Anticor [à compléter avec la
            dénomination juridique exacte], dont le siège social est situé au&nbsp;:
          </p>
          <p>[Adresse complète]</p>
          <p>[Numéro SIREN/SIRET]</p>
        </div>
        <div>
          <h2 className='mb-4'>2. Hébergeur</h2>
          <p>Le site est hébergé par&nbsp;:</p>
          <ul>
            <li>[Nom de l’hébergeur]</li>
            <li>[Adresse de l’hébergeur]</li>
            <li>[Téléphone de l’hébergeur]</li>
          </ul>
        </div>
        <div>
          <h2 className='mb-4'>3. Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus présents sur le site (textes, images, logos, éléments
            graphiques, code) sont protégés par le droit de la propriété intellectuelle.
          </p>
          <p>
            Toute reproduction ou réutilisation est autorisée uniquement dans le cadre de la licence
            d’utilisation définie sur ce site. La source “Éclaireur Public” doit être mentionnée.
          </p>
        </div>
        <div>
          <h2 className='mb-4'>4. Données personnelles</h2>
          <p>
            Le site Éclaireur Public peut collecter des données personnelles (par exemple via un
            formulaire de contact).
          </p>
          <p>
            Ces données sont utilisées exclusivement dans le cadre du projet et ne sont en aucun cas
            cédées à des tiers sans consentement préalable.
          </p>
          <p>
            Conformément à la réglementation (RGPD et loi Informatique et Libertés), vous disposez
            d’un droit d’accès, de rectification et de suppression de vos données.
          </p>
          <p>Pour l’exercer, vous pouvez nous écrire à : [adresse e-mail de contact].</p>
        </div>
        <div>
          <h2 className='mb-4'>5. Limitation de responsabilité</h2>
          <p>
            Les informations publiées sur ce site proviennent de sources jugées fiables, mais elles
            sont fournies à titre indicatif.
          </p>
          <p>
            Éclaireur Public ne peut garantir l’exactitude, la complétude ou l’actualité des données
            mises en ligne et décline toute responsabilité en cas d’erreur ou d’omission.
          </p>
          <p>
            {' '}
            L’association Anticor ne pourra être tenue responsable de tout dommage direct ou
            indirect résultant de l’utilisation du site.
          </p>
        </div>
        <div>
          <h2 className='mb-4'>6. Liens externes</h2>
          <p>Le site peut contenir des liens vers d’autres sites.</p>
          <p>
            Éclaireur Public n’exerce aucun contrôle sur le contenu de ces sites tiers et ne saurait
            être tenu responsable de leurs pratiques ou de leurs informations.
          </p>
        </div>
        <div>
          <h2 className='mb-4'>7. Modification des mentions légales</h2>
          <p>
            Les présentes mentions légales peuvent être modifiées à tout moment pour s’adapter aux
            évolutions législatives ou techniques.
          </p>
          <p>Nous vous invitons à les consulter régulièrement.</p>
        </div>
      </article>
    </main>
  );
}
