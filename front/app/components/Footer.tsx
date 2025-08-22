'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { usePathname } from 'next/navigation';

const FOOTER_DATA = {
  social: [
    { href: '#', label: 'Instagram', src: '/logos/rs/Instagram.png', alt: 'Instagram' },
    { href: '#', label: 'LinkedIn', src: '/logos/rs/Linkedin.png', alt: 'LinkedIn' },
    { href: '#', label: 'Facebook', src: '/logos/rs/Facebook.png', alt: 'Facebook' },
  ],
  partners: [
    {
      href: 'https://dataforgood.fr/',
      imgSrc: '/logos/assos/Data for Good.svg',
      imgAlt: 'Data For Good',
      name: 'Data For Good',
    },
  ],
  initiatives: [
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
  ],
  navigation: [
    {
      title: "Comprendre",
      links: [
        { href: '/about', label: 'Qui sommes‑nous' },
        { href: '/project', label: 'Le projet' },
        { href: '/interpeller', label: 'Interpeller' },
      ]
    },
    {
      title: "Besoin d'aide",
      links: [
        { href: '/contact', label: 'Contact' },
        { href: '/faq', label: 'FAQ' },
        { href: '/cookies', label: 'Gérer mes cookies' },
      ]
    }
  ]
};

const btnBase = 'flex w-fit items-center gap-4 rounded-full bg-white pl-4 pr-6 py-3 transition-colors hover:bg-gray-200 overflow-hidden';
const linkBase = 'text-primary hover:text-primary hover:underline transition-colors text-link';

const Footer: FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/map')) return 

  return (
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
              {FOOTER_DATA.social.map(({ href, label, src, alt }) => (
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
          <div className="col-span-2 md:col-span-1">
            <div className="flex gap-1 md:block">
              <div className="flex flex-col gap-3 md:gap-8 flex-1">
                <div>
                  <h3 className="mb-2 text-tag font-semibold text-gray-500">
                    Un projet accompagné par
                  </h3>
                  <div className="flex flex-col gap-3">
                    {FOOTER_DATA.partners.map(({ href, imgSrc, imgAlt, name }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={btnBase}
                      >
                        <Image src={imgSrc} alt={imgAlt} width={24} height={24} className="h-6 w-6" loading="lazy" />
                        <span className="text-sm font-semibold text-primary whitespace-nowrap">{name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-tag font-semibold text-gray-500">
                    À l&apos;initiative de
                  </h3>
                  <div className="flex flex-col gap-3">
                    {FOOTER_DATA.initiatives.map(({ href, imgSrc, imgAlt, name }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={btnBase}
                      >
                        <Image src={imgSrc} alt={imgAlt} width={24} height={24} className="h-6 w-6" loading="lazy" />
                        <span className="text-sm font-semibold text-primary whitespace-nowrap">{name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center md:hidden mt-4">
                <Image
                  src="/eclaireur/Mascotte-appel.png"
                  alt="Mascotte Éclaireur Public"
                  width={114}
                  height={94}
                  className="h-[94px] w-28"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {FOOTER_DATA.navigation.map((section) => (
            <FooterNav key={section.title} title={section.title} links={section.links} />
          ))}
          
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-row md:flex-col gap-8 md:gap-0 w-full">
              <div className="flex flex-col space-y-2 flex-1">
                <h3 className="mb-2 text-lg font-semibold text-secondary-dark">Vous êtes un élu ?</h3>
                <Link href="https://www.eclaireurpublic.fr/aide-aux-elus" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary underline transition-colors text-link">
                  Aide aux élus
                </Link>
              </div>
              <div className="flex flex-col space-y-2 flex-1">
                <span className="text-muted text-sm">Bonnes pratiques</span>
                <Link href="https://data.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary underline transition-colors text-link">
                  Data.gouv.fr
                </Link>
                <Link href="https://publieretalab.studio/fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary underline transition-colors text-link">
                  Publier vos données
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-muted-light pt-6 text-sm md:flex-row md:justify-between">
          <p className="text-center text-muted md:text-left">
            Copyright © 2025 • Avec engagement contre la corruption 🚀
          </p>
          <nav className="flex gap-4">
            <Link href="/license" className={linkBase}>
              Licences
            </Link>
            <span className="text-muted">|</span>
            <Link href="/legal" className={linkBase}>
              Mentions légales
            </Link>
          </nav>
        </section>
      </div>
    </div>
  </footer>
  )
};

type FooterNavLink = {
  href: string;
  label: string;
  external?: boolean;
  isText?: boolean;
};

type FooterNavProps = {
  title: string;
  links: FooterNavLink[];
};

const FooterNav: FC<FooterNavProps> = ({ title, links }) => (
  <div>
    <h3 className="mb-4 text-lg font-semibold text-secondary-dark">{title}</h3>
    <ul className="space-y-2">
      {links.map(({ href, label, external, isText }) => (
        <li key={label}>
          {isText ? (
            <span className="text-muted text-sm">{label}</span>
          ) : external ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={linkBase}>
              {label}
            </a>
          ) : (
            <Link href={href} className={linkBase}>
              {label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;