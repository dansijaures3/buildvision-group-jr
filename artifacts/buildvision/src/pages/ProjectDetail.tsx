import { Link, useParams } from "wouter";
import { useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, MapPin, Calendar, Building, Info, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ProjectDetail() {
  const params = useParams();
  const id = Number(params.id);
  
  const { data: project, isLoading } = useGetProject(id, {
    query: {
      enabled: !!id,
      queryKey: getGetProjectQueryKey(id)
    }
  });

  if (isLoading) {
    return <div className="pt-32 min-h-screen flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!project) {
    return <div className="pt-32 text-center text-zinc-500 min-h-screen">Projet introuvable</div>;
  }

  return (
    <div className="w-full pt-20">
      <section className="relative h-[70vh] min-h-[500px] flex items-end pb-12">
        <div className="absolute inset-0">
          <img 
            src={project.coverImage || "https://images.unsplash.com/photo-1541881451009-42b781b0f146?auto=format&fit=crop&w=1920&q=80"} 
            alt={project.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <Link href="/projets">
            <span className="text-zinc-300 hover:text-white inline-flex items-center gap-2 mb-6 cursor-pointer text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Retour aux projets
            </span>
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 rounded-sm bg-white text-zinc-950 text-xs font-bold uppercase tracking-widest">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-sm bg-primary text-white text-xs font-bold uppercase tracking-widest">
              {project.status.replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 max-w-5xl leading-tight">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Metadata Strip */}
      <div className="bg-zinc-950 text-zinc-300 py-8 border-t border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1 flex items-center gap-2"><Building className="w-3 h-3" /> Client</div>
              <div className="font-medium text-white">{project.client}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1 flex items-center gap-2"><MapPin className="w-3 h-3" /> Localisation</div>
              <div className="font-medium text-white">{project.location}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1 flex items-center gap-2"><Calendar className="w-3 h-3" /> Date</div>
              <div className="font-medium text-white">
                {format(new Date(project.completedAt), "MMMM yyyy", { locale: fr })}
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1 flex items-center gap-2"><Info className="w-3 h-3" /> Code Projet</div>
              <div className="font-mono text-white">{project.code}</div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-8 text-zinc-900">Le Projet</h2>
            <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed whitespace-pre-line text-lg mb-16">
              {project.description}
            </div>

            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h3 className="text-2xl font-serif font-bold mb-8 text-zinc-900 flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-primary" />
                  Galerie du projet
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {project.gallery.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-zinc-100">
                      <img src={img} alt={`Galerie ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
