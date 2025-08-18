'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const SOCIAL_LINKS = [
  { href: '#', label: 'Instagram', src: '/logos/rs/Instagram.png', alt: 'Instagram' },
  { href: '#', label: 'LinkedIn', src: '/logos/rs/Linkedin.png', alt: 'LinkedIn' },
  { href: '#', label: 'Facebook', src: '/logos/rs/Facebook.png', alt: 'Facebook' },
];

const PARTNERS = [
  {
    href: 'https://dataforgood.fr/',
    imgSrc: '/logos/assos/Data for Good.svg',
    imgAlt: 'Data For Good',
    name: 'Data For Good',
  },
];

const INITIATIVES = [
  {
    href: 'https://www.anticor.org/',
    imgSrc: '/logos/assos/Anticor.svg',
    imgAlt: 'Anticor',
    name: 'Anticor',
  },
  {
    href: 'https://transparency-france.org/',
    imgSrc: '/logos/assos/Transparency international.svg',
    imgAlt: 'Transparency International',
    name: 'Transparency International',
  },
];

const btnBase =
  'flex h-10 min-w-[150px] items-center gap-3 rounded-full bg-white p-4 transition-colors hover:bg-gray-200';

const Footer: FC = () => (
  <footer
    className="relative w-full bg-[url('/eclaireur/project_background.jpg')] bg-cover bg-center object-cover"
    aria-labelledby="footer-title"
  >
    <div className="global-margin flex h-full items-center justify-center py-12">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <section className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-start gap-2">
            <Image
              src="/eclaireur/eclaireur-footeur.svg"
              alt="Éclaireur Public – Pour une transparence des dépenses"
              width={300}
              height={70}
              priority
              className="h-9 w-auto"
            />
            <p className="text-base">Pour une transparence des dépenses</p>
            <span className="hidden text-tag font-semibold text-secondary-dark md:block md:mt-2">
              Suivez‑nous
            </span>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(({ href, label, src, alt }) => (
                <a
                  key={label}
                  href={href}
                  className="flex h-8 w-8 items-center justify-center rounded transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={label}
                >
                  <Image src={src} alt={alt} width={24} height={24} className="h-8 w-8" loading="lazy" />
                </a>
              ))}
            </div>
          </div>

          <Image
            src="/eclaireur/Mascotte-appel.png"
            alt="Mascotte Éclaireur Public"
            width={160}
            height={140}
            className="hidden md:block h-36 w-40"
            loading="lazy"
          />
        </section>

        <section className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-primary">
                Un projet accompagné par
              </h3>
              <div className="flex flex-col gap-3">
                {PARTNERS.map(({ href, imgSrc, imgAlt, name }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnBase}
                  >
                    <Image src={imgSrc} alt={imgAlt} width={24} height={24} className="h-6 w-6" loading="lazy" />
                    <span className="font-semibold text-primary">{name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-primary">
                À l&apos;initiative de
              </h3>
              <div className="flex flex-col gap-3">
                {INITIATIVES.map(({ href, imgSrc, imgAlt, name }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnBase}
                  >
                    <Image src={imgSrc} alt={imgAlt} width={24} height={24} className="h-6 w-6" loading="lazy" />
                    <span className="font-semibold text-primary">{name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center md:hidden">
            <Image
              src="/eclaireur/Mascotte-appel.png"
              alt="Mascotte Éclaireur Public"
              width={80}
              height={80}
              className="h-16 w-16"
              loading="lazy"
            />
          </div>

          <FooterNav
            title="Comprendre"
            links={[
              { href: '/about', label: 'Qui sommes‑nous' },
              { href: '/project', label: 'Le projet' },
              { href: '/interpeller', label: 'Interpeller' },
            ]}
          />
          <FooterNav
            title="Besoin d&apos;aide"
            links={[
              { href: '/contact', label: 'Contact' },
              { href: '/faq', label: 'FAQ' },
              { href: '/cookies', label: 'Gérer mes cookies' },
            ]}
          />
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-row md:flex-col gap-8 md:gap-0 w-full">
              <div className="flex flex-col space-y-2 flex-1">
                <h3 className="mb-2 text-lg font-semibold text-secondary">Vous êtes un élu ?</h3>
                <a href="https://www.eclaireurpublic.fr/aide-aux-elus" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary underline transition-colors text-link">
                  Aide aux élus
                </a>
              </div>
              <div className="flex flex-col space-y-2 flex-1">
                <span className="text-muted text-sm">Bonnes pratiques</span>
                <a href="https://data.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary underline transition-colors text-link">
                  Data.gouv.fr
                </a>
                <a href="https://publieretalab.studio/fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary underline transition-colors text-link">
                  Publier vos données
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-muted-light pt-6 text-sm md:flex-row md:justify-between">
          <p className="text-center text-muted md:text-left">
            Copyright © 2025 • Avec engagement contre la corruption 🚀
          </p>
          <nav className="flex gap-4">
            <Link href="/license" className="text-primary hover:text-primary hover:underline transition-colors text-link">
              Licences
            </Link>
            <span className="text-muted">|</span>
            <Link href="/legal" className="text-primary hover:text-primary hover:underline transition-colors text-link">
              Mentions légales
            </Link>
          </nav>
        </section>
      </div>
    </div>
  </footer>
);

type FooterNavLink = {
  href: string;
  label: string;
  external?: boolean;
  isText?: boolean;
  noUnderline?: boolean;
};

type FooterNavProps = {
  title: string;
  links: FooterNavLink[];
};

const FooterNav: FC<FooterNavProps> = ({ title, links }) => (
  <div>
    <h3 className="mb-4 text-lg font-semibold text-secondary">{title}</h3>
    <ul className="space-y-2">
      {links.map(({ href, label, external, isText, noUnderline }) => (
        <li key={label}>
          {isText ? (
            <span className="text-muted text-sm">{label}</span>
          ) : external ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary hover:underline transition-colors text-link">
              {label}
            </a>
          ) : (
            <Link href={href} className="text-primary hover:text-primary hover:underline transition-colors text-link">
              {label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;