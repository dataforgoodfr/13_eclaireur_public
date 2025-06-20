import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quelle transparence sur les dépenses des collectivités ? Perspectives',
  description:
    'La transparence des données publiques aux différents échelons locaux, état des lieux et perspectives',
};

export default function Page() {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Etats des lieux et Perspectives</h1>
      <p className='my-6 text-lg'>
        {/* TODO - rédiger une intro */}
        La France est-elle un élève modèle en termes d'ouvertures de ses données publiques aux
        différents échelons locaux ? Depuis la loi pour une République numérique de 2016, peut-on
        constater une amélioration de la transparence sur ces données ? Quels enseignements tirer de
        la faible performance de nos collectivités en matière de transparence ?
      </p>
      <h2 className='my-12 text-2xl font-bold'>Etat des lieux</h2>
      <p className='my-6 text-lg'>
        {/* TODO - à rédiger */}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore voluptas atque unde
        provident cupiditate eaque deleniti velit totam molestias? Sint id blanditiis expedita quae
        vitae?
      </p>

      <h2 className='my-12 text-2xl font-bold'>Perspectives</h2>
      <p className='my-6 text-lg'>
        {/* TODO : rédiger cette partie */}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos porro sed alias numquam tempore
        similique ex rem tempora illum sunt, veritatis dolor. Voluptatibus sit numquam hic magni
        quidem voluptate blanditiis laboriosam mollitia suscipit, voluptates ratione illum, ea
        consequatur pariatur at totam nobis? Illo excepturi minus laudantium nisi minima a ducimus
        vitae asperiores, tempore distinctio eveniet accusamus voluptas dolor est nobis sed delectus
        ut sunt eos. Doloribus in ab adipisci sed beatae, ea at libero, dolores ex saepe veniam
        delectus sit magnam neque rem doloremque quae vel impedit voluptates voluptate ipsa! Quis
        esse praesentium vitae dolorum et quod aut culpa laboriosam, aliquam inventore modi
        similique numquam tempore tenetur hic. Aliquam exercitationem odio blanditiis nostrum
        corrupti dolorem ratione totam enim voluptatem corporis. Sunt animi nisi laborum tenetur id
        doloremque nemo quibusdam error sed excepturi neque porro cum iste, quas minima at, fugit
        aliquam ratione, delectus labore. Doloremque voluptates perferendis aut aliquid! Dignissimos
        mollitia consectetur tempore quas sint nemo, reiciendis facilis hic praesentium. Suscipit
        eligendi provident vitae explicabo nihil, blanditiis, consectetur placeat ex officia ullam
        quia illo adipisci, sit recusandae itaque eos. Ipsam ducimus atque laboriosam repudiandae
        libero quo sapiente. Vel, ratione nihil maiores asperiores exercitationem laboriosam, nam
        facere similique nemo officiis veritatis!
      </p>
    </main>
  );
}
