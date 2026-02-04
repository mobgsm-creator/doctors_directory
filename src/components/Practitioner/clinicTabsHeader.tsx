"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import  Link  from "next/link"
import { Link as LinkIcon} from "lucide-react"
interface ClinicTabsHeaderProps {
  clinic_list: string[]
  selected?: string
  onSelect?: (clinic: string) => void
}

export default function ClinicTabsHeader({clinic_list, selected, onSelect} : ClinicTabsHeaderProps) {
  let sections: {id: string,label: string}[] = []
  clinic_list.map((clinic: string) => {
    sections.push({ id: clinic, label: clinic })
  })
  
  return (
    <Tabs
      defaultValue="roles"
      className="w-full sticky top-0 bg-white z-20 pb-4 mb-6 border-b overflow-x-auto flex items-center"
    >
      <TabsList className="flex flex-nowrap gap-2 overflow-x-auto">
        {sections.map((s) => (
          <div key={s.id} className="flex flex-colmin-w-max">
            <TabsTrigger
              value={s.id}
              onClick={() => {
                document.getElementById(s.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                onSelect?.(s.id)
              }}
              className="capitalize data-[state=active]:font-bold data-[state=active]:shadow-none"
            >
              {s.label}
            </TabsTrigger>
            <Link href={`/clinics/${s.id}`} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            <LinkIcon className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </TabsList>
    </Tabs>
  );
}
