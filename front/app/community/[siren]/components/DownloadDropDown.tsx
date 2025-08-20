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
        <Button 
          variant="default" 
          size="icon" 
          className='h-12 w-12 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none bg-primary hover:bg-primary/90'
        >
          <ArrowDownToLine className="h-5 w-5" />
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
