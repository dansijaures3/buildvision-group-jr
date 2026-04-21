import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useListCommerceItems } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CheckCircle2, Clock } from "lucide-react";

export default function Commerce() {
  const { data: items, isLoading } = useListCommerceItems();
  const [activeCat, setActiveCat] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items?.forEach((i) => set.add(i.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = activeCat === "all" ? items : items?.filter((i) => i.category === activeCat);

  return (
    <div className="w-full pt-20">
      <section className="bg-zinc-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2000&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 to-zinc-950" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">Pôle Commerce</div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 max-w-3xl">Notre catalogue de matériaux et équipements.</h1>
          <p className="text-lg text-zinc-300 max-w-2xl">
            Du ciment haute performance au mobilier événementiel premium, nous distribuons des produits sélectionnés pour leur qualité et leur fiabilité.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-zinc-100 sticky top-20 z-30 backdrop-blur">
        <div className="container mx-auto px-4 md:px-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeCat === c ? "bg-primary text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
            >
              {c === "all" ? "Toutes catégories" : c}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 bg-zinc-50 min-h-[60vh]">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />)}
            </div>
          ) : !filtered?.length ? (
            <div className="text-center py-24">
              <div className="inline-flex w-16 h-16 rounded-full bg-zinc-100 items-center justify-center text-zinc-400 mb-4"><ShoppingBag className="w-8 h-8" /></div>
              <h3 className="text-xl font-serif font-bold mb-2">Aucun produit dans cette catégorie</h3>
              <p className="text-zinc-500">Essayez une autre catégorie ou contactez-nous pour une demande spécifique.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <article key={item.id} className="group bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="aspect-square overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{item.category}</div>
                    <h3 className="text-lg font-serif font-bold mb-2 text-zinc-900">{item.name}</h3>
                    <p className="text-sm text-zinc-600 mb-4 flex-1 line-clamp-3">{item.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                      <div className="text-base font-semibold text-zinc-900">{item.price}</div>
                      {item.available ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Disponible</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full"><Clock className="w-3 h-3" /> Sur commande</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-zinc-950 text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Besoin d'une fourniture spécifique ?</h2>
          <p className="text-zinc-400 mb-8">Notre service commerce vous établit un devis personnalisé sous 48h.</p>
          <Link href="/devis"><Button size="lg" className="font-semibold">Demander un devis matériel</Button></Link>
        </div>
      </section>
    </div>
  );
}
