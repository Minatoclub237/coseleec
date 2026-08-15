import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

/**
 * Bandeau d'avis Google en défilement continu.
 *
 * Les 17 avis ci-dessous sont reproduits MOT POUR MOT depuis la fiche Google
 * « Coseleec + service », fautes de frappe et d'accord comprises — ce sont des
 * témoignages de clients réels, ils ne se réécrivent pas.
 *
 * Le total affiché (40) est celui de la fiche : on n'en montre que 17, et le
 * lien renvoie vers la fiche pour que le visiteur puisse tout lire, y compris
 * le seul avis critique, qui n'est donc pas dissimulé.
 */

export const REVIEWS_TOTAL = 40;
export const REVIEWS_RATING = "4,9";
export const REVIEWS_URL = "https://share.google/ocFTbMJsHhu0BkVu2";

type Review = {
  name: string;
  /** Ce que l'avis dit du chantier — repris du texte, jamais inventé. */
  job: string;
  date: string;
  text: string;
};

const REVIEWS: Review[] = [
  {
    name: "Elodie PATARD",
    job: "Pose de porte coulissante",
    date: "Local Guide · 18 avis",
    text: "Artisan ponctuel et qui travaille efficacement et proprement. A su trouver une solution suite à un problème de fournitures par Leroy Merlin et a pris directement contact avec eux pour trouver une solution pour l'installation de notre porte coulissante.",
  },
  {
    name: "Frédéric Donzé",
    job: "Rénovation électrique & tableau",
    date: "8 avis",
    text: "Aurélien a rénové l'électricité de mon appartement (pose d'un nouveau tableau entre autres). Le travail a été soigneusement et bien fait.",
  },
  {
    name: "Melike Koc",
    job: "Dépannage un dimanche",
    date: "4 avis · 2 photos",
    text: "Technicien très professionnel, Il est intervenu un Dimanche, à chercher le problème, à expliquez la panne, est surtout règle le problème. Encore merci le problème est résolu",
  },
  {
    name: "adrien wiart",
    job: "Salle de bain, WC & luminaires",
    date: "4 avis · 1 photo",
    text: "Aurelien a réalisé la rénovation de notre salle de bain , wc et la pose de luminaires. Vous pouvez lui faire confiance, il est soucieux du travail bien fait !",
  },
  {
    name: "Christine Dassonneville",
    job: "Prestation pour un client professionnel",
    date: "Local Guide · 18 avis",
    text: "Courtois, respect des délais, nettoyage du chantier et évacuation des déchets, rien à redire",
  },
  {
    name: "Valerie Beaurepaire",
    job: "Remplacement de cumulus",
    date: "Local Guide · 23 avis",
    text: "Aurelien a su être disponible rapidement pour un remplacement de cumulus. Chantier pas facile car le chauffe eau se trouvait à l'étage dans un placard et en plus cumulus horizontal avec accès difficile",
  },
  {
    name: "mounire chigri",
    job: "Intervention & plomberie",
    date: "Local Guide · 7 avis",
    text: "Entreprise sérieuse intervention rapide et en plus nous a débouchés les toilettes. Merci encore, n'hésitez pas à le contacter très pro",
  },
  {
    name: "annie germain",
    job: "Pose de radiateurs électriques",
    date: "4 avis · 8 photos",
    text: "Intervention à Wattignies suite achats de radiateurs électriques installés par Aurélien. Son travail est soigné, réfléchi.",
  },
  {
    name: "Morgane Drsx",
    job: "Rénovation d'appartement",
    date: "11 avis · 9 photos",
    text: "J'ai fais appel à coselec pour la rénovation de mon appartement, la prestation fut réalisée avec succès. Aurélien a été réactif et professionnel",
  },
  {
    name: "Adrien Clerc",
    job: "Réparation après radiateur arraché",
    date: "7 avis",
    text: "Réparation suite à un radiateur arraché. Travail impeccable et de bons conseils ! Je recommande",
  },
  {
    name: "Ibrahim",
    job: "Intervention à Villeneuve",
    date: "2 avis",
    text: "Merci à Aurélien pour l'intervention sur Villeneuve, un vrai pro, l'heure de RDV respectée, travail bien fait, problème résolu.",
  },
  {
    name: "Anne w",
    job: "Avis Google",
    date: "7 avis",
    text: "Professionnel expérimenté, attentif et à l'écoute du client, je recommande !",
  },
  {
    name: "Christine Landru",
    job: "Avis Google",
    date: "4 avis",
    text: "Félicitations et merci pour l'efficacité et votre rapidité, pour votre professionnalisme et votre rapidité. Je recommande.",
  },
  {
    name: "Lisandro Mendes",
    job: "Avis Google",
    date: "2 avis",
    text: "Bon electricien tres rapide et reactive",
  },
  {
    name: "Fethi Mokrani",
    job: "Avis Google",
    date: "1 avis",
    text: "Travail minutieux agent agréable et travail professionnel",
  },
  {
    name: "Diaby Kandjoura",
    job: "Avis Google",
    date: "1 avis",
    text: "Intervention rapide efficace très agréable merci beaucoup",
  },
  {
    name: "Mariana Abarz",
    job: "Avis Google",
    date: "1 avis",
    text: "Très professionnel et très agréable",
  },
];

