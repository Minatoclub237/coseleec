import type { MouseEvent, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Point unique de vérité pour les coordonnées. Tout le site (CTA, barre
 * d'appel, WhatsApp, FAQ, footer, contact) lit ces constantes.
 * Source : fiche Google « Coseleec + service » et le client.
 */
export const TEL = "+33768348150";
export const TEL_DISPLAY = "07 68 34 81 50";
export const WHATSAPP = "33768348150";
export const MAIL = "aureliendes@outlook.fr";

/** Horaires de la fiche Google. Le samedi n'y figure pas hors jour férié —
 *  TODO CLIENT : AlloVoisins annonce 9h30-18h30, à confirmer. */
export const HOURS_SHORT = "Lun – Ven · 9h – 20h  ·  Mardi jusqu’à 18h";

interface SectionCtaProps {
  label: string;
  /** Ancre interne (#contact), tel:, mailto: ou URL externe. */
  href: string;
  variant?: "solid" | "ghost";
  icon?: ReactNode;
  className?: string;
}

/**
 * CTA de fin de section. Les ancres internes défilent en douceur, le reste
 * garde son comportement natif (composer, e-mail, nouvel onglet).
 */
export function SectionCta({ label, href, variant = "solid", icon, className = "" }: SectionCtaProps) {
  const isAnchor = href.startsWith("#");
  const isExternal = href.startsWith("http");

  const onClick = (e: MouseEvent) => {
    if (!isAnchor) return;
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <a
      href={href}
      onClick={onClick}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`section-cta ${variant === "ghost" ? "is-ghost" : "is-solid"} ${className}`}
    >
      {icon}
      <span>{label}</span>
      {!icon && <ArrowRight className="section-cta-arrow" />}
    </a>
  );
}
