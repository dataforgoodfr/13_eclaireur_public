import { Subvention } from '@/app/models/subvention';
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
import { fetchSubventions } from '@/utils/fetchers/subventions/fetchSubventions-server';
import { formatCompactPrice } from '@/utils/utils';

type SubventionsComparisonProperties = {
  siren1: string;
  siren2: string;
};
export async function SubventionsComparison({ siren1, siren2 }: SubventionsComparisonProperties) {
  const Subventions1 = await fetchSubventions({
    filters: { id_attribuant: siren1 },
  });
  const Subventions2 = await fetchSubventions({
    filters: { id_attribuant: siren2 },
  });

  return (
    <>
      <SectionSeparator sectionTitle='Subventions (2024)' />
      <div className='flex justify-around'>
        <ComparingSubventions data={Subventions1} />
        <ComparingSubventions data={Subventions2} />
      </div>
    </>
  );
}

function ComparingSubventions({ data }: { data: Subvention[] }) {
  // TODO Faire ces calculs dans le back et ajouter un filtre sur l'année
  const filteredData = data.filter((x) => Number(x.annee) === 2024);
  const totalAmount = filteredData.reduce((n, { montant }) => n + montant, 0);
  const subventionsNumber = filteredData.length;
  const top5Subventions = filteredData.sort((a, b) => b.montant - a.montant).slice(0, 5);
  return (
    <div className='basis-1/2 flex-col space-y-2 text-center md:mx-2'>
      <p>Montant total : {formatCompactPrice(totalAmount)}</p>
      <p>Nombre de subventions : {subventionsNumber}</p>
      <div className='md:mx-5'>
        <ShadCNTable>
          <TableCaption>Top 5 des subventions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>Bénéficiaire</TableHead>
              <TableHead className='w-[75px] text-right'>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top5Subventions.map(({ nom_beneficiaire, montant }, index) => (
              <TableRow key={index}>
                <TableCell className='text-left md:text-xs'>
                  {nom_beneficiaire.toLocaleUpperCase()}
                </TableCell>
                <TableCell className='text-right'>{formatCompactPrice(montant)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ShadCNTable>
      </div>
    </div>
  );
}
