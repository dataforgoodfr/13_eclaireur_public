'use client';

import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

const FOOTER_DATA = {
  social: [
    { href: 'https://www.instagram.com/anticorofficiel/', label: 'Instagram', src: '/logos/rs/Instagram.png', alt: 'Instagram' },
    { href: 'https://www.linkedin.com/company/anticor/', label: 'LinkedIn', src: '/logos/rs/Linkedin.png', alt: 'LinkedIn' },
    { href: 'https://www.facebook.com/Anticor.officiel/', label: 'Facebook', src: '/logos/rs/Facebook.png', alt: 'Facebook' },
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
      title: 'Comprendre',
      links: [
        { href: '/qui-sommes-nous', label: 'Qui sommes‑nous' },
        { href: '/le-projet', label: 'Le projet' },
        { href: '/interpeller', label: 'Interpeller' },
      ],
    },
    {
      title: "Besoin d'aide",
      links: [
        { href: '/contact', label: 'Contact' },
        { href: '/faq', label: 'FAQ' },
        // Pas d'analytics et de cookies pour l'instant
        // { href: '/cookies', label: 'Gérer mes cookies' },
      ],
    },
  ],
};

const btnBase =
  'flex w-fit items-center gap-2.5 rounded-full bg-white px-4 py-2 transition-colors hover:bg-gray-200 overflow-hidden';
const linkBase =
  'font-semibold text-lg text-primary hover:text-primary hover:underline transition-colors text-link';
const linkLegalBase =
  'font-semibold text-muted hover:text-muted hover:underline transition-colors text-link';

const Footer: FC = () => (
  <footer
    className="relative w-full bg-[url('/eclaireur/project_background.webp')] bg-cover bg-center object-cover"
    aria-labelledby='footer-title'
  >
    <div className='global-margin flex h-full items-center justify-center py-12'>
      <div className='w-full px-4 md:px-6 lg:px-8'>
        <section className='mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col items-start gap-2'>
            <Image
              src='/eclaireur/eclaireur-footeur.svg'
              alt='Éclaireur Public – Pour une transparence des dépenses'
              width={300}
              height={70}
              priority
              className='h-9 w-auto'
            />
            <p className='text-lg'>Pour une transparence des dépenses</p>
            <span className='hidden text-sm font-bold text-secondary-dark md:mt-2 md:block'>
              Suivez‑nous
            </span>
            <div className='flex gap-4'>
              {FOOTER_DATA.social.map(({ href, label, src, alt }) => (
                <a
                  key={label}
                  href={href}
                  className='flex h-8 w-8 items-center justify-center rounded transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                  aria-label={label}
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={24}
                    height={24}
                    className='h-8 w-8'
                    loading='lazy'
                  />
                </a>
              ))}
            </div>
          </div>

          <Image
            src='/eclaireur/Mascotte-appel.png'
            alt='Mascotte Éclaireur Public'
            width={160}
            height={140}
            className='hidden h-36 w-40 md:block'
            loading='lazy'
          />
        </section>

        <section className='grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12'>
          <div className='col-span-2 md:col-span-2'>
            <div className='md:bloc flex gap-1'>
              <div className='flex flex-1 flex-col gap-3'>
                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-500'>
                    Un projet accompagné par
                  </h3>
                  <div className='flex flex-col'>
                    {FOOTER_DATA.partners.map(({ href, imgSrc, imgAlt, name }) => (
                      <a
                        key={name}
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={btnBase}
                      >
                        <Image
                          src={imgSrc}
                          alt={imgAlt}
                          width={24}
                          height={24}
                          className='h-6 w-6'
                          loading='lazy'
                        />
                        <span className='whitespace-nowrap text-sm font-semibold text-primary'>
                          {name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='mb-2 text-base font-semibold text-gray-500'>
                    À l&apos;initiative de
                  </h3>
                  <div className='flex flex-col gap-1'>
                    {FOOTER_DATA.initiatives.map(({ href, imgSrc, imgAlt, name }) => (
                      <a
                        key={name}
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={btnBase}
                      >
                        <Image
                          src={imgSrc}
                          alt={imgAlt}
                          width={24}
                          height={24}
                          className='h-6 w-6'
                          loading='lazy'
                        />
                        <span className='whitespace-nowrap text-sm font-semibold text-primary'>
                          {name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className='mt-4 flex justify-center md:hidden'>
                <Image
                  src='/eclaireur/Mascotte-appel.png'
                  alt='Mascotte Éclaireur Public'
                  width={114}
                  height={94}
                  className='h-[94px] w-28'
                  loading='lazy'
                />
              </div>
            </div>
          </div>

          {FOOTER_DATA.navigation.map((section) => (
            <FooterNav key={section.title} title={section.title} links={section.links} />
          ))}

          <div className='col-span-2 md:col-span-1'>
            <div className='flex w-full flex-row gap-8 md:flex-col md:gap-0'>
              <div className='flex flex-1 flex-col space-y-2'>
                <h3 className='mb-2 text-sm font-bold text-secondary-dark'>Vous êtes un élu ?</h3>
                <Link
                  href='/aide-aux-elus'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-semibold text-primary underline transition-colors hover:text-primary'
                >
                  Aide aux élus
                </Link>
              </div>
              <div className='mt-3 flex flex-1 flex-col space-y-2'>
                <span className='text-sm font-bold text-muted'>Bonnes pratiques</span>
                <Link
                  href='https://data.gouv.fr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-semibold text-primary underline transition-colors hover:text-primary'
                >
                  Data.gouv.fr
                </Link>
                <Link
                  href='https://publier.etalab.studio/fr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-semibold text-primary underline transition-colors hover:text-primary'
                >
                  Publier vos données
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className='mt-12 flex flex-col gap-6 border-muted-light text-sm md:flex-row'>
          <p className='text-left text-base text-muted'>
            Copyright © 2025 • Avec engagement contre la corruption 🚀
          </p>
          <nav className='flex-start flex gap-4'>
            <Link href='/license' className={linkLegalBase}>
              Licences
            </Link>
            <span className='text-muted'>|</span>
            <Link href='/legal' className={linkLegalBase}>
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
};

type FooterNavProps = {
  title: string;
  links: FooterNavLink[];
};

const FooterNav: FC<FooterNavProps> = ({ title, links }) => (
  <div>
    <h3 className='mb-4 text-sm font-bold text-secondary-dark'>{title}</h3>
    <ul className='grid gap-2.5 space-y-2'>
      {links.map(({ href, label, external, isText }) => (
        <li key={label}>
          {isText ? (
            <span className='text-sm text-muted'>{label}</span>
          ) : external ? (
            <a href={href} target='_blank' rel='noopener noreferrer' className={linkBase}>
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
