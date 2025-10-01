import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#components/ui/accordion';
import type { FAQPage, Question, WithContext } from 'schema-dts';

export interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  plainTextAnswer?: string;
}

export interface FaqWithSchemaProps {
  items: FaqItem[];
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  pageTitle?: string;
}

function extractPlainText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractPlainText).join(' ');
  if (
    node &&
    typeof node === 'object' &&
    'props' in node &&
    typeof (node as { props?: unknown }).props === 'object' &&
    (node as { props?: { children?: React.ReactNode } }).props &&
    'children' in ((node as { props?: { children?: React.ReactNode } }).props ?? {})
  ) {
    return extractPlainText((node as { props: { children: React.ReactNode } }).props.children);
  }
  return '';
}

export function FaqWithSchema({
  items,
  type = 'single',
  collapsible = true,
  className,
  pageTitle = 'FAQ',
}: FaqWithSchemaProps) {
  const mainEntity: Question[] = items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.plainTextAnswer || extractPlainText(item.answer),
    },
  }));

  const jsonLd: WithContext<FAQPage> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: pageTitle,
    mainEntity,
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <Accordion
        type={type}
        collapsible={type === 'single' ? collapsible : undefined}
        className={className}
      >
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
