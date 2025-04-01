// import { fetchCommunities } from '@/utils/fetchers/communities/fetchCommunities-server';
// import { fetchSubventions } from '@/utils/fetchers/subventions/fetchSubventions-server';


// type CommunityPageProps = { params: Promise<{ siren: string }> };

// async function getCommunity(siren: string) {
//   const communitiesResults = await fetchCommunities({ filters: { siren } });

//   if (communitiesResults.length === 0) {
//     throw new Error(`Community doesnt exist with siren ${siren}`);
//   }

//   return communitiesResults[0];
// }





// export default async function CommunityPage({ params }: CommunityPageProps) {
//   const siren = (await params).siren;

//   const community = await getCommunity(siren);


//   return (
//     <div className='max-w-screen-xl mx-auto '>
//       <div className='community-page p-4 border rounded-lg shadow my-6'>
//         <h1 className='text-4xl text-center font-medium'>{community.nom}</h1>

//         <div className='community-details'>
//           <p>
//             <strong>SIREN:</strong> {community.siren}
//           </p>
//           <p>
//             <strong>Type:</strong> {community.type}
//           </p>
//           <p>
//             <strong>Population:</strong> {community.population.toLocaleString()} habitants
//           </p>
//         </div>
//       </div>
//       <MarchesPublics trendsData={trends} TreemapData={dataForTreemap} MarketTypeData={marketType} MarketProcessData={marketProcess}/>
//     </div>
//   );
// }
