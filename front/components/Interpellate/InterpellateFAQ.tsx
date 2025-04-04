import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export default function InterpellateFAQ() {
  return (
    <section id='faq' className='my-16'>
      <h2 className='my-6 text-2xl font-bold'>Question fréquentes</h2>
      <Accordion type='single' collapsible className='my-12'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>
            Est-ce que mon identité et mon adresse e-mail seront visibles par les élu·e·s que
            j'interpelle ?
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>
            Mes données sont-elles conservées par Eclaireur Public ?
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>
            Comment savoir si mon message a été reçu par mes élu·e·s ?
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-4'>
          <AccordionTrigger>Que va-t-il se passer suite à mon interpellation ?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
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
