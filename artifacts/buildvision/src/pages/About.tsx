import { ArrowRight, CheckCircle2, Building2, HardHat, Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="w-full pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/images/about-hero.png')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium mb-6 backdrop-blur-md border border-white/20">
              <span className="w-2 h-2 rounded-full bg-primary" />
              À propos de nous
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Bâtir l'excellence, concevoir l'avenir.
            </h1>
            <p className="text-xl text-zinc-300 leading-relaxed">
              BuildVision Group & JR Service est un conglomérat d'ingénierie et de développement de premier plan opérant en Afrique de l'Ouest, dédié à la transformation des paysages urbains et à la création d'expériences mémorables.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Vision */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-zinc-900">Notre Histoire</h2>
              <div className="space-y-6 text-zinc-600 leading-relaxed">
                <p>
                  Fondé sur la conviction que l'infrastructure est le fondement du développement socio-économique, BuildVision Group a commencé comme un modeste cabinet de conseil en ingénierie avant de se développer en un groupe diversifié.
                </p>
                <p>
                  L'intégration de JR Service a permis d'étendre nos compétences au-delà de la construction traditionnelle pour englober l'événementiel de haut niveau et le commerce spécialisé, offrant ainsi une approche holistique à nos clients institutionnels et privés.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers de contribuer activement à la modernisation de l'Afrique de l'Ouest, avec un portefeuille de projets allant des tours corporatives aux complexes résidentiels de luxe.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-zinc-50 p-8 border border-zinc-100 rounded-lg">
                <h3 className="text-xl font-serif font-bold mb-4 text-primary">Mission</h3>
                <p className="text-zinc-600 text-sm">
                  Délivrer une ingénierie de précision, des designs innovants et des services d'excellence qui dépassent les attentes de nos clients tout en respectant les normes internationales de qualité et de durabilité.
                </p>
              </div>
              <div className="bg-zinc-50 p-8 border border-zinc-100 rounded-lg">
                <h3 className="text-xl font-serif font-bold mb-4 text-primary">Vision</h3>
                <p className="text-zinc-600 text-sm">
                  Devenir le partenaire de choix et le standard de référence pour tous les projets majeurs d'infrastructure, de construction et d'événementiel en Afrique de l'Ouest d'ici 2030.
                </p>
              </div>
              <div className="bg-zinc-50 p-8 border border-zinc-100 rounded-lg sm:col-span-2">
                <h3 className="text-xl font-serif font-bold mb-4 text-primary">Nos Valeurs Fondamentales</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Excellence technique et rigueur",
                    "Intégrité et transparence totale",
                    "Innovation architecturale",
                    "Respect des délais et des budgets",
                    "Engagement envers la durabilité",
                    "Sécurité absolue sur nos chantiers"
                  ].map((value, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-600">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4 text-zinc-900">Une Expertise Multidimensionnelle</h2>
            <p className="text-zinc-600">Notre force réside dans la synergie de nos quatre piliers d'expertise, nous permettant de gérer des projets complexes de A à Z.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Building2,
                title: "Architecture",
                desc: "Conception innovante, plans directeurs et design d'intérieur alliant esthétique et fonctionnalité.",
                link: "/services/architecture"
              },
              {
                icon: HardHat,
                title: "Construction",
                desc: "Génie civil, réalisation d'infrastructures et gestion de chantiers avec une rigueur absolue.",
                link: "/services/construction"
              },
              {
                icon: Calendar,
                title: "Événementiel",
                desc: "Organisation de cérémonies corporatives, lancements de projets et événements de prestige.",
                link: "/services/evenementiel"
              },
              {
                icon: Briefcase,
                title: "Commerce",
                desc: "Fourniture d'équipements spécialisés, matériaux premium et solutions technologiques.",
                link: "/services/commerce"
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-lg mb-6 group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3 text-zinc-900">{pillar.title}</h3>
                <p className="text-zinc-600 text-sm mb-6 leading-relaxed">{pillar.desc}</p>
                <Link href="/services">
                  <span className="text-primary font-medium text-sm inline-flex items-center cursor-pointer group-hover:underline">
                    En savoir plus <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h2 className="text-3xl font-serif font-bold mb-6 text-zinc-900">Le Leadership BuildVision</h2>
          <p className="text-zinc-600 mb-10 leading-relaxed">
            Notre comité de direction est composé d'experts reconnus dans leurs domaines respectifs, cumulant des décennies d'expérience dans le développement d'infrastructures en Afrique et à l'international. Leur vision stratégique guide notre croissance continue.
          </p>
          <Link href="/equipe">
            <Button variant="outline" size="lg" className="h-12 px-8">
              Découvrir notre équipe dirigeante
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
