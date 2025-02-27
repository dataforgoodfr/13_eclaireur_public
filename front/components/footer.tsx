import Link from 'next/link';

export default function Footer() {
  return (
    <div className='w-full bg-neutral-400 fixed bottom-0'>
      <div className='mx-auto w-full max-w-screen-lg p-4 md:p-6'>
        <div className='flex items-center justify-start space-x-3 pb-4'>
          <div>
            <h2 className='text-xl font-extrabold md:text-3xl'>Éclaireur Public</h2>
            <div className='text-lg font-bold md:text-2xl'>Pour une transparence des dépenses</div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10'>
          <div className='col-span-1 grid grid-cols-2 gap-1 text-center text-sm md:text-base'>
            <Link
              href={'/methodology'}
              className='flex items-center justify-center rounded bg-neutral-700 p-1 text-white hover:bg-neutral-800'
            >
              Méthodologie
            </Link>
            <div className='flex items-center justify-center rounded bg-neutral-700 p-1 text-white hover:bg-neutral-800'>
              Télécharger les données
            </div>
            <a
              href='mailto:'
              className='flex items-center justify-center rounded bg-neutral-700 p-1 text-white hover:bg-neutral-800'
            >
              Contact
            </a>
            <Link
              href={'/faq'}
              className='flex items-center justify-center rounded bg-neutral-700 p-1 text-white hover:bg-neutral-800'
            >
              FAQ
            </Link>
          </div>
          <div className='col-span-1'>
            <div className='leading-7'>
              Projet mené par
              <a
                href='https://dataforgood.fr/'
                target='_blank'
                className='relative -my-2 inline-flex items-baseline whitespace-nowrap rounded-md bg-neutral-400 px-1 hover:bg-neutral-300'
              >
                <img
                  src='dataforgoodLogo.png'
                  alt='logo de Data For Good'
                  className='absolute top-1/2 h-4 w-4 -translate-y-1/2'
                />
                <span className='pl-5 font-semibold'>Data For Good</span>
              </a>
              en partenariat avec
              <a
                href='https://www.anticor.org/'
                target='_blank'
                className='relative inline-flex items-baseline whitespace-nowrap rounded-md bg-neutral-400 px-1 py-0 hover:bg-neutral-300'
              >
                <img
                  src='anticorLogo.png'
                  alt='logo de Anticor'
                  className='absolute top-1/2 h-4 -translate-y-1/2'
                />
                <span className='pl-12 font-semibold'>Anticor</span>
              </a>
              et
              <a
                href='https://transparency-france.org/'
                target='_blank'
                className='relative inline-flex items-baseline whitespace-nowrap rounded-md bg-neutral-400 px-1 py-0 hover:bg-neutral-300'
              >
                <img
                  src='transparencyLogo.png'
                  alt='logo de Transparency International'
                  className='absolute top-1/2 h-4 w-4 -translate-y-1/2'
                />
                <span className='pl-5 font-semibold'>Transparency International</span>
              </a>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center gap-6 pt-6 text-sm text-white'>
          <Link href={'/legal'} className='hover:text-neutral-200'>
            Mentions légales
          </Link>
          <Link href={'/license'} className='hover:text-neutral-200'>
            Licence d'utilisation
          </Link>
        </div>
      </div>
    </div>
  );
}
