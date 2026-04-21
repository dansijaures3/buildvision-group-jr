import { useMemo, useState } from "react";
import { useListTeamMembers } from "@workspace/api-client-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Linkedin, Mail, Users } from "lucide-react";

export default function Team() {
  const { data: members, isLoading } = useListTeamMembers();
  const [selected, setSelected] = useState<any>(null);

  const departments = useMemo(() => {
    const map = new Map<string, any[]>();
    members?.forEach((m) => {
      if (!map.has(m.department)) map.set(m.department, []);
      map.get(m.department)!.push(m);
    });
    return Array.from(map.entries());
  }, [members]);

  return (
    <div className="w-full pt-20">
      <section className="bg-zinc-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=2000&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 to-zinc-950" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">Notre Capital Humain</div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 max-w-3xl">L'équipe qui bâtit votre vision.</h1>
          <p className="text-lg text-zinc-300 max-w-2xl">
            Architectes, ingénieurs, chefs de projet et producteurs : des talents complémentaires réunis par une même exigence d'excellence.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-2xl">
            {departments.map(([dept, list]) => (
              <div key={dept}>
                <div className="text-3xl font-serif font-bold text-primary">{list.length}</div>
                <div className="text-xs uppercase tracking-widest text-zinc-400 mt-1">{dept}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-50 min-h-[40vh]">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />)}
            </div>
          ) : !members?.length ? (
            <div className="text-center py-24">
              <div className="inline-flex w-16 h-16 rounded-full bg-zinc-100 items-center justify-center text-zinc-400 mb-4"><Users className="w-8 h-8" /></div>
              <h3 className="text-xl font-serif font-bold mb-2">Notre équipe arrive bientôt</h3>
            </div>
          ) : (
            <Tabs defaultValue={departments[0]?.[0] ?? "all"} className="w-full">
              <TabsList className="mb-10 flex flex-wrap h-auto bg-white border border-zinc-100 p-1.5">
                {departments.map(([dept]) => (
                  <TabsTrigger key={dept} value={dept} className="text-sm px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">{dept}</TabsTrigger>
                ))}
              </TabsList>
              {departments.map(([dept, list]) => (
                <TabsContent key={dept} value={dept}>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {list.map((m: any) => (
                      <button key={m.id} onClick={() => setSelected(m)} className="group bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-left">
                        <div className="aspect-square overflow-hidden">
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                        </div>
                        <div className="p-5">
                          <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">{m.role}</div>
                          <div className="font-serif font-bold text-lg mb-2 text-zinc-900">{m.name}</div>
                          <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{m.bio}</p>
                          <div className="flex gap-2">
                            {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"><Linkedin className="w-3.5 h-3.5" /></a>}
                            {m.email && <a href={`mailto:${m.email}`} onClick={(e) => e.stopPropagation()} className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"><Mail className="w-3.5 h-3.5" /></a>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <div className="aspect-square w-40 mx-auto rounded-full overflow-hidden -mt-2 mb-2">
                <img src={selected.photo} alt={selected.name} className="w-full h-full object-cover" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-serif">{selected.name}</DialogTitle>
                <div className="text-center text-xs uppercase tracking-widest text-primary font-bold">{selected.role}</div>
              </DialogHeader>
              <p className="text-sm text-zinc-700 leading-relaxed text-center">{selected.bio}</p>
              <div className="flex justify-center gap-3 pt-2">
                {selected.linkedin && <a href={selected.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"><Linkedin className="w-4 h-4" /></a>}
                {selected.email && <a href={`mailto:${selected.email}`} className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"><Mail className="w-4 h-4" /></a>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
