"use client"
import { useState, useEffect,PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Contrast, ArrowDownToLine } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from '@/components/ui/switch';


type formattedDataTrends = {
  Année: number;
  Montant: number;
  Nombre: number;
};

export default function Trends({data}:{data: any[]}) {

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


  return (
    <>
    <div className="flex items-center justify-between">
      <div className='flex items-baseline gap-2'>
        <h3 className="text-xl py-2">Évolution des marchés publics au cours du temps</h3>
        <div className='flex items-baseline gap-2'>
          <div 
            onClick={() => setContractDisplayed(false)}
            className={`cursor-pointer ${!contractDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >(Montants annuels
          </div>
          <Switch 
            checked={contractDisplayed} 
            onCheckedChange={() => setContractDisplayed(prev => !prev)}
          />
          <div 
            onClick={() => setContractDisplayed(true)}
            className={`cursor-pointer ${contractDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >Nombre de contrats)
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-1 hover:bg-neutral-100 rounded">
          <Contrast className="text-neutral-500"/>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="p-1 hover:bg-neutral-100 rounded">
              <ArrowDownToLine className="text-neutral-500"/>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Télécharger les données</DropdownMenuItem>
            <DropdownMenuItem>Télécharger le graphique</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div className='p-4 border'>
    <ResponsiveContainer width="100%" height={600}>
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Année" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => {
              const tooltipLabels: Record<string, string> = {
                Nombre: "Nombre de marchés",
              };
              return [value, tooltipLabels[name] || name];
            }}
          /> 
          <Legend 
            formatter={(value) => {
              const legendLabels: Record<string, string> = {
                Montant: "Montant total annuel (€)",
                Nombre: "Nombre de marchés",
              };
              return legendLabels[value] || value;
            }}
          />
          {!contractDisplayed && <Bar dataKey="Montant" fill="#413ea0" />}
          {contractDisplayed && <Bar dataKey="Nombre" fill="#ff7300" />}
        </BarChart>
      </ResponsiveContainer>
    </div>
    </>
  );
}
