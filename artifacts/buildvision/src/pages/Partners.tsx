import { useListPartners, useListTestimonials } from "@workspace/api-client-react";
import { Handshake, Star, Quote } from "lucide-react";

export default function Partners() {
  const { data: partners, isLoading } = useListPartners();
  const { data: testimonials } = useListTestimonials();

  return (
    <div className="w-full pt-20">
      <section className="bg-zinc-950 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">Nos Alliances</div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Ils nous font confiance.</h1>
          <p className="text-lg text-zinc-300 max-w-2xl">Institutions publiques, grands comptes privés, fondations et marques de prestige : nos partenariats reposent sur la confiance et la livraison.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="bg-zinc-100 rounded-xl aspect-[3/2] animate-pulse" />)}</div>
          ) : !partners?.length ? (
            <div className="text-center py-24">
              <div className="inline-flex w-16 h-16 rounded-full bg-zinc-100 items-center justify-center text-zinc-400 mb-4"><Handshake className="w-8 h-8" /></div>
              <h3 className="text-xl font-serif font-bold mb-2">Nos partenaires apparaîtront ici</h3>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {partners.map((p) => (
                <a key={p.id} href={p.website || "#"} target={p.website ? "_blank" : undefined} rel="noreferrer" className="group bg-white border border-zinc-200 rounded-xl p-8 aspect-[3/2] flex flex-col items-center justify-center gap-4 hover:border-primary hover:shadow-lg transition-all hover:-translate-y-1">
                  <img src={p.logo} alt={p.name} className="max-h-20 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                  <div className="text-xs font-semibold text-zinc-700 group-hover:text-primary transition-colors text-center">{p.name}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-zinc-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-4">Témoignages</div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Ce qu'ils disent de nous.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white rounded-xl p-8 border border-zinc-100 shadow-sm relative">
                  <Quote className="w-10 h-10 text-primary/15 absolute top-6 right-6" />
                  <div className="flex gap-0.5 mb-4">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-zinc-700 leading-relaxed mb-6 italic">« {t.quote} »</p>
                  <div className="pt-4 border-t border-zinc-100">
                    <div className="font-serif font-bold text-zinc-900">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role} · {t.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
