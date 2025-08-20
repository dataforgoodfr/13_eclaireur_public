import { fetchSubventions } from '#utils/fetchers/subventions/fetchSubventions-server';
import { fetchSubventionsAvailableYears } from '#utils/fetchers/subventions/fetchSubventionsAvailableYears';

import { FicheCard } from '../FicheCard';
import { NoData } from '../NoData';
import { SubventionsWithState } from './SubventionsWithState';

async function getSubventions(siren: string) {
  const subventionsResults = await fetchSubventions({
    filters: { id_attribuant: siren },
    // TODO - Remove limit when api to calculate data is done
    limit: 100,
  });

  return subventionsResults;
}

export async function FicheSubventions({ siren }: { siren: string }) {
  const subventions = await getSubventions(siren);
  const availableYears = await fetchSubventionsAvailableYears(siren);

  return (
    <FicheCard>
      <h2 className='pb-3 text-center text-2xl'>Subventions</h2>
      {subventions.length > 0 ? (
        <SubventionsWithState siren={siren} subventions={subventions} availableYears={availableYears} />
      ) : (
        <NoData />
      )}
    </FicheCard>
  );
}