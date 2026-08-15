import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { TEL, TEL_DISPLAY, MAIL } from "./SectionCta";

// Les liens de colonnes pointent vers les ancres réelles de la page ; les
// prestations ouvrent la grille, qui contient déjà le détail de chacune.
const COLUMNS = [
  {
    title: "Prestations",
    href: "#realisations",
    links: ["Électricité tertiaire", "Électricité industrielle", "Diagnostic & maintenance", "Mise en sécurité des locaux", "Second œuvre & bricolage", "Plomberie & dégât des eaux", "Menuiserie & pose de cuisine"],
  },
  {
    title: "L'entreprise",
    href: "#apropos",
    links: ["L'atelier", "Notre méthode", "FAQ", "Demander un devis"],
  },
  {
    title: "Zone d'intervention",
    href: "#zone",
    links: ["Tourcoing", "Roubaix", "Wattrelos", "Mouvaux", "Lille"],
  },
];

// TODO CLIENT : aucun réseau social public n'a été trouvé pour Coseleec.
// Renseigner les URL réelles ou supprimer ce bloc avant mise en ligne.
const SOCIALS = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="site-footer relative w-full overflow-hidden border-t border-white/10 px-6 md:px-16 lg:px-24 pt-16 pb-8">
      <div className="pointer-events-none absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-8">
          {/* Brand */}
          <div className="space-y-5">
            <a href="#hero-section" onClick={(e) => { e.preventDefault(); document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="flex items-center gap-2.5 w-fit group">
              {/* Logo fourni par le client. Son fond est noir : sur le footer,
                  également sombre, il se fond sans détourage. C'est pour ça
                  qu'il n'est utilisé QUE là — sur la navbar, posée sur une
                  photo claire, le carré noir se verrait. */}
              <img
                src="/logo-coseleec.webp"
                alt="COSELEEC — électricien à Tourcoing"
                width={520}
                height={469}
                decoding="async"
                className="footer-logo transition-transform group-hover:-translate-y-0.5"
              />
            </a>
            <p className="text-sm text-white/55 font-body font-light leading-relaxed max-w-xs">
              Aurélien Van Moer, électricien à Tourcoing depuis 2021. Tertiaire, industrie et logement, courants forts et faibles — un seul artisan sur le chantier. 4,9/5 sur 40 avis Google.
            </p>
            <div className="space-y-2.5 pt-1">
              {/* Coordonnées réelles, centralisées dans SectionCta.tsx. */}
              <a href={`mailto:${MAIL}`} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors font-body">
                <Mail className="h-3.5 w-3.5 text-sky-300" /> {MAIL}
              </a>
              <a href={`tel:${TEL}`} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors font-body">
                <Phone className="h-3.5 w-3.5 text-sky-300" /> {TEL_DISPLAY}
              </a>
              <span className="flex items-center gap-2.5 text-sm text-white/60 font-body">
                <MapPin className="h-3.5 w-3.5 text-sky-300" /> 15 rue Edouard Lalo, 59200 Tourcoing
              </span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              {SOCIALS.map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs uppercase tracking-widest text-white/40 font-body font-medium mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={col.href}
                      onClick={(e) => { e.preventDefault(); document.getElementById(col.href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                      className="text-sm text-white/60 hover:text-white transition-colors font-body"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 font-body">© 2026 COSELEEC — Aurélien Van Moer · SIREN 901 349 472 · SIRET 901 349 472 00018</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors font-body">Mentions légales</a>
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors font-body">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
