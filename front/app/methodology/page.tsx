import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Méthodologie',
  description:
    'Explications de la méthodologie utilisée pour récupérer et traiter les données utilisées sur le site.',
};

export default function page() {
  return (
    <div className='mx-auto w-full max-w-screen-lg p-6'>
      <h1 className='my-6 text-3xl font-bold'>Méthodologie</h1>
      <h2 className='mb-4 mt-6 text-2xl font-bold'>Données</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam ut quaerat libero in odit
        repudiandae suscipit incidunt facilis quod, atque corporis minus architecto qui inventore
        delectus vitae quae tempore sit. Voluptate aperiam id suscipit deserunt tempore voluptatibus
        maiores quia repellat. Similique dicta illo consequuntur labore eligendi qui ullam? Eum
        voluptatibus pariatur dolore fugiat sequi itaque veritatis vel sunt quae quasi enim quo vero
        fuga hic explicabo quisquam, officiis repellendus sint neque libero temporibus dolorum
        tenetur omnis et? Rem vitae non veritatis, quibusdam eaque nostrum nemo harum nobis omnis
        veniam ut est dolor quaerat. Nesciunt, eius nihil sequi nulla labore repudiandae asperiores
        tenetur molestiae? Quam eaque, fuga dolorem amet nobis minus at commodi odio maxime nisi
        dolorum facere. Assumenda odit atque, vel tempora dignissimos magnam temporibus velit
        consequatur perspiciatis ut ratione alias itaque totam reprehenderit soluta laboriosam?
        Veniam a deserunt, quidem pariatur ratione repudiandae, dolores consequatur inventore, in
        iste beatae asperiores.
      </p>
      <h2 className='mb-4 mt-6 text-2xl font-bold'>Traitement de la donnée</h2>
      <ul className='list-inside list-decimal'>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, veniam!</li>
        <li>
          Nobis omnis veniam ut est dolor quaerat. Nesciunt, eius nihil sequi nulla labore
          repudiandae asperi
        </li>
        <li>
          Dolore fugiat sequi itaque veritatis vel sunt quae quasi enim quo vero fuga hic explicabo
          quisquam, officiis repellendus sint !
        </li>
        <li>Dicta illo consequuntur labore eligendi qui ullam? Eum voluptatibus pari</li>
      </ul>
      <h2 className='mb-4 mt-6 text-2xl font-bold'>Gouvernance</h2>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente velit fugit recusandae
        modi praesentium maxime cumque error? Numquam voluptatum harum exercitationem, in placeat,
        illo consequatur autem ab excepturi commodi rerum at quos minima aut cumque sequi?
      </p>
    </div>
  );
}
