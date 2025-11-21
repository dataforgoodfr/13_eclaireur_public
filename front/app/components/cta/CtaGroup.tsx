import CtaCard from './CtaCard';

export default function CtaGroup() {
  const CtaInfo = [
    {
      title: 'Cartographie',
      caption: 'Explorer la carte pour voir quelles sont les collectivités les plus transparentes.',
      buttonText: 'Naviguer sur la carte',
      picto: '/icons/map.svg',
      href: '/map',
      colorClassName: 'bg-brand-1',
    },

    {
      title: 'Recherche avancée',
      caption: 'Affinez votre recherche de collectivités avec la recherche avancée.',
      buttonText: 'Filtrer par collectivité',
      picto: '/icons/search.svg',
      href: '/advanced-search',
      colorClassName: 'bg-brand-2',
    },

    {
      title: 'Interpeller',
      caption: 'Interpeller les élus pour améliorer la transparence dans votre collectivité.',
      buttonText: 'Interpeller les élus',
      picto: '/icons/speaker.svg',
      href: '/interpeller',
      colorClassName: 'bg-brand-3',
    },
  ];

  return (
    <div className='global-margin my-20 flex w-full justify-center px-4'>
      <div className='grid w-full grid-cols-1 gap-8 md:grid-cols-3'>
        {CtaInfo.map((item) => (
          <CtaCard
            key={item.title}
            title={item.title}
            caption={item.caption}
            picto={item.picto}
            buttonText={item.buttonText}
            href={item.href}
            colorClassName={item.colorClassName}
          />
        ))}
      </div>
    </div>
  );
}
