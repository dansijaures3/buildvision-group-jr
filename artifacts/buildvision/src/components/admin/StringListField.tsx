import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

export function StringListField({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input value={v} placeholder={placeholder} onChange={(e) => { const n = [...values]; n[i] = e.target.value; onChange(n); }} />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(values.filter((_, idx) => idx !== i))}><X className="w-4 h-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ""])}><Plus className="w-3 h-3 mr-1" /> Ajouter</Button>
    </div>
  );
}
