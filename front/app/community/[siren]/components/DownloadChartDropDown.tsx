import { Button } from '#components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import { Extension } from '#utils/downloader/types';
import { ArrowDownToLine } from 'lucide-react';

type DownloadChartDropDownProps = {
  onClickDownload: (extension: Extension) => void;
};

export default function DownloadChartDropDown({ onClickDownload }: DownloadChartDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='default'
          size='icon'
          className='h-12 w-12 rounded-bl-none rounded-br-lg rounded-tl-lg rounded-tr-none bg-primary hover:bg-primary/90'
        >
          <ArrowDownToLine className='h-5 w-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            onClickDownload('png');
          }}
        >
          <ArrowDownToLine />
          Télécharger au format PNG
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onClickDownload('svg');
          }}
        >
          <ArrowDownToLine />
          Télécharger au format SVG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
