import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetCompanyInfo } from "@workspace/api-client-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { data: info } = useGetCompanyInfo();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "/a-propos" },
    { label: "Services", href: "/services" },
    { label: "Projets", href: "/projets" },
    { label: "Événementiel", href: "/evenementiel" },
    { label: "Commerce", href: "/commerce" },
    { label: "Équipe", href: "/equipe" },
    { label: "Blog", href: "/blog" },
    { label: "Partenaires", href: "/partenaires" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              {info?.logo ? (
                <img src={info.logo} alt={info.name || "BuildVision"} className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-xl rounded-sm group-hover:scale-105 transition-transform">
                  BV
                </div>
              )}
              <div className="flex flex-col leading-none">
                <span className={`font-serif font-bold text-lg tracking-tight ${isScrolled ? "text-foreground" : "text-white drop-shadow-md"}`}>
                  {info?.name?.split(" ")[0] || "BuildVision"}
                </span>
                <span className={`text-[10px] font-medium tracking-widest uppercase whitespace-nowrap ${isScrolled ? "text-muted-foreground" : "text-white/80 drop-shadow-md"}`}>
                  Group &amp; JR Service
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                    location === link.href
                      ? "text-primary"
                      : isScrolled
                      ? "text-foreground"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/devis">
              <Button
                variant={isScrolled ? "default" : "secondary"}
                className={`font-semibold ${
                  !isScrolled ? "bg-white text-primary hover:bg-white/90" : ""
                }`}
              >
                Demander un devis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-foreground" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-foreground" : "text-white"} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-24 px-6 pb-6 flex flex-col overflow-y-auto">
          <nav className="flex flex-col gap-4 flex-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-2xl font-serif font-medium cursor-pointer ${
                    location === link.href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-border">
            <Link href="/devis">
              <Button size="lg" className="w-full font-semibold">
                Demander un devis
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {info?.logo ? (
                  <img src={info.logo} alt={info.name || "BuildVision"} className="h-10 w-auto object-contain" />
                ) : (
                  <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-xl rounded-sm">
                    BV
                  </div>
                )}
                <div className="flex flex-col leading-none">
                  <span className="font-serif font-bold text-lg tracking-tight text-white">
                    {info?.name?.split(" ")[0] || "BuildVision"}
                  </span>
                  <span className="text-[10px] font-medium tracking-widest uppercase text-zinc-500 whitespace-nowrap">
                    Group &amp; JR Service
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                {info?.about?.slice(0, 200) || "Excellence en ingénierie, construction, architecture et événementiel en Afrique de l'Ouest. Bâtissons l'avenir ensemble."}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-serif font-semibold mb-6">Liens Rapides</h3>
              <ul className="space-y-3">
                {navLinks.slice(0, 6).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-sm hover:text-primary transition-colors cursor-pointer inline-flex items-center group">
                        <ChevronRight className="w-3 h-3 mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-serif font-semibold mb-6">Nos Piliers</h3>
              <ul className="space-y-3 text-sm">
                <li>Architecture & Design</li>
                <li>Génie Civil & Construction</li>
                <li>Événementiel Premium</li>
                <li>Commerce & Fourniture</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-serif font-semibold mb-6">Contact</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <span>{info?.address || "Immeuble Horizon"}<br />{info?.city || "Abidjan"}, {info?.country || "Côte d'Ivoire"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href={`tel:${info?.phone || ""}`} className="hover:text-white">{info?.phone || "+225 27 22 49 50 00"}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href={`mailto:${info?.email || ""}`} className="hover:text-white break-all">{info?.email || "contact@buildvision.ci"}</a>
                </li>
              </ul>
              <div className="flex gap-2 mt-6">
                {info?.facebook && <a href={info.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-primary flex items-center justify-center transition-colors"><Facebook className="w-3.5 h-3.5" /></a>}
                {info?.instagram && <a href={info.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-primary flex items-center justify-center transition-colors"><Instagram className="w-3.5 h-3.5" /></a>}
                {info?.linkedin && <a href={info.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-primary flex items-center justify-center transition-colors"><Linkedin className="w-3.5 h-3.5" /></a>}
                {info?.twitter && <a href={info.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-primary flex items-center justify-center transition-colors"><Twitter className="w-3.5 h-3.5" /></a>}
                {info?.youtube && <a href={info.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-primary flex items-center justify-center transition-colors"><Youtube className="w-3.5 h-3.5" /></a>}
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} BuildVision Group & JR Service. Tous droits réservés.</p>
            <div className="flex gap-4">
              <Link href="/admin/login"><span className="hover:text-white cursor-pointer">Accès Admin</span></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
