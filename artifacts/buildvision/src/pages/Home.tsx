import { Link } from "wouter";
import { useEffect, useState } from "react";
import { 
  useListHeroSlides, 
  useGetPublicStats, 
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const FALLBACK_SLIDES = [
  {
    title: "Bâtir l'Avenir",
    subtitle: "Excellence en ingénierie et construction en Afrique de l'Ouest",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    button1Text: "Nos Projets", button1Link: "/projets",
    button2Text: "Nous Contacter", button2Link: "/contact",
  },
  {
    title: "L'Architecture Réinventée",
    subtitle: "Des espaces qui transcendent la fonctionnalité pour devenir des lieux de vie",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop",
    button1Text: "Nos Services", button1Link: "/services",
    button2Text: "Demander un devis", button2Link: "/devis",
  },
  {
    title: "Construction d'Excellence",
    subtitle: "De la fondation à la livraison, une expertise reconnue dans toute la sous-région",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop",
    button1Text: "Voir nos réalisations", button1Link: "/projets",
    button2Text: "Notre équipe", button2Link: "/equipe",
  },
];

export default function Home() {
  const { data: slidesData } = useListHeroSlides({ activeOnly: true });
  const { data: stats } = useGetPublicStats();

  const slides = (slidesData && slidesData.length > 0) ? slidesData : FALLBACK_SLIDES;
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setCurrentIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const goPrev = () => setCurrentIdx((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setCurrentIdx((i) => (i + 1) % slides.length);

  return (
    <div className="w-full">
      {/* Hero Slider */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-zinc-950">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${idx === currentIdx ? "opacity-100" : "opacity-0"}`}
            aria-hidden={idx !== currentIdx}
          >
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ease-out ${idx === currentIdx ? "scale-110" : "scale-100"}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/40 to-zinc-950/90" />
          </div>
        ))}

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center text-white">
          <div key={currentIdx} className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 text-xs font-medium tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              BuildVision Group & JR Service
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 max-w-5xl mx-auto leading-[1.05]">
              {slides[currentIdx].title}
            </h1>
            <p className="text-base md:text-xl text-zinc-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              {slides[currentIdx].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {slides[currentIdx].button1Text && (
                <Link href={slides[currentIdx].button1Link || "#"}>
                  <Button size="lg" className="h-14 px-8 text-base w-full sm:w-auto shadow-lg shadow-primary/30">
                    {slides[currentIdx].button1Text}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
              {slides[currentIdx].button2Text && (
                <Link href={slides[currentIdx].button2Link || "#"}>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white hover:text-zinc-950">
                    {slides[currentIdx].button2Text}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Slider controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center text-white hover:bg-white hover:text-zinc-950 transition-all"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center text-white hover:bg-white hover:text-zinc-950 transition-all"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-1 rounded-full transition-all ${idx === currentIdx ? "w-10 bg-primary" : "w-6 bg-white/40 hover:bg-white/70"}`}
                  aria-label={`Diapositive ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-2 text-xs text-white/60 font-medium tracking-widest uppercase">
          <span className="text-white">{String(currentIdx + 1).padStart(2, "0")}</span>
          <span className="w-8 h-px bg-white/30" />
          <span>{String(slides.length).padStart(2, "0")}</span>
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
