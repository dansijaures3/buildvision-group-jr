import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Pencil, Trash2 } from "lucide-react";

const blank = { title: "", description: "", image: "", location: "", eventDate: "", attendees: 0, category: "" };

export default function AdminEvents() {
  const qc = useQueryClient();
  const { data: events } = useListEvents();
  const create = useCreateEvent();
  const update = useUpdateEvent();
  const del = useDeleteEvent();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: getListEventsQueryKey() });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...editing, attendees: Number(editing.attendees) || 0, category: editing.category || null };
    delete payload.id;
    if (editing.id) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
    else create.mutate({ data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
  };

  return (
    <div>
      <AdminPageHeader title="Événements" subtitle="Productions JR Service." onAdd={() => { setEditing({ ...blank }); setOpen(true); }} addLabel="Nouvel événement" />
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b"><tr className="text-left text-xs uppercase tracking-widest text-zinc-500"><th className="px-4 py-3 w-16"></th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Titre</th><th className="px-4 py-3">Lieu</th><th className="px-4 py-3">Invités</th><th className="px-4 py-3"></th></tr></thead>
          <tbody className="divide-y divide-zinc-100">
            {events?.map((e) => (
              <tr key={e.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3"><img src={e.image} alt="" className="w-12 h-12 rounded object-cover" /></td>
                <td className="px-4 py-3 font-mono text-xs">{e.eventDate}</td>
                <td className="px-4 py-3 font-medium">{e.title}</td>
                <td className="px-4 py-3 text-zinc-500">{e.location}</td>
                <td className="px-4 py-3">{e.attendees}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(e); setOpen(true); }}><Pencil className="w-3 h-3" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-rose-600"><Trash2 className="w-3 h-3" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Supprimer cet événement ?</AlertDialogTitle></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: e.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
            {!events?.length && <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-400">Aucun événement</td></tr>}
          </tbody>
        </table>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.id ? "Modifier l'événement" : "Nouvel événement"}</SheetTitle></SheetHeader>
          {editing && (
            <form onSubmit={onSave} className="space-y-4 mt-6">
              <div className="space-y-2"><Label>Titre</Label><Input required value={editing.title} onChange={(ev) => setEditing({ ...editing, title: ev.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea required rows={4} value={editing.description} onChange={(ev) => setEditing({ ...editing, description: ev.target.value })} /></div>
              <div className="space-y-2"><Label>Image (URL)</Label><Input required value={editing.image} onChange={(ev) => setEditing({ ...editing, image: ev.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Date</Label><Input required type="date" value={editing.eventDate} onChange={(ev) => setEditing({ ...editing, eventDate: ev.target.value })} /></div>
                <div className="space-y-2"><Label>Lieu</Label><Input required value={editing.location} onChange={(ev) => setEditing({ ...editing, location: ev.target.value })} /></div>
                <div className="space-y-2"><Label>Invités</Label><Input type="number" value={editing.attendees} onChange={(ev) => setEditing({ ...editing, attendees: Number(ev.target.value) })} /></div>
                <div className="space-y-2"><Label>Catégorie</Label><Input value={editing.category || ""} onChange={(ev) => setEditing({ ...editing, category: ev.target.value })} /></div>
              </div>
              <div className="pt-4 flex gap-2"><Button type="submit" className="flex-1">Enregistrer</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button></div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
