import { useState, useEffect, useRef, FormEvent } from "react";
import FeaturesChess, { FeatureItem } from "./FeaturesChess";
import { TestimonialsSection } from "./TestimonialsSection";
import { FaqSection } from "./FaqSection";
import { X, Sparkles, Check, Cpu, Zap, Eye, Mail, Phone, User, MessageSquare, Send, CheckCircle2, ArrowLeft } from "lucide-react";

const generalContactItem: FeatureItem = {
  id: "contact-general",
  title: "Poser votre question",
  category: "COSELEEC",
  imageUrl: "",
  shortDescription: "Une question, un doute sur l'état de votre installation, ou un projet à chiffrer.",
  longDescription: "Décrivez la situation en quelques lignes : le lieu, ce qui vous pose problème ou ce que vous voulez faire, et le délai que vous avez en tête. Vous serez rappelé pour en parler de vive voix — c'est souvent en cinq minutes de conversation qu'on comprend ce dont un chantier a réellement besoin.",
  benefits: [
    "Visite sur place ou lecture de plans, sans frais",
    "Devis écrit et détaillé poste par poste",
    "Un seul interlocuteur, du premier appel à la mise en service",
  ],
  metrics: [
    { label: "Premier échange", value: "Sans engagement" },
    { label: "Secteur", value: "Tourcoing & métropole" },
  ],
};

export function RanServices() {
  const [activeFeature, setActiveFeature] = useState<FeatureItem | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const stackRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setActiveFeature(null);
    setShowContactForm(false);
    setContactSubmitted(false);
  };

  const handleSelectFeature = (feature: FeatureItem) => {
    setActiveFeature(feature);
    setShowContactForm(false);
    setContactSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: `Bonjour, je souhaite obtenir un devis et des informations concernant : ${feature.title}.`,
    });
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  // Épingle le BAS de la grille des prestations au bas de la fenêtre pendant
  // que la section blanche des avis la recouvre. Un `sticky bottom: 0` ne
  // convient pas : un inset `bottom` n'épingle qu'au défilement vers le haut.
  // D'où ce `top` négatif, égal à (hauteur de fenêtre − hauteur de section),
  // recalculé quand l'une ou l'autre change.
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    const measure = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // `.ran-services-root` applique `overflow-x: clip` et non `hidden` :
  // `hidden` crée un contexte de défilement qui casserait le
  // `position: sticky` de `.stack-under`, donc l'effet de recouvrement.
  return (
    <section className="ran-services ran-services-root relative w-full bg-black text-white selection:bg-white/20 selection:text-white">
      {/* Background ambient lighting gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        {/* Épinglée par le bas : elle se fige pendant que la section blanche
            des avis vient la recouvrir. Le décalage est calculé dans l'effet
            ci-dessus, un `bottom` n'épinglerait pas au défilement descendant. */}
        <div ref={stackRef} className="stack-under">
          <FeaturesChess onAction={handleSelectFeature} />
        </div>

        <TestimonialsSection />

        <FaqSection
          onContactClick={() => {
            setActiveFeature(generalContactItem);
            setShowContactForm(true);
            setContactSubmitted(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              message: "Bonjour, je souhaite vous poser une question à propos de travaux chez moi.",
            });
          }}
        />
      </div>

      {/* Interactive detail / contact modal */}
      {activeFeature && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[200] flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-fade-in">
          <div className="liquid-glass-strong rounded-3xl max-w-2xl w-full p-6 md:p-8 relative border border-white/10 shadow-2xl shadow-sky-500/10 my-auto">
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all cursor-pointer z-20"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2 text-sky-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-body font-semibold uppercase tracking-widest">
                  {activeFeature.category}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-heading italic text-white tracking-tight leading-none mt-1">
                {activeFeature.title}
              </h3>
            </div>

            {!showContactForm ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] text-white/40 font-body uppercase tracking-wider block">
                    Comment ça se passe
                  </span>
                  <p className="text-sm md:text-base font-body text-white/90 leading-relaxed font-light">
                    {activeFeature.longDescription}
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] text-white/40 font-body uppercase tracking-wider block">
                    Ce que vous y gagnez
                  </span>
                  <ul className="space-y-2.5">
                    {activeFeature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-white/70 font-body">
                        <span className="mt-1 h-4 w-4 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 flex-shrink-0">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  {activeFeature.metrics.map((metric, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider block">
                          {metric.label}
                        </span>
                        <span className="text-lg md:text-xl font-heading italic text-white leading-none font-medium">
                          {metric.value}
                        </span>
                      </div>
                      {idx === 0 ? (
                        <Cpu className="h-5 w-5 text-sky-400/40" />
                      ) : (
                        <Zap className="h-5 w-5 text-sky-400/40" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    onClick={handleClose}
                    className="order-2 sm:order-1 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-body font-medium rounded-xl text-xs transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Fermer
                  </button>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="order-1 sm:order-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-body font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    DEMANDER UN DEVIS
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {!contactSubmitted ? (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        Retour aux détails
                      </button>
                      <span className="text-[10px] text-sky-400 font-mono tracking-wider uppercase">
                        Formulaire de Contact
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/50 font-mono uppercase tracking-wider block">
                          Nom complet
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                            <User className="h-3.5 w-3.5" />
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Votre nom ou entreprise"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-body text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/50 font-mono uppercase tracking-wider block">
                            E-mail
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                              <Mail className="h-3.5 w-3.5" />
                            </span>
                            <input
                              type="email"
                              required
                              placeholder="adresse@mail.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-body text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-white/50 font-mono uppercase tracking-wider block">
                            Téléphone
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                              <Phone className="h-3.5 w-3.5" />
                            </span>
                            <input
                              type="tel"
                              placeholder="06 12 34 56 78"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-body text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/50 font-mono uppercase tracking-wider block">
                          Message
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3 text-white/30">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </span>
                          <textarea
                            required
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-body text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-body font-medium rounded-xl text-xs transition-colors border border-white/10 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-body font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-sky-600/20 flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Confirmer l'envoi
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8 px-4 space-y-4">
                    <div className="inline-flex h-12 w-12 rounded-full bg-sky-500/10 border border-sky-500/30 items-center justify-center text-sky-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-heading italic text-white">C’est envoyé.</h4>
                      <p className="text-xs font-body text-white/60 leading-relaxed max-w-sm mx-auto">
                        Merci <span className="text-sky-400 font-medium">{formData.name}</span>. Votre demande concernant <span className="text-sky-400 font-medium">« {activeFeature.title} »</span> est bien arrivée. Vous serez rappelé pour en parler de vive voix.
                      </p>
                    </div>
                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setContactSubmitted(false);
                          setShowContactForm(false);
                        }}
                        className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white font-body font-medium rounded-xl text-xs transition-colors border border-white/10 cursor-pointer"
                      >
                        Retour aux détails
                      </button>
                      <button
                        onClick={handleClose}
                        className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-body font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Quitter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
