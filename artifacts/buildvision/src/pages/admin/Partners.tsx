import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListPartners, useCreatePartner, useDeletePartner, getListPartnersQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Trash2 } from "lucide-react";

export default function AdminPartners() {
  const qc = useQueryClient();
  const { data: partners } = useListPartners();
  const create = useCreatePartner();
  const del = useDeletePartner();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", logo: "", website: "" });
  const refresh = () => qc.invalidateQueries({ queryKey: getListPartnersQueryKey() });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({ data: { ...form, website: form.website || null } }, { onSuccess: () => { refresh(); setOpen(false); setForm({ name: "", logo: "", website: "" }); } });
  };

  return (
    <div>
      <AdminPageHeader title="Partenaires" subtitle="Logos et liens partenaires." onAdd={() => setOpen(true)} addLabel="Nouveau partenaire" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {partners?.map((p) => (
          <Card key={p.id} className="p-6 flex flex-col items-center gap-3 relative group">
            <img src={p.logo} alt={p.name} className="h-16 max-w-full object-contain" />
            <div className="text-xs text-center text-zinc-700 font-medium">{p.name}</div>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Supprimer ce partenaire ?</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: p.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        ))}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle>Nouveau partenaire</SheetTitle></SheetHeader>
          <form onSubmit={onSave} className="space-y-4 mt-6">
            <div className="space-y-2"><Label>Nom</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Logo (URL)</Label><Input required value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} /></div>
            <div className="space-y-2"><Label>Site web</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
            <div className="pt-4 flex gap-2"><Button type="submit" className="flex-1">Enregistrer</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button></div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
