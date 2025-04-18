import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NONE_VALUE = '-';

type SelectorProps<Option> = {
  label: string;
  placeholder?: string;
  options: Option[];
  value: Option | null;
  onChange: (option: Option | null) => void;
};

/**
 * Selector for string or number
 */
export function Selector<Option extends string | number | null>({
  label,
  placeholder,
  options,
  value,
  onChange,
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

  return (
    <div className='flex-col'>
      <Label>{label}</Label>
      <Select value={value?.toString() ?? ''} onValueChange={handleValueChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={NONE_VALUE}>-</SelectItem>
            {options.map((option) => (
              <SelectItem key={option} value={option?.toString() ?? NONE_VALUE}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
