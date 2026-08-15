import { useEffect, useState } from "react";
import { Phone, FileText } from "lucide-react";
import { TEL, TEL_DISPLAY } from "./SectionCta";

/**
 * Barre d'appel fixe, mobile uniquement. Elle n'apparaît qu'une fois le hero
 * dépassé : tant que le visiteur lit le titre, il n'a rien à décider.
 */
export function MobileCallBar() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`call-bar ${shown ? "is-shown" : ""}`} aria-hidden={!shown}>
      <a className="call-bar-main" href={`tel:${TEL}`} tabIndex={shown ? 0 : -1}>
        <Phone className="h-4 w-4" />
        <span>
          Appeler
          <em>{TEL_DISPLAY}</em>
        </span>
      </a>
      <a className="call-bar-alt" href="#contact" onClick={toContact} tabIndex={shown ? 0 : -1}>
        <FileText className="h-4 w-4" />
        Devis
      </a>
    </div>
  );
}
