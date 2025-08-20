export function NoData({ style }: { style?: React.CSSProperties }) {
  return (
    <div className='flex h-[200px] w-full items-center justify-center rounded-lg bg-gray-50' style={style}>
      <div className='text-center'>
        <p className='text-lg font-medium text-gray-600'>Aucune donnée disponible</p>
        <p className='mt-1 text-sm text-gray-500'>
          Il n&apos;y a pas de données à afficher pour le moment.
        </p>
      </div>
    </div>
  );
}
