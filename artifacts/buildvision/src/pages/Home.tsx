import { Link } from "wouter";
import { 
  useListHeroSlides, 
  useGetPublicStats, 
  useListServices, 
  useListProjects, 
  useListTestimonials, 
  useListPartners 
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Building2, HardHat, Briefcase, Calendar } from "lucide-react";

export default function Home() {
  const { data: slides } = useListHeroSlides({ activeOnly: true });
  const { data: stats } = useGetPublicStats();
  const { data: services } = useListServices();
  const { data: featuredProjects } = useListProjects({ featured: true });
  const { data: testimonials } = useListTestimonials();
  const { data: partners } = useListPartners();

  const currentSlide = slides?.[0] || {
    title: "Bâtir l'Avenir",
    subtitle: "Excellence en ingénierie et construction en Afrique de l'Ouest",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    button1Text: "Nos Projets",
    button1Link: "/projets",
    button2Text: "Nous Contacter",
    button2Link: "/contact"
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentSlide.image})` }}
        />
        <div className="absolute inset-0 bg-zinc-950/60 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {currentSlide.title}
          </h1>
          <p className="text-lg md:text-xl text-zinc-200 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            {currentSlide.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {currentSlide.button1Text && (
              <Link href={currentSlide.button1Link || "#"}>
                <Button size="lg" className="h-14 px-8 text-base w-full sm:w-auto">
                  {currentSlide.button1Text}
                </Button>
              </Link>
            )}
            {currentSlide.button2Text && (
              <Link href={currentSlide.button2Link || "#"}>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white hover:text-zinc-950">
                  {currentSlide.button2Text}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary" />
                BuildVision Group & JR Service
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-zinc-900">
                L'Excellence architecturale et technique au service de vos ambitions.
              </h2>
              <p className="text-zinc-600 mb-8 leading-relaxed">
                Forts de plusieurs années d'expertise en Afrique de l'Ouest, nous combinons vision innovante et rigueur technique pour concrétiser les projets les plus ambitieux. De la conception architecturale à la réalisation, nous sommes le partenaire de confiance des acteurs publics et privés.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 mb-10">
                <div>
                  <h3 className="text-lg font-bold font-serif mb-2">Notre Mission</h3>
                  <p className="text-sm text-zinc-600">Bâtir des infrastructures durables et concevoir des espaces qui élèvent les standards de vie.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif mb-2">Notre Vision</h3>
                  <p className="text-sm text-zinc-600">Devenir la référence incontournable de l'ingénierie et du développement en Afrique de l'Ouest.</p>
                </div>
              </div>
              
              <Link href="/a-propos">
                <Button variant="outline" className="group">
                  Découvrir notre histoire
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img src="/src/assets/images/about-hero.png" alt="BuildVision Headquarters" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-primary text-white p-8 rounded-lg hidden md:block">
                <div className="text-4xl font-serif font-bold mb-1">15+</div>
                <div className="text-sm font-medium opacity-90 uppercase tracking-wider">Années<br/>d'expertise</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-zinc-950 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                {stats?.projectsCompleted || "120"}+
              </div>
              <div className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Projets Livrés</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                {stats?.clientsServed || "85"}+
              </div>
              <div className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Clients Satisfaits</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                {stats?.activeWorksites || "12"}
              </div>
              <div className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Chantiers Actifs</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                {stats?.eventsOrganized || "45"}+
              </div>
              <div className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Événements</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Prêt à concrétiser votre vision ?</h2>
          <p className="text-primary-foreground/80 mb-10 text-lg">Nos équipes d'experts sont à votre disposition pour étudier votre projet et vous proposer des solutions sur mesure.</p>
          <Link href="/devis">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-base font-semibold text-primary">
              Demander un devis gratuit
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
