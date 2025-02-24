'use client';

import * as React from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const items = [
  { value: 'auvergne-rhone-alpes', label: 'Auvergne-Rhône-Alpes' },
  { value: 'bourgogne-franche-comte', label: 'Bourgogne-Franche-Comté' },
  { value: 'bretagne', label: 'Bretagne' },
  { value: 'centre-val-de-loire', label: 'Centre-Val de Loire' },
  { value: 'corse', label: 'Corse' },
  { value: 'grand-est', label: 'Grand Est' },
  { value: 'hauts-de-france', label: 'Hauts-de-France' },
  { value: 'ile-de-france', label: 'Île-de-France' },
  { value: 'normandie', label: 'Normandie' },
  { value: 'nouvelle-aquitaine', label: 'Nouvelle-Aquitaine' },
  { value: 'occitanie', label: 'Occitanie' },
  { value: 'pays-de-la-loire', label: 'Pays de la Loire' },
  { value: 'provence-alpes-cote-dazur', label: "Provence-Alpes-Côte d'Azur" },
  { value: 'guadeloupe', label: 'Guadeloupe' },
  { value: 'martinique', label: 'Martinique' },
  { value: 'guyane', label: 'Guyane' },
  { value: 'la-reunion', label: 'La Réunion' },
  { value: 'mayotte', label: 'Mayotte' },
  { value: 'ain', label: 'Ain' },
  { value: 'aisne', label: 'Aisne' },
  { value: 'allier', label: 'Allier' },
  { value: 'alpes-de-haute-provence', label: 'Alpes-de-Haute-Provence' },
  { value: 'hautes-alpes', label: 'Hautes-Alpes' },
  { value: 'alpes-maritimes', label: 'Alpes-Maritimes' },
  { value: 'ardeche', label: 'Ardèche' },
  { value: 'ardennes', label: 'Ardennes' },
  { value: 'ariege', label: 'Ariège' },
  { value: 'aube', label: 'Aube' },
  { value: 'aude', label: 'Aude' },
  { value: 'aveyron', label: 'Aveyron' },
  { value: 'bouches-du-rhone', label: 'Bouches-du-Rhône' },
  { value: 'calvados', label: 'Calvados' },
  { value: 'cantal', label: 'Cantal' },
  { value: 'charente', label: 'Charente' },
  { value: 'charente-maritime', label: 'Charente-Maritime' },
  { value: 'cher', label: 'Cher' },
  { value: 'correze', label: 'Corrèze' },
  { value: 'cote-dor', label: "Côte-d'Or" },
  { value: 'cotes-darmor', label: "Côtes-d'Armor" },
  { value: 'creuse', label: 'Creuse' },
  { value: 'dordogne', label: 'Dordogne' },
  { value: 'doubs', label: 'Doubs' },
  { value: 'drome', label: 'Drôme' },
  { value: 'eure', label: 'Eure' },
  { value: 'eure-et-loir', label: 'Eure-et-Loir' },
  { value: 'finistere', label: 'Finistère' },
  { value: 'gard', label: 'Gard' },
  { value: 'haute-garonne', label: 'Haute-Garonne' },
  { value: 'gers', label: 'Gers' },
  { value: 'gironde', label: 'Gironde' },
  { value: 'herault', label: 'Hérault' },
  { value: 'ille-et-vilaine', label: 'Ille-et-Vilaine' },
  { value: 'indre', label: 'Indre' },
  { value: 'indre-et-loire', label: 'Indre-et-Loire' },
  { value: 'isere', label: 'Isère' },
  { value: 'jura', label: 'Jura' },
  { value: 'landes', label: 'Landes' },
  { value: 'loir-et-cher', label: 'Loir-et-Cher' },
  { value: 'loire', label: 'Loire' },
  { value: 'haute-loire', label: 'Haute-Loire' },
  { value: 'loire-atlantique', label: 'Loire-Atlantique' },
  { value: 'loiret', label: 'Loiret' },
  { value: 'lot', label: 'Lot' },
  { value: 'lot-et-garonne', label: 'Lot-et-Garonne' },
  { value: 'lozere', label: 'Lozère' },
  { value: 'maine-et-loire', label: 'Maine-et-Loire' },
  { value: 'manche', label: 'Manche' },
  { value: 'marne', label: 'Marne' },
  { value: 'haute-marne', label: 'Haute-Marne' },
  { value: 'mayenne', label: 'Mayenne' },
  { value: 'meurthe-et-moselle', label: 'Meurthe-et-Moselle' },
  { value: 'meuse', label: 'Meuse' },
  { value: 'morbihan', label: 'Morbihan' },
  { value: 'moselle', label: 'Moselle' },
  { value: 'nievre', label: 'Nièvre' },
  { value: 'nord', label: 'Nord' },
  { value: 'oise', label: 'Oise' },
  { value: 'orne', label: 'Orne' },
  { value: 'pas-de-calais', label: 'Pas-de-Calais' },
  { value: 'puy-de-dome', label: 'Puy-de-Dôme' },
  { value: 'pyrenees-atlantiques', label: 'Pyrénées-Atlantiques' },
  { value: 'hautes-pyrenees', label: 'Hautes-Pyrénées' },
  { value: 'pyrenees-orientales', label: 'Pyrénées-Orientales' },
  { value: 'bas-rhin', label: 'Bas-Rhin' },
  { value: 'haut-rhin', label: 'Haut-Rhin' },
  { value: 'rhone', label: 'Rhône' },
  { value: 'haute-saone', label: 'Haute-Saône' },
  { value: 'saone-et-loire', label: 'Saône-et-Loire' },
  { value: 'sarthe', label: 'Sarthe' },
  { value: 'savoie', label: 'Savoie' },
  { value: 'haute-savoie', label: 'Haute-Savoie' },
  { value: 'paris', label: 'Paris' },
  { value: 'seine-maritime', label: 'Seine-Maritime' },
  { value: 'seine-et-marne', label: 'Seine-et-Marne' },
  { value: 'yvelines', label: 'Yvelines' },
  { value: 'deux-sevres', label: 'Deux-Sèvres' },
  { value: 'somme', label: 'Somme' },
  { value: 'tarn', label: 'Tarn' },
  { value: 'tarn-et-garonne', label: 'Tarn-et-Garonne' },
  { value: 'var', label: 'Var' },
  { value: 'vaucluse', label: 'Vaucluse' },
  { value: 'vendee', label: 'Vendée' },
  { value: 'vienne', label: 'Vienne' },
  { value: 'haute-vienne', label: 'Haute-Vienne' },
  { value: 'vosges', label: 'Vosges' },
  { value: 'yonne', label: 'Yonne' },
  { value: 'territoire-de-belfort', label: 'Territoire de Belfort' },
  { value: 'essonne', label: 'Essonne' },
  { value: 'hauts-de-seine', label: 'Hauts-de-Seine' },
  { value: 'seine-saint-denis', label: 'Seine-Saint-Denis' },
  { value: 'val-de-marne', label: 'Val-de-Marne' },
  { value: 'val-doise', label: "Val-d'Oise" },
];

export function SearchBar() {
  const [query, setQuery] = React.useState('');

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className='relative w-4/5'>
      <div className='relative'>
        <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
        <Input
          className='pl-8 pr-4'
          placeholder='Entrez une collectivité territoriale'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {query.length > 0 && filteredItems.length !== 1 && (
        <div className='absolute mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md'>
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      setQuery(item.label);
                      // Perform action here, e.g. navigation
                      console.log(`Selected: ${item.label}`);
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
