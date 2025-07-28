import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#components/ui/accordion';
import { buttonVariants } from '#components/ui/button';
import { ChevronRight } from 'lucide-react';

export default function InterpellateFAQ() {
  return (
    <section id='faq' className='my-16'>
      <h2 className='my-6 text-2xl font-bold'>Question fréquentes</h2>
      <Accordion type='single' collapsible className='my-12'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Puis-je interpeller les élu-e-s de manière anonyme ?</AccordionTrigger>
          <AccordionContent>
            Non, l’interpellation s’exécute par le biais d’un e-mail envoyé à un élu considéré comme
            l’élu référent sur la collectivité, e-mail qui peut-être adressé en copie à d’autres
            élus ou référents de la collectivité. L’e-mail sera envoyé depuis le compte email
            d’Eclaireur public. Néanmoins, le nom que vous aurez renseigné dans le formulaire
            figurera en signature de l’e-mail. Il conviendra au citoyen interpellateur de respecter
            les règles de bienséance et savoir-vivre élémentaires et d’éviter les comportements de
            harcèlement réprimés par la loi (article de loi XXX).
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>
            Mes données sont-elles conservées par Eclaireur Public ?
          </AccordionTrigger>
          <AccordionContent>
            Non vos données ne sont ni conservées, ni stockées dans une base de données. Le seul
            usage qui en est fait est la signature de l’e-mail envoyé à l’élu interpelé ainsi que
            l’envoi d’une copie du mail à votre adresser mail si vous avez cochez la case « recevoir
            une copie par email »
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>
            Puis-je espérer une réponse de la part du ou des élus que j’interpelle par
            l’intermédiaire d’Eclaireur Public ?
          </AccordionTrigger>
          <AccordionContent>
            Difficile de répondre à la place du ou des élus interpellés. Tout ce que peut garantir
            Éclaireur Public c'est que votre message sera bien acheminé dans la boîte mail de l'élu.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-4'>
          <AccordionTrigger>Que va-t-il se passer suite à mon interpellation ?</AccordionTrigger>
          <AccordionContent>
            Pour Éclaireur Public, le but est bien d'encourager toutes les collectivités à être le
            plus transparentes possibles sur l'ensemble de leur politiques publiques.
            <br />
            Au mieux, la collectivité interpelée conduira une action dans ce sens, ce qui devrait se
            traduire l'année prochaine par une amélioration de l'indice de transparence de ladire
            collectivité.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <p>
        <Link href='/faq' className={buttonVariants({ variant: 'outline' })}>
          Voir toutes les questions <ChevronRight />
        </Link>
      </p>
    </section>
  );
}
