'use client';

import { PureComponent, useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import { MarchePublic } from '@/app/models/marche_public';
import { Switch } from '@/components/ui/switch';
import { formatNumber } from '@/utils/utils';
import { Contrast } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type FormattedDataTrends = {
  annee: number;
  montant: number;
  nombre: number;
};

export default function Trends({ data }: { data: MarchePublic[] }) {
  const [contractDisplayed, setContractDisplayed] = useState(false);

  const trends: FormattedDataTrends[] = Object.values(
    data.reduce<Record<string, FormattedDataTrends>>((acc, item) => {
      const year = item.datenotification_annee;

      if (!acc[year]) {
        acc[year] = { annee: year, montant: 0, nombre: 0 };
      }
      acc[year].montant += parseFloat(String(item.montant)) || 0;
      acc[year].nombre += 1;

      return acc;
    }, {}),
  );

  const renderLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill='#4e4e4e'
        textAnchor='middle'
        dominantBaseline='middle'
        fontSize='16'
      >
        {formatNumber(value)}
      </text>
    );
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Évolution des marchés publics au cours du temps</h3>
          <div className='flex items-baseline gap-2'>
            <div
              onClick={() => setContractDisplayed(false)}
              className={`cursor-pointer ${!contractDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              (Montants annuels
            </div>
            <Switch
              checked={contractDisplayed}
              onCheckedChange={() => setContractDisplayed((prev) => !prev)}
            />
            <div
              onClick={() => setContractDisplayed(true)}
              className={`cursor-pointer ${contractDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              Nombre de contrats)
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='rounded p-1 hover:bg-neutral-100'>
            <Contrast className='text-neutral-500' />
          </div>
          <DownloadSelector />
        </div>
      </div>
      <div className='border p-4'>
        <ResponsiveContainer width='100%' height={600}>
          <BarChart
            width={500}
            height={300}
            data={trends}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='annee' />
            <Legend
              formatter={(value) => {
                const legendLabels: Record<string, string> = {
                  Montant: 'Montant total annuel (€)',
                  Nombre: 'Nombre de marchés',
                };
                return legendLabels[value] || value;
              }}
            />
            {!contractDisplayed && (
              <Bar dataKey='montant' fill='#413ea0' radius={[10, 10, 0, 0]}>
                <LabelList content={renderLabel} />
              </Bar>
            )}
            {contractDisplayed && (
              <Bar dataKey='nombre' fill='#ff7300' radius={[10, 10, 0, 0]}>
                <LabelList dataKey='nombre' position='top' />
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
