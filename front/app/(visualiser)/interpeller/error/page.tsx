import Image from 'next/image';
import Link from 'next/link';

import { Button } from '#components/ui/button';

export default function InterpellateError() {
  return (
    <section className='global-margin mb-16 mt-16'>
      <article className='mx-4 rounded-3xl border border-primary-light pb-12 shadow'>
        <div
          id='header-article'
          className='align-center mb-16 rounded-t-3xl bg-[url(/eclaireur/project_background.webp)] bg-bottom px-8 py-12 md:flex-row md:gap-0'
        >
          <h2 className='text-center'>Lien invalide ou expiré</h2>
        </div>

        <Image
          src='/eclaireur/error_icon.png'
          alt='Erreur'
          width={100}
          height={100}
          className='mx-auto block'
        />
        <p className='mb-12 mt-6 px-8 text-center text-lg'>
          Ce lien de confirmation n'est plus valide.
          <br />
          Il a peut-être expiré ou a déjà été utilisé.
        </p>

        <Button
          size='lg'
          className='mx-auto block rounded-none rounded-br-lg rounded-tl-lg bg-primary hover:bg-primary/90'
        >
          <Link href='/interpeller'>
            <Image
              src='/eclaireur/interpeller.svg'
              alt='Interpeller'
              width={20}
              height={20}
              className='mr-2 inline-block'
            />
            Retourner à l'interpellation
          </Link>
        </Button>
      </article>
    </section>
  );
}
