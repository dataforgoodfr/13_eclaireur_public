import carteImage from '@/public/carte-image.png';
import placeHolderImage from '@/public/placeholder.jpg';
import advanced_search from "@/public/advanced_search.png"
import interpellate from "@/public/interpellate.png"

import CtaCard from './CtaCard';

export default function CtaGroup() {
  const CtaInfo = [
    {
      title: 'Cartographie',
      caption: 'Explorer la carte pour voir quelles sont les collectivités les plus transparentes.',
      image: carteImage,
      buttonText: 'Naviguer sur la carte',
      href: '/map',
      color:"#ffeccf"
    },

    {
      title: 'Recherche avancée',
      caption: 'Affinez votre recherche de collectivités avec la recherche avancée.',
      image: advanced_search,
      buttonText: 'Filtrer par collectivité',
      href: '/',
      color:"#cfe8ff"
    },

    {
      title: 'Interpeller',
      caption: 'Interpeller les élus pour améliorer la transparence dans votre collectivité.',
      image: interpellate,
      buttonText: 'Engagement citoyen',
      href: '/',
      color:"#b1b2b5"
    },
  ];

  return (
    <div className='mx-auto my-20 flex max-w-screen-lg justify-center space-x-20'>
      {CtaInfo.map((item) => (
        <CtaCard
          key={item.title}
          title={item.title}
          caption={item.caption}
          image={item.image}
          buttonText={item.buttonText}
          href={item.href}
          color={item.color}
        />
      ))}
    </div>
  );
}
