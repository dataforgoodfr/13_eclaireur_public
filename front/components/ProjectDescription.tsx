import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ProjectDescription() {

  return (
    <div className="py-16 px-20">
      <h2 className="text-3xl font-bold uppercase mb-5">Le projet</h2>
      <div className="grid md:grid-cols-2 gap-8">

        <div>
        <div className="space-y-3 pr-10 text-lg mb-3">
          <p>Éclaireur Public est une initiative portée par Transparency International France et Anticor. Le projet vise à pallier le manque de transparence dans la gestion des dépenses publiques des collectivités locales en France.</p>
          <p>Depuis l’adoption de la loi pour une République numérique (2016), les collectivités sont légalement tenues de publier leurs données administratives en open data. Cependant, seulement 10% d'entre elles respectent cette obligation. Cette situation limite considérablement la capacité des citoyens, des journalistes et des organisations de lutte contre la corruption à surveiller l’utilisation des fonds publics.</p>
          <p>Avec un budget annuel total de 65 milliards d'euros (45 milliards pour la commande publique et 20 milliards pour les subventions), une meilleure transparence est essentielle pour détecter d'éventuelles irrégularités et renforcer la confiance des citoyens dans leurs institutions locales.</p>
        </div>
          <Link href={'/'}
            className='flex items-center justify-center rounded p-2 text-white bg-black hover:bg-neutral-800 w-40'>
            <span className='me-2'>En savoir plus</span>
            <ArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 2xl:px-20 justify-items-center">
          {ChiffreCle("10%", "Des dépenses françaises sont publiées")}
          {ChiffreCle("XXX", "Collectivités recensées sur le site")}
          {ChiffreCle("XMd€", "Budget national des collectivités")}
          {ChiffreCle("XXX", "XXX")}
        </div>
      </div>
    </div>
  );
}


function ChiffreCle(
  value: string,
  description: string,
) {
  return (
    <div className="border content-center px-6 w-64 h-48">
      <p className="font-bold text-2xl">{value}</p>
      <p className="">{description}</p>
    </div>
  );
}