import { Community } from '@/app/models/community';

type CommunitySuggestionDisplayProps = Pick<Community, 'nom' | 'code_postal'>;

export default function Suggestion({ nom, code_postal }: CommunitySuggestionDisplayProps) {
  return (
    <span>
      {nom}
      {code_postal && <> – {code_postal}</>}
    </span>
  );
}
