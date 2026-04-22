import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Briefcase, 
  HardHat, 
  Users, 
  Calendar, 
  ShoppingCart, 
  FileText, 
  Handshake, 
  MessageSquareQuote,
  MessageSquare,
  Building2,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setLocation("/admin/login");
    }
  }, [location, setLocation]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setLocation("/admin/login");
  };

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Hero Slider", href: "/admin/hero", icon: ImageIcon },
    { label: "Projets", href: "/admin/projects", icon: Briefcase },
    { label: "Services", href: "/admin/services", icon: HardHat },
    { label: "Équipe", href: "/admin/team", icon: Users },
    { label: "Événements", href: "/admin/events", icon: Calendar },
    { label: "Commerce", href: "/admin/commerce", icon: ShoppingCart },
    { label: "Blog", href: "/admin/blog", icon: FileText },
    { label: "Partenaires", href: "/admin/partners", icon: Handshake },
    { label: "Témoignages", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "Devis", href: "/admin/quotes", icon: FileText },
    { label: "Commandes", href: "/admin/orders", icon: ShoppingCart },
    { label: "Messages", href: "/admin/contact", icon: MessageSquare },
    { label: "Informations entreprise", href: "/admin/company", icon: Building2 },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 text-white flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="font-serif font-bold text-lg">BuildVision Admin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href || (location.startsWith(link.href) && link.href !== "/admin");
              return (
                <Link key={link.href} href={link.href}>
                  <div className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                    isActive ? "bg-primary text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800 space-y-3">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Aller au site
            </Button>
          </Link>
          <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
