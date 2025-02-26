import { CommunityType } from '@/utils/types';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type SelectCommunityTypeProps = {
  onChange: (value: CommunityType) => void;
};

export default function SelectCommunityType({ onChange }: SelectCommunityTypeProps) {
  const types = Object.keys(CommunityType) as CommunityType[];

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select a fruit' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type de communaute</SelectLabel>
          {types.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
