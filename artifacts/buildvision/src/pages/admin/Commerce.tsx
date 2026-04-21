import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListCommerceItems, useCreateCommerceItem, useUpdateCommerceItem, useDeleteCommerceItem, getListCommerceItemsQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Pencil, Trash2 } from "lucide-react";

const blank = { name: "", description: "", image: "", price: "", category: "", available: true };

export default function AdminCommerce() {
  const qc = useQueryClient();
  const { data: items } = useListCommerceItems();
  const create = useCreateCommerceItem();
  const update = useUpdateCommerceItem();
  const del = useDeleteCommerceItem();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: getListCommerceItemsQueryKey() });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...editing };
    delete payload.id;
    if (editing.id) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
    else create.mutate({ data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
  };

  return (
    <div>
      <AdminPageHeader title="Commerce" subtitle="Catalogue de matériaux et équipements." onAdd={() => { setEditing({ ...blank }); setOpen(true); }} addLabel="Nouveau produit" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((it) => (
          <Card key={it.id} className="overflow-hidden">
            <div className="aspect-square bg-zinc-100"><img src={it.image} alt={it.name} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">{it.category}</div>
              <h3 className="font-serif font-bold mb-1">{it.name}</h3>
              <div className="text-sm text-zinc-700 mb-3">{it.price}</div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => { setEditing(it); setOpen(true); }}><Pencil className="w-3 h-3" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-rose-600"><Trash2 className="w-3 h-3" /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: it.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.id ? "Modifier le produit" : "Nouveau produit"}</SheetTitle></SheetHeader>
          {editing && (
            <form onSubmit={onSave} className="space-y-4 mt-6">
              <div className="space-y-2"><Label>Nom</Label><Input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea required rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="space-y-2"><Label>Image (URL)</Label><Input required value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Prix</Label><Input required value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></div>
                <div className="space-y-2"><Label>Catégorie</Label><Input required value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
              </div>
              <div className="flex items-center gap-3"><Switch checked={editing.available} onCheckedChange={(v) => setEditing({ ...editing, available: v })} /><Label>Disponible</Label></div>
              <div className="pt-4 flex gap-2"><Button type="submit" className="flex-1">Enregistrer</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button></div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
