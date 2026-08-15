import { useEffect, useRef, useState } from "react";
import { SectionCta, TEL } from "./SectionCta";

/**
 * Le déroulé d'un chantier, scrubbé au scroll : la section fait plusieurs
 * écrans de haut, son contenu est collé, et l'avancement du scroll fait
 * défiler les quatre étapes de l'objet social — conseil, audit, montage,
 * réalisation. Même principe que la section « L'atelier » : une seule boucle
 * rAF qui écrit directement dans les styles, sans re-render par frame.
 */

const STEPS = [
  {
    n: "01",
    key: "L’appel",
    title: "Vous décrivez, on écoute",
    // Le délai de réponse moyen de 5 min est celui affiché sur le profil
    // AlloVoisins d'Aurélien Van Moer. TODO CLIENT : confirmer les 3 autres.
    delay: "Réponse en 5 min en moyenne",
    body: "Le lieu, ce qui vous gêne, ce que vous voulez pouvoir faire ensuite. À ce stade on ne vend rien — on cherche surtout à savoir si le problème que vous décrivez est bien le problème que vous avez. Il arrive que la réponse tienne en un conseil, et que le déplacement soit inutile.",
    marker: "Le premier contact",
  },
  {
    n: "02",
    key: "La visite",
    title: "On regarde ce qui existe déjà",
    delay: "1 à 2 h sur place",
    body: "On ouvre le tableau, on vérifie la terre, on mesure la puissance disponible, on repère les cheminements exploitables. Et comme le chantier ne s'arrête pas à l'électricité, on regarde aussi ce qui touche à la plomberie ou aux cloisons — c'est souvent là que se cachent les mauvaises surprises d'un devis trop rapide.",
    marker: "L’état des lieux",
  },
  {
    n: "03",
    key: "Le devis",
    title: "On chiffre, ligne par ligne",
    // TODO CLIENT : annoncer un délai chiffré ici (« sous 48 h », « sous 5 jours »)
    // dès qu'Aurélien Van Moer l'aura confirmé — c'est un argument fort.
    delay: "Remis après la visite",
    body: "Un devis ferme, détaillé, fourniture séparée de la pose. Vous pouvez le comparer à un autre sans avoir à deviner ce qui se cache derrière un prix global. Et quand plusieurs métiers entrent en jeu, tout tient sur un seul document au lieu de trois — c'est là qu'on voit ce que la polyvalence fait gagner.",
    marker: "Le prix écrit",
  },
  {
    n: "04",
    key: "Le chantier",
    title: "On pose, on teste, on explique",
    delay: "D’une journée à quelques semaines",
    body: "Pose, raccordement, essais. Chaque départ est repéré, la légende collée dans la porte du tableau. Et à la fin, un tour du propriétaire : ce qui a été fait, où couper en cas de besoin, ce qui reste prévu pour plus tard. Une installation réussie est une installation que vous savez utiliser.",
    marker: "La mise en service",
  },
];

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

export function ProcessSection() {
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const fillRef = useRef<HTMLDivElement>(null);
  const smoothRef = useRef(0);
  const activeRef = useRef(0);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress = clamp(total > 0 ? -rect.top / total : 0);

        // Lissage, sinon les étapes claquent d'une à l'autre sur molette.
        let smooth = smoothRef.current;
        smooth += (progress - smooth) * 0.14;
        if (Math.abs(progress - smooth) < 0.0002) smooth = progress;
        smoothRef.current = smooth;

        const span = 1 / STEPS.length;

        stepRefs.current.forEach((el, i) => {
          if (!el) return;
          // Position de l'étape dans sa propre fenêtre : -1 = pas encore,
          // 0 = pleine page, +1 = déjà passée.
          const local = (smooth - i * span) / span;
          const offset = clamp(local, -1.2, 2.2);

          // Fondu en cloche centré sur le milieu de la fenêtre : pleine
          // opacité au centre, et croisement bref à 25 % au passage d'une
          // étape à l'autre. Une rampe plus large laissait l'étape suivante
          // transparaître derrière l'étape courante.
          const d = Math.abs(offset - 0.5);
          const opacity = clamp((0.55 - d) / 0.2);

          const y = (offset - 0.5) * -90;
          const scale = 1 - Math.min(0.06, Math.abs(offset - 0.5) * 0.07);

          el.style.opacity = String(opacity);
          el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
          el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        });

        if (fillRef.current) {
          fillRef.current.style.transform = `scaleX(${smooth})`;
        }

        const idx = Math.min(STEPS.length - 1, Math.floor(smooth * STEPS.length + 0.001));
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section ref={sectionRef} id="methode" className="process" aria-label="Le déroulé d’un chantier">
      <div className="process-sticky">
        <div className="process-glow" aria-hidden="true" />

        <header className="process-head">
          <span className="process-badge">Le déroulé</span>
          <h2 className="process-title">
            Du premier appel <span className="accent-volt">à la mise en service</span>, en quatre temps.
          </h2>
        </header>

        <div className="process-stage">
          {STEPS.map((step, i) => (
            <article
              key={step.n}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="process-step"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <div className="process-step-num" aria-hidden="true">{step.n}</div>
              <div className="process-step-body">
                <div className="process-step-meta">
                  <span className="process-step-key">{step.key}</span>
                  <span className="process-step-dot" aria-hidden="true" />
                  <span className="process-step-delay">{step.delay}</span>
                </div>
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-text">{step.body}</p>
                <span className="process-step-marker">{step.marker}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="process-rail">
          <ol className="process-ticks">
            {STEPS.map((step, i) => (
              <li key={step.n} className={`process-tick ${i <= active ? "is-done" : ""}`}>
                <span className="process-tick-dot" aria-hidden="true" />
                <span className="process-tick-label">{step.key}</span>
              </li>
            ))}
          </ol>
          <div className="process-bar">
            <div ref={fillRef} className="process-bar-fill" />
          </div>

          <div className="process-cta">
            <SectionCta label="Commencer par l’étape 01" href={`tel:${TEL}`} variant="ghost" />
            <SectionCta label="Demander un devis" href="#contact" />
          </div>
        </div>
      </div>
    </section>
  );
}
