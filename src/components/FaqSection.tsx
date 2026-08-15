import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "../lib/utils";
import { TEL, MAIL } from "./SectionCta";
import { REVIEWS_URL } from "./TestimonialsSection";

// 1. Material Symbols Icon component
type MIconProps = {
  name: string;
  size?: number;
  className?: string;
  fill?: 0 | 1;
  weight?: number;
  grade?: number;
  opsz?: number;
};

export const MIcon = ({
  name,
  size = 20,
  className,
  fill = 0,
  weight = 400,
  grade = 0,
  opsz = 24,
}: MIconProps) => (
  <span
    className={cn("material-symbols-outlined leading-none select-none", className)}
    style={{
      fontSize: size,
      fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`,
    }}
  >
    {name}
  </span>
);

// 2. FadeUp scroll reveal animation component
type FadeUpProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  key?: string | number;
};

export const FadeUp = ({ children, delay = 0, className }: FadeUpProps) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 3. Spotlight Border styled overlay helper
export const spotlightMaskStyle = (size: number, intensity: number) => ({
  background: `radial-gradient(${size}px circle at var(--spot-x, -200px) var(--spot-y, -200px), rgba(255,255,255,${intensity}), rgba(255,255,255,0) 60%)`,
  padding: "1px",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as const);

type SpotlightBorderProps = {
  as?: "div" | "button" | "section";
  children: React.ReactNode;
  radius?: "xl" | "2xl" | "3xl" | "full";
  size?: number;
  intensity?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  key?: string | number;
};

export const SpotlightBorder = ({
  as = "div",
  children,
  radius = "2xl",
  size = 280,
  intensity = 0.4,
  className,
  onClick,
  ...props
}: SpotlightBorderProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const radiusClass = {
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  }[radius];

  const Component = as;

  return (
    <Component
      ref={ref as any}
      onClick={onClick}
      className={cn("relative overflow-hidden", radiusClass, className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
        style={spotlightMaskStyle(size, intensity)}
      />
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </Component>
  );
};

// 4. Radix Accordion custom building blocks (shadcn-inspired)
const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "relative rounded-2xl border border-white/10 bg-landing-surface px-6 [&[data-state=open]]:bg-landing-surface-hover transition-all duration-300",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-7 text-left text-sm sm:text-base font-medium text-foreground transition-all hover:no-underline group [&>svg]:hidden cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-7 text-xs sm:text-sm text-foreground/60 leading-relaxed font-sans font-light", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

// 5. Data Definitions
export type CategoryKey = "prix" | "confiance" | "chantier";

export const categories = [
  { key: "prix" as CategoryKey, label: "L’argent" },
  { key: "confiance" as CategoryKey, label: "Le risque" },
  { key: "chantier" as CategoryKey, label: "Le dérangement" },
];


type Faq = { q: string; a: string; cta: { label: string; href: string } };

// Chaque réponse lève une objection réelle et se termine par une action
// différente : appeler, envoyer une photo, vérifier l'immatriculation…
// Un seul et même CTA partout ferait lire la FAQ comme une brochure.
export const faqs: Record<CategoryKey, Faq[]> = {
  // L'ARGENT — l'objection qui bloque le plus de devis, traitée en premier.
  prix: [
    {
      q: "J'ai un devis moins cher ailleurs. Pourquoi vous ?",
      a: "Comparez d'abord ce que les deux devis contiennent. Chez Coseleec, la fourniture est séparée de la main-d'œuvre et le matériel professionnel est référencé ligne par ligne : vous voyez la marque et le calibre de ce qui sera posé chez vous. Un devis moins cher l'est presque toujours pour une raison — du matériel d'entrée de gamme, une ligne « divers » qui absorbe les imprévus, ou des reprises de mur laissées à votre charge. Envoyez l'autre devis, vous saurez en cinq minutes ce qui explique l'écart. Et s'il est réellement mieux-disant, on vous le dira.",
      cta: { label: "Faire comparer votre devis", href: "#contact" },
    },
    {
      q: "Soyons directs : ça va me coûter combien ?",
      a: "Aucun artisan sérieux ne chiffre sans avoir vu le chantier, et il faut se méfier de ceux qui le font au téléphone. Ce qui est certain : la visite et le chiffrage ne coûtent rien, le devis est ferme, écrit, détaillé, et ce qui y est écrit est ce que vous payez. Décrivez la situation en deux lignes avec une photo, et vous aurez un ordre de grandeur honnête avant même le déplacement.",
      cta: { label: "Obtenir votre chiffre exact", href: "#contact" },
    },
    {
      q: "Un client a trouvé votre devis trop cher. Vous en dites quoi ?",
      a: "C'est vrai, l'avis existe et il n'a pas été caché. Un prix d'artisan couvre le matériel, l'assurance décennale, le déplacement et le temps réel du chantier — pas seulement les heures passées chez vous. La bonne question n'est donc pas « pourquoi si cher ? » mais « qu'est-ce qu'il y a dedans ? », et à celle-là il y a une réponse ligne par ligne. Sur l'ensemble des avis publiés, c'est le seul sur ce sujet ; les autres parlent d'efficacité, de ponctualité et de travail soigné.",
      cta: { label: "Lire les avis sans filtre", href: REVIEWS_URL },
    },
    {
      q: "Vous n'êtes pas RGE — est-ce que je perds des aides ?",
      a: "Non, et autant le dire franchement plutôt que d'entretenir le flou. La qualification RGE conditionne les aides à la rénovation énergétique : isolation, pompe à chaleur, chauffage, ventilation. Les travaux d'électricité courants — tableau, mise en conformité, circuits, alimentation — n'ouvrent pas droit à ces aides, avec ou sans RGE. Sur ce que nous faisons, la question ne change donc rien à votre facture.",
      cta: { label: "Voir les 9 prestations couvertes", href: "#realisations" },
    },
    {
      q: "C'est une petite intervention. Ça vaut le déplacement ?",
      a: "Oui, et il n'y a pas de chantier minimum. Une prise morte, un disjoncteur capricieux, un radiateur à reposer : ce sont des interventions normales, et c'est souvent comme ça qu'on découvre le vrai état d'une installation. Beaucoup de gens hésitent à appeler pour « si peu » et laissent traîner un défaut pendant des années. Décrivez la panne en deux lignes : si ça se règle au téléphone, on vous le dira sans venir.",
      cta: { label: "Décrire votre panne", href: `tel:${TEL}` },
    },
  ],

  // LE RISQUE — ce que le client craint de perdre en confiant son logement.
  confiance: [
    {
      q: "Comment je sais que vous êtes une vraie entreprise ?",
      a: "Deux vérifications, deux minutes, et aucune ne dépend de ce site. La première : la note Google, 4,9 sur 40 avis, avec des clients qui décrivent un chantier précis — un tableau posé, un cumulus remplacé, une salle de bain rénovée. La seconde, plus solide encore : l'immatriculation. SIREN 901 349 472, immatriculé à Tourcoing le 3 mai 2021, toujours en activité, consultable sur l'annuaire officiel des entreprises. Une page web se fabrique en une soirée ; quatre ans d'immatriculation continue et quarante avis, non.",
      cta: { label: "Vérifier l'immatriculation", href: "https://annuaire-entreprises.data.gouv.fr/entreprise/901349472" },
    },
    {
      q: "Électricité, plomberie, menuiserie… ce n'est pas du bricolage ?",
      a: "La hiérarchie est nette et mérite d'être dite. Le métier, c'est l'électricité : BEP, Bac pro puis BTS ELEEC, tout le cursus d'électrotechnique et d'équipements communicants. C'est ce qui permet d'intervenir en tertiaire, en ERP et jusqu'en industrie sur du raccordement de machines. Le second œuvre vient en complément du chantier électrique, pas à sa place. Et ce n'est pas une promesse : dans les avis, des clients décrivent une porte coulissante posée, un cumulus remplacé, une salle de bain refaite.",
      cta: { label: "Voir les chantiers réalisés", href: "#realisations" },
    },
    {
      q: "Comment je sais que vous êtes assuré ?",
      a: "La garantie décennale est obligatoire dans le bâtiment, et l'attestation vous est remise avec le devis — avant les travaux, pas après. Vous pouvez la demander dès maintenant, sans même avoir de projet : c'est le document que tout artisan sérieux sort en une minute. S'il faut le réclamer trois fois à quelqu'un, la réponse est déjà donnée.",
      cta: { label: "Demander l'attestation d'assurance", href: `mailto:${MAIL}?subject=Attestation%20d%27assurance%20d%C3%A9cennale` },
    },
    {
      q: "Vous travaillez seul. Et si vous tombez malade en plein chantier ?",
      a: "C'est la vraie contrepartie d'un artisan indépendant, et il serait malhonnête de prétendre le contraire. Ce qui la compense : un planning volontairement non surchargé, donc une marge en cas d'imprévu, et vous êtes prévenu le jour même — pas au bout d'une semaine de silence. Un logement n'est jamais laissé hors service entre deux passages. En échange, vous avez quelqu'un qui connaît votre installation par cœur, du premier appel à la dernière prise.",
      cta: { label: "Demander les disponibilités", href: `mailto:${MAIL}?subject=Disponibilit%C3%A9s%20et%20d%C3%A9lais` },
    },
    {
      q: "Vous allez sous-traiter à quelqu'un que je ne connais pas ?",
      a: "Non — et c'est justement l'intérêt d'un artisan polyvalent. Celui qui vient chiffrer est celui qui pose, y compris quand le chantier touche à la plomberie ou aux cloisons, et c'est encore lui que vous aurez au téléphone six mois plus tard. Pas d'équipe qui tourne, pas de dossier qui change de main, pas de « je vais voir avec le chef d'équipe ». C'est ce qu'une petite structure peut offrir et qu'une grande ne peut pas.",
      cta: { label: "Poser la question de vive voix", href: `tel:${TEL}` },
    },
  ],

  // LE DÉRANGEMENT — la troisième raison de repousser, souvent la vraie.
  chantier: [
    {
      q: "Sous quel délai pouvez-vous intervenir ?",
      a: "Le délai de réponse moyen constaté sur les demandes reçues est de cinq minutes — c'est une donnée mesurée, pas une promesse commerciale. Les horaires vont du lundi au vendredi de 9 h à 20 h, le mardi jusqu'à 18 h. Plusieurs avis mentionnent une intervention obtenue rapidement, et l'un d'eux un dépannage réalisé un dimanche. Pour une date ferme, un appel vaut mieux qu'un site qui promettrait « 24 h » sans le tenir.",
      cta: { label: "Appeler pour un créneau", href: `tel:${TEL}` },
    },
    {
      q: "Combien de temps vais-je rester sans électricité, ou sans eau ?",
      a: "Beaucoup moins que ce que l'on imagine. Un remplacement de tableau se fait dans la journée, avec des coupures ciblées et le courant rétabli le soir même. Sur une rénovation plus large, on travaille circuit par circuit : le réfrigérateur, la box et l'éclairage principal restent alimentés pendant que le reste avance. Même logique sur l'eau. La date et la durée des coupures vous sont annoncées à l'avance, pas découvertes le matin même.",
      cta: { label: "Fixer une visite sur place", href: "#contact" },
    },
    {
      q: "Vous allez faire des saignées partout chez moi ?",
      a: "L'objectif est l'inverse. On utilise d'abord ce qui existe : gaines en place, combles, vides de cloison, plinthes techniques. Les saignées ne viennent qu'en dernier recours, et leur emplacement vous est montré et validé avant le premier coup de disqueuse. Surtout, ce qui est ouvert est refermé par la même personne — c'est là qu'un artisan polyvalent change tout. Envoyez quelques photos des pièces : dans bien des cas, on sait dire par avance ce qui passera sans ouvrir un mur.",
      cta: { label: "Envoyer les photos de vos pièces", href: `sms:${TEL}` },
    },
    {
      q: "Dans quel état vous laissez le chantier ?",
      a: "C'est un point sur lequel les clients sont plus crédibles que nous : « courtois, respect des délais, nettoyage du chantier et évacuation des déchets, rien à redire », écrit une cliente professionnelle. Concrètement, les gravats partent avec l'artisan, les départs du tableau sont repérés et la légende reste collée dans la porte, et vous avez un tour du propriétaire à la fin : ce qui a été fait, où couper en cas de besoin, ce qui reste à prévoir.",
      cta: { label: "Lire ce que disent les clients", href: "#avis" },
    },
    {
      q: "Je n'habite pas Tourcoing. Vous vous déplacez quand même ?",
      a: "Roubaix, Wattrelos, Mouvaux, Roncq, Neuville-en-Ferrain, Halluin, Croix et Marcq-en-Barœul sont à moins de dix kilomètres et font partie du secteur habituel, Lille et Villeneuve-d'Ascq aussi — des avis mentionnent d'ailleurs des interventions à Villeneuve, Wattignies et Lille. Au-delà, cela dépend de la durée du chantier : un dépannage d'une heure à trente kilomètres n'a pas de sens, une rénovation de trois semaines, si. Le plus simple est de demander, la réponse est franche dans les deux sens.",
      cta: { label: "Vérifier votre commune", href: "#zone" },
    },
  ],
};

interface FaqSectionProps {
  onContactClick?: () => void;
}

export const FaqSection = ({ onContactClick }: FaqSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("prix");
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Les CTA internes défilent en douceur ; tel:, sms:, mailto: et les liens
  // externes suivent leur comportement natif.
  const handleCtaClick = (href: string) => (e: React.MouseEvent) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Reset/empty item refs array when category changes to repopulate on map
  useEffect(() => {
    itemRefs.current = [];
  }, [activeCategory]);

  // Track cursor on every accordion item independently
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      itemRefs.current.forEach((item) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        item.style.setProperty("--spot-x", `${x}px`);
        item.style.setProperty("--spot-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [activeCategory]);

  return (
    <section id="faq" className="relative w-full bg-background py-20 sm:py-24 border-t border-white/5">
      {/* Background radial soft light to match the theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 relative z-10">
        
        {/* Header - two-column on lg */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <FadeUp delay={0.1}>
              <div className="inline-flex items-center gap-2 rounded-full bg-landing-surface border border-white/10 px-3.5 py-1 text-xs text-foreground/80 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
                <span>FAQ</span>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.15}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading italic font-light tracking-[-0.02em] leading-[1.05] text-foreground">
Ce qui vous fait hésiter, <br className="hidden sm:block" /> <span className="accent-volt">traité sans détour.</span>
              </h2>
            </FadeUp>
          </div>

          <div className="lg:max-w-sm">
            <FadeUp delay={0.2}>
              <p className="text-sm sm:text-base text-foreground/60 font-sans font-light leading-relaxed">
L’argent, le risque, le dérangement&nbsp;: on ne repousse jamais des travaux pour une autre raison. Voici les objections telles qu’elles se posent vraiment, avec des réponses qui ne nous arrangent pas toujours — y compris sur le devis jugé trop cher et sur le fait de travailler seul.
              </p>
            </FadeUp>
          </div>
        </div>

        {/* Body grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6 lg:h-full justify-between">
            {/* Categories */}
            <div className="lg:flex-grow">
              <SpotlightBorder
                radius="2xl"
                size={280}
                intensity={0.2}
                className="flex flex-col p-2.5 bg-[#050505] border border-white/5 lg:sticky lg:top-24 gap-1.5"
              >
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.key;
                  return (
                    <SpotlightBorder
                      key={cat.key}
                      as="button"
                      radius="full"
                      size={200}
                      intensity={0.3}
                      onClick={() => setActiveCategory(cat.key)}
                      className={cn(
                        "w-full text-center px-4 py-2.5 text-xs transition-all duration-300 font-sans tracking-wide cursor-pointer",
                        isActive
                          ? "bg-landing-surface border border-white/10 text-foreground font-medium"
                          : "border border-transparent text-foreground/50 hover:text-foreground"
                      )}
                    >
                      {cat.label}
                    </SpotlightBorder>
                  );
                })}
              </SpotlightBorder>
            </div>

            {/* "Got Questions" card */}
            <div className="lg:mt-auto">
              <SpotlightBorder
                radius="2xl"
                size={360}
                intensity={0.2}
                className="p-2.5 bg-[#050505] border border-white/5"
              >
                <SpotlightBorder
                  radius="2xl"
                  size={260}
                  intensity={0.4}
                  className="border border-white/10 bg-landing-surface p-6"
                >
                  <h3 className="text-lg font-heading italic text-foreground">Votre cas n’est pas dans la liste ?</h3>
                  <p className="mt-2 text-xs text-foreground/60 leading-relaxed font-sans font-light">
                    Décrivez-nous la situation en deux lignes. Vous aurez une réponse d’électricien, pas une brochure — même si la réponse est que ce n’est pas notre domaine.
                  </p>
                  <button
                    onClick={onContactClick}
                    className="faq-cta mt-5 inline-flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer px-4 py-2 rounded-xl"
                  >
                    Poser la question <span aria-hidden="true">→</span>
                  </button>
                </SpotlightBorder>
              </SpotlightBorder>
            </div>
          </div>

          {/* Right Column (Accordion) */}
          <div className="flex flex-col h-full justify-start">
            <SpotlightBorder
              radius="2xl"
              size={360}
              intensity={0.2}
              className="p-2.5 bg-[#050505] border border-white/5 h-full"
            >
              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-3 w-full"
                key={activeCategory} // Force collapse/re-mount when category changes
              >
                {faqs[activeCategory].map((faq, idx) => (
                  <FadeUp delay={0.1 * idx} key={`${activeCategory}-${idx}`}>
                    <AccordionItem
                      value={`${activeCategory}-${idx}`}
                      // @ts-ignore
                      ref={(el) => {
                        if (el) itemRefs.current[idx] = el as HTMLDivElement;
                      }}
                      className="group"
                    >
                      {/* Inner Spotlight element inside card overlay */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-2xl z-10"
                        style={spotlightMaskStyle(260, 0.35)}
                      />
                      
                      <AccordionTrigger className="relative z-20">
                        <span className="flex-1 pr-4 font-sans text-xs sm:text-sm md:text-base font-normal text-white/90 group-hover:text-white transition-colors">
                          {faq.q}
                        </span>
                        
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-foreground/70 transition-transform duration-300 group-data-[state=open]:rotate-180 group-hover:bg-white/10">
                          <MIcon name="expand_more" size={16} />
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="relative z-20">
                        <p className="font-sans font-light leading-relaxed text-xs sm:text-sm text-foreground/60">
                          {faq.a}
                        </p>
                        <a
                          href={faq.cta.href}
                          onClick={handleCtaClick(faq.cta.href)}
                          {...(faq.cta.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="faq-cta mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-sans font-medium transition-all hover:gap-3"
                        >
                          {faq.cta.label}
                          <span aria-hidden="true">→</span>
                        </a>
                      </AccordionContent>
                    </AccordionItem>
                  </FadeUp>
                ))}
              </Accordion>
            </SpotlightBorder>
          </div>

        </div>

      </div>
    </section>
  );
};
