import { useEffect, useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { SectionCta, TEL, TEL_DISPLAY } from "./SectionCta";

export interface FeatureItem {
  id: string;
  title: string;
  category: string;
  /** Poster affiché tant que la vidéo ne tourne pas. */
  imageUrl: string;
  /** Vidéo de la vignette. Absente sur l'item de contact générique. */
  videoUrl?: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  metrics: { label: string; value: string }[];
}

// RÈGLE : une vignette n'existe que si la prestation est SOURCÉE (fiche Google,
// profil AlloVoisins, liste Pappers, ou photo de chantier du client) — jamais
// parce qu'un visuel était disponible. Trois vignettes héritées du site d'origine
// ont été retirées le 15/08/2026 pour cette raison : vidéosurveillance,
// interphone/portail/volets et borne de recharge, absentes des trois sources.
// Leurs médias restent dans public/services/ (eclairage.*, chemins-de-cables.*,
// borne-de-recharge.*) au cas où le client confirmerait ces activités.
//
// ATTENTION : les noms de fichiers des vidéos sont hérités et ne décrivent PAS
// leur contenu (`reseau-informatique.mp4` montre une ossature de faux-plafond,
// `tableau-electrique.mp4` des chemins de câbles, `depannage.mp4` une centrale
// d'alarme…). Chaque prestation est appariée à ce que la vidéo montre
// réellement, pas à son nom de fichier. Ne pas « corriger » ces chemins.
const FEATURES_DATA: FeatureItem[] = [
  {
    id: "electricite-tertiaire",
    title: "Électricité générale tertiaire",
    category: "Chantier Coseleec",
    // CHANTIER RÉEL : tableau tertiaire Legrand posé par Aurélien Van Moer,
    // chaque départ étiqueté (BUR 1/2/3, BAES, INTRUSION, ECL PUBLIC…).
    // Le poster est la photo d'origine, la vidéo son animation.
    imageUrl: "/services/tableau-tertiaire.webp",
    videoUrl: "/services/tableau-tertiaire.mp4",
    shortDescription: "Bureaux, commerces et bâtiments administratifs : installation, mise aux normes et tableau.",
    longDescription: "La photo est un tableau réellement posé par Coseleec dans des bureaux : chaque départ étiqueté, l’éclairage public séparé de l’éclairage non public, l’intrusion et les BAES sur leurs propres protections, une télécommande BAES en façade. C’est le meilleur indicateur d’un travail sérieux, et le seul que vous puissiez vérifier vous-même sans être du métier. S’ajoute à l’installation tout ce qui fait la vie d’un local professionnel : reprise de circuits, ajout de postes, et la dépose ou la pose d’enseigne et de signalétique.",
    benefits: [
      "Chaque départ repéré et légende laissée dans le tableau",
      "Dépose et pose d’enseigne et de signalétique",
      "Matériel professionnel fourni, référencé sur le devis"
    ],
    metrics: [
      { label: "Cadre", value: "Bureaux, commerces, administratif" },
      { label: "Référentiel", value: "NF C 15-100" }
    ]
  },
  {
    id: "electricite-industrielle",
    title: "Électricité industrielle",
    category: "Industrie",
    // Vidéo : chemins de câbles et gaines en plafond technique industriel.
    imageUrl: "/services/tableau-electrique.webp",
    videoUrl: "/services/tableau-electrique.mp4",
    shortDescription: "Raccordement de machines, câblage et réseaux d’usine — là où l’arrêt de production coûte plus cher que les travaux.",
    longDescription: "Raccordement et câblage de machines, tirage sur chemins de câbles, armoires et départs de puissance, optimisation et maintenance des réseaux électriques d’atelier. En industrie, la contrainte n’est pas la pose mais le planning : ce qui compte, c’est de savoir ce qui peut se préparer machine en marche et ce qui impose une coupure, puis de tenir la fenêtre annoncée. Le repérage y vaut encore plus qu’ailleurs — une armoire lisible fait gagner des heures le jour où quelque chose lâche.",
    benefits: [
      "Coupures annoncées à l’avance et tenues",
      "Préparation au maximum hors arrêt de production",
      "Armoires et départs repérés pour les dépannages futurs"
    ],
    metrics: [
      { label: "Portée", value: "Machines & réseaux d’atelier" },
      { label: "Contrainte", value: "Planning de production" }
    ]
  },
  {
    id: "diagnostic-maintenance",
    title: "Diagnostic & maintenance",
    category: "Intervention",
    // Vidéo : mesure à la pince ampèremétrique sur une armoire.
    imageUrl: "/services/renovation-mise-aux-normes.webp",
    videoUrl: "/services/renovation-mise-aux-normes.mp4",
    shortDescription: "Trouver l’origine réelle du défaut, plutôt que de remplacer une pièce au hasard.",
    longDescription: "Un disjoncteur qui saute sans raison, une prise morte, une odeur de chaud, un différentiel qui se déclenche seulement le soir : ces symptômes ont presque toujours une cause précise, et rarement celle qu’on suppose. On isole circuit par circuit, mesure à l’appui, jusqu’à identifier le point exact — défaut d’isolement, contact desserré, matériel en fin de vie. En entreprise, la même méthode sert à la maintenance périodique : contrôler avant que ça lâche coûte toujours moins cher que dépanner en urgence.",
    benefits: [
      "Diagnostic méthodique, mesure à l’appui",
      "Explication de la cause, pas seulement du remède",
      "Maintenance périodique possible pour les locaux pro"
    ],
    metrics: [
      { label: "Méthode", value: "Isolement progressif" },
      { label: "Secteur", value: "Tourcoing & métropole" }
    ]
  },
  {
    id: "installation-electrique",
    title: "Installation & rénovation électrique",
    category: "Logement",
    // Vidéo : pose d'un panneau LED au plafond.
    imageUrl: "/services/installation-electrique.webp",
    videoUrl: "/services/installation-electrique.mp4",
    shortDescription: "Rénovation totale ou partielle : on reprend ce qui doit l’être, on garde ce qui tient encore.",
    longDescription: "Installation entière ou reprise ciblée : arrivée et comptage, tableau, circuits de puissance, éclairage, prises et sorties spécialisées. En rénovation, on part d’un état des lieux honnête — pas de liaison à la terre, un différentiel unique pour tout le logement, des fils sous plinthe d’un autre âge — et on reprend par priorité : ce qui est dangereux, ce qui est vieux mais sain, ce qui peut attendre l’an prochain. Vous savez ce que vous payez et pourquoi.",
    benefits: [
      "Priorisation claire : ce qui est urgent, ce qui peut attendre",
      "Dimensionnement calculé sur vos usages réels",
      "Installation conforme pour la vente, la location ou l’assurance"
    ],
    metrics: [
      { label: "Champ", value: "Du compteur à la prise" },
      { label: "Référentiel", value: "NF C 15-100" }
    ]
  },
  {
    id: "mise-en-securite",
    title: "Mise en sécurité des locaux",
    category: "ERP & syndics",
    // Vidéo : déclencheur manuel d'alarme incendie et issue de secours.
    imageUrl: "/services/confort-domotique.webp",
    videoUrl: "/services/confort-domotique.mp4",
    shortDescription: "Un local qui reçoit du public n’a pas les mêmes obligations qu’un logement.",
    longDescription: "Éclairage de sécurité (BAES) et sa télécommande, déclencheurs manuels, alarme incendie, blocs d’ambiance, balisage des issues. Dans un magasin, un cabinet, un local recevant du public ou les parties communes d’une copropriété, ces équipements ne sont pas optionnels et leur implantation répond à des règles précises. On installe, on raccorde et on repère, pour qu’une visite de contrôle ne vous prenne pas au dépourvu — et quand un bureau de contrôle doit être associé, on le dit plutôt que de laisser croire le contraire.",
    benefits: [
      "BAES et déclencheurs implantés selon les cheminements",
      "Travaux planifiables en dehors des heures d’ouverture",
      "Position claire sur ce qui relève d’un bureau de contrôle"
    ],
    metrics: [
      { label: "Cadre", value: "ERP, commerces, syndics" },
      { label: "Planning", value: "Hors heures d’ouverture" }
    ]
  },
  {
    id: "alarme",
    // Périmètre volontairement limité à ce qui est prouvé : la photo du tableau
    // tertiaire porte un départ « INTRUSION » dédié, donc l'alimentation et le
    // raccordement sont attestés. Ne PAS étendre à la vente, au paramétrage de
    // centrales ou au contrôle d'accès sans confirmation du client.
    title: "Alimentation d’alarme & détection",
    category: "Courants faibles",
    // Vidéo : centrale d'alarme tactile murale.
    imageUrl: "/services/depannage.webp",
    videoUrl: "/services/depannage.mp4",
    shortDescription: "Une alarme ne vaut que par la ligne qui l’alimente et par la protection qui la garde en service.",
    longDescription: "Sur le tableau visible en première vignette, l’intrusion a son propre départ, séparé de l’éclairage et des prises. Ce n’est pas un détail : une alarme branchée sur un circuit partagé se retrouve hors service dès que le disjoncteur voisin saute, et personne ne s’en aperçoit avant d’en avoir besoin. Alimentation dédiée, protection adaptée, liaisons intégrées à l’installation existante et repérées au tableau — en logement comme en local professionnel.",
    benefits: [
      "Ligne dédiée, séparée des circuits d’éclairage et de prises",
      "Départ repéré au tableau pour les interventions futures",
      "Liaisons intégrées à l’installation existante"
    ],
    metrics: [
      { label: "Champ", value: "Alimentation & raccordement" },
      { label: "Preuve", value: "Départ INTRUSION dédié" }
    ]
  },
  {
    id: "second-oeuvre",
    title: "Second œuvre & travaux polyvalents",
    category: "Complément de chantier",
    // Vidéo : pose d'une ossature métallique de faux-plafond.
    imageUrl: "/services/reseau-informatique.webp",
    videoUrl: "/services/reseau-informatique.mp4",
    shortDescription: "Les petits travaux qui accompagnent un chantier électrique et qu’on ne veut pas confier à une autre entreprise.",
    longDescription: "Cloisons, faux-plafonds, saignées et leurs reprises, fixations, petits travaux d’un autre corps de métier. C’est un complément du chantier électrique, pas une activité à part : quand un mur doit être ouvert pour passer un circuit, c’est la même personne qui le rebouche et le remet en état. Ce qui évite la situation classique — l’électricien a fini, mais la pièce reste inutilisable en attendant quelqu’un d’autre pour trois heures de travail.",
    benefits: [
      "Le mur ouvert pour les travaux est rebouché par la même personne",
      "Pas de délai perdu entre deux corps de métier",
      "Petits travaux complémentaires pris avec le chantier"
    ],
    metrics: [
      { label: "Rôle", value: "Complément du chantier" },
      { label: "Portée", value: "Cloisons, plafonds, reprises" }
    ]
  },
  {
    id: "plomberie-degat-des-eaux",
    title: "Plomberie & dégât des eaux",
    category: "Chantier Coseleec",
    // CHANTIER RÉEL : salle de bains refaite par Aurélien Van Moer
    // (« Rénovation salle de bain complète », réalisation AlloVoisins).
    imageUrl: "/services/plomberie-sdb.webp",
    videoUrl: "/services/plomberie-sdb.mp4",
    shortDescription: "Après une fuite, la reprise touche autant à l’eau qu’à l’électricité. Autant que ce soit la même personne.",
    longDescription: "Réparation après dégât des eaux, remplacement de sanitaires, déplacement d’une arrivée ou d’une évacuation, réfection complète d’une salle de bains comme sur cette photo. L’intérêt d’un artisan qui fait les deux se voit surtout après un sinistre : l’eau abîme rarement que la plomberie, et devoir attendre un électricien pour reprendre un circuit noyé fait perdre des semaines. Ici, le constat, la reprise et la remise sous tension se suivent sans intermédiaire.",
    benefits: [
      "Reprise de l’eau et de l’électricité par le même artisan",
      "Salle de bains refaite entièrement, du réseau à la finition",
      "Intervention après sinistre sans attendre un second corps de métier"
    ],
    metrics: [
      { label: "Champ", value: "Sanitaire & réseaux" },
      { label: "Après fuite", value: "Constat et reprise" }
    ]
  },
  {
    id: "menuiserie-cuisine",
    title: "Menuiserie & pose de cuisine",
    category: "Chantier Coseleec",
    // CHANTIER RÉEL : cuisine posée par Aurélien Van Moer
    // (« Assemblage et pose d'un cuisine équipé », réalisation AlloVoisins).
    imageUrl: "/services/cuisine.webp",
    videoUrl: "/services/cuisine.mp4",
    shortDescription: "Une cuisine se pose bien quand celui qui la monte a aussi tiré les circuits qui l’alimentent.",
    longDescription: "Montage et pose de cuisine, plans de travail, meubles et menuiseries. C’est le chantier où la polyvalence se voit le plus : les prises, la hotte, la plaque, l’arrivée d’eau et l’évacuation du lave-vaisselle se décident au moment où l’on trace les meubles, pas après. Sur la photo, l’éclairage, les prises du plan de travail et l’implantation ont été pensés ensemble — c’est ce qui évite la rallonge qui traverse le plan et la prise cachée derrière un caisson.",
    benefits: [
      "Électricité et arrivées d’eau tracées avec l’implantation des meubles",
      "Prises, hotte et plaque positionnées avant le montage",
      "Un seul interlocuteur du plan à la dernière poignée"
    ],
    metrics: [
      { label: "Portée", value: "Pose & raccordements" },
      { label: "Atout", value: "Élec et eau du même artisan" }
    ]
  }
];

interface FeaturesChessProps {
  onAction?: (feature: FeatureItem) => void;
}

interface ServiceCardProps {
  feature: FeatureItem;
  index: number;
  onAction?: (feature: FeatureItem) => void;
}

const ServiceCard = ({ feature, index, onAction }: ServiceCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Neuf vidéos qui tournent en permanence useraient la batterie pour rien.
  // Au pointeur : rien ne se charge tant qu'on ne survole pas (preload="none",
  // le poster suffit). Au doigt, il n'y a pas de survol : on lit la vignette
  // quand elle est bien visible et on met les autres en pause.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(hover: hover)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.55 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const play = () => {
    const video = videoRef.current;
    if (video) video.play().catch(() => {});
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <div
      onClick={() => onAction?.(feature)}
      onMouseEnter={play}
      onMouseLeave={stop}
      className="group relative aspect-video rounded-2xl overflow-hidden liquid-glass border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-sky-500/10 hover:-translate-y-1"
    >
      {/* Les trois vignettes « chantier Coseleec » sont des photos réelles :
          pas de <video> sans source, une <img> se charge et s'affiche mieux. */}
      {feature.videoUrl ? (
        <video
          ref={videoRef}
          src={feature.videoUrl}
          poster={feature.imageUrl}
          aria-label={feature.title}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-700 brightness-[0.8] group-hover:brightness-100"
        />
      ) : (
        <img
          src={feature.imageUrl}
          alt={feature.title}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-700 brightness-[0.8] group-hover:brightness-100"
        />
      )}

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 group-hover:via-black/30 transition-all duration-300" />

      {/* Info Reveal Circle Accent */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
          <Sparkles className="h-4 w-4 text-sky-300" />
        </div>
      </div>

      {/* Labels and Categories */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[10px] font-body uppercase tracking-widest text-white/60">
              {feature.category}
            </span>
          </div>
          <h4 className="text-base font-heading italic text-white/95 leading-tight group-hover:text-white transition-colors font-medium">
            {feature.title}
          </h4>
        </div>

        <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/10 transition-colors">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Feature Index ID */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-white/70 tracking-wider">
        N° {String(index + 1).padStart(2, "0")}
      </div>

      {/* Info Trigger Badge */}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-mono text-white/95 uppercase tracking-wide">
        Voir détails
      </div>
    </div>
  );
};

const FeaturesChess = ({ onAction }: FeaturesChessProps) => {
  return (
    <section id="realisations" className="py-24 px-6 md:px-16 lg:px-24">
      {/* Section header */}
      <div className="text-center mb-20 max-w-2xl mx-auto">
        <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4">
          Ce que nous faisons
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          {/* Le <br> garde le span dégradé sur une seule ligne : un
              background-clip:text réparti sur deux lignes se coupe. */}
          Neuf prestations, <br className="hidden sm:block" />
          <span className="accent-volt">un seul artisan.</span>
        </h2>
        <p className="text-white/50 font-body font-light leading-relaxed text-sm md:text-base mt-6">
          Du logement au tertiaire et jusqu’à l’atelier industriel, plus ce qui accompagne un chantier électrique. Neuf prestations, pas une de plus&nbsp;: on ne liste que ce qui est réellement fait — et les trois vignettes marquées «&nbsp;chantier Coseleec&nbsp;» sont des chantiers filmés chez de vrais clients.
        </p>
      </div>

      {/* Grille des 12 prestations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {FEATURES_DATA.map((feature, idx) => (
          <ServiceCard key={feature.id} feature={feature} index={idx} onAction={onAction} />
        ))}
      </div>

      <div className="features-cta">
        <p className="features-cta-text">
          Le <strong>matériel électrique professionnel</strong> est fourni avec le chantier, référencé
          ligne par ligne sur le devis. Votre besoin n’entre dans aucune de ces cases&nbsp;? Décrivez-le
          et vous saurez tout de suite si c’est notre métier.
        </p>
        <div className="features-cta-row">
          <SectionCta label="Demander un devis" href="#contact" />
          <SectionCta label={TEL_DISPLAY} href={`tel:${TEL}`} variant="ghost" />
        </div>
      </div>
    </section>
  );
};

export default FeaturesChess;
