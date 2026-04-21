import { useState } from "react";
import { useCreateContactMessage, useGetCompanyInfo } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle2, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export default function Contact() {
  const { data: info } = useGetCompanyInfo();
  const create = useCreateContactMessage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate(
      { data: form },
      { onSuccess: () => setDone(true) }
    );
  };

  const waNumber = (info?.whatsapp || "").replace(/[^\d]/g, "");

  return (
    <div className="w-full pt-20">
      <section className="bg-zinc-950 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">Contact</div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 max-w-3xl">Parlons de votre projet.</h1>
          <p className="text-lg text-zinc-300 max-w-2xl">Notre équipe répond sous 24 heures à toute demande. Pour les urgences chantier, privilégiez WhatsApp.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {done ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-12 text-center">
                <div className="inline-flex w-16 h-16 rounded-full bg-emerald-100 items-center justify-center text-emerald-700 mb-4"><CheckCircle2 className="w-8 h-8" /></div>
                <h2 className="text-2xl font-serif font-bold mb-2 text-emerald-900">Message reçu</h2>
                <p className="text-emerald-800 mb-6">Nous revenons vers vous sous 24 heures.</p>
                <Button variant="outline" onClick={() => { setDone(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}>Envoyer un autre message</Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="bg-white border border-zinc-100 rounded-xl p-8 shadow-sm space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2"><Label>Nom complet *</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Email *</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Téléphone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="space-y-2"><Label>Sujet *</Label><Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
                <div className="space-y-2"><Label>Message *</Label><Textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={create.isPending}>{create.isPending ? "Envoi…" : "Envoyer le message"}</Button>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-zinc-950 text-white rounded-xl p-8">
              <h3 className="font-serif text-xl font-bold mb-6">Coordonnées</h3>
              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" /><div><div className="font-medium text-white">{info?.address || "Immeuble Horizon"}</div><div className="text-zinc-400">{info?.city}, {info?.country}</div></div></li>
                <li className="flex items-start gap-3"><Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" /><a href={`tel:${info?.phone || ""}`} className="hover:text-primary">{info?.phone || "+225 27 22 49 50 00"}</a></li>
                <li className="flex items-start gap-3"><Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" /><a href={`mailto:${info?.email || ""}`} className="hover:text-primary break-all">{info?.email || "contact@buildvision.ci"}</a></li>
                <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>{info?.hours || "Lun - Ven : 8h - 18h"}</span></li>
              </ul>
            </div>

            {waNumber && (
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="block bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-6 transition-colors">
                <div className="flex items-center gap-4">
                  <MessageCircle className="w-10 h-10" />
                  <div>
                    <div className="font-serif text-lg font-bold">WhatsApp</div>
                    <div className="text-sm text-emerald-100">Discutez directement avec nous</div>
                  </div>
                </div>
              </a>
            )}

            <div className="bg-zinc-50 rounded-xl p-6">
              <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Suivez-nous</div>
              <div className="flex gap-2">
                {info?.facebook && <a href={info.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-colors"><Facebook className="w-4 h-4" /></a>}
                {info?.instagram && <a href={info.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-colors"><Instagram className="w-4 h-4" /></a>}
                {info?.linkedin && <a href={info.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-colors"><Linkedin className="w-4 h-4" /></a>}
                {info?.twitter && <a href={info.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-colors"><Twitter className="w-4 h-4" /></a>}
                {info?.youtube && <a href={info.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-colors"><Youtube className="w-4 h-4" /></a>}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container mx-auto px-4 md:px-6 relative text-center">
          <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
          <div className="font-serif text-2xl font-bold mb-2">{info?.address || "Immeuble Horizon, Boulevard Lagunaire"}</div>
          <div className="text-zinc-400">{info?.city}, {info?.country}</div>
        </div>
      </section>
    </div>
  );
}
