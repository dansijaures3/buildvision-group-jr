import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListServices, useCreateService, useUpdateService, useDeleteService, getListServicesQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StringListField } from "@/components/admin/StringListField";
import { Pencil, Trash2 } from "lucide-react";

const blank = { slug: "", title: "", category: "architecture", shortDescription: "", fullDescription: "", icon: "building", image: "", features: [] as string[], displayOrder: 0 };

export default function AdminServices() {
  const qc = useQueryClient();
  const { data: services } = useListServices();
  const create = useCreateService();
  const update = useUpdateService();
  const del = useDeleteService();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: getListServicesQueryKey() });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...editing, features: (editing.features || []).filter(Boolean), displayOrder: Number(editing.displayOrder) || 0 };
    delete payload.id;
    if (editing.id) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
    else create.mutate({ data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
  };

  return (
    <div>
      <AdminPageHeader title="Services" subtitle="Les pôles de prestations du groupe." onAdd={() => { setEditing({ ...blank }); setOpen(true); }} addLabel="Nouveau service" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services?.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <div className="aspect-[16/7] bg-zinc-100"><img src={s.image} alt={s.title} className="w-full h-full object-cover" /></div>
            <div className="p-5">
              <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">{s.category}</div>
              <h3 className="font-serif font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{s.shortDescription}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing({ ...s, features: s.features || [] }); setOpen(true); }}><Pencil className="w-3 h-3 mr-1" /> Modifier</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-rose-600"><Trash2 className="w-3 h-3 mr-1" /> Supprimer</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: s.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.id ? "Modifier le service" : "Nouveau service"}</SheetTitle></SheetHeader>
          {editing && (
            <form onSubmit={onSave} className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Slug</Label><Input required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
                <div className="space-y-2"><Label>Catégorie</Label><Input required value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Titre</Label><Input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description courte</Label><Textarea required rows={2} value={editing.shortDescription} onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description complète</Label><Textarea required rows={5} value={editing.fullDescription} onChange={(e) => setEditing({ ...editing, fullDescription: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Icône</Label><Input required value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></div>
                <div className="space-y-2"><Label>Ordre</Label><Input type="number" value={editing.displayOrder} onChange={(e) => setEditing({ ...editing, displayOrder: Number(e.target.value) })} /></div>
              </div>
              <div className="space-y-2"><Label>Image (URL)</Label><Input required value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></div>
              <StringListField label="Caractéristiques" values={editing.features || []} onChange={(v) => setEditing({ ...editing, features: v })} placeholder="Caractéristique" />
              <div className="pt-4 flex gap-2"><Button type="submit" className="flex-1">Enregistrer</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button></div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
