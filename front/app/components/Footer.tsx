import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='relative w-full bg-none object-cover'>
      {/* Decorative eyes similar to header pattern */}
      <Image src="/eclaireur/eyes_left.svg" alt="Yeux" className='absolute hidden md:block h-8' style={{ left: '15%', top: '40%' }} width={54} height={36} />
      <Image src="/eclaireur/eyes_right.svg" alt="Yeux" className='absolute hidden md:block h-8' style={{ right: '25%', top: '20%' }} width={60} height={40} />
      <Image src="/eclaireur/eyes_right.svg" alt="Yeux" className='absolute hidden md:block h-6' style={{ right: '10%', top: '80%' }} width={42} height={28} />
      
      {/* Mascot in upper right corner */}
      <div className='absolute top-4 right-4 z-20'>
        <Image
          src='/eclaireur/Mascotte-appel.png'
          alt='Mascotte Éclaireur Public'
          width={80}
          height={80}
          className='h-16 w-16 md:h-20 md:w-20'
        />
      </div>

      <div className='global-margin flex h-full items-center justify-center'>
        <div className='w-full px-4 py-8 md:px-6 lg:px-8'>
          {/* Header section with logo and social links */}
          <div className='mb-8 flex flex-col items-start justify-between gap-4 pr-20 md:flex-row md:items-center md:pr-24'>
            <div className='flex flex-col items-start gap-3'>
              {/* Full logo */}
              <Image
                src='/eclaireur/eclaireur-footeur.svg'
                alt='Éclaireur Public - Pour une transparence des dépenses'
                width={300}
                height={80}
                className='h-16 w-auto md:h-20'
              />
              
              {/* Social media links - positioned under the logo */}
              <div className='flex items-center gap-3'>
                <span className='text-sm font-medium text-muted'>Suivez-nous</span>
                <div className='flex gap-2'>
                  <a
                    href='#'
                    className='flex h-8 w-8 items-center justify-center rounded hover:opacity-80 transition-opacity'
                    aria-label='Instagram'
                  >
                    <Image
                      src='/logos/rs/Instagram.png'
                      alt='Instagram'
                      width={32}
                      height={32}
                      className='h-8 w-8'
                    />
                  </a>
                  <a
                    href='#'
                    className='flex h-8 w-8 items-center justify-center rounded hover:opacity-80 transition-opacity'
                    aria-label='LinkedIn'
                  >
                    <Image
                      src='/logos/rs/Linkedin.png'
                      alt='LinkedIn'
                      width={32}
                      height={32}
                      className='h-8 w-8'
                    />
                  </a>
                  <a
                    href='#'
                    className='flex h-8 w-8 items-center justify-center rounded hover:opacity-80 transition-opacity'
                    aria-label='Facebook'
                  >
                    <Image
                      src='/logos/rs/Facebook.png'
                      alt='Facebook'
                      width={32}
                      height={32}
                      className='h-8 w-8'
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className='grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12'>
            {/* Partners section */}
            <div className='md:col-span-2'>
              <h3 className='mb-4 text-lg font-semibold text-primary'>
                Un projet accompagné par
              </h3>
              
              <div className='mb-6 flex items-center gap-2'>
                <a
                  href='https://dataforgood.fr/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50 transition-colors'
                >
                  <Image
                    src='/logos/assos/Data for Good.svg'
                    alt='Data For Good'
                    width={32}
                    height={32}
                    className='h-8 w-8'
                  />
                  <span className='font-semibold text-primary'>Data For Good</span>
                </a>
              </div>

              <h3 className='mb-4 text-lg font-semibold text-primary'>
                À l&apos;initiative de
              </h3>
              
              <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
                <a
                  href='https://www.anticor.org/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50 transition-colors'
                >
                  <Image
                    src='/logos/assos/Anticor.svg'
                    alt='Anticor'
                    width={32}
                    height={32}
                    className='h-8 w-8'
                  />
                  <span className='font-semibold text-primary'>Anticor</span>
                </a>
                
                <a
                  href='https://transparency-france.org/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50 transition-colors'
                >
                  <Image
                    src='/logos/assos/Transparency international.svg'
                    alt='Transparency International'
                    width={32}
                    height={32}
                    className='h-8 w-8'
                  />
                  <span className='font-semibold text-primary'>Transparency International</span>
                </a>
              </div>
            </div>

            {/* Navigation columns */}
            <div>
              <h3 className='mb-4 text-lg font-semibold text-secondary'>
                Comprendre
              </h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='#'
                    className='text-muted hover:text-primary hover:underline'
                  >
                    Qui sommes nous
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='text-muted hover:text-primary hover:underline'
                  >
                    Le projet
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='text-muted hover:text-primary hover:underline'
                  >
                    Interpeller
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-4 text-lg font-semibold text-secondary'>
                Besoin d&apos;aide
              </h3>
              <ul className='space-y-2 mb-6'>
                <li>
                  <Link
                    href='/contact'
                    className='text-muted hover:text-primary hover:underline'
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='text-muted hover:text-primary hover:underline'
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='text-muted hover:text-primary hover:underline'
                  >
                    Gérer mes cookies
                  </Link>
                </li>
              </ul>

              <h3 className='mb-4 text-lg font-semibold text-secondary'>
                Vous êtes un élu ?
              </h3>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='https://www.eclaireurpublic.fr/aide-aux-elus'
                    className='text-muted hover:text-primary hover:underline'
                  >
                    Aide aux élus
                  </a>
                </li>
                <li>
                  <span className='text-muted text-sm'>Bonnes pratiques</span>
                </li>
                <li>
                  <a
                    href='https://data.gouv.fr'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-muted hover:text-primary hover:underline'
                  >
                    Data.gouv.fr
                  </a>
                </li>
                <li>
                  <a
                    href='https://publieretalab.studio/fr'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-muted hover:text-primary hover:underline'
                  >
                    Publier vos données
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer bottom */}
          <div className='mt-8 flex flex-col items-center justify-center gap-4 border-t border-muted-light pt-6 text-sm md:flex-row md:justify-between'>
            <p className='text-center text-muted md:text-left'>
              Copyright © 2025 • Avec engagement contre la corruption 🚀
            </p>
            <div className='flex gap-4'>
              <Link
                href='/license'
                className='text-muted hover:text-primary hover:underline'
              >
                Licences
              </Link>
              <span className='text-muted'>|</span>
              <Link
                href='/legal'
                className='text-muted hover:text-primary hover:underline'
              >
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}