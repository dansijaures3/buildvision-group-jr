import { Link, useRoute } from "wouter";
import { useGetBlogPost, useListBlogPosts, getGetBlogPostQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react";

const formatDate = (d: string) => {
  try { return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; }
};

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const { data: post, isLoading } = useGetBlogPost(slug, { query: { enabled: !!slug, queryKey: getGetBlogPostQueryKey(slug) } });
  const { data: allPosts } = useListBlogPosts();
  const related = allPosts?.filter((p) => p.slug !== slug).slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div className="w-full pt-20">
        <div className="container mx-auto px-4 md:px-6 py-20"><div className="bg-zinc-100 rounded-xl h-96 animate-pulse" /></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Article introuvable</h1>
          <Link href="/blog"><Button>Retour au blog</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-20">
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="relative container mx-auto px-4 md:px-6 pb-12 text-white">
          <Link href="/blog"><Button variant="ghost" className="text-white hover:bg-white/10 mb-6 -ml-3"><ArrowLeft className="w-4 h-4 mr-2" /> Retour au journal</Button></Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((t) => <span key={t} className="text-[10px] uppercase tracking-widest bg-primary px-2.5 py-1 rounded font-bold">{t}</span>)}
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 max-w-4xl leading-tight">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {post.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </section>

      <article className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <p className="text-xl text-zinc-700 leading-relaxed font-serif italic mb-10 border-l-4 border-primary pl-6">{post.excerpt}</p>
          <div className="text-base text-zinc-800 leading-relaxed whitespace-pre-line">{post.content}</div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-20 bg-zinc-50 border-t border-zinc-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-4">À lire aussi</div>
            <h2 className="text-3xl font-serif font-bold mb-12 text-zinc-900">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`}>
                  <article className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif font-bold mb-2 text-zinc-900 group-hover:text-primary transition-colors leading-snug">{p.title}</h3>
                      <span className="inline-flex items-center gap-1 text-sm text-primary font-semibold">Lire <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
