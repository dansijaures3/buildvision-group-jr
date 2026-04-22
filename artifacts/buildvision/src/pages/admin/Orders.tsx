import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListOrders, useUpdateOrderStatus, getListOrdersQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Eye } from "lucide-react";
import { formatXof } from "@/lib/cart";

const STATUSES = [
  { value: "pending", label: "En attente", color: "bg-amber-100 text-amber-800" },
  { value: "paid", label: "Payée", color: "bg-emerald-100 text-emerald-800" },
  { value: "shipped", label: "Expédiée", color: "bg-blue-100 text-blue-800" },
  { value: "delivered", label: "Livrée", color: "bg-zinc-200 text-zinc-800" },
  { value: "failed", label: "Échouée", color: "bg-red-100 text-red-800" },
  { value: "cancelled", label: "Annulée", color: "bg-zinc-100 text-zinc-600" },
];

export default function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders } = useListOrders();
  const update = useUpdateOrderStatus();
  const [selected, setSelected] = useState<any | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: getListOrdersQueryKey() });

  return (
    <div>
      <AdminPageHeader title="Commandes" subtitle="Suivi et gestion des commandes payées via FedaPay." />

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
            <tr><th className="px-4 py-3">Référence</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Articles</th><th className="px-4 py-3">Montant</th><th className="px-4 py-3">Statut</th><th className="px-4 py-3">Date</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {!orders?.length && <tr><td colSpan={7} className="text-center py-12 text-zinc-500">Aucune commande pour le moment</td></tr>}
            {orders?.map((o) => {
              const st = STATUSES.find((s) => s.value === o.status);
              return (
                <tr key={o.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3 font-mono text-xs">{o.reference}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-xs text-zinc-500">{o.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3">{o.items.reduce((s, i) => s + i.quantity, 0)} article(s)</td>
                  <td className="px-4 py-3 font-semibold">{formatXof(o.total, o.currency)}</td>
                  <td className="px-4 py-3">
                    <Select value={o.status} onValueChange={(v) => update.mutate({ id: o.id, data: { status: v } }, { onSuccess: refresh })}>
                      <SelectTrigger className={`h-8 w-32 text-xs ${st?.color || ""}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3"><button onClick={() => setSelected(o)} className="text-zinc-400 hover:text-primary"><Eye className="w-4 h-4" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader><SheetTitle className="font-serif">Commande {selected.reference}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div><div className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Client</div><div className="font-medium">{selected.customerName}</div><div className="text-zinc-600">{selected.customerEmail} · {selected.customerPhone}</div>{selected.customerAddress && <div className="text-zinc-600">{selected.customerAddress}</div>}</div>
                {selected.notes && <div><div className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Notes</div><div>{selected.notes}</div></div>}
                <div><div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Articles</div><div className="space-y-2">{selected.items.map((i: any, idx: number) => <div key={idx} className="flex justify-between border-b border-zinc-100 pb-2"><span>{i.name} × {i.quantity}</span><span className="font-medium">{formatXof(i.price * i.quantity, selected.currency)}</span></div>)}</div></div>
                <div className="flex justify-between font-semibold text-base pt-2"><span>Total</span><span className="text-primary">{formatXof(selected.total, selected.currency)}</span></div>
                <div className="text-xs text-zinc-500 pt-4 border-t border-zinc-100">Transaction FedaPay : {selected.paymentTransactionId || "—"}</div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
