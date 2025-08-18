'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { buttonVariants } from '#components/ui/button';
import {
  ResponsiveAccordion,
  ResponsiveAccordionContent,
  ResponsiveAccordionItem,
  ResponsiveAccordionTrigger,
} from '#components/ui/responsive-accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQBannerProps {
  title?: string;
  subtitle?: string;
  questions: FAQItem[];
  buttonText?: string;
  buttonHref?: string;
  className?: string;
  variant?: 'interpellate' | 'default';
}

const defaultQuestions: FAQItem[] = [
  {
    id: 'default-1',
    question: 'Puis-je interpeller les élu·e·s de manière anonyme ?',
    answer: 'Non, l\'interpellation doit être nominative afin de garantir sa légitimité. En revanche, vos coordonnées ne sont utilisées que pour transmettre votre message et ne sont pas exploitées à d\'autres fins.',
  },
  {
    id: 'default-2',
    question: 'Mes données sont-elles conservées par Éclaireur Public ?',
    answer: 'Non. Éclaireur Public ne conserve pas le contenu de vos interpellations ni vos coordonnées personnelles. Vos informations sont uniquement utilisées pour envoyer votre message aux élu·e·s concerné·e·s.',
  },
  {
    id: 'default-3',
    question: 'Puis-je espérer une réponse de la part des élu·e·s que j\'interpelle via Éclaireur Public ?',
    answer: 'La plateforme facilite la mise en relation, mais la réponse dépend uniquement des élu·e·s ou des services de la collectivité. Vous recevrez leur éventuel retour directement sur l\'adresse e-mail que vous avez renseignée.',
  },
  {
    id: 'default-4',
    question: 'Que va-t-il se passer suite à mon interpellation ?',
    answer: 'Votre message est transmis à la collectivité ou aux élu·e·s concernés. Vous recevez une copie par mail (si vous l\'avez cochée). L\'interpellation contribue à encourager la transparence et incite les collectivités à mettre leurs données à jour.',
  },
];

export default function FAQBanner({
  title = 'Questions fréquentes',
  subtitle = 'Trouvez rapidement les réponses à vos questions les plus courantes.',
  questions = defaultQuestions,
  buttonText = 'Voir toutes les questions',
  buttonHref = '/faq',
  className = '',
  variant = 'default',
}: FAQBannerProps) {
  const baseStyles = variant === 'interpellate' 
    ? 'my-16 border-t border-gray-200 pt-16' 
    : 'my-12 rounded-lg border bg-card p-8';

  return (
    <section id='faq-banner' className={`${baseStyles} ${className}`}>
      <div className='mb-8'>
        <h2 className='mb-4 text-2xl font-bold text-center lg:text-left'>{title}</h2>
        {subtitle && (
          <p className='text-muted-foreground text-center lg:text-left'>
            {subtitle}
          </p>
        )}
      </div>

      <ResponsiveAccordion 
        type='multiple' 
        collapsible 
        mobileExclusive={true}
        className='space-y-4'
      >
        {questions.map((item) => (
          <ResponsiveAccordionItem 
            key={item.id} 
            value={item.id}
            className='border rounded-lg px-4 bg-background/50'
          >
            <ResponsiveAccordionTrigger className='text-left hover:text-primary'>
              {item.question}
            </ResponsiveAccordionTrigger>
            <ResponsiveAccordionContent className='text-muted-foreground'>
              <div 
                dangerouslySetInnerHTML={{ __html: item.answer }}
                className='prose prose-sm max-w-none'
              />
            </ResponsiveAccordionContent>
          </ResponsiveAccordionItem>
        ))}
      </ResponsiveAccordion>

      <div className='mt-8 text-center lg:text-left'>
        <Link 
          href={buttonHref} 
          className={buttonVariants({ variant: 'outline' })}
        >
          {buttonText} <ChevronRight className='ml-2 h-4 w-4' />
        </Link>
      </div>
    </section>
  );
}