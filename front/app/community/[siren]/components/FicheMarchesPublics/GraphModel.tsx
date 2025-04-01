import { Contrast, EllipsisVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function GraphModel({title, children}: {title: string, children: React.ReactNode}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-xl py-2">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="p-1 hover:bg-neutral-100 rounded">
            <Contrast className="text-neutral-500"/>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="p-1 hover:bg-neutral-100 rounded">
                <EllipsisVertical className="text-neutral-500"/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Télécharger les données</DropdownMenuItem>
              <DropdownMenuItem>Télécharger le graphique</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
      {children}
    </>
  )
}
