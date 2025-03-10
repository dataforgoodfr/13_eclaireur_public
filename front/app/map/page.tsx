import { Map } from '@/components/FranceMap';
import { fetchGeoCommunities } from '@/utils/fetchers/fetchGeoCommunities-server';

export default async function MapPage() {
  const topoJSON = await fetchGeoCommunities();

  return (
    <div className='min-h-screen'>
      <div style={{ width: '500px', height: '500px' }}>
        <Map width={500} height={500} topoJson={topoJSON} />
      </div>
    </div>
  );
}
