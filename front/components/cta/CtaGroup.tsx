import carteImage from '@/public/carte-image.png';
import placeHolderImage from '@/public/placeholder.jpg';

import CtaCard from './CtaCard';

export default function CtaGroup() {
  const CtaInfo = [
    {
      title: 'Cartographie',
      caption: 'Explorer la carte pour voir quelles sont les collectivités les plus transparentes.',
      image: carteImage,
      buttonText: 'Naviguer sur la carte',
      href: '/map',
    },

    {
      title: 'Recherche avancée',
      caption: 'Personnaliser votre recherche pour trouver les collectivités qui vous intéressent.',
      image: placeHolderImage,
      buttonText: 'Filtrer par collectivité',
      href: '/',
    },

    {
      title: 'Interpeller',
      caption: "Interpeller les élus pour améliorer la transparence dans votre collectivité.",
      image: placeHolderImage,
      buttonText: 'Engagement citoyen',
      href: '/',
    },
  ];

  return (
    <div className='box-border flex w-full flex-wrap items-stretch justify-center gap-2 p-2'>
      {CtaInfo.map((item) => (
        <CtaCard
          key={item.title}
          title={item.title}
          caption={item.caption}
          image={item.image}
          buttonText={item.buttonText}
          href={item.href}
        />
      ))}
    </div>
  );
}
