import CtaCard from './CtaCard';

export default function CtaGroup() {
  const CtaInfo = [
    {
      title: 'Cartographie',
      caption: 'Quelles sont les collectivités les plus transparentes ?',
      image: '',
      buttonText: 'Filtrer par indicateur',
      href: '/',
    },

    {
      title: 'Portrait',
      caption: 'Comment ma collectivité dépense-t-elle ?',
      image: '',
      buttonText: 'Filtrer par collectivité',
      href: '/',
    },

    {
      title: 'Interpeller',
      caption: 'Ma collectivité est-elle transparente ?',
      image: '',
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