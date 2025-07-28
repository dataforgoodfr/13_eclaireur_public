import { CommunityType } from '#utils/types';

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
  const types = Object.values(CommunityType);

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className='w-[230px]'>
        <SelectValue placeholder='Choisi un type de collectivite' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type de collectivite</SelectLabel>
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
