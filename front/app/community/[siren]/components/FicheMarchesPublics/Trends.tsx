'use client';

import { PureComponent, useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { ArrowDownToLine, Contrast } from 'lucide-react';
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

type formattedDataTrends = {
  Année: number;
  Montant: number;
  Nombre: number;
};

export default function Trends({ data }: { data: any[] }) {
  const [contractDisplayed, setContractDisplayed] = useState(false);

  const trends: formattedDataTrends[] = Object.values(
    data.reduce<Record<string, formattedDataTrends>>((acc, item) => {
      const year = item.datenotification_annee;

      if (!acc[year]) {
        acc[year] = { Année: year, Montant: 0, Nombre: 0 };
      }
      acc[year].Montant += parseFloat(item.montant) || 0;
      acc[year].Nombre += 1;

      return acc;
    }, {}),
  );

  function formatNumberWithSpaces(number: number): string {
    return number.toLocaleString('fr-FR');
  }

  const renderLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 10} // Ajustez la position du label au-dessus de la barre
        fill='#4e4e4e'
        textAnchor='middle'
        dominantBaseline='middle'
        fontSize='16'
      >
        {formatNumberWithSpaces(value)} €
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className='rounded p-1 hover:bg-neutral-100'>
                <ArrowDownToLine className='text-neutral-500' />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Télécharger les données</DropdownMenuItem>
              <DropdownMenuItem>Télécharger le graphique</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <XAxis dataKey='Année' />
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
              <Bar dataKey='Montant' fill='#413ea0' radius={[10, 10, 0, 0]}>
                <LabelList content={renderLabel} />
              </Bar>
            )}
            {contractDisplayed && (
              <Bar dataKey='Nombre' fill='#ff7300' radius={[10, 10, 0, 0]}>
                <LabelList dataKey='Nombre' position='top' />
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
