import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='relative w-full bg-yellow-100'>
      {/* Mascot in upper right corner */}
      <div className='absolute top-4 right-4 z-10'>
        <Image
          src='/eclaireur/mascotte_e.svg'
          alt='Mascotte Éclaireur Public'
          width={80}
          height={80}
          className='h-16 w-16 md:h-20 md:w-20'
        />
      </div>

      <div className='mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8'>
        {/* Header section with logo and social links */}
        <div className='mb-8 flex flex-col items-start justify-between gap-4 pr-20 md:flex-row md:items-center md:pr-24'>
          <div className='flex items-center gap-4'>
            <Image
              src='/eclaireur/logo.svg'
              alt='Éclaireur Public'
              width={48}
              height={48}
              className='h-12 w-12'
            />
            <div>
              <h2 className='text-2xl font-bold text-blue-900 md:text-3xl'>
                Éclaireur Public
              </h2>
              <p className='text-sm text-gray-600 md:text-base'>
                Pour une transparence des dépenses
              </p>
            </div>
          </div>
          
          {/* Social media links */}
          <div className='flex items-center gap-3'>
            <span className='text-sm font-medium text-orange-500'>Suivez-nous</span>
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

        {/* Main content grid */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12'>
          {/* Partners section */}
          <div className='md:col-span-2'>
            <h3 className='mb-4 text-lg font-semibold text-gray-700'>
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
                <span className='font-semibold text-blue-900'>Data For Good</span>
              </a>
            </div>

            <h3 className='mb-4 text-lg font-semibold text-gray-700'>
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
                <span className='font-semibold text-blue-900'>Anticor</span>
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
                <span className='font-semibold text-blue-900'>Transparency International</span>
              </a>
            </div>
          </div>

          {/* Navigation columns */}
          <div>
            <h3 className='mb-4 text-lg font-semibold text-orange-500'>
              Comprendre
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#'
                  className='text-blue-900 hover:text-blue-700 hover:underline'
                >
                  Qui sommes nous
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-blue-900 hover:text-blue-700 hover:underline'
                >
                  Le projet
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-blue-900 hover:text-blue-700 hover:underline'
                >
                  Interpeller
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold text-orange-500'>
              Besoin d&apos;aide
            </h3>
            <ul className='space-y-2 mb-6'>
              <li>
                <Link
                  href='/contact'
                  className='text-blue-900 hover:text-blue-700 hover:underline'
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-blue-900 hover:text-blue-700 hover:underline'
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-blue-900 hover:text-blue-700 hover:underline'
                >
                  Gérer mes cookies
                </Link>
              </li>
            </ul>

            <h3 className='mb-4 text-lg font-semibold text-orange-500'>
              Vous êtes un élu ?
            </h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='https://www.eclaireurpublic.fr/aide-aux-elus'
                  className='text-blue-900 hover:text-blue-700 hover:underline'
                >
                  Aide aux élus
                </a>
              </li>
              <li>
                <span className='text-gray-600 text-sm'>Bonnes pratiques</span>
              </li>
              <li>
                <a
                  href='https://data.gouv.fr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-900 hover:text-blue-700 hover:underline'
                >
                  Data.gouv.fr
                </a>
              </li>
              <li>
                <a
                  href='https://publieretalab.studio/fr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-900 hover:text-blue-700 hover:underline'
                >
                  Publier vos données
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className='mt-8 flex flex-col items-center justify-center gap-4 border-t border-gray-200 pt-6 text-sm text-gray-600 md:flex-row md:justify-between'>
          <p className='text-center md:text-left'>
            Copyright © 2025 • Avec engagement contre la corruption 🚀
          </p>
          <div className='flex gap-4'>
            <Link
              href='/license'
              className='hover:text-blue-900 hover:underline'
            >
              Licences
            </Link>
            <span className='text-gray-400'>|</span>
            <Link
              href='/legal'
              className='hover:text-blue-900 hover:underline'
            >
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}