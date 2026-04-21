import { useState } from "react";
import { Link } from "wouter";
import { useListProjects } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: projects, isLoading } = useListProjects();

  const categories = [
    { id: "all", label: "Tous" },
    { id: "architecture", label: "Architecture" },
    { id: "construction", label: "Construction" },
    { id: "evenementiel", label: "Événementiel" }
  ];

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects?.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="w-full pt-20">
      <section className="bg-zinc-950 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Notre Portfolio</h1>
          <p className="text-xl text-zinc-300 max-w-2xl mb-10">
            Découvrez nos réalisations majeures en Afrique de l'Ouest. L'excellence technique incarnée dans chaque structure.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id 
                    ? "bg-primary text-white" 
                    : "bg-white/10 text-zinc-300 hover:bg-white/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl h-96 animate-pulse border border-zinc-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects?.map((project) => (
                <Link key={project.id} href={`/projets/${project.id}`}>
                  <div className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img 
                        src={project.coverImage || "https://images.unsplash.com/photo-1541881451009-42b781b0f146?auto=format&fit=crop&w=800&q=80"} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-zinc-900 text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-xs font-mono text-zinc-500 mb-2">{project.code}</div>
                      <h3 className="text-xl font-serif font-bold mb-4 text-zinc-900 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <div className="mt-auto space-y-2 text-sm text-zinc-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-zinc-400" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-400" />
                          {new Date(project.completedAt).getFullYear()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {!filteredProjects?.length && (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-flex w-16 h-16 rounded-full bg-zinc-100 items-center justify-center text-zinc-400 mb-4">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-zinc-900 mb-2">Aucun projet trouvé</h3>
                  <p className="text-zinc-500">Il n'y a pas de projets dans cette catégorie pour le moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
