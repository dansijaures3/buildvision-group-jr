import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StringListField } from "@/components/admin/StringListField";
import { Pencil, Trash2, Star } from "lucide-react";

const CATS = ["architecture", "construction", "evenementiel", "commerce"];
const STATUSES = ["en_cours", "termine", "planifie"];

const blank = { code: "", title: "", category: "architecture", description: "", coverImage: "", gallery: [] as string[], client: "", location: "", status: "en_cours", completedAt: "", featured: false };

export default function AdminProjects() {
  const qc = useQueryClient();
  const { data: projects } = useListProjects();
  const create = useCreateProject();
  const update = useUpdateProject();
  const del = useDeleteProject();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => filter === "all" ? projects : projects?.filter((p) => p.category === filter), [projects, filter]);
  const refresh = () => qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...editing, gallery: (editing.gallery || []).filter(Boolean) };
    delete payload.id;
    if (editing.id) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
    else create.mutate({ data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
  };

  return (
    <div>
      <AdminPageHeader title="Projets" subtitle="Portfolio de réalisations du groupe." onAdd={() => { setEditing({ ...blank }); setOpen(true); }} addLabel="Nouveau projet" />

      <div className="mb-6 flex items-center gap-3">
        <Label className="text-xs uppercase tracking-widest text-zinc-500">Filtrer</Label>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr className="text-left text-xs uppercase tracking-widest text-zinc-500">
              <th className="px-4 py-3 w-16"></th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered?.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3"><img src={p.coverImage} alt="" className="w-12 h-12 rounded object-cover" /></td>
                <td className="px-4 py-3 font-mono text-xs">{p.code}</td>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3"><span className="text-[10px] uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded">{p.category}</span></td>
                <td className="px-4 py-3"><span className="text-xs">{p.status}</span></td>
                <td className="px-4 py-3">{p.featured && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing({ ...p, gallery: p.gallery || [] }); setOpen(true); }}><Pencil className="w-3 h-3" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-rose-600"><Trash2 className="w-3 h-3" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: p.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
            {!filtered?.length && <tr><td colSpan={7} className="px-4 py-12 text-center text-zinc-400">Aucun projet</td></tr>}
          </tbody>
        </table>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.id ? "Modifier le projet" : "Nouveau projet"}</SheetTitle></SheetHeader>
          {editing && (
            <form onSubmit={onSave} className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Code</Label><Input required value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} /></div>
                <div className="space-y-2"><Label>Catégorie</Label>
                  <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Titre</Label><Input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea required rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="space-y-2"><Label>Image principale (URL)</Label><Input required value={editing.coverImage} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} /></div>
              <StringListField label="Galerie d'images (URLs)" values={editing.gallery || []} onChange={(v) => setEditing({ ...editing, gallery: v })} placeholder="https://..." />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Client</Label><Input required value={editing.client} onChange={(e) => setEditing({ ...editing, client: e.target.value })} /></div>
                <div className="space-y-2"><Label>Localisation</Label><Input required value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></div>
                <div className="space-y-2"><Label>Statut</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Date d'achèvement</Label><Input required value={editing.completedAt} placeholder="2025-09" onChange={(e) => setEditing({ ...editing, completedAt: e.target.value })} /></div>
              </div>
              <div className="flex items-center gap-3"><Switch checked={editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} /><Label>Mettre en vedette</Label></div>
              <div className="pt-4 flex gap-2"><Button type="submit" className="flex-1">Enregistrer</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button></div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
