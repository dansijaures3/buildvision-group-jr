import { useState } from "react";
import { Link } from "wouter";
import { useListEvents } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Calendar, Users, Sparkles, ArrowRight } from "lucide-react";

const formatDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch { return d; }
};

export default function Events() {
  const { data: events, isLoading } = useListEvents();
  const [selected, setSelected] = useState<typeof events extends (infer T)[] | undefined ? T : never | null>(null as any);

  return (
    <div className="w-full pt-20">
      <section className="bg-zinc-950 text-white py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=2000&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/80 to-zinc-950" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">Pôle Événementiel — JR Service</div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 max-w-3xl">Des événements à la hauteur de vos ambitions.</h1>
          <p className="text-lg text-zinc-300 max-w-2xl">
            Conférences, galas, lancements de produits, mariages d'exception — JR Service produit chaque détail avec une exigence absolue.
          </p>
        </div>
      </section>

      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl h-96 animate-pulse border border-zinc-100" />
              ))}
            </div>
          ) : !events?.length ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelected(event as any)}
                  className="group relative text-left rounded-xl overflow-hidden bg-white border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                      {event.category && (
                        <span className="bg-white/90 backdrop-blur text-zinc-900 text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-widest">
                          {event.category}
                        </span>
                      )}
                      <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-sm flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {formatDate(event.eventDate)}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-serif font-bold mb-2 leading-tight">{event.title}</h3>
                      <div className="flex items-center justify-between text-xs text-white/90">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {event.attendees} invités</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <span className="text-sm text-zinc-600 line-clamp-1">{event.description}</span>
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Un événement à organiser ?</h2>
          <p className="text-primary-foreground/80 mb-8">Notre équipe événementielle conçoit chaque expérience sur mesure, du brief à la régie.</p>
          <Link href="/devis"><Button size="lg" variant="secondary" className="text-primary font-semibold">Demander un devis</Button></Link>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null as any)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <div className="aspect-video overflow-hidden rounded-md -mt-2">
                <img src={(selected as any).image} alt={(selected as any).title} className="w-full h-full object-cover" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">{(selected as any).title}</DialogTitle>
                <DialogDescription className="text-sm flex flex-wrap gap-4 pt-2">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {(selected as any).location}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate((selected as any).eventDate)}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {(selected as any).attendees} invités</span>
                </DialogDescription>
              </DialogHeader>
              <p className="text-zinc-700 leading-relaxed">{(selected as any).description}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24">
      <div className="inline-flex w-16 h-16 rounded-full bg-zinc-100 items-center justify-center text-zinc-400 mb-4">
        <Sparkles className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-serif font-bold mb-2">Aucun événement pour l'instant</h3>
      <p className="text-zinc-500">Nos prochaines productions apparaîtront ici très bientôt.</p>
    </div>
  );
}
