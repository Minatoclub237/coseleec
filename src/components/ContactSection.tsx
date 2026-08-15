import { useState, FormEvent } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, ArrowUpRight, Clock } from "lucide-react";
import { MAIL, TEL_DISPLAY, HOURS_SHORT } from "./SectionCta";

// Adresse et identité légale : registre du commerce (SIREN 901 349 472).
// Téléphone, e-mail et horaires : fiche Google « Coseleec + service ».
const CONTACT = {
  email: MAIL,
  phone: TEL_DISPLAY,
  address: "15 rue Edouard Lalo, 59200 Tourcoing",
  hours: HOURS_SHORT,
};

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputClass =
    "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm font-body text-white placeholder-white/30 outline-none transition-colors focus:border-sky-400/60 focus:bg-white/[0.06]";

  return (
    <section id="contact" className="contact-section relative w-full overflow-hidden py-24 sm:py-28 px-6 md:px-16 lg:px-24">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-sky-600/20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[380px] w-[380px] translate-x-1/2 rounded-full bg-sky-600/15 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-600/10 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-xs text-white/80 font-body backdrop-blur mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.95]">
            Dites-nous <span className="accent-volt">ce que vous avez en tête.</span>
          </h2>
          <p className="mt-5 text-white/55 font-body font-light text-sm md:text-base leading-relaxed">
            Une pièce à refaire, un tableau à reprendre, une panne qui revient&nbsp;: on en parle, on vient voir, et vous recevez un devis détaillé. Sans frais, sans engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-8 items-stretch">
          {/* ── Left: contact info ── */}
          <div className="contact-card relative overflow-hidden rounded-3xl p-8 md:p-10 flex flex-col justify-between">
            <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-none">
                COSELEEC
              </h3>
              <p className="mt-4 text-sm md:text-[15px] text-white/70 font-body font-light leading-relaxed max-w-sm">
                Électricité générale tertiaire et industrielle à Tourcoing et dans la métropole lilloise. Particuliers, bureaux, commerces, ERP, syndics et ateliers. 4,9/5 sur 40 avis Google.
              </p>

              <div className="mt-9 space-y-5">
                <a href={`mailto:${CONTACT.email}`} className="group flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-sky-300 transition-colors group-hover:bg-white/10">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-body text-white/80 group-hover:text-white transition-colors">{CONTACT.email}</span>
                </a>
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-sky-300">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-body text-white/80">{CONTACT.address}</span>
                </div>
                <a href={`tel:${CONTACT.phone.replace(/[^+0-9]/g, "")}`} className="group flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-sky-300 transition-colors group-hover:bg-white/10">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-body text-white/80 group-hover:text-white transition-colors">{CONTACT.phone}</span>
                </a>
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-sky-300">
                    <Clock className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-body text-white/80">{CONTACT.hours}</span>
                </div>
              </div>
            </div>

            <div className="relative mt-10 flex items-center gap-2 text-xs text-white/40 font-body">
              <span className="h-px flex-1 bg-white/10" />
              <span>Entreprise individuelle · SIREN 901 349 472 · Tourcoing depuis 2021</span>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="contact-card relative overflow-hidden rounded-3xl p-8 md:p-10">
            <div className="pointer-events-none absolute -top-20 -right-10 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />
            {!sent ? (
              <form onSubmit={submit} className="relative space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-white/45 font-body">Votre nom *</label>
                    <input required type="text" placeholder="Nom ou entreprise" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-white/45 font-body">E-mail *</label>
                    <input required type="email" placeholder="adresse@mail.com" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-white/45 font-body">Téléphone (optionnel)</label>
                  <input type="tel" placeholder="06 12 34 56 78" value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-white/45 font-body">Votre message *</label>
                  <textarea required rows={4} placeholder="Le lieu, ce que vous voulez faire, et le délai que vous avez en tête…" value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} />
                </div>
                <button type="submit"
                  className="contact-send group relative w-full overflow-hidden rounded-xl px-6 py-3.5 text-sm font-body font-semibold text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.99]">
                  <span className="relative z-10 flex items-center gap-2">
                    Envoyer le message
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
                <p className="text-center text-[11px] text-white/35 font-body pt-1">
                  En envoyant ce formulaire, vous acceptez d'être recontacté par COSELEEC.
                </p>
              </form>
            ) : (
              <div className="relative flex flex-col items-center justify-center text-center py-14 px-4 gap-4 min-h-[360px]">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-heading italic text-white">C’est envoyé.</h3>
                <p className="text-sm text-white/60 font-body font-light max-w-xs leading-relaxed">
                  Merci <span className="text-sky-300">{form.name || "à vous"}</span>. Votre message est bien arrivé. Vous serez rappelé pour en parler de vive voix.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", company: "", message: "" }); }}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-body text-white/70 hover:text-white transition-colors">
                  Envoyer une autre demande <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
