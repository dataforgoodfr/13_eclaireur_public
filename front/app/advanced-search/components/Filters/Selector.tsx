import { ReactNode, useEffect, useRef, useState } from 'react';

import { Label } from '#components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select';

const NONE_VALUE = 'Tout';
const PADDING_FOR_SELECTOR = 40;

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

  // Measure of max width - US0122
  const [maxWidth, setMaxWidth] = useState<number>(230);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      const children = Array.from(measureRef.current.children);
      const widths = children.map((child) => (child as HTMLElement).getBoundingClientRect().width);
      const max = Math.max(...widths, 0);
      setMaxWidth(Math.ceil(max) + PADDING_FOR_SELECTOR);
    }
  }, [options, placeholder, noneLabel, getOptionLabel]);

  return (
    <div className='flex-col'>
      <Label>{label}</Label>
      {/* Invisible div for measurement of max width - US0122 */}
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          height: 0,
          overflow: 'scroll',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {placeholder && <span>{placeholder}</span>}
        {noneLabel && <span>{noneLabel}</span>}
        <span>{NONE_VALUE}</span>
        {options.map((option) => (
          <span key={option?.toString() ?? 'none'}>{getOptionLabel(option)}</span>
        ))}
      </div>
      <Select value={value?.toString() ?? undefined} onValueChange={handleValueChange}>
        <SelectTrigger style={{ width: maxWidth }}>
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
