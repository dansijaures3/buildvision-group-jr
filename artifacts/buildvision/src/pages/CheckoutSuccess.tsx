import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle, Loader2, Package } from "lucide-react";
import { formatXof } from "@/lib/cart";

export default function CheckoutSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = Number(params.get("orderId"));
  const [polls, setPolls] = useState(0);
  const { data: order, refetch, isLoading } = useGetOrder(orderId, { query: { enabled: !!orderId } });

  useEffect(() => {
    if (!order || order.status !== "pending" || polls >= 6) return;
    const t = setTimeout(() => { refetch(); setPolls((p) => p + 1); }, 3000);
    return () => clearTimeout(t);
  }, [order, polls, refetch]);

  const status = order?.status;
  const isPaid = status === "paid";
  const isFailed = status === "failed";
  const isPending = status === "pending";

  return (
    <div className="w-full pt-32 pb-24 min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className={`p-10 text-center ${isPaid ? "bg-gradient-to-br from-emerald-50 to-white" : isFailed ? "bg-gradient-to-br from-red-50 to-white" : "bg-gradient-to-br from-amber-50 to-white"}`}>
            {isLoading || !order ? (
              <Loader2 className="w-14 h-14 mx-auto text-zinc-400 animate-spin mb-4" />
            ) : isPaid ? (
              <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
            ) : isFailed ? (
              <XCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
            ) : (
              <Clock className="w-16 h-16 mx-auto text-amber-600 mb-4" />
            )}
            <h1 className="text-3xl font-serif font-bold mb-2">
              {isPaid ? "Paiement confirmé !" : isFailed ? "Paiement échoué" : isPending ? "Paiement en cours..." : "Vérification..."}
            </h1>
            <p className="text-zinc-600">
              {isPaid && "Merci pour votre commande. Notre équipe vous contactera sous 24h."}
              {isFailed && "Le paiement n'a pas pu être finalisé. Vous pouvez réessayer."}
              {isPending && "Nous vérifions auprès de FedaPay. Cela peut prendre quelques secondes."}
            </p>
          </div>

          {order && (
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Référence</span>
                <span className="font-mono font-semibold">{order.reference}</span>
              </div>
              <div className="border-t border-zinc-100 pt-4 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <Package className="w-4 h-4 text-zinc-400 mt-0.5" />
                    <div className="flex-1">{item.name} × {item.quantity}</div>
                    <div className="font-medium">{formatXof(item.price * item.quantity, order.currency)}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatXof(order.total, order.currency)}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {isFailed && order.paymentUrl && (
                  <a href={order.paymentUrl} className="flex-1"><Button size="lg" className="w-full">Réessayer le paiement</Button></a>
                )}
                <Link href="/commerce" className="flex-1"><Button variant="outline" size="lg" className="w-full">Continuer mes achats</Button></Link>
                <Link href="/" className="flex-1"><Button variant="ghost" size="lg" className="w-full">Retour à l'accueil</Button></Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
