import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Trash2, Minus, Plus, Loader2 } from "lucide-react";
import { useCart, formatXof } from "@/lib/cart";
import { useCreateCheckout } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function CartButton() {
  const { itemCount } = useCart();
  return (
    <SheetTrigger asChild>
      <Button variant="outline" size="lg" className="relative gap-2">
        <ShoppingCart className="w-5 h-5" />
        <span className="hidden sm:inline">Panier</span>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
    </SheetTrigger>
  );
}

export function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { lines, setQty, remove, subtotal, currency, clear } = useCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [form, setForm] = useState({ customerName: "", customerEmail: "", customerPhone: "", customerAddress: "", notes: "" });
  const checkout = useCreateCheckout();
  const { toast } = useToast();

  const onCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await checkout.mutateAsync({
        data: {
          ...form,
          items: lines.map((l) => ({ id: l.id, quantity: l.quantity })),
        },
      });
      clear();
      window.location.href = result.paymentUrl;
    } catch (err: any) {
      toast({ title: "Échec du paiement", description: err?.response?.data?.error || err?.message || "Une erreur s'est produite.", variant: "destructive" });
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setStep("cart"); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">{step === "cart" ? "Votre panier" : "Vos coordonnées"}</SheetTitle>
        </SheetHeader>

        {step === "cart" && (
          <div className="mt-6 space-y-4">
            {lines.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Votre panier est vide</p>
              </div>
            ) : (
              <>
                {lines.map((l) => (
                  <div key={l.id} className="flex gap-3 border-b border-zinc-100 pb-4">
                    <img src={l.image} alt={l.name} className="w-20 h-20 rounded object-cover" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{l.name}</div>
                      <div className="text-xs text-zinc-500 mb-2">{formatXof(l.priceAmount, l.currency)}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setQty(l.id, l.quantity - 1)} className="w-7 h-7 border border-zinc-200 rounded flex items-center justify-center hover:bg-zinc-50"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center text-sm font-medium">{l.quantity}</span>
                        <button onClick={() => setQty(l.id, l.quantity + 1)} className="w-7 h-7 border border-zinc-200 rounded flex items-center justify-center hover:bg-zinc-50"><Plus className="w-3 h-3" /></button>
                        <button onClick={() => remove(l.id)} className="ml-auto text-zinc-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="text-sm font-semibold whitespace-nowrap">{formatXof(l.priceAmount * l.quantity, l.currency)}</div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 text-base font-semibold">
                  <span>Total</span>
                  <span className="text-primary text-xl">{formatXof(subtotal, currency)}</span>
                </div>
                <Button size="lg" className="w-full font-semibold" onClick={() => setStep("checkout")}>Passer au paiement</Button>
                <p className="text-xs text-zinc-500 text-center">Paiement sécurisé via FedaPay (Mobile Money, Visa, Mastercard)</p>
              </>
            )}
          </div>
        )}

        {step === "checkout" && (
          <form onSubmit={onCheckout} className="mt-6 space-y-4">
            <div className="space-y-2"><Label>Nom complet *</Label><Input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email *</Label><Input type="email" required value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} /></div>
            <div className="space-y-2"><Label>Téléphone *</Label><Input required placeholder="+225..." value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Adresse de livraison</Label><Input value={form.customerAddress} onChange={(e) => setForm({ ...form, customerAddress: e.target.value })} /></div>
            <div className="space-y-2"><Label>Notes</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>

            <div className="bg-zinc-50 p-4 rounded-lg space-y-1 text-sm">
              {lines.map((l) => (
                <div key={l.id} className="flex justify-between"><span className="text-zinc-600">{l.name} × {l.quantity}</span><span>{formatXof(l.priceAmount * l.quantity, l.currency)}</span></div>
              ))}
              <div className="flex justify-between font-semibold pt-2 border-t border-zinc-200 text-base"><span>Total à payer</span><span className="text-primary">{formatXof(subtotal, currency)}</span></div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep("cart")}>Retour</Button>
              <Button type="submit" size="lg" className="flex-1 font-semibold" disabled={checkout.isPending}>
                {checkout.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Préparation...</> : "Payer maintenant"}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
