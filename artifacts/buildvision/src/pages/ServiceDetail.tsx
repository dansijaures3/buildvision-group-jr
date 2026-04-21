import { Link, useParams } from "wouter";
import { useGetService, getGetServiceQueryKey } from "@workspace/api-client-react";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServiceDetail() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: service, isLoading } = useGetService(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetServiceQueryKey(slug)
    }
  });

  if (isLoading) {
    return <div className="pt-32 min-h-screen flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!service) {
    return <div className="pt-32 text-center text-zinc-500 min-h-screen">Service introuvable</div>;
  }

  return (
    <div className="w-full pt-20">
      <section className="relative h-[60vh] min-h-[400px] flex items-end pb-20">
        <div className="absolute inset-0">
          <img 
            src={service.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"} 
            alt={service.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <Link href="/services">
            <span className="text-zinc-300 hover:text-white inline-flex items-center gap-2 mb-6 cursor-pointer text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Retour aux services
            </span>
          </Link>
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md border border-primary/30">
            {service.category}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 max-w-4xl leading-tight">
            {service.title}
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl">
            {service.shortDescription}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-serif font-bold mb-8 text-zinc-900">Présentation</h2>
              <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed whitespace-pre-line text-lg">
                {service.fullDescription}
              </div>
            </div>
            
            <div>
              <div className="bg-zinc-50 p-8 rounded-xl border border-zinc-100 mb-8">
                <h3 className="text-xl font-serif font-bold mb-6 text-zinc-900">Points clés</h3>
                <ul className="space-y-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-zinc-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-primary text-white p-8 rounded-xl text-center">
                <h3 className="text-xl font-serif font-bold mb-4">Besoin de ce service ?</h3>
                <p className="text-primary-foreground/80 mb-6 text-sm">
                  Discutons de votre projet et de la manière dont nous pouvons vous accompagner.
                </p>
                <Link href="/devis">
                  <Button variant="secondary" className="w-full text-primary font-semibold">
                    Demander un devis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
