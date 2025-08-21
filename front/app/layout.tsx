import Footer from '#app/components/Footer';
import Navbar from '#app/components/Navbar';
import { Toaster } from '#components/ui/toaster';
import { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import './globals.css';
import Providers from './Providers';

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
  metadataBase: baseURL != null ? new URL(baseURL) : null,
  alternates: {
    canonical: './',
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
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'google-fonts': 'https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${kanit.variable} flex h-screen flex-col antialiased font-sans`}
      >
        <Providers>
          <Navbar />
          <div className='relative flex-grow pt-20'>{children}</div>
          <Footer />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
