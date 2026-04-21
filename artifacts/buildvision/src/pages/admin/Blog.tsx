import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, getListBlogPostsQueryKey } from "@workspace/api-client-react";
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

const blank = { slug: "", title: "", excerpt: "", content: "", coverImage: "", author: "", publishedAt: new Date().toISOString().slice(0, 10), tags: [] as string[] };

export default function AdminBlog() {
  const qc = useQueryClient();
  const { data: posts } = useListBlogPosts();
  const create = useCreateBlogPost();
  const update = useUpdateBlogPost();
  const del = useDeleteBlogPost();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...editing, tags: (editing.tags || []).filter(Boolean) };
    delete payload.id;
    if (editing.id) update.mutate({ id: editing.id, data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
    else create.mutate({ data: payload }, { onSuccess: () => { refresh(); setOpen(false); } });
  };

  return (
    <div>
      <AdminPageHeader title="Blog" subtitle="Articles publiés sur le site." onAdd={() => { setEditing({ ...blank }); setOpen(true); }} addLabel="Nouvel article" />
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b"><tr className="text-left text-xs uppercase tracking-widest text-zinc-500"><th className="px-4 py-3 w-16"></th><th className="px-4 py-3">Titre</th><th className="px-4 py-3">Auteur</th><th className="px-4 py-3">Date</th><th className="px-4 py-3"></th></tr></thead>
          <tbody className="divide-y divide-zinc-100">
            {posts?.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3"><img src={p.coverImage} alt="" className="w-12 h-12 rounded object-cover" /></td>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-zinc-500">{p.author}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.publishedAt}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing({ ...p, tags: p.tags || [] }); setOpen(true); }}><Pencil className="w-3 h-3" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-rose-600"><Trash2 className="w-3 h-3" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: p.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
            {!posts?.length && <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-400">Aucun article</td></tr>}
          </tbody>
        </table>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.id ? "Modifier l'article" : "Nouvel article"}</SheetTitle></SheetHeader>
          {editing && (
            <form onSubmit={onSave} className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Slug</Label><Input required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
                <div className="space-y-2"><Label>Auteur</Label><Input required value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Titre</Label><Input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Extrait</Label><Textarea required rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
              <div className="space-y-2"><Label>Contenu</Label><Textarea required rows={10} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
              <div className="space-y-2"><Label>Image de couverture (URL)</Label><Input required value={editing.coverImage} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} /></div>
              <div className="space-y-2"><Label>Date de publication</Label><Input type="date" required value={editing.publishedAt} onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })} /></div>
              <StringListField label="Tags" values={editing.tags || []} onChange={(v) => setEditing({ ...editing, tags: v })} placeholder="Tag" />
              <div className="pt-4 flex gap-2"><Button type="submit" className="flex-1">Enregistrer</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button></div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
