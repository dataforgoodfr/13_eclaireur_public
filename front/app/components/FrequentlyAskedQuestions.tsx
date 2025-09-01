import Image from 'next/image';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#components/ui/accordion';
import { ArrowRight } from 'lucide-react';

export default function FrequentlyAskQuestion() {
  return (
    <div className='mx-auto mb-20 w-full max-w-screen-lg p-6'>
      <div className='hidden grid-cols-2 md:grid'>
        <div className='mt-2.5 space-y-4'>
          <h1 className='text-3xl font-bold'>Questions fréquentes</h1>
          <div className='w-[500px] text-xl font-semibold md:block'>
            Consultez les réponses aux questions les plus courantes sur l'utilisation d'Éclaireur
            Public
          </div>
          <Image
            src={'/eclaireur/mascotte-faq.svg'}
            alt='Image de la mascotte se posant des questions'
            width={256}
            height={128}
          />
        </div>
        <div>
          <Accordion type='multiple'>
            <AccordionItem value='item-1'>
              <AccordionTrigger>
                Puis-je interpeller les élu·e·s de manière anonyme&nbsp;?
              </AccordionTrigger>
              <AccordionContent>
                Non, l’interpellation doit être nominative afin de garantir sa légitimité. En
                revanche, vos coordonnées ne sont utilisées que pour transmettre votre message et ne
                sont pas exploitées à d’autres fins.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
              <AccordionTrigger>
                Mes données sont-elles conservées par Éclaireur Public&nbsp;?
              </AccordionTrigger>
              <AccordionContent>
                Non. Éclaireur Public ne conserve pas le contenu de vos interpellations ni vos
                coordonnées personnelles. Vos informations sont uniquement utilisées pour envoyer
                votre message aux élu·e·s concerné·e·s.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>
                Puis-je espérer une réponse de la part des élu·e·s que j’interpelle via Éclaireur
                Public&nbsp;?
              </AccordionTrigger>
              <AccordionContent>
                La plateforme facilite la mise en relation, mais la réponse dépend uniquement des
                élu·e·s ou des services de la collectivité. Vous recevrez leur éventuel retour
                directement sur l’adresse e-mail que vous avez renseignée.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-4'>
              <AccordionTrigger>
                Que va-t-il se passer suite à mon interpellation&nbsp;?
              </AccordionTrigger>
              <AccordionContent>
                Votre message est transmis à la collectivité ou aux élu·e·s concernés. Vous recevez
                une copie par mail (si vous l’avez cochée). L’interpellation contribue à encourager
                la transparence et incite les collectivités à mettre leurs données à jour.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link
            href={'/faq'}
            className='my-6 flex w-64 items-center justify-center rounded-br-xl rounded-tl-xl border border-primary-light bg-white p-2'
          >
            <span className='me-2 font-bold'>Voir toutes les questions</span>
            <ArrowRight />
          </Link>
        </div>
      </div>

      <div className='md:hidden'>
        <h1 className='mb-4 text-3xl font-bold'>Questions fréquentes</h1>
        <Accordion type='single' collapsible>
          <AccordionItem value='item-1'>
            <AccordionTrigger>
              Puis-je interpeller les élu·e·s de manière anonyme&nbsp;?
            </AccordionTrigger>
            <AccordionContent>
              Non, l’interpellation doit être nominative afin de garantir sa légitimité. En
              revanche, vos coordonnées ne sont utilisées que pour transmettre votre message et ne
              sont pas exploitées à d’autres fins.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>
              Mes données sont-elles conservées par Éclaireur Public&nbsp;?
            </AccordionTrigger>
            <AccordionContent>
              Non. Éclaireur Public ne conserve pas le contenu de vos interpellations ni vos
              coordonnées personnelles. Vos informations sont uniquement utilisées pour envoyer
              votre message aux élu·e·s concerné·e·s.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger>
              Puis-je espérer une réponse de la part des élu·e·s que j’interpelle via Éclaireur
              Public&nbsp;?
            </AccordionTrigger>
            <AccordionContent>
              La plateforme facilite la mise en relation, mais la réponse dépend uniquement des
              élu·e·s ou des services de la collectivité. Vous recevrez leur éventuel retour
              directement sur l’adresse e-mail que vous avez renseignée.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-4'>
            <AccordionTrigger>
              Que va-t-il se passer suite à mon interpellation&nbsp;?
            </AccordionTrigger>
            <AccordionContent>
              Votre message est transmis à la collectivité ou aux élu·e·s concernés. Vous recevez
              une copie par mail (si vous l’avez cochée). L’interpellation contribue à encourager la
              transparence et incite les collectivités à mettre leurs données à jour.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Link
          href={'/faq'}
          className='my-6 flex w-64 items-center justify-center rounded-br-xl rounded-tl-xl border border-primary-light bg-white p-2'
        >
          <span className='me-2 font-bold'>Voir toutes les questions</span>
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
