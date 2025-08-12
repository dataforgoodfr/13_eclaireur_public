import CtaCard from './CtaCard';

export default function CtaGroup() {
  const CtaInfo = [
    {
      title: 'Cartographie',
      caption: 'Explorer la carte pour voir quelles sont les collectivités les plus transparentes.',
      buttonText: 'Naviguer sur la carte',
      picto: '/eclaireur/map_icon.png',
      href: '/map',
      colorClassName: 'bg-brand-1',
    },

    {
      title: 'Recherche avancée',
      caption: 'Affinez votre recherche de collectivités avec la recherche avancée.',
      buttonText: 'Filtrer par collectivité',
      picto: '/eclaireur/search_icon.png',
      href: '/advanced-search',
      colorClassName: 'bg-brand-2',
    },

    {
      title: 'Interpeller',
      caption: 'Interpeller les élus pour améliorer la transparence dans votre collectivité.',
      buttonText: 'Engagement citoyen',
      picto: '/eclaireur/call_icon.png',
      href: '/interpeller',
      colorClassName: 'bg-brand-3',
    },
  ];

  return (
    <div className='global-margin my-20 flex w-full justify-center px-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full'>
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
