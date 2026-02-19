"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import  Link  from "next/link"
import { Link as LinkIcon} from "lucide-react"
import { Clinic } from "@/lib/types";
interface ClinicTabsHeaderProps {
  k_value: Clinic;
  clinic_list: string[]
  selected?: string
  onSelect?: (clinic: string) => void
}

export default function ClinicTabsHeader({k_value, clinic_list, selected, onSelect} : ClinicTabsHeaderProps) {
  let sections: {id: string,label: string}[] = []
  clinic_list.map((clinic: string) => {
    sections.push({ id: clinic, label: clinic })
  })
  
  return (
    <Tabs
      defaultValue="roles"
      className="w-full sticky top-0 bg-(--primary-bg-color) z-10 border-b border-[#C4C4C4] md:border-0 md:border-b-[1px] md:border-[var(--alto)]"
    >
      <TabsList className="bg-(--primary-bg-color) flex flex-nowrap gap-2 overflow-x-auto">
        {sections.map((s) => (
          <div key={s.id} className=" bg-(--primary-bg-color) flex flex-colmin-w-max">
            <TabsTrigger
              value={s.id}
              onClick={() => {
                document.getElementById(s.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                onSelect?.(s.id)
              }}
              className="bg-(--primary-bg-color) text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {s.label}
            </TabsTrigger>
            <Link href={`/clinics/${k_value.City}/clinic/${s.id}`} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            <LinkIcon className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </TabsList>
    </Tabs>
  );
}
