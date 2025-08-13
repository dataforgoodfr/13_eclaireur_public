import { Button } from '#components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import { ArrowDownToLine } from 'lucide-react';

type DownloadDropDownProps = {
  onClickDownloadData?: () => void;
  onClickDownloadChart?: () => void;
};

export default function DownloadDropDown({ onClickDownloadData, onClickDownloadChart }: DownloadDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="icon" className='rounded-tl-br'>
          <ArrowDownToLine />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onClickDownloadData}>
          <ArrowDownToLine />
          Télécharger les données
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onClickDownloadChart}>
          <ArrowDownToLine />
          Télécharger le graphique
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
