import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember, getListTeamMembersQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Pencil, Trash2 } from "lucide-react";

const blank = { name: "", role: "", department: "Direction", photo: "", bio: "", linkedin: "", email: "", displayOrder: 0 };

export default function AdminTeam() {
  const qc = useQueryClient();
  const { data: members } = useListTeamMembers();
  const create = useCreateTeamMember();
  const update = useUpdateTeamMember();
  const del = useDeleteTeamMember();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...editing, displayOrder: Number(editing.displayOrder) || 0, linkedin: editing.linkedin || null, email: editing.email || null };
    delete payload.id;
    if (editing.id) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
    else create.mutate({ data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
  };

  return (
    <div>
      <AdminPageHeader title="Équipe" subtitle="Membres et collaborateurs du groupe." onAdd={() => { setEditing({ ...blank }); setOpen(true); }} addLabel="Nouveau membre" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {members?.map((m) => (
          <Card key={m.id} className="overflow-hidden">
            <div className="aspect-square bg-zinc-100"><img src={m.photo} alt={m.name} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">{m.role}</div>
              <h3 className="font-serif font-bold mb-2">{m.name}</h3>
              <div className="text-xs text-zinc-500 mb-3">{m.department}</div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => { setEditing(m); setOpen(true); }}><Pencil className="w-3 h-3" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-rose-600"><Trash2 className="w-3 h-3" /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Supprimer ce membre ?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: m.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.id ? "Modifier le membre" : "Nouveau membre"}</SheetTitle></SheetHeader>
          {editing && (
            <form onSubmit={onSave} className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Nom</Label><Input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Rôle</Label><Input required value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></div>
                <div className="space-y-2"><Label>Département</Label><Input required value={editing.department} onChange={(e) => setEditing({ ...editing, department: e.target.value })} /></div>
                <div className="space-y-2"><Label>Ordre</Label><Input type="number" value={editing.displayOrder} onChange={(e) => setEditing({ ...editing, displayOrder: Number(e.target.value) })} /></div>
              </div>
              <div className="space-y-2"><Label>Photo (URL)</Label><Input required value={editing.photo} onChange={(e) => setEditing({ ...editing, photo: e.target.value })} /></div>
              <div className="space-y-2"><Label>Biographie</Label><Textarea required rows={4} value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} /></div>
              <div className="space-y-2"><Label>LinkedIn</Label><Input value={editing.linkedin || ""} onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
              <div className="pt-4 flex gap-2"><Button type="submit" className="flex-1">Enregistrer</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button></div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
