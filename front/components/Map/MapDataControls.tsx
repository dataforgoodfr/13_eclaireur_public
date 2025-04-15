'use client';

import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { choroplethDataSource } from './MapLayout';

export type MapDataControlsProps = {
  selectedDataSource: string;
  setSelectedDataSource: (value: string) => void;
};

export default function MapDataControls({
  selectedDataSource,
  setSelectedDataSource,
}: MapDataControlsProps) {
  console.log(selectedDataSource);
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
          {Object.values(choroplethDataSource).map((source) => (
            <div key={source.dataName} className='flex items-center space-x-2'>
              <RadioGroupItem value={source.dataName} id={source.dataName} />
              <Label htmlFor={source.dataName} className='text-sm'>
                {source.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
