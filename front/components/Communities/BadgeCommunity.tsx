import { Award } from 'lucide-react';

type TName = {
  name: 'exemplaire' | '';
};
export default function BadgeCommunity({ name }: TName) {
  return (
    <div className='flex max-w-[250] justify-start gap-2 rounded-full bg-gray-300 px-4 py-2'>
      <Award size={20} />
      <span>Collectivité {name}</span>
    </div>
  );
}
