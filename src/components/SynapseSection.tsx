import { useEffect, useState, useRef } from "react";
import { ScrambleText } from "./ScrambleText";
import { TelemetryCarousel } from "./TelemetryCarousel";
import { SectionCta } from "./SectionCta";
import { StatCardData } from "../types";

// Portrait d'Aurélien Van Moer, scrubbé au scroll. Encodé avec une keyframe
// toutes les 0,625 s (-g 15) : le navigateur décode au plus 15 images pour
// atteindre une position, c'est ce qui rend le scrub fluide. Sans ça, un GOP
// long oblige à décoder des dizaines d'images par saut et la section saccade.
//
// L'attribut `media` d'un <source> n'est PAS honoré dans <video> (contrairement
// à <picture>) : la variante doit être choisie en JS.
const VIDEO_DESKTOP = "/videos/synapse-portrait.mp4";
const VIDEO_MOBILE = "/videos/synapse-portrait-mobile.mp4";

const pickVideo = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
    ? VIDEO_MOBILE
    : VIDEO_DESKTOP;

// Chiffres volontairement vérifiables : rien qui ne soit pas sourçable
// (registre du commerce, norme applicable, zone d'intervention réelle).
const statsData: StatCardData[] = [
  {
    title: "INSTALLÉ DEPUIS",
    value: "2021",
    footer: "IMMATRICULÉ À TOURCOING LE 3 MAI 2021",
    details: ["Entreprise individuelle", "SIREN 901 349 472", "Aurélien Van Moer, artisan"],
  },
  {
    title: "FORMATION",
    value: "ELEEC",
    footer: "BEP, BAC PRO ET BTS — LE CURSUS COMPLET",
    details: ["Électrotechnique et énergie", "Équipements communicants", "Le métier appris, pas improvisé"],
  },
  {
    title: "AVIS CLIENTS",
    value: "4,9/5",
    footer: "SUR 40 AVIS GOOGLE",
    details: ["« Ponctuel, professionnel, honnête »", "« Aime le travail bien fait »", "+ 4 avis sur AlloVoisins"],
  },
  {
    title: "TERRAINS",
    value: "TROIS",
    footer: "LOGEMENT, TERTIAIRE, INDUSTRIE",
    details: ["Particuliers et copropriétés", "Bureaux, commerces, ERP, syndics", "Machines et réseaux d’atelier"],
  },
  {
    title: "ZONE D'INTERVENTION",
    value: "MEL",
    footer: "TOURCOING, ROUBAIX ET LA MÉTROPOLE LILLOISE",
    details: ["Roubaix, Wattrelos, Mouvaux", "Halluin, Roncq, Neuville-en-Ferrain", "Lille et Villeneuve-d'Ascq"],
  },
  {
    title: "NORME APPLIQUÉE",
    value: "C 15-100",
    footer: "RÉFÉRENTIEL DES INSTALLATIONS BASSE TENSION",
    details: ["Mise aux normes de tableaux anciens", "Protection différentielle et mise à la terre", "Installation prête pour le diagnostic"],
  },
];

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

const SERVICES = [
  "Électricité générale tertiaire : bureaux, commerces, administratif",
  "Électricité industrielle : machines, câblage, réseaux d’atelier",
  "Diagnostic de pannes, dépannage et maintenance",
  "Rénovation totale ou partielle et mise en conformité",
  "Mise en sécurité des locaux : BAES, alarme incendie, ERP",
  "Alimentation d’alarme et de détection intrusion",
  "Fourniture de matériel électrique professionnel",
  "Enseigne, signalétique et travaux polyvalents",
];

