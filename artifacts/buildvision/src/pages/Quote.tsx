import { useState } from "react";
import { Link } from "wouter";
import { useCreateQuoteRequest } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, ArrowRight } from "lucide-react";

const PROJECT_TYPES = ["Architecture", "Construction & Génie civil", "Événementiel", "Commerce & Fournitures", "Autre"];
const BUDGETS = ["Moins de 5M FCFA", "5 - 25M FCFA", "25 - 100M FCFA", "Plus de 100M FCFA", "À définir"];

export default function Quote() {
  const create = useCreateQuoteRequest();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", projectType: "", budget: "", description: "" });
  const [doneId, setDoneId] = useState<number | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({ data: form }, { onSuccess: (data: any) => setDoneId(data?.id ?? 0) });
  };

  if (doneId !== null) {
    return (
      <div className="w-full pt-20 min-h-screen bg-zinc-50">
        <div className="container mx-auto px-4 md:px-6 py-24 max-w-2xl">
          <div className="bg-white border border-emerald-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="inline-flex w-20 h-20 rounded-full bg-emerald-100 items-center justify-center text-emerald-700 mb-6"><CheckCircle2 className="w-10 h-10" /></div>
            <h1 className="text-3xl font-serif font-bold mb-4 text-zinc-900">Demande envoyée</h1>
            <p className="text-zinc-600 mb-2">Votre demande de devis a bien été enregistrée.</p>
            {doneId > 0 && <p className="text-sm text-zinc-500 mb-8">Référence : <span className="font-mono font-bold text-primary">DEV-{String(doneId).padStart(5, "0")}</span></p>}
            <p className="text-sm text-zinc-600 mb-8">Nos équipes étudient votre projet et reviennent vers vous sous <span className="font-bold">48 heures</span>.</p>
            <Link href="/"><Button size="lg">Retour à l'accueil <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-20">
      <section className="bg-zinc-950 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">Devis Express</div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 max-w-3xl">Décrivez votre projet, nous chiffrons.</h1>
          <p className="text-lg text-zinc-300 max-w-2xl">Réponse argumentée sous 48 heures par un chef de projet dédié.</p>
        </div>
      </section>

      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-100">
              <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Étape 1</div>
              <h2 className="text-xl font-serif font-bold mb-6 text-zinc-900">Vos coordonnées</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2"><Label>Nom complet *</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email *</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>Téléphone *</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="space-y-2"><Label>Société *</Label><Input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
              </div>
            </div>

            <div className="p-8">
              <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Étape 2</div>
              <h2 className="text-xl font-serif font-bold mb-6 text-zinc-900">Votre projet</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-2">
                  <Label>Type de projet *</Label>
                  <Select required value={form.projectType} onValueChange={(v) => setForm({ ...form, projectType: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                    <SelectContent>{PROJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget estimatif *</Label>
                  <Select required value={form.budget} onValueChange={(v) => setForm({ ...form, budget: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                    <SelectContent>{BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description du projet *</Label>
                <Textarea required rows={6} placeholder="Localisation, surface, échéances, contraintes particulières…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-xs text-zinc-500">En soumettant ce formulaire, vous acceptez d'être recontacté sous 48h.</p>
              <Button type="submit" size="lg" className="font-semibold" disabled={create.isPending}>{create.isPending ? "Envoi…" : "Envoyer ma demande"}</Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
