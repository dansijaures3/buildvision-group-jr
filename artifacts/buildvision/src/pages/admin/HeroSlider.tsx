import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListHeroSlides, useCreateHeroSlide, useUpdateHeroSlide, useDeleteHeroSlide, getListHeroSlidesQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Pencil, Trash2 } from "lucide-react";

const blank = { image: "", title: "", subtitle: "", button1Text: "", button1Link: "", button2Text: "", button2Link: "", displayOrder: 0, isActive: true };

export default function AdminHeroSlider() {
  const qc = useQueryClient();
  const { data: slides } = useListHeroSlides();
  const create = useCreateHeroSlide();
  const update = useUpdateHeroSlide();
  const del = useDeleteHeroSlide();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: getListHeroSlidesQueryKey() });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...editing, displayOrder: Number(editing.displayOrder) || 0 };
    delete payload.id;
    if (editing.id) {
      update.mutate({ id: editing.id, data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
    } else {
      create.mutate({ data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
    }
  };

  return (
    <div>
      <AdminPageHeader title="Hero Slider" subtitle="Diapositives affichées sur la page d'accueil." onAdd={() => { setEditing({ ...blank }); setOpen(true); }} addLabel="Nouvelle diapositive" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides?.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <div className="aspect-[16/7] bg-zinc-100 overflow-hidden"><img src={s.image} alt={s.title} className="w-full h-full object-cover" /></div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">Ordre {s.displayOrder}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Actif</span>
                  <Switch checked={s.isActive} onCheckedChange={(v) => update.mutate({ id: s.id, data: { ...s, isActive: v } as any }, { onSuccess: refresh })} />
                </div>
              </div>
              <h3 className="font-serif font-bold text-lg mb-1 line-clamp-1">{s.title}</h3>
              <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{s.subtitle}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="w-3 h-3 mr-1" /> Modifier</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-rose-600"><Trash2 className="w-3 h-3 mr-1" /> Supprimer</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Supprimer cette diapositive ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: s.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
        {!slides?.length && <Card className="p-12 text-center md:col-span-2 text-zinc-500">Aucune diapositive. Cliquez sur « Nouvelle diapositive » pour commencer.</Card>}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.id ? "Modifier la diapositive" : "Nouvelle diapositive"}</SheetTitle></SheetHeader>
          {editing && (
            <form onSubmit={onSave} className="space-y-4 mt-6">
              <div className="space-y-2"><Label>Image (URL)</Label><Input required value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></div>
              <div className="space-y-2"><Label>Titre</Label><Input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Sous-titre</Label><Input required value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Bouton 1 — texte</Label><Input value={editing.button1Text || ""} onChange={(e) => setEditing({ ...editing, button1Text: e.target.value })} /></div>
                <div className="space-y-2"><Label>Bouton 1 — lien</Label><Input value={editing.button1Link || ""} onChange={(e) => setEditing({ ...editing, button1Link: e.target.value })} /></div>
                <div className="space-y-2"><Label>Bouton 2 — texte</Label><Input value={editing.button2Text || ""} onChange={(e) => setEditing({ ...editing, button2Text: e.target.value })} /></div>
                <div className="space-y-2"><Label>Bouton 2 — lien</Label><Input value={editing.button2Link || ""} onChange={(e) => setEditing({ ...editing, button2Link: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Ordre d'affichage</Label><Input type="number" value={editing.displayOrder} onChange={(e) => setEditing({ ...editing, displayOrder: Number(e.target.value) })} /></div>
                <div className="space-y-2 flex flex-col"><Label>Active</Label><Switch checked={editing.isActive} onCheckedChange={(v) => setEditing({ ...editing, isActive: v })} /></div>
              </div>
              <div className="pt-4 flex gap-2"><Button type="submit" className="flex-1">Enregistrer</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button></div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
