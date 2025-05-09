'use client';

import { Suspense } from 'react';

import { useRouter } from 'next/navigation';

import { Community } from '@/app/models/community';
import { Filters } from '@/components/Filters/Filters';
import SearchBar from '@/components/SearchBar/SearchBar';
import Loading from '@/components/ui/Loading';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogTitle } from '@radix-ui/react-dialog';
import { ListFilterPlus } from 'lucide-react';

type FicheComparisonInput = { community: Community };

const searchLabel = 'Comparer avec une autre collectivité ?';

export function FicheComparisonInput({ community }: FicheComparisonInput) {
  const router = useRouter();

  function goToComparison(comparedSiren: string) {
    router.push(`/community/${community.siren}/comparison/${comparedSiren}`);
  }

  return (
    <div className='flex flex-1 flex-col items-center gap-2'>
      <div className='justify-content flex items-center gap-2'>
        <p>{searchLabel}</p>

        <Dialog>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <DialogTrigger asChild>
                <TooltipTrigger asChild>
                  <Button className='w-fit' variant='outline' size='sm'>
                    <ListFilterPlus />
                  </Button>
                </TooltipTrigger>
              </DialogTrigger>
              <TooltipContent>
                <p>Ouvrir la recherche avancée de collectivité à comparer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className='max-w-fit'>
            <DialogTitle>Recherche avancée de collectivité à comparer</DialogTitle>
            <Filters></Filters>
            <Suspense fallback={<Loading />}>{/* <CommunitiesTableWithLoader /> */}</Suspense>
          </DialogContent>
        </Dialog>
      </div>
      <SearchBar onSelect={(option) => goToComparison(option.siren)} />
    </div>
  );
}
