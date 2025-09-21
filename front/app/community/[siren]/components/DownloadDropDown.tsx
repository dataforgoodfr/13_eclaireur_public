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
  disabled?: boolean;
  disableChartDownload?: boolean;
};

export default function DownloadDropDown({
  onClickDownloadData,
  onClickDownloadChart,
  disabled,
  disableChartDownload,
}: DownloadDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant='default'
          size='icon'
          className='h-12 w-12 rounded-bl-none rounded-br-lg rounded-tl-lg rounded-tr-none bg-primary hover:bg-primary/90'
        >
          <ArrowDownToLine className='h-5 w-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onClickDownloadData}>
          <ArrowDownToLine />
          Télécharger les données
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onClickDownloadChart} disabled={disableChartDownload}>
          <ArrowDownToLine />
          Télécharger le graphique
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
