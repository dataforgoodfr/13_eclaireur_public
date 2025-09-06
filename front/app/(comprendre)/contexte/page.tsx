import { Metadata } from 'next';

import Card, { BulletList, InfoBox, Paragraph } from '#app/components/SectionCard';
import { SectionHeader } from '#app/components/SectionHeader';
import CtaCard from '#app/components/cta/CtaCard';

export const metadata: Metadata = {
  title: 'Le contexte',
  description:
    'À chaque échelon territorial son ensemble de compétences particulières, revue de détails et enjeux de la transparence',
};

export default function Page() {
  return (
    <main className='mx-auto mb-12 flex w-full flex-col items-center justify-center' id='contexte'>
      <SectionHeader sectionTitle='Le contexte' />

      {/* Main div */}
      <div className='flex-col items-center justify-center p-6 md:max-w-screen-lg' id='main-div'>
        {/* Contexte du projet */}
        <Card
          title='Le contexte du projet'
          subtitle="D'aucuns s'accordent pour louer les bienfaits d'une meilleure transparence des dépenses
            publiques. La défiance toujours plus grandissante des citoyens envers l'impôt démontre
            l'incompréhension de la dépense publique à tous les échelons."
        >
          <Paragraph>
            Les services publics comme l'éducation, la santé, ainsi que ceux au niveau local tels
            que le ramassage des ordures, l'entretien de la voirie, les services municipaux etc...
            demeurent des concepts plus ou moins abstraits.
          </Paragraph>
          <Paragraph>
            Qu'une meilleure transparence rendrait de facto plus palpables et concrets. Alors quels
            services publics, quelles compétences relèvent de quelles collectivités ? Revue de
            détail.
          </Paragraph>
        </Card>

        {/* Échelons */}
        <Card title='Les échelons des collectivités territoriales'>
          <Paragraph>
            En France, l'État a réparti ses responsabilités entre différents niveaux de
            collectivités territoriales, c'est ce qu'on appelle la décentralisation. L'idée est de
            gérer chaque domaine public au niveau le plus adapté. Ainsi, les communes, les
            départements et les régions ont chacun des rôles bien définis.
          </Paragraph>
          <div className='grid w-full grid-cols-1 gap-8 md:grid-cols-3'>
            <CtaCard
              title='La commune'
              caption="La commune est l'échelon le plus proche des citoyens. Ses principales responsabilités incluent :"
              isCardBig={true}
              picto='/contexte/commune.svg'
              buttonText='Le rôle du conseil municipal'
              href='https://www.vie-publique.fr/infographie/270295-infographie-quel-est-le-role-du-conseil-municipal'
              colorClassName='bg-brand-1'
            >
              <BulletList
                items={[
                  "La gestion de l'état civil",
                  "L'urbanisme local",
                  "L'entretien des écoles primaires",
                  'La gestion des équipements culturels et sportifs locaux',
                  "L'action sociale de proximité",
                ]}
              />
            </CtaCard>

            <CtaCard
              title='Le département'
              caption='Le département joue un rôle clé dans la solidarité sociale et territoriale. Ses compétences principales sont :'
              isCardBig={true}
              picto='/contexte/departement.svg'
              buttonText='Les compétences du département'
              href='https://www.vie-publique.fr/infographie/270019-infographie-quelles-sont-les-competences-du-departement'
              colorClassName='bg-brand-2'
            >
              <BulletList
                items={[
                  "L'action sociale (aide à l'enfance, aux personnes âgées et handicapées)",
                  'La gestion des collèges',
                  "L'entretien des routes départementales",
                  'Le soutien aux communes rurales',
                ]}
              />
            </CtaCard>

            <CtaCard
              title='La région'
              caption="La région a des responsabilités plus larges, axées sur le développement et l'aménagement du territoire :"
              isCardBig={true}
              picto='/contexte/region.svg'
              buttonText='Le rôle de la région'
              href='https://www.vie-publique.fr/infographie/280077-infographie-quelles-sont-les-competences-de-la-region'
              colorClassName='bg-brand-3'
            >
              <BulletList
                items={[
                  "Le développement économique et l'aide aux entreprises",
                  "L'aménagement du territoire et les transports",
                  'La gestion des lycées',
                  "La formation professionnelle et l'apprentissage",
                  "La protection de l'environnement",
                ]}
              />
            </CtaCard>
          </div>
          <InfoBox title='Transparence des collectivités : adapter les exigences à la taille et aux moyens'>
            <Paragraph>
              Toutes les collectivités au-dessus d'un certain seuil sont soumises aux mêmes
              obligations légales de transparence. Mais dans la pratique, la situation varie
              beaucoup.
            </Paragraph>
            <Paragraph>
              Une petite commune qui vient de dépasser 3 500 habitant·es n'a pas les mêmes moyens
              humains ou organisationnels qu'une grande métropole ou une région. Elle doit souvent
              gérer de front de nombreux dossiers locaux urgents, avec des équipes limitées.
            </Paragraph>
            <Paragraph>
              Il est donc important d'aborder la question avec souplesse et bienveillance :
              encourager ces communes à publier leurs données, même progressivement, permet déjà de
              renforcer la transparence et la confiance citoyenne, sans attendre d'elles le même
              niveau de structuration que les plus grandes collectivités.
            </Paragraph>
          </InfoBox>
        </Card>

        {/* Enjeux */}
        <Card
          title="L'enjeu de la transparence sur les dépenses publiques selon les collectivités"
          subtitle="Rendre visible l'utilisation des fonds pour renforcer la confiance citoyenne"
          columns={2}
        >
          <Paragraph>
            Chaque niveau de collectivité territoriale gère un budget propre, destiné à financer ses
            compétences spécifiques : écoles et services de proximité pour les communes, action
            sociale et infrastructures pour les départements, développement économique et transports
            pour les régions. Ces dépenses concernent directement le quotidien des citoyen·nes, ce
            qui rend la transparence essentielle.
            <br />
            <br />
            Rendre publiques les informations sur l'utilisation de ces fonds permet de montrer
            comment l'argent collecté via les impôts et les taxes locales est employé. Pour les
            collectivités, c'est une manière de justifier leurs choix, de démontrer leur bonne
            gestion et d'éviter les soupçons de mauvaise utilisation.
          </Paragraph>
          <Paragraph>
            Mais la transparence ne se limite pas à un exercice de conformité légale : elle
            contribue aussi à instaurer un climat de confiance et de dialogue. En expliquant
            clairement leurs priorités budgétaires, les collectivités valorisent leurs actions et
            donnent aux habitant·es les moyens de mieux comprendre et d'interpeller, si nécessaire,
            leurs représentants. Cette ouverture participe ainsi à une gouvernance plus responsable,
            où les citoyen·nes deviennent acteurs de la vie publique.
          </Paragraph>
        </Card>

        {/* Enjeux */}
        <Card
          title='Les obligations légales de publication : la Loi pour une République numérique'
          subtitle="Un cadre réglementaire pour garantir l'accès aux données publiques"
          columns={2}
          knowMore='/cadre-reglementaire'
        >
          <Paragraph>
            Depuis 2016, la Loi pour une République numérique impose aux collectivités un cadre
            clair en matière de transparence. Selon leur taille et leurs moyens, elles doivent
            publier en ligne un certain nombre de données dites publiques : budgets, subventions,
            marchés publics, mais aussi informations relatives à l'organisation et aux décisions
            prises.
            <br />
            <br />
            Cette obligation vise à rendre l'action publique plus accessible, à renforcer le
            contrôle citoyen et à encourager la réutilisation de ces données par la société civile,
            les chercheurs ou encore les journalistes.
          </Paragraph>
          <Paragraph>
            Toutes les collectivités ne sont cependant pas soumises aux mêmes exigences. Les
            communes de plus de 3 500 habitant·es et disposant d'un budget supérieur à 5 millions
            d'euros sont tenues de publier leurs données essentielles. Pour les départements et les
            régions, la transparence est une obligation générale compte tenu de l'importance de
            leurs budgets. Les petites communes, elles, restent encouragées à s'inscrire
            volontairement dans cette démarche, notamment grâce à des outils mutualisés.
          </Paragraph>
        </Card>
      </div>
    </main>
  );
}
