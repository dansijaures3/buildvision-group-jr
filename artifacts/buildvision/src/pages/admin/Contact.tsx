import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListContactMessages, useDeleteContactMessage, getListContactMessagesQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Trash2, Mail, Phone, Inbox } from "lucide-react";

export default function AdminContact() {
  const qc = useQueryClient();
  const { data: messages } = useListContactMessages();
  const del = useDeleteContactMessage();
  const [selected, setSelected] = useState<any | null>(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: getListContactMessagesQueryKey() }); setSelected(null); };

  return (
    <div>
      <AdminPageHeader title="Messages" subtitle="Boîte de réception des messages contact." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="px-4 py-3 border-b text-xs uppercase tracking-widest text-zinc-500 bg-zinc-50">Boîte de réception ({messages?.length ?? 0})</div>
          <ul className="divide-y divide-zinc-100 max-h-[70vh] overflow-y-auto">
            {messages?.map((m) => (
              <li key={m.id}>
                <button onClick={() => setSelected(m)} className={`w-full text-left p-4 hover:bg-zinc-50 transition-colors ${selected?.id === m.id ? "bg-zinc-50" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium text-sm truncate flex-1">{m.name}</span>
                    <span className="text-[10px] text-zinc-400">{new Date(m.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="text-xs text-zinc-700 truncate font-medium ml-4">{m.subject}</div>
                  <div className="text-xs text-zinc-500 truncate ml-4">{m.message}</div>
                </button>
              </li>
            ))}
            {!messages?.length && <li className="p-12 text-center text-zinc-400"><Inbox className="w-8 h-8 mx-auto mb-2" /> Boîte de réception vide</li>}
          </ul>
        </Card>

        <Card className="lg:col-span-2 p-8 min-h-[400px]">
          {selected ? (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold">{selected.subject}</h2>
                  <div className="text-sm text-zinc-500 mt-1">De {selected.name} · {new Date(selected.createdAt).toLocaleString("fr-FR")}</div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="text-rose-600"><Trash2 className="w-3 h-3 mr-1" /> Supprimer</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Supprimer ce message ?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate({ id: selected.id }, { onSuccess: refresh })}>Supprimer</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex gap-4 text-sm mb-6 pb-6 border-b">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-primary hover:underline"><Mail className="w-4 h-4" /> {selected.email}</a>
                {selected.phone && <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 text-zinc-600"><Phone className="w-4 h-4" /> {selected.phone}</a>}
              </div>
              <p className="text-zinc-800 leading-relaxed whitespace-pre-line">{selected.message}</p>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 py-20">
              <Inbox className="w-12 h-12 mb-4" />
              <p>Sélectionnez un message à lire</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
