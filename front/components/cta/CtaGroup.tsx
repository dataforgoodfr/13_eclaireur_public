import advancedSearchImg from '@/public/advancedSearchImg.png';
import carteImg from '@/public/carteImg.png';
import interpellateImg from '@/public/interpellateImg.png';

import CtaCard from './CtaCard';

export default function CtaGroup() {
  const CtaInfo = [
    {
      title: 'Cartographie',
      caption: 'Explorer la carte pour voir quelles sont les collectivités les plus transparentes.',
      image: carteImg,
      buttonText: 'Naviguer sur la carte',
      href: '/map',
      colorClassName: 'bg-card-secondary-foreground-2',
    },

    {
      title: 'Recherche avancée',
      caption: 'Affinez votre recherche de collectivités avec la recherche avancée.',
      image: advancedSearchImg,
      buttonText: 'Filtrer par collectivité',
      href: '/advanced-search',
      colorClassName: 'bg-card-secondary-foreground-3',
    },

    {
      title: 'Interpeller',
      caption: 'Interpeller les élus pour améliorer la transparence dans votre collectivité.',
      image: interpellateImg,
      buttonText: 'Engagement citoyen',
      href: '/interpeller',
      colorClassName: 'bg-card-secondary-foreground-4',
    },
  ];

  return (
    <div className='mx-auto my-20 flex max-w-screen-lg justify-center space-x-8'>
      {CtaInfo.map((item) => (
        <CtaCard
          key={item.title}
          title={item.title}
          caption={item.caption}
          image={item.image}
          buttonText={item.buttonText}
          href={item.href}
          colorClassName={item.colorClassName}
        />
      ))}
    </div>
  );
}
