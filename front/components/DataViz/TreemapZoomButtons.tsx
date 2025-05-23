import { ZoomIn, ZoomOut } from 'lucide-react';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type TreemapZoomButtonsProps = { isZoomActive: boolean; handleClick: Function };


export default function TreemapZoomButtons({ isZoomActive, handleClick}: TreemapZoomButtonsProps) {
  return (
 <div className='absolute bottom-2 left-3 space-x-2'>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => handleClick("")} disabled={!isZoomActive} variant='outline'>
                <ZoomOut />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isZoomActive && <p>Revenir à l'affichage initial</p>}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline'>
                <ZoomIn />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cliquer sur un bloc pour zoomer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
  );
}
