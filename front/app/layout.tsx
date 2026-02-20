import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';

import Footer from '#app/components/Footer';
import Navbar from '#app/components/Navbar';
import { Toaster } from '#components/ui/toaster';

import Providers from './Providers';
import ReactScanWrapper from './ReactScanWrapper';
import './globals.css';

const kanit = Kanit({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit',
  display: 'swap',
  subsets: ['latin'],
  fallback: ['system-ui', 'sans-serif'], // fallback fonts
});

const baseURL: string | undefined = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
  title: {
    template: '%s | Éclaireur Public',
    default: 'Éclaireur Public',
  },
  metadataBase: baseURL != null ? new URL(baseURL) : new URL('https://eclaireurpublic.fr'),
  alternates: {
    canonical: './',
  },
  description:
    'Éclaireur Public est une initiative portée par Anticor et accompagnée par Data for Good. Le projet vise à pallier le manque de transparence dans la gestion des dépenses publiques des collectivités locales en France.',
  robots: {
    index: true,
    follow: true,
  },
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
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Éclaireur Public',
    title: 'Éclaireur Public',
    description:
      'Éclaireur Public est une initiative portée par Anticor et accompagnée par Data for Good. Le projet vise à pallier le manque de transparence dans la gestion des dépenses publiques des collectivités locales en France.',
    images: [
      {
        url: '/eclaireur/partager_EP.png',
        width: 1200,
        height: 630,
        alt: 'Éclaireur Public — Transparence des finances locales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Éclaireur Public',
    description:
      'Éclaireur Public est une initiative portée par Anticor et accompagnée par Data for Good. Le projet vise à pallier le manque de transparence dans la gestion des dépenses publiques des collectivités locales en France.',
    images: ['/eclaireur/partager_EP.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'google-fonts':
      'https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='fr'>
      <body className={`${kanit.variable} flex h-screen flex-col font-sans antialiased`}>
        <ReactScanWrapper />
        <Providers>
          <Navbar />
          <div className='relative flex-grow pt-16 lg:pt-20'>{children}</div>
          <Footer />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
