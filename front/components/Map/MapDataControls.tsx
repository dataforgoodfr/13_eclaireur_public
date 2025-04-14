'use client';

import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type MapDataControlsProps = {
  onDataSourceChange: (dataSource: string, dataType: 'categorical' | 'numerical') => void;
};

export default function MapDataControls({ onDataSourceChange }: MapDataControlsProps) {
  const [selectedDataSource, setSelectedDataSource] = useState('subventions_score');

  return (
    <Card className='w-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm font-medium'>Data Source</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedDataSource}
          onValueChange={setSelectedDataSource}
          className='space-y-2'
        >
          {dataSources.map((source) => (
            <div key={source.id} className='flex items-center space-x-2'>
              <RadioGroupItem value={source.id} id={source.id} />
              <Label htmlFor={source.id} className='text-sm'>
                {source.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
