import { Suspense } from 'react';

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import Loading from '../../components/ui/Loading';
import KPIs from './KPIs';

export default async function ProjectDescription() {
  return (
    <main
      className="w-full"
      style={{
        backgroundImage: "url('/eclaireur/project_background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <article className='global-margin py-20 px-4'>
        <h2 className='mb-5 text-h2 '>Le projet</h2>
        <div className='grid gap-12 md:grid-cols-2'>
          <div>
            <div className='mb-3 pr-10 text-lg'>
              <p className='my-6 text-lg'>
              Depuis 2016, les collectivités doivent publier leurs données d'intérêt général. 
              Pourtant, seules 10% le font. Transparency International France et Anticor estiment 
              que la confiance citoyenne repose sur l'exemplarité des institutions.              
              </p>
              <p className='my-6 text-lg'>
                Le projet Éclaireur Public vise à :
              </p>
              <ul className='ml-5 list-disc'>
                <li>Encourager l'ouverture des données publiques.</li>
                <li>Rendre ces données accessibles aux citoyens.</li>
              </ul>
            </div>
            <Link
              href={'/le-projet'}
              className='my-10 p-2 flex w-40 items-center justify-center rounded-br-xl rounded-tl-xl bg-primary text-white'
            >
              <span className='me-2 font-bold'>En savoir plus</span>
              <ArrowRight />
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
