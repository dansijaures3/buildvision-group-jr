import { Link } from "wouter";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
} from "recharts";
import { Briefcase, Activity, Inbox, MessageSquare, Calendar, Wrench, Users, FileText, ArrowRight, Building2 } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  nouveau: "bg-blue-100 text-blue-800",
  en_cours: "bg-amber-100 text-amber-800",
  accepte: "bg-emerald-100 text-emerald-800",
  refuse: "bg-rose-100 text-rose-800",
  cloture: "bg-zinc-200 text-zinc-700",
};

export default function AdminDashboard() {
  const { data: stats } = useGetDashboardStats();

  const cards = [
    { label: "Projets total", value: stats?.totalProjects ?? 0, icon: Briefcase, accent: "bg-primary/10 text-primary" },
    { label: "Chantiers actifs", value: stats?.activeProjects ?? 0, icon: Activity, accent: "bg-emerald-100 text-emerald-700" },
    { label: "Devis en attente", value: stats?.pendingQuotes ?? 0, icon: Inbox, accent: "bg-amber-100 text-amber-700" },
    { label: "Messages reçus", value: stats?.totalContactMessages ?? 0, icon: MessageSquare, accent: "bg-violet-100 text-violet-700" },
  ];
  const secondary = [
    { label: "Événements", value: stats?.totalEvents ?? 0, icon: Calendar },
    { label: "Services", value: stats?.totalServices ?? 0, icon: Wrench },
    { label: "Membres équipe", value: stats?.totalTeamMembers ?? 0, icon: Users },
    { label: "Devis total", value: stats?.totalQuotes ?? 0, icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif font-bold text-zinc-900">Tableau de bord</h1>
        <p className="text-sm text-zinc-500 mt-1">Vue d'ensemble de l'activité de BuildVision Group & JR Service.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-6">
            <div className={`w-11 h-11 rounded-lg ${c.accent} flex items-center justify-center mb-4`}><c.icon className="w-5 h-5" /></div>
            <div className="text-3xl font-serif font-bold text-zinc-900">{c.value}</div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">{c.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondary.map((c) => (
          <Card key={c.label} className="p-5 flex items-center gap-4">
            <c.icon className="w-5 h-5 text-zinc-400" />
            <div>
              <div className="text-2xl font-serif font-bold">{c.value}</div>
              <div className="text-[11px] uppercase tracking-widest text-zinc-500">{c.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-lg font-bold">Projets par catégorie</h2>
            <Link href="/admin/projects"><Button variant="ghost" size="sm">Gérer <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.projectsByCategory ?? []}>
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {(stats?.projectsByCategory ?? []).map((_, i) => (
                    <Cell key={i} fill={["hsl(215 100% 40%)", "hsl(215 80% 60%)", "hsl(220 10% 40%)", "hsl(220 10% 60%)"][i % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-bold">Devis récents</h2>
            <Link href="/admin/quotes"><Button variant="ghost" size="sm">Tous <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
          </div>
          <ul className="divide-y divide-zinc-100">
            {(stats?.recentQuotes ?? []).slice(0, 5).map((q) => (
              <li key={q.id} className="py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-sm truncate">{q.name}</div>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_COLORS[q.status] || "bg-zinc-100"}`}>{q.status}</span>
                </div>
                <div className="text-xs text-zinc-500 truncate">{q.projectType} · {q.budget}</div>
              </li>
            ))}
            {!stats?.recentQuotes?.length && <li className="py-6 text-center text-sm text-zinc-400">Aucun devis récent</li>}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction to="/admin/hero" icon={<Building2 className="w-5 h-5" />} label="Hero slider" />
        <QuickAction to="/admin/projects" icon={<Briefcase className="w-5 h-5" />} label="Projets" />
        <QuickAction to="/admin/quotes" icon={<Inbox className="w-5 h-5" />} label="Devis" />
        <QuickAction to="/admin/company" icon={<Building2 className="w-5 h-5" />} label="Entreprise" />
      </div>
    </div>
  );
}

function QuickAction({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={to}>
      <Card className="p-5 cursor-pointer hover:shadow-md hover:border-primary transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
            <div className="font-medium text-sm">{label}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400" />
        </div>
      </Card>
    </Link>
  );
}
