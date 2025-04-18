import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Trophy } from 'lucide-react';


export default function TooltipScore() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className='-ml-2 mt-1 h-4 w-4' />
        </TooltipTrigger>
        <TooltipContent side='bottom' sideOffset={10}>
          <div className='p-2'>
            <h4>Explication du score de transparence agrégé :</h4>
            <ul className='ml-4 mt-2 list-disc'>
              <li>Les données sont bien formattées</li>
              <li>Les données sont complètes</li>
              <li>Les données sont à jour</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
