import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Licence d’utilisation',
  description: 'License d’utilisation',
};


export default function page() {
  return (
    <div className='mx-auto w-full max-w-screen-lg p-6'>
      <h1 className='my-6 text-3xl font-bold'>Licence d'utilisation</h1>
      <h3 className='pb-4 text-lg font-semibold'>Dernière mise à jour : 25 Février 2025</h3>
      <hr />
      <h2 className='mb-4 mt-6 text-2xl font-bold'>1. Objet</h2>
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
      <h2 className='mb-4 mt-6 text-2xl font-bold'>2. Utilisation Autorisée</h2>
      <ul className='list-inside list-disc'>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, veniam!</li>
        <li>
          Nobis omnis veniam ut est dolor quaerat. Nesciunt, eius nihil sequi nulla labore
          repudiandae asperi
        </li>
        <li>
          Nisi dolorum facere. Assumenda odit atque, vel tempora dignissimos magnam temporibus velit
          consequatur perspiciatis ut
        </li>
        <li>
          Magnam temporibus velit consequatur perspiciatis ut ratione alias itaque totam
          reprehenderit
        </li>
      </ul>
      <h2 className='mb-4 mt-6 text-2xl font-bold'>3. Restrictions</h2>
      <p>
        Eius nihil sequi nulla labore repudiandae asperiores tenetur molestiae? Quam eaque, fuga
        dolorem amet nobis minus at commodi odio maxime nisi dolorum facere. Assumenda odit atque,
        vel tempora dignissimos magnam temporibus velit consequatur perspiciatis ut ratione alias
        itaque totam reprehenderit soluta laboriosam? Veniam a deserunt, quidem pariatur ratione
        repudiandae, dolores consequatur inventore, in iste beatae asperiores.
      </p>
      <h2 className='mb-4 mt-6 text-2xl font-bold'>4. Propriété Intellectuelle</h2>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente velit fugit recusandae
        modi praesentium maxime cumque error? Numquam voluptatum harum exercitationem, in placeat,
        illo consequatur autem ab excepturi commodi rerum at quos minima aut cumque sequi?
      </p>
      <h2 className='mb-4 mt-6 text-2xl font-bold'>5. Responsabilité</h2>
      <p>
        {' '}
        Numquam voluptatum harum exercitationem, in placeat, illo consequatur autem ab excepturi
        commodi rerum at quos minima aut cumque sequi?
      </p>
      <h2 className='mb-4 mt-6 text-2xl font-bold'>6. Modifications</h2>
      <p>
        In placeat, illo consequatur autem ab excepturi commodi rerum at quos minima aut cumque
        sequi?
      </p>
      <h2 className='mb-4 mt-6 text-2xl font-bold'>7. Contact</h2>
      <p>
        Veniam a deserunt, quidem pariatur ratione repudiandae, dolores consequatur inventore, in
        iste beatae@asperiores.com.
      </p>
    </div>
  );
}
