import { Handshake, Euro } from "lucide-react"


export default function Stats({marketNumber, marketAmount}: {marketNumber: number, marketAmount: string}) {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-screen-lg mx-auto my-6">
      <div className="flex items-center border rounded-lg p-4 shadow">
         <div className="flex bg-purple-100 rounded-full w-12 h-12 items-center justify-center mr-4"><Handshake className="text-purple-500" /></div>
         <div className="flex flex-col">
            <span className="text-sm text-[#94A3B8]">Nombre de marchés publics : </span>
            {marketAmount ? (
             <span className="text-2xl font-semibold">{marketNumber}</span>
            ) : (
              <span className="text-2xl font-semibold">Données manquantes</span>
            )}         </div>
      </div>
      <div className="flex items-center border rounded-lg p-4 shadow">
         <div className="flex bg-orange-100 rounded-full w-12 h-12 items-center justify-center mr-4"><Euro className="text-orange-500" /></div>
         <div className="flex flex-col">
            <span className="text-sm text-[#94A3B8]">Montant total : </span>
            {marketAmount ? (
             <span className="text-2xl font-semibold">{marketAmount} €</span>
            ) : (
              <span className="text-2xl font-semibold">Données manquantes</span>
            )}
         </div>
      </div>
    </div>
  )
}
