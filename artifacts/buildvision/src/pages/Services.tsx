import { Link } from "wouter";
import { useListServices } from "@workspace/api-client-react";
import { Building2, HardHat, Briefcase, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, any> = {
  architecture: Building2,
  construction: HardHat,
  evenementiel: Calendar,
  commerce: Briefcase,
};

export default function Services() {
  const { data: services, isLoading } = useListServices();

  return (
    <div className="w-full pt-20">
      <section className="bg-zinc-950 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Nos Domaines d'Expertise</h1>
          <p className="text-xl text-zinc-300 max-w-2xl">
            Une offre globale et intégrée pour répondre aux exigences des projets les plus complexes en Afrique de l'Ouest.
          </p>
        </div>
      </section>

      <section className="py-20 bg-zinc-50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-zinc-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {services?.map((service) => {
                const Icon = iconMap[service.category] || Building2;
                return (
                  <div key={service.id} className="bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={service.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="text-xs font-medium text-primary uppercase tracking-widest mb-3">
                        {service.category}
                      </div>
                      <h2 className="text-2xl font-serif font-bold mb-4 text-zinc-900">{service.title}</h2>
                      <p className="text-zinc-600 mb-8 flex-1 leading-relaxed">
                        {service.shortDescription}
                      </p>
                      <Link href={`/services/${service.slug}`}>
                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                          Découvrir le service
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
              
              {!services?.length && (
                <div className="col-span-full py-20 text-center text-zinc-500">
                  Aucun service disponible pour le moment.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
