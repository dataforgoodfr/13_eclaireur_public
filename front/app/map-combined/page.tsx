import { GeoJSONData, CommunityType, newFetchGeoData } from '@/utils/fetchers/communities/fetchGeoData';
import { MapPageClient } from './client-mapgl';

interface MapPageServerProps {
  regionsData: GeoJSONData | null;
  departmentsData: GeoJSONData | null;
}

export default async function MapPageServer() {
    try {
      // Fetch regions and departments server-side
      const regionsData = await newFetchGeoData(CommunityType.Region);
      const departmentsData = await newFetchGeoData(CommunityType.Departement);
  
      // Pass the data to the client component
      return <MapPageClient regionsData={regionsData} departmentsData={departmentsData} />;
    } catch (error) {
      console.error('Error fetching server-side data:', error);
      return (
        <div>
          <p>Error fetching data. Please try again later.</p>
        </div>
      );
    }
  }