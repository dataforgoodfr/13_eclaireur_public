/* eslint-disable max-classes-per-file */
import React, { PureComponent } from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';

const data = [
  {name: 'Axis',size: 0 },
  // {name: 'Controls',size: 3546 },
  // {name: 'Data',size: 20544 }
];

const COLORS = [];

interface CustomizedContentProps {
  root: any;
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  colors: string[];
  name: string;
  size: string;
}

class CustomizedContent extends PureComponent<CustomizedContentProps> {
  render() {
    const { root, depth, x, y, width, height, index, colors, name, size } = this.props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : '#ffffff00',
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />   
        {depth === 1 ? (
          <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fontWeight={100}>
            {name }
          </text>
        ) : null}
        {depth === 1 ? (
          <text x={x + 4} y={y + 36} fill="#f4f4f4" fontSize={14} fontWeight={100}>
            {size } €
          </text>
        ) : null}
      </g>
    );
  }
}

export default function MarketByActivities({data} : {data: any[]}) {
  return (
    <div className='max-w-screen-lg mx-auto p-4 border rounded-lg shadow my-6'>
      <h2 className='text-lg font-medium text-neutral-600 pb-3'>Répartition des montants par activités</h2>
      {data.length === 0 ? (
        <div className='flex justify-center items-center w-full h-[400px] space-x-2'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-600'></div>
          <span>Chargement...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            width={400}
            height={200}
            data={data}
            dataKey="size"
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent colors={COLORS} />}
          />
        </ResponsiveContainer>
        )
      }
    </div>
  );
}