/** Initiales de repli : aucune photo de profil n'est récupérable depuis Google. */
const initials = (name: string) =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

function ReviewCard({ review, tone }: { review: Review; tone: number }) {
  return (
    <figure className="tcard" data-tone={tone}>
      <div className="tcard-avatar" aria-hidden="true">
        <span>{initials(review.name)}</span>
      </div>

      <div className="tcard-body">
        <figcaption>
          <span className="tcard-name">{review.name}</span>
          <span className="tcard-job">{review.job}</span>
        </figcaption>
        <blockquote className="tcard-text">{review.text}</blockquote>
      </div>

      {/* Bandeau incurvé du bas — repris du modèle fourni : la vague part du coin
          inférieur gauche et remonte vers la droite, les étoiles posées dessus. */}
      <div className="tcard-footer">
        <svg className="tcard-wave" viewBox="0 0 340 96" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 96 L0 54 C 54 28, 134 24, 192 50 C 224 64, 234 81, 240 96 Z" />
        </svg>
        <div className="tcard-stars" aria-label="5 étoiles sur 5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="tcard-star" aria-hidden="true" />
          ))}
        </div>
        <svg className="tcard-mark" viewBox="0 0 512 512" aria-hidden="true">
          <path d="M291 58 L150 288 h84 l-29 166 141-230 h-84 z" />
        </svg>
      </div>
    </figure>
  );
}

export function TestimonialsSection() {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // La piste est dupliquée pour que la boucle se referme sans saut. La durée
  // suit le nombre de cartes, sinon 17 cartes défileraient trois fois plus vite
  // que 6 pour la même animation.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.setProperty("--tmarquee-duration", `${REVIEWS.length * 7}s`);
  }, []);

  return (
    <section id="avis" className="testimonials" aria-label="Avis clients">
      <div className="testimonials-head">
        <a
          className="testimonials-badge"
          href={REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Note de ${REVIEWS_RATING} sur 5, sur ${REVIEWS_TOTAL} avis Google — voir la fiche`}
        >
          <span className="testimonials-score">{REVIEWS_RATING}</span>
          <span className="testimonials-stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="testimonials-star" />
            ))}
          </span>
          <span className="testimonials-count">
            <strong>{REVIEWS_TOTAL} avis</strong> Google
          </span>
        </a>

        <h2 className="testimonials-title">
          Ce que disent <span className="accent-volt">les clients d’Aurélien.</span>
        </h2>
        <p className="testimonials-sub">
          {REVIEWS.length} avis reproduits mot pour mot depuis la fiche Google, sur{" "}
          {REVIEWS_TOTAL} au total.{" "}
          <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer">
            Lire les {REVIEWS_TOTAL} avis&nbsp;↗
          </a>
        </p>
      </div>

      <div
        className={`testimonials-rail ${paused ? "is-paused" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div ref={trackRef} className="testimonials-track">
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <ReviewCard
              key={`${r.name}-${i}`}
              review={r}
              tone={i % 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
