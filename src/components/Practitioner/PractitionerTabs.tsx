"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function PractitionerTabs() {
    const sections = [
        { id: "roles", label: "Roles" },
        { id: "qualifications", label: "Qualifications" },
        { id: "experience", label: "Experience" },
        { id: "news", label: "News" },
        { id: "awards", label: "Awards" },
        { id: "hours", label: "Hours" },
        { id: "insurance", label: "Insurance" },
        { id: "payments", label: "Payments" },
        { id: "fees", label: "Estimated Fees" },
      ];
    return (
        <Tabs defaultValue="roles" className="w-full sticky top-0 bg-white z-20 pb-4 mb-6 border-b">
  <TabsList className="flex flex-wrap gap-2">
    {sections.map((s) => (
      <TabsTrigger
        key={s.id}
        value={s.id}
        onClick={() => {
          document.getElementById(s.id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
        className="capitalize"
      >
        {s.label}
      </TabsTrigger>
    ))}
  </TabsList>
</Tabs>
    )
    }