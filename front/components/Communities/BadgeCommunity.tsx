import { Award } from 'lucide-react';

const EXEMPLAIRE_LABEL = 'exemplaire';
type BadgeCommunityProps = {
  name: typeof EXEMPLAIRE_LABEL | '';
};
let isExemplaire = true;

export default function BadgeCommunity({ name }: BadgeCommunityProps) {
  return (
    <div className='flex max-w-[250] justify-start gap-2 rounded-full bg-gray-300 px-4 py-2'>
      <Award size={20} />
      <span>Collectivité {isExemplaire ? EXEMPLAIRE_LABEL : ''}</span>
    </div>
  );
}
