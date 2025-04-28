import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

import Providers from './Providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Éclaireur Public',
    default: 'Éclaireur Public',
  },
  description:
    'Éclaireur Public est une initiative portée par Transparency International France et Anticor. Le projet vise à pallier le manque de transparence dans la gestion des dépenses publiques des collectivités locales en France.',
  robots: 'noindex, nofollow',
  keywords: [
    'Transparence financière',
    'Gestion des dépenses publiques',
    'Collectivités locales',
    'Comptes publics',
    'Réforme comptable',
    'Budgets locaux',
    'Finances locales',
    'Responsabilité publique',
    'Gouvernance locale',
    'Dépenses municipales',
    'Contrôle budgétaire',
    'Information citoyenne',
    'Comptabilité publique',
    'Optimisation des dépenses',
    'Rapports financiers',
    'Engagement citoyen',
    'Transparence budgétaire',
    'Décentralisation financière',
    'Audit des dépenses',
    'Participation citoyenne',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='fr'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-screen flex-col antialiased`}
      >
        <Providers>
          <Navbar />
          <div className='relative flex-grow pt-[80px]'>{children}</div>
          <Footer />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
