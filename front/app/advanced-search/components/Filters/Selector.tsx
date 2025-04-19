import { ReactNode } from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NONE_VALUE = 'Tout';

type SelectorProps<Option> = {
  label: string;
  placeholder?: string;
  noneLabel?: string;
  options: Option[];
  value: Option | null;
  onChange: (option: Option | null) => void;
  getOptionLabel?: (option: Option | null) => ReactNode;
};

/**
 * Selector for string or number
 */
export function Selector<Option extends string | number | null>({
  label,
  placeholder,
  noneLabel,
  options,
  value,
  onChange,
  getOptionLabel: getOptionLabelProp,
}: SelectorProps<Option>) {
  function handleValueChange(option: string) {
    if (option === NONE_VALUE) {
      onChange(null);

      return;
    }

    if (typeof options[0] === 'string') {
      onChange(option as Option);

      return;
    }

    onChange(Number(option) as Option);
  }

  function getOptionLabelDefault(option: Option | null) {
    return option;
  }

  const getOptionLabel = getOptionLabelProp ?? getOptionLabelDefault;

  return (
    <div className='flex-col'>
      <Label>{label}</Label>
      <Select value={value?.toString() ?? undefined} onValueChange={handleValueChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{noneLabel}</SelectLabel>
            <SelectItem value={NONE_VALUE} className='font-bold'>
              {NONE_VALUE}
            </SelectItem>
            {options.map((option) => (
              <SelectItem key={option} value={option?.toString() ?? NONE_VALUE}>
                {getOptionLabel(option)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
