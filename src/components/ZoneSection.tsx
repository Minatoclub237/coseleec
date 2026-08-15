import { useEffect, useRef, useState } from "react";
import { SectionCta, TEL } from "./SectionCta";

/**
 * Zone d'intervention en carte-radar. Les coordonnées sont projetées depuis
 * les vraies latitudes/longitudes (équirectangulaire centrée sur Tourcoing,
 * 50.735 N / 3.170 E — l'adresse du siège), x = (lon - lon0) * cos(lat0),
 * donc les positions relatives et les distances affichées sont exactes. Le
 * scroll fait grandir les cercles et allume les communes de la plus proche à
 * la plus lointaine.
 */

type Anchor = "start" | "middle" | "end";
type Town = {
  name: string; x: number; y: number; km: number; near: boolean;
  /** Décalage de l'étiquette, réglé à la main : autour de Tourcoing les
   *  communes sont trop serrées pour qu'un placement automatique reste
   *  lisible. */
  lx: number; ly: number; anchor: Anchor;
};

// Projetées à l'échelle 1050 px/degré, centre Tourcoing (300, 300) sur un
// viewBox 600x600. cos(50.735°) = 0.6329.
const TOWNS: Town[] = [
  { name: "Neuville-en-Ferrain", x: 294.1, y: 281.9, km: 2, near: true, lx: 12, ly: -6, anchor: "start" },
  { name: "Mouvaux", x: 278.6, y: 331.2, km: 4, near: true, lx: -13, ly: 5, anchor: "end" },
  { name: "Roncq", x: 265.8, y: 281.9, km: 4, near: true, lx: -13, ly: 0, anchor: "end" },
  { name: "Roubaix", x: 302.9, y: 342.8, km: 5, near: true, lx: 13, ly: 5, anchor: "start" },
  { name: "Wattrelos", x: 331.0, y: 336.4, km: 5, near: true, lx: 13, ly: -6, anchor: "start" },
  { name: "Halluin", x: 270.8, y: 246.0, km: 6, near: true, lx: 0, ly: -14, anchor: "middle" },
  { name: "Croix", x: 286.3, y: 359.2, km: 6, near: true, lx: 6, ly: 19, anchor: "start" },
  { name: "Marcq-en-Barœul", x: 251.1, y: 363.8, km: 8, near: true, lx: -13, ly: 5, anchor: "end" },
  { name: "Villeneuve-d’Ascq", x: 283.0, y: 417.0, km: 12, near: false, lx: 13, ly: 5, anchor: "start" },
  { name: "Lille", x: 224.9, y: 411.1, km: 14, near: false, lx: -13, ly: 5, anchor: "end" },
];

// 1050 px/degré, 111 km/degré  ->  9.46 px/km
const PX_PER_KM = 1050 / 111;
const RINGS = [5, 10, 20];

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

