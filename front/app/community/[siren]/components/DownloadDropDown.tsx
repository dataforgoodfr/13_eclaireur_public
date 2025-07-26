import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import { ArrowDownToLine } from 'lucide-react';

type DownloadDropDownProps = {
  onClickDownloadData?: () => void;
};

export default function DownloadDropDown({ onClickDownloadData }: DownloadDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='rounded p-1 hover:bg-neutral-100'>
          <ArrowDownToLine className='text-neutral-500' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onClickDownloadData}>Télécharger les données</DropdownMenuItem>
        <DropdownMenuItem>Télécharger le graphique</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
