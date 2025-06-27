import { MarchePublic } from '@/app/models/marchePublic';
import {
  Table as ShadCNTable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SectionSeparator from '@/components/utils/SectionSeparator';
import { fetchMarchesPublics } from '@/utils/fetchers/marches-publics/fetchMarchesPublics-server';
import { formatCompactPrice } from '@/utils/utils';

type MarchesPublicsComparisonProperties = {
  siren1: string;
  siren2: string;
};
export async function MarchesPublicsComparison({
  siren1,
  siren2,
}: MarchesPublicsComparisonProperties) {
  const marchesPublics1 = await fetchMarchesPublics({
    filters: { acheteur_id: siren1 },
  });
  const marchesPublics2 = await fetchMarchesPublics({
    filters: { acheteur_id: siren2 },
  });

  return (
    <>
      <SectionSeparator sectionTitle='Marchés publics (2024)' />
      <div className='flex justify-around'>
        <ComparingMarchesPublics data={marchesPublics1} />
        <ComparingMarchesPublics data={marchesPublics2} />
      </div>
    </>
  );
}

function ComparingMarchesPublics({ data }: { data: MarchePublic[] }) {
  // TODO Faire ces calculs dans le back et ajouter un filtre sur l'année
  const filteredData = data.filter((x) => Number(x.annee_notification) === 2024);
  const totalAmount = filteredData.reduce((n, { montant }) => n + montant, 0);
  const contractsNumber = filteredData.length;
  const top5Contracts = filteredData.sort((a, b) => b.montant - a.montant).slice(0, 5);
  return (
    <div className='mx-2 basis-1/2 flex-col space-y-2 text-center'>
      <p>Montant total : {formatCompactPrice(totalAmount)}</p>
      <p>Nombre de contrats : {contractsNumber}</p>
      <div className='md:mx-5'>
        <ShadCNTable>
          <TableCaption>Top 5 des contrats</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>Objet</TableHead>
              <TableHead className='w-[75px] text-right'>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top5Contracts.map(({ cpv_2_label, montant }, index) => (
              <TableRow key={index}>
                <TableCell className='text-left'>{cpv_2_label.toLocaleUpperCase()}</TableCell>
                <TableCell className='text-right'>{formatCompactPrice(montant)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ShadCNTable>
      </div>
    </div>
  );
}
