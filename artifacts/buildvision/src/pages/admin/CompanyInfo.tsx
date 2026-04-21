import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCompanyInfo, useUpdateCompanyInfo, getGetCompanyInfoQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function AdminCompanyInfo() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: info } = useGetCompanyInfo();
  const update = useUpdateCompanyInfo();
  const [form, setForm] = useState<any>(null);

  useEffect(() => { if (info && !form) setForm(info); }, [info, form]);

  if (!form) return <div className="p-8 text-zinc-500">Chargement…</div>;

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { id, updatedAt, ...payload } = form;
    update.mutate({ data: payload }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getGetCompanyInfoQueryKey() }); toast({ title: "Informations enregistrées" }); },
      onError: () => toast({ title: "Erreur lors de l'enregistrement", variant: "destructive" }),
    });
  };

  return (
    <div>
      <AdminPageHeader title="Informations entreprise" subtitle={`Dernière modification : ${form.updatedAt ? new Date(form.updatedAt).toLocaleString("fr-FR") : "—"}`} />
      <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
        <Card className="p-6 space-y-4">
          <h2 className="font-serif text-lg font-bold">Identité</h2>
          <div className="space-y-2"><Label>Nom de l'entreprise</Label><Input required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="space-y-2"><Label>Slogan</Label><Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></div>
          <div className="space-y-2"><Label>À propos</Label><Textarea rows={4} value={form.about} onChange={(e) => set("about", e.target.value)} /></div>
          <div className="space-y-2"><Label>Logo (URL)</Label><Input value={form.logo || ""} onChange={(e) => set("logo", e.target.value)} /></div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-serif text-lg font-bold">Mission & Vision</h2>
          <div className="space-y-2"><Label>Mission</Label><Textarea rows={3} value={form.mission} onChange={(e) => set("mission", e.target.value)} /></div>
          <div className="space-y-2"><Label>Vision</Label><Textarea rows={3} value={form.vision} onChange={(e) => set("vision", e.target.value)} /></div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-serif text-lg font-bold">Coordonnées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div className="space-y-2"><Label>Téléphone</Label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div className="space-y-2"><Label>WhatsApp</Label><Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+225..." /></div>
            <div className="space-y-2"><Label>Horaires</Label><Input value={form.hours} onChange={(e) => set("hours", e.target.value)} /></div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-serif text-lg font-bold">Adresse</h2>
          <div className="space-y-2"><Label>Adresse</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Ville</Label><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
            <div className="space-y-2"><Label>Pays</Label><Input value={form.country} onChange={(e) => set("country", e.target.value)} /></div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-serif text-lg font-bold">Réseaux sociaux</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Facebook</Label><Input value={form.facebook || ""} onChange={(e) => set("facebook", e.target.value)} /></div>
            <div className="space-y-2"><Label>Instagram</Label><Input value={form.instagram || ""} onChange={(e) => set("instagram", e.target.value)} /></div>
            <div className="space-y-2"><Label>LinkedIn</Label><Input value={form.linkedin || ""} onChange={(e) => set("linkedin", e.target.value)} /></div>
            <div className="space-y-2"><Label>Twitter</Label><Input value={form.twitter || ""} onChange={(e) => set("twitter", e.target.value)} /></div>
            <div className="space-y-2 md:col-span-2"><Label>YouTube</Label><Input value={form.youtube || ""} onChange={(e) => set("youtube", e.target.value)} /></div>
          </div>
        </Card>

        <div className="sticky bottom-4 bg-white border border-zinc-200 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div className="text-sm text-zinc-500">Enregistrez pour appliquer les modifications sur tout le site.</div>
          <Button type="submit" disabled={update.isPending}><Save className="w-4 h-4 mr-2" /> {update.isPending ? "Enregistrement…" : "Enregistrer"}</Button>
        </div>
      </form>
    </div>
  );
}
