'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { cn } from '#utils/utils';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface ResponsiveAccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
  mobileExclusive?: boolean; // New prop for mobile-exclusive behavior
}

const ResponsiveAccordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  ResponsiveAccordionProps
>(({ className, children, mobileExclusive = false, ...props }, ref) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // On mobile with exclusive behavior, force single mode
  const accordionType = mobileExclusive && isMobile ? 'single' : props.type || 'single';
  
  return (
    <AccordionPrimitive.Root
      ref={ref}
      type={accordionType}
      collapsible={props.collapsible}
      className={className}
    >
      {children}
    </AccordionPrimitive.Root>
  );
});

ResponsiveAccordion.displayName = 'ResponsiveAccordion';

const ResponsiveAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item 
    ref={ref} 
    className={cn('border-b last:border-b-0', className)} 
    {...props} 
  />
));
ResponsiveAccordionItem.displayName = 'ResponsiveAccordionItem';

const ResponsiveAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className='flex'>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 text-left text-lg font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className='h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-200 text-primary' />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
ResponsiveAccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const ResponsiveAccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className='text-md overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
ResponsiveAccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { 
  ResponsiveAccordion, 
  ResponsiveAccordionContent, 
  ResponsiveAccordionItem, 
  ResponsiveAccordionTrigger 
};