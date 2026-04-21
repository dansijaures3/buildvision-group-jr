import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListQuoteRequests, useUpdateQuoteStatus, useDeleteQuoteRequest, getListQuoteRequestsQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Trash2, Eye, Mail, Phone, Building2, Calendar } from "lucide-react";

const STATUSES = ["nouveau", "en_cours", "accepte", "refuse", "cloture"];
const STATUS_COLORS: Record<string, string> = {
  nouveau: "bg-blue-100 text-blue-800",
  en_cours: "bg-amber-100 text-amber-800",
  accepte: "bg-emerald-100 text-emerald-800",
  refuse: "bg-rose-100 text-rose-800",
  cloture: "bg-zinc-200 text-zinc-700",
};

export default function AdminQuotes() {
  const qc = useQueryClient();
  const { data: quotes } = useListQuoteRequests();
  const updateStatus = useUpdateQuoteStatus();
  const del = useDeleteQuoteRequest();
  const [viewing, setViewing] = useState<any | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: getListQuoteRequestsQueryKey() });

  return (
    <div>
      <AdminPageHeader title="Devis" subtitle="Demandes de devis reçues via le site." />
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b"><tr className="text-left text-xs uppercase tracking-widest text-zinc-500"><th className="px-4 py-3">Date</th><th className="px-4 py-3">Nom</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Budget</th><th className="px-4 py-3">Statut</th><th className="px-4 py-3"></th></tr></thead>
          <tbody className="divide-y divide-zinc-100">
            {quotes?.map((q) => (
              <tr key={q.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-mono text-xs">{new Date(q.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{q.name}</div>
                  <div className="text-xs text-zinc-500">{q.company}</div>
                </td>
                <td className="px-4 py-3 text-zinc-700">{q.projectType}</td>
                <td className="px-4 py-3 text-zinc-700">{q.budget}</td>
                <td className="px-4 py-3">
                  <Select value={q.status} onValueChange={(v) => updateStatus.mutate({ id: q.id, data: { status: v } }, { onSuccess: refresh })}>
                    <SelectTrigger className={`w-32 h-8 text-xs ${STATUS_COLORS[q.status] || ""}`}><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => setViewing(q)}><Eye className="w-3 h-3" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-rose-600"><Trash2 className="w-3 h-3" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Supprimer cette demande ?</AlertDialogTitle></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: q.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
            {!quotes?.length && <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-400">Boîte de réception vide</td></tr>}
          </tbody>
        </table>
      </Card>

      <Sheet open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader><SheetTitle>Demande de devis</SheetTitle></SheetHeader>
          {viewing && (
            <div className="space-y-6 mt-6">
              <div>
                <div className="font-mono text-xs text-zinc-500">DEV-{String(viewing.id).padStart(5, "0")}</div>
                <h3 className="font-serif text-2xl font-bold mt-1">{viewing.name}</h3>
                <span className={`inline-block text-[10px] uppercase tracking-widest px-2 py-1 rounded mt-2 ${STATUS_COLORS[viewing.status]}`}>{viewing.status}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-zinc-400" /> <a href={`mailto:${viewing.email}`} className="text-primary">{viewing.email}</a></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-zinc-400" /> {viewing.phone}</div>
                <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-zinc-400" /> {viewing.company}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-zinc-400" /> {new Date(viewing.createdAt).toLocaleString("fr-FR")}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-50 rounded-lg">
                <div><div className="text-[10px] uppercase tracking-widest text-zinc-500">Type</div><div className="font-medium">{viewing.projectType}</div></div>
                <div><div className="text-[10px] uppercase tracking-widest text-zinc-500">Budget</div><div className="font-medium">{viewing.budget}</div></div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Description du projet</div>
                <p className="text-sm leading-relaxed whitespace-pre-line">{viewing.description}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
