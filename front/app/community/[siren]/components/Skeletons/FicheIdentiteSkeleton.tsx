import { Card } from '#components/ui/card';
import { Skeleton } from '#components/ui/skeleton';

export function FicheIdentiteSkeleton() {
  return (
    <Card className="w-full p-6 bg-card rounded-2xl border border-border">
      {/* Header - Show static title, skeleton for badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="order-2 sm:order-1">
          <h2 className="text-3xl font-extrabold md:text-4xl text-primary">
            Informations générales
          </h2>
        </div>
        <div className="order-1 sm:order-2">
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
      
      <div className="mb-10 flex w-full flex-col gap-6 md:flex-row">
        {/* Info blocks - Show static labels, skeleton for values */}
        <div className="order-2 w-full md:order-1 md:w-1/3">
          <div className="flex flex-col gap-4 w-full">
            <InfoBlockSkeleton
              label="Population"
              unit="habitants"
              bgColor="bg-yellow-100"
            />
            <InfoBlockSkeleton
              label="Superficie"
              unit="hectares"
              bgColor="bg-lime-100"
            />
            <InfoBlockSkeleton
              label="Nombre d'agents administratifs"
              unit="agents"
              bgColor="bg-indigo-100"
            />
          </div>
        </div>
        
        {/* Map skeleton */}
        <div className="w-full md:w-2/3 h-64 rounded-lg md:h-auto order-1 md:order-2">
          <div className="w-full h-64 md:h-auto bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 p-6 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="text-gray-700 text-center">
                <div className="text-sm font-medium">Carte des collectivités voisines</div>
                <div className="text-xs text-gray-500 mt-1">Chargement...</div>
              </div>
              <div className="w-8 h-8 border-2 border-primary rounded-full flex items-center justify-center">
                <Skeleton className="w-4 h-4 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function InfoBlockSkeleton({ 
  label, 
  unit, 
  bgColor = 'bg-gray-100' 
}: { 
  label: string; 
  unit?: string; 
  bgColor?: string; 
}) {
  return (
    <div className={`rounded-none rounded-br-2xl rounded-tl-2xl p-3 text-primary ${bgColor}`}>
      <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:gap-1">
        {/* Static label - show immediately */}
        <p className="text-base font-medium">{label}</p>
        {/* Dynamic value - skeleton with exact styling match */}
        <h4 className='text-lg font-bold'>
          <Skeleton className="h-6 w-16 inline-block" />
          {unit && <span className='hidden sm:inline ml-1 text-base font-normal'>{unit}</span>}
        </h4>
      </div>
    </div>
  );
}
