import { Suspense } from 'react';

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import Loading from '../../components/ui/Loading';
import KPIs from './KPIs';

export default async function ProjectDescription() {
  return (
    <main
      className='w-full'
      style={{
        backgroundImage: "url('/eclaireur/project_background.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <article className='global-margin px-4 py-20'>
        <h2 className='text-h2'>Le projet</h2>
        <div className='grid gap-12 md:grid-cols-2'>
          <div>
            <div className='mb-3 text-lg'>
              <p className='my-6 text-lg'>
                Depuis 2016, les collectivités de plus de 3500 habitants doivent publier leurs données d'intérêt général.
                Pourtant, seules 10% le font. Transparency International France et Anticor estiment
                que la confiance citoyenne repose sur l'exemplarité des institutions.
              </p>
              <p className='mt-6 text-lg'>Le projet Éclaireur Public vise à :</p>
              <ul className='ml-5 list-disc'>
                <li>Encourager l'ouverture des données publiques.</li>
                <li>Rendre ces données accessibles aux citoyens.</li>
              </ul>
            </div>
            <Link
              href={'/le-projet'}
              className='my-10 flex items-center justify-center rounded-br-xl rounded-tl-xl bg-primary p-2 text-white md:w-40'
            >
              <span className='me-2 font-semibold'>En savoir plus</span>
              <ChevronRight />
            </Link>
          </div>
          <Suspense fallback={<Loading />}>
            <KPIs />
          </Suspense>
        </div>
      </article>
    </main>
  );
}