export function SynapseSection() {
  const [scrollActive, setScrollActive] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoSrc] = useState(pickVideo);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroDescRef = useRef<HTMLDivElement>(null);
  const cinematicInnerRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);

  const smoothRef = useRef(0);
  const scrollActiveRef = useRef(false);
  const revealedRef = useRef(false);
  const activatedRef = useRef(false);
  const entranceStartRef = useRef(0);
  const isSeekingRef = useRef(false);
  const nextSeekTimeRef = useRef<number | null>(null);

  const handleSeeking = () => {
    isSeekingRef.current = true;
  };
  const handleSeeked = () => {
    isSeekingRef.current = false;
    if (nextSeekTimeRef.current !== null) {
      const t = nextSeekTimeRef.current;
      nextSeekTimeRef.current = null;
      const video = videoRef.current;
      if (video && video.readyState >= 1 && video.duration > 0) {
        isSeekingRef.current = true;
        video.currentTime = t;
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    let cleanupGestures = () => {};

    if (video) {
      video.autoplay = false;
      video.muted = true;
      video.playsInline = true;

      // Scroll-scrubbing sets currentTime on a PAUSED video. Desktop paints
      // seeked frames fine, but mobile browsers (esp. iOS Safari) won't render
      // a video that was never played — so we "prime" it with a brief play/pause.
      // iOS only allows play() inside a user gesture, hence the gesture listeners.
      const prime = () => {
        const pr = video.play();
        if (pr && typeof pr.then === 'function') {
          pr.then(() => video.pause()).catch(() => {});
        } else {
          try { video.pause(); } catch { /* noop */ }
        }
      };

      prime(); // works on desktop + Android (muted autoplay is allowed)

      const onGesture = () => {
        prime();
        cleanupGestures();
      };
      window.addEventListener('touchstart', onGesture, { passive: true });
      window.addEventListener('pointerdown', onGesture);
      window.addEventListener('scroll', onGesture, { passive: true });
      cleanupGestures = () => {
        window.removeEventListener('touchstart', onGesture);
        window.removeEventListener('pointerdown', onGesture);
        window.removeEventListener('scroll', onGesture);
      };
    }

    let rafId = 0;

    // Dimensions du viewport mises en cache : les relire à chaque frame coûte
    // un layout forcé pour rien. Le resize est debouncé car la barre d'URL
    // mobile en émet en rafale pendant le défilement.
    let vh = window.innerHeight;
    let narrow = window.innerWidth <= 768;
    let resizeTimer: number | undefined;
    const measure = () => {
      vh = window.innerHeight;
      narrow = window.innerWidth <= 768;
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 120);
    };
    window.addEventListener("resize", onResize, { passive: true });

    const tick = (now: number) => {
      const section = sectionRef.current;

      if (section) {
        const rect = section.getBoundingClientRect();
        const total = rect.height - vh;
        const rawProgress = total > 0 ? -rect.top / total : 0;
        const progress = clamp(rawProgress);

        // Activate the entrance once the section scrolls into view.
        const inView = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
        if (inView && !activatedRef.current) {
          activatedRef.current = true;
          entranceStartRef.current = now;
        }

        // Smooth the scrub target.
        let smooth = smoothRef.current;
        smooth += (progress - smooth) * 0.12;
        if (Math.abs(progress - smooth) < 0.0001) smooth = progress;
        smoothRef.current = smooth;

        // Un setState par frame déclenche un passage de réconciliation React
        // 60 fois par seconde même quand la valeur ne change pas : on ne
        // notifie que sur bascule réelle.
        const nextActive = progress > 0.05;
        if (nextActive !== scrollActiveRef.current) {
          scrollActiveRef.current = nextActive;
          setScrollActive(nextActive);
        }

        // Entrance zoom / fade-in of the video.
        let entranceZoom = 1.0;
        let entranceOpacity = 1.0;
        if (!activatedRef.current) {
          entranceZoom = 1.1;
          entranceOpacity = 0;
        } else {
          const elapsed = now - entranceStartRef.current;
          const p = Math.min(1, elapsed / 1200);
          const easeOut = 1 - Math.pow(1 - p, 3);
          entranceZoom = 1.1 - 0.1 * easeOut;
          entranceOpacity = Math.min(1, elapsed / 500);
          if (p >= 1 && !videoReady) setVideoReady(true);
        }

        // Scrub styles. Le blur plein écran est de loin le poste le plus cher
        // du moteur : on le plafonne sur téléphone et on repasse à `none` dès
        // qu'il vaut zéro, sinon le compositeur garde le passe coûteux actif.
        const subtleBase = clamp((smooth - 0.05) / 0.45);
        const progressive = clamp((smooth - 0.55) / 0.4);
        const rawBlur = subtleBase * 4 + progressive * 26;
        const blurVal = narrow ? Math.min(rawBlur, 12) : rawBlur;
        const scaleVal = 1.03 + clamp((smooth - 0.05) / 0.9) * 0.06;

        if (video) {
          // Vidéo rendue telle quelle : aucun étalonnage, aucun voile. Seul le
          // flou du scrub est appliqué. La lisibilité du texte repose donc
          // entièrement sur son ombre portée (voir .synapse-* dans index.css).
          video.style.filter = blurVal < 0.15 ? "none" : `blur(${blurVal.toFixed(2)}px)`;
          video.style.transform = `scale(${scaleVal * entranceZoom})`;
          video.style.opacity = String(entranceOpacity);

          if (video.readyState >= 1 && video.duration > 0) {
            const targetTime = clamp(smooth * video.duration, 0, video.duration);
            if (Math.abs(video.currentTime - targetTime) > 0.008) {
              if (!isSeekingRef.current && !video.seeking) {
                isSeekingRef.current = true;
                video.currentTime = targetTime;
              } else {
                nextSeekTimeRef.current = targetTime;
              }
            }
          }
        }

        // Hero fade + scale as it scrolls away.
        if (heroRef.current) {
          const heroOp = clamp(1 - progress / 0.24);
          const heroSc = 1 - 0.04 * clamp(progress / 0.24);
          heroRef.current.style.opacity = String(heroOp);
          heroRef.current.style.transform = `scale(${heroSc})`;
        }

        // Cinematic 3D paragraph fade in/out.
        if (cinematicInnerRef.current) {
          if (narrow) {
            // On phones the 3D tilt makes the lower items overflow the viewport
            // (and get clipped), and the fade-out can hide info mid-read. Keep it
            // flat and simply fade it in once — so ALL the text stays readable.
            cinematicInnerRef.current.style.transform = 'none';
            cinematicInnerRef.current.style.opacity = String(clamp((progress - 0.05) / 0.12));
          } else {
            const yVal = -110 * clamp(progress / 0.7);
            let cinOp = 0;
            if (progress <= 0.1) cinOp = 0;
            else if (progress <= 0.26) cinOp = (progress - 0.1) / 0.16;
            else if (progress <= 0.5) cinOp = 1;
            else if (progress <= 0.72) cinOp = 1 - (progress - 0.5) / 0.22;
            else cinOp = 0;
            cinematicInnerRef.current.style.transform = `rotateX(20deg) translateY(${yVal}px) translateZ(15px)`;
            cinematicInnerRef.current.style.opacity = String(clamp(cinOp));
          }
        }

        // Reveal the stats carousel. Une fois révélé, on arrête de mesurer :
        // ce getBoundingClientRect tournait à chaque frame pour rien.
        if (!revealedRef.current && statsSectionRef.current) {
          const sRect = statsSectionRef.current.getBoundingClientRect();
          if (sRect.top < vh * 0.9) {
            revealedRef.current = true;
            statsSectionRef.current.classList.add("revealed");
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      cleanupGestures();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fade the hero description in once the video entrance completes.
  useEffect(() => {
    if (videoReady && heroDescRef.current) {
      heroDescRef.current.style.transition =
        "opacity 0.9s cubic-bezier(0.215,0.61,0.355,1) 0.2s, transform 0.9s cubic-bezier(0.215,0.61,0.355,1) 0.2s";
      heroDescRef.current.style.opacity = "1";
      heroDescRef.current.style.transform = "translateY(0)";
    }
  }, [videoReady]);

  return (
    <section ref={sectionRef} id="apropos" className="synapse" aria-label="À propos de COSELEEC">
      {/* Sticky video background, scoped to this section only */}
      <div className="synapse-bg">
        <video
          ref={videoRef}
          className="synapse-video"
          loop
          muted
          playsInline
          preload="auto"
          src={videoSrc}
          onSeeking={handleSeeking}
          onSeeked={handleSeeked}
        />
        <div className="synapse-bottom-blur" />
      </div>

      <div className="synapse-content">
        <div className="synapse-dot-grid" />

        {/* Hero */}
        <div ref={heroRef} className="synapse-hero">
          <div className="synapse-hero-inner">
            <div className="synapse-hero-grid">
              <div className="synapse-hero-title">
                <ScrambleText text="Un seul" delay={100} scrollActive={scrollActive} videoReady={videoReady} />
                <ScrambleText text="artisan" delay={300} scrollActive={scrollActive} videoReady={videoReady} />
              </div>
              <div />
            </div>

            <div className="synapse-hero-grid synapse-hero-grid-bottom">
              <div ref={heroDescRef} className="synapse-hero-desc" style={{ opacity: 0, transform: "translateY(-30px)" }}>
                <p>
                  COSELEEC, c’est Aurélien Van Moer. Électricien installé à Tourcoing depuis mai 2021, formé au métier de bout en bout&nbsp;: BEP, Bac pro puis BTS ELEEC.
                </p>
                <p className="synapse-desc-p2">
                  Le nom porte le diplôme. L’électricité est le métier&nbsp;: le logement, mais aussi le tertiaire — bureaux, commerces, ERP, copropriétés — et l’industrie, où l’on raccorde des machines et où l’on entretient des réseaux d’atelier. Le reste vient en complément, parce qu’un chantier s’arrête rarement au tableau.
                </p>
              </div>
              <div className="synapse-hero-title synapse-hero-title-right">
                <ScrambleText text="tous vos" delay={200} scrollActive={scrollActive} videoReady={videoReady} />
                <ScrambleText text="chantiers" delay={400} scrollActive={scrollActive} videoReady={videoReady} />
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic parallax paragraph + services */}
        <div className="synapse-cinematic">
          <div ref={cinematicInnerRef} className="synapse-cinematic-inner">
            <div className="synapse-cinematic-copy">
              <h2>
                Du logement à l’atelier, <span className="accent-volt">une seule personne responsable du résultat.</span>
              </h2>
              <p>
                Un tableau de bureaux, une machine à raccorder, une panne qui revient chez un particulier&nbsp;: c’est le même métier et la même méthode. Et quand le chantier déborde sur un mur à rouvrir ou une arrivée d’eau à déplacer, ça ne part pas chez une autre entreprise. Il n’y a qu’un planning et qu’un numéro — celui qui chiffre est celui qui pose, et c’est encore lui que vous aurez au téléphone six mois plus tard.
              </p>
              <p>
                Tout commence par regarder l’existant&nbsp;: ce qui passe déjà dans les murs, l’âge du tableau, la puissance disponible, ce que vous voulez pouvoir brancher demain. C’est cet état des lieux qui décide du chantier — pas un devis type.
              </p>
              <p>
                Puis on pose, on raccorde, on teste, et on vous explique ce qui a été fait. Chaque départ est repéré, la légende collée dans la porte du tableau. Une installation réussie, c’est une installation que son propriétaire sait utiliser.
              </p>

              <div className="synapse-services">
                {SERVICES.map((service, index) => (
                  <div key={index} className="synapse-service">
                    <span className="synapse-service-dot" />
                    <span className="synapse-service-label">{service}</span>
                  </div>
                ))}
              </div>

              {/* .synapse-cinematic est en pointer-events: none pour laisser
                  passer le scrub : le CTA doit les réactiver. */}
              <div className="synapse-cta">
                <SectionCta label="Parler de votre projet" href="#contact" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats carousel */}
        <div ref={statsSectionRef} className="synapse-stats">
          <TelemetryCarousel cards={statsData} />
        </div>
      </div>
    </section>
  );
}
