import { Link } from "wouter";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Newspaper, ArrowRight, Calendar, User } from "lucide-react";

const formatDate = (d: string) => {
  try { return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; }
};

export default function Blog() {
  const { data: posts, isLoading } = useListBlogPosts();
  const featured = posts?.[0];
  const rest = posts?.slice(1) ?? [];

  return (
    <div className="w-full pt-20">
      <section className="bg-zinc-950 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">Le Journal du Groupe</div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Actualités, analyses et coulisses.</h1>
          <p className="text-lg text-zinc-300 max-w-2xl">Plongez dans les réflexions de nos équipes sur le bâtiment, l'architecture et l'événementiel en Afrique de l'Ouest.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="space-y-8">
              <div className="bg-zinc-100 rounded-xl h-96 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => <div key={i} className="bg-zinc-100 rounded-xl h-80 animate-pulse" />)}
              </div>
            </div>
          ) : !posts?.length ? (
            <div className="text-center py-24">
              <div className="inline-flex w-16 h-16 rounded-full bg-zinc-100 items-center justify-center text-zinc-400 mb-4"><Newspaper className="w-8 h-8" /></div>
              <h3 className="text-xl font-serif font-bold mb-2">Aucun article pour l'instant</h3>
              <p className="text-zinc-500">Nos prochains articles arrivent très bientôt.</p>
            </div>
          ) : (
            <>
              {featured && (
                <Link href={`/blog/${featured.slug}`}>
                  <article className="group grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl">
                      <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-4">À la une</div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featured.tags?.map((t) => <span key={t} className="text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-100 px-2 py-1 rounded">{t}</span>)}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-zinc-900 group-hover:text-primary transition-colors leading-tight">{featured.title}</h2>
                      <p className="text-zinc-600 mb-6 leading-relaxed">{featured.excerpt}</p>
                      <div className="flex items-center gap-6 text-xs text-zinc-500 mb-6">
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {featured.author}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(featured.publishedAt)}</span>
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Lire l'article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                    </div>
                  </article>
                </Link>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {rest.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <article className="group h-full bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.tags?.slice(0, 2).map((t) => <span key={t} className="text-[10px] uppercase tracking-widest text-primary font-bold">{t}</span>)}
                          </div>
                          <h3 className="text-lg font-serif font-bold mb-3 text-zinc-900 group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                          <p className="text-sm text-zinc-600 mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-100">
                            <span>{post.author}</span>
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