export function ZoneSection() {
  const [lit, setLit] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const ringRefs = useRef<Array<SVGCircleElement | null>>([]);
  const townRefs = useRef<Array<SVGGElement | null>>([]);
  const smoothRef = useRef(0);
  const litRef = useRef(0);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress = clamp(total > 0 ? -rect.top / total : 0);

        let smooth = smoothRef.current;
        smooth += (progress - smooth) * 0.12;
        if (Math.abs(progress - smooth) < 0.0002) smooth = progress;
        smoothRef.current = smooth;

        // Les cercles s'ouvrent sur le premier tiers du défilement.
        const ringP = clamp(smooth / 0.34);
        ringRefs.current.forEach((c, i) => {
          if (!c) return;
          const p = clamp((ringP - i * 0.18) / 0.55);
          c.style.transform = `scale(${0.2 + 0.8 * p})`;
          c.style.opacity = String(p * 0.9);
        });

        // Puis les communes s'allument, de la plus proche à la plus lointaine.
        const townP = clamp((smooth - 0.16) / 0.72);
        let count = 0;
        townRefs.current.forEach((g, i) => {
          if (!g) return;
          const threshold = i / TOWNS.length;
          const p = clamp((townP - threshold) / (1 / TOWNS.length) / 0.9);
          g.style.opacity = String(p);
          g.style.transform = `translate3d(0, ${(1 - p) * 8}px, 0)`;
          if (p > 0.6) count++;
        });

        if (count !== litRef.current) {
          litRef.current = count;
          setLit(count);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section ref={sectionRef} id="zone" className="zone" aria-label="Zone d’intervention">
      <div className="zone-sticky">
        <div className="zone-inner">
          <div className="zone-copy">
            <span className="zone-badge">Zone d’intervention</span>
            <h2 className="zone-title">
              Basé à Tourcoing, <span className="accent-volt">et pas très loin de chez vous.</span>
            </h2>
            <p className="zone-text">
              Le secteur habituel couvre Tourcoing, Roubaix et les communes du nord de la métropole
              lilloise, sans supplément de déplacement. Au-delà, cela dépend de la durée du
              chantier&nbsp;: un dépannage d’une heure à trente kilomètres n’a pas de sens, une
              rénovation de trois semaines, si.
            </p>

            <div className="zone-counter">
              <span className="zone-counter-num">{String(lit).padStart(2, "0")}</span>
              <span className="zone-counter-label">
                communes couvertes<br />dans un rayon de 15 km
              </span>
            </div>

            <ul className="zone-list">
              {TOWNS.map((t, i) => (
                <li key={t.name} className={`zone-list-item ${i < lit ? "is-lit" : ""}`}>
                  <span className="zone-list-name">{t.name}</span>
                  <span className="zone-list-km">{t.km} km</span>
                </li>
              ))}
            </ul>

            <div className="zone-cta">
              <SectionCta label="Vérifier votre commune" href={`tel:${TEL}`} variant="ghost" />
              <SectionCta label="Demander un devis" href="#contact" />
            </div>
          </div>

          <div className="zone-map">
            <svg viewBox="0 0 600 600" role="img" aria-label="Carte des communes desservies autour de Tourcoing">
              <defs>
                <radialGradient id="zoneCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2ea3f2" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2ea3f2" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="zoneSea" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#8fa3bb" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#8fa3bb" stopOpacity="0.015" />
                </linearGradient>
              </defs>

              {/* La Belgique, au nord et à l'est : Tourcoing est frontalière.
                  Tracé stylisé suivant la Lys puis la frontière vers Mouscron. */}
              <path className="zone-sea" d="M 0 232 L 227 242 L 273 237 L 333 290 L 353 326 L 373 379 L 600 430 L 600 0 L 0 0 Z" fill="url(#zoneSea)" />
              <text className="zone-sea-label" x="455" y="150" transform="rotate(-14 455 150)">BELGIQUE</text>

              <circle cx="300" cy="300" r="120" fill="url(#zoneCore)" />

              {RINGS.map((km, i) => (
                <circle
                  key={km}
                  ref={(el) => { ringRefs.current[i] = el; }}
                  className="zone-ring"
                  cx="300"
                  cy="300"
                  r={km * PX_PER_KM}
                  style={{ transformOrigin: "300px 300px", opacity: 0 }}
                />
              ))}

              {TOWNS.map((t, i) => (
                <g
                  key={t.name}
                  ref={(el) => { townRefs.current[i] = el; }}
                  className={`zone-town ${t.near ? "is-near" : "is-far"}`}
                  style={{ opacity: 0 }}
                >
                  <line className="zone-town-link" x1="300" y1="300" x2={t.x} y2={t.y} />
                  <circle className="zone-town-dot" cx={t.x} cy={t.y} r={t.near ? 5 : 4} />
                  <text
                    className="zone-town-label"
                    x={t.x + t.lx}
                    y={t.y + t.ly}
                    textAnchor={t.anchor}
                  >
                    {t.name}
                  </text>
                </g>
              ))}

              {/* Tourcoing, le point d'origine */}
              <g className="zone-home">
                <circle className="zone-home-halo" cx="300" cy="300" r="16" />
                <circle className="zone-home-dot" cx="300" cy="300" r="7" />
                <text className="zone-home-label" x="283" y="305" textAnchor="end">TOURCOING</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
