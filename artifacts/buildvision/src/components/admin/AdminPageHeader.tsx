import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AdminPageHeader({ title, subtitle, onAdd, addLabel = "Nouveau" }: { title: string; subtitle?: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <header className="flex items-end justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 className="text-3xl font-serif font-bold text-zinc-900">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      {onAdd && <Button onClick={onAdd}><Plus className="w-4 h-4 mr-1" /> {addLabel}</Button>}
    </header>
  );
}
