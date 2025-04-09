import carteImage from '@/public/carte-image.png';
import placeHolderImage from '@/public/placeholder.jpg';

import CtaCard from './CtaCard';

export default function CtaGroup() {
  const CtaInfo = [
    {
      title: 'Cartographie',
      caption: 'Quelles sont les collectivités les plus transparentes ?',
      image: carteImage,
      buttonText: 'Filtrer par indicateur',
      href: '/map',
    },

    {
      title: 'Portrait',
      caption: 'Comment ma collectivité dépense-t-elle ?',
      image: placeHolderImage,
      buttonText: 'Filtrer par collectivité',
      href: '/',
    },

    {
      title: 'Interpeller',
      caption: 'Ma collectivité est-elle transparente ?',
      image: placeHolderImage,
      buttonText: 'Engagement citoyen',
      href: '/interpeller',
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
