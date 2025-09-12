import { ReactNode } from 'react';

import { Switch } from '#components/ui/switch';

type GraphSwitchProps = {
  label1: ReactNode;
  label2: ReactNode;
  isActive: boolean;
  onChange: (value: boolean) => void;
};

function getCursorClassName(isActive: boolean) {
  return `cursor-pointer ${isActive ? 'text-muted' : 'text-primary'} text-xs font-semibold sm:text-sm whitespace-nowrap`;
}

export function GraphSwitch({ label1, label2, isActive, onChange }: GraphSwitchProps) {
  return (
    <div className='flex items-center gap-1'>
      <div
        onClick={() => {
          onChange(false);
        }}
        className={getCursorClassName(isActive)}
      >
        ({label1}
      </div>
      <Switch
        checked={isActive}
        onCheckedChange={() => {
          onChange(!isActive);
        }}
        className='data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary'
      />
      <div
        onClick={() => {
          onChange(true);
        }}
        className={getCursorClassName(!isActive)}
      >
        {label2})
      </div>
    </div>
  );
}
