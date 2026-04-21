import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListTestimonials, useCreateTestimonial, useDeleteTestimonial, getListTestimonialsQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Trash2, Star } from "lucide-react";

export default function AdminTestimonials() {
  const qc = useQueryClient();
  const { data: testimonials } = useListTestimonials();
  const create = useCreateTestimonial();
  const del = useDeleteTestimonial();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", company: "", quote: "", rating: 5, photo: "" });
  const refresh = () => qc.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({ data: { ...form, rating: Number(form.rating), photo: form.photo || null } }, { onSuccess: () => { refresh(); setOpen(false); setForm({ name: "", role: "", company: "", quote: "", rating: 5, photo: "" }); } });
  };

  return (
    <div>
      <AdminPageHeader title="Témoignages" subtitle="Avis clients affichés sur le site." onAdd={() => setOpen(true)} addLabel="Nouveau témoignage" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials?.map((t) => (
          <Card key={t.id} className="p-6 relative group">
            <div className="flex gap-0.5 mb-3">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}</div>
            <p className="italic text-zinc-700 mb-4 line-clamp-4">« {t.quote} »</p>
            <div className="text-sm font-bold">{t.name}</div>
            <div className="text-xs text-zinc-500">{t.role} · {t.company}</div>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Supprimer ce témoignage ?</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: t.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        ))}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle>Nouveau témoignage</SheetTitle></SheetHeader>
          <form onSubmit={onSave} className="space-y-4 mt-6">
            <div className="space-y-2"><Label>Nom</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Rôle</Label><Input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
            <div className="space-y-2"><Label>Société</Label><Input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div className="space-y-2"><Label>Citation</Label><Textarea required rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></div>
            <div className="space-y-2"><Label>Note (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Photo (URL)</Label><Input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} /></div>
            <div className="pt-4 flex gap-2"><Button type="submit" className="flex-1">Enregistrer</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button></div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
