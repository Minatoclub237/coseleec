import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { SynapseSection } from './components/SynapseSection';
import { ProcessSection } from './components/ProcessSection';
import { RanServices } from './components/RanServices';
import { ZoneSection } from './components/ZoneSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MobileCallBar } from './components/MobileCallBar';
import { WhatsAppFab } from './components/WhatsAppFab';

const LIGHT_IMG = '/images/hero-light.webp';
const DARK_IMG = '/images/hero-dark.webp';

// Signal de confiance haut de page, volontairement réduit à la note : les
// verbatims vivent dans la section « Avis » juste avant la FAQ, les répéter
// ici ferait doublon. Le lien mène à cette section.

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const bgFrontRef = useRef<HTMLDivElement | null>(null);
  const bgBackRef = useRef<HTMLDivElement | null>(null);
  const animatingRef = useRef<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDark]);

  useEffect(() => {
    if (bgFrontRef.current) {
      bgFrontRef.current.style.backgroundImage = `url(${DARK_IMG})`;
    }
    if (bgBackRef.current) {
      bgBackRef.current.style.backgroundImage = `url(${DARK_IMG})`;
    }

    // Preload + decode both hero images so the first theme switch is instant
    // instead of stuttering while the 3.8 MB opposite image is fetched.
    [LIGHT_IMG, DARK_IMG].forEach((src) => {
      const img = new Image();
      img.src = src;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }, []);

  const toggleTheme = (toDark: boolean) => {
    if (isDark === toDark || animatingRef.current) {
      return;
    }
    animatingRef.current = true;

    const targetImg = toDark ? DARK_IMG : LIGHT_IMG;

    if (bgBackRef.current) {
      bgBackRef.current.style.backgroundImage = `url(${targetImg})`;
    }

    if (bgFrontRef.current) {
      bgFrontRef.current.classList.add('pull-down');
    }

    setTimeout(() => {
      setIsDark(toDark);
      if (bgFrontRef.current) {
        bgFrontRef.current.style.backgroundImage = `url(${targetImg})`;
      }
      setTimeout(() => {
        if (bgFrontRef.current) {
          bgFrontRef.current.classList.remove('pull-down');
        }
        animatingRef.current = false;
      }, 30);
    }, 300);
  };

  const scrollToId = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
    <div id="hero-section" className="hero">
      <div id="top-overlay" className="blur-overlay blur-overlay-top"></div>
      <div id="bottom-overlay" className="blur-overlay blur-overlay-bottom"></div>
      <div id="bg-wrapper" className="hero-bg-wrapper">
        <div id="bg-back-div" ref={bgBackRef} className="hero-bg bg-back"></div>
        <div id="bg-front-div" ref={bgFrontRef} className="hero-bg bg-front"></div>
      </div>
      
      <nav id="navbar-id" className="navbar">
        <a id="logo-container-id" className="logo-container" href="#hero-section" onClick={scrollToId('hero-section')} aria-label="COSELEEC — retour en haut">
          <span className="logo-word">
            COS<span className="logo-word-accent">ELEEC</span>
            <span className="logo-word-city">Tourcoing</span>
          </span>
        </a>

        <div id="nav-links-id" className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <a id="nav-link-about" href="#apropos" onClick={scrollToId('apropos')}>L’atelier</a>
          <a id="nav-link-method" href="#methode" onClick={scrollToId('methode')}>Méthode</a>
          <a id="nav-link-cases" href="#realisations" onClick={scrollToId('realisations')}>Prestations</a>
          <a id="nav-link-avis" href="#avis" onClick={scrollToId('avis')}>Avis</a>
          <a id="nav-link-zone" href="#zone" onClick={scrollToId('zone')}>Zone</a>
          <a id="nav-link-faq" href="#faq" onClick={scrollToId('faq')}>FAQ</a>
          <a id="nav-link-contact" href="#contact" onClick={scrollToId('contact')}>Contact</a>
          <button id="cta-drawer" className="cta-button drawer-cta" onClick={scrollToId('contact')}>Demander un devis</button>
        </div>

        <button id="cta-navbar" className="cta-button nav-cta" onClick={scrollToId('contact')}>Demander un devis</button>
        
        <div 
          id="hamburger-id" 
          className={`hamburger ${menuOpen ? 'active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
      
      <div id="hero-content-id" className="hero-content">
        <h1 id="hero-title-id" className="hero-title">
          Électricien à Tourcoing.{' '}
          <span id="title-accent-id" className="title-accent">Et le reste du chantier avec.</span>
        </h1>
        
        <div id="theme-toggle-id" className="theme-toggle">
          <div 
            id="toggle-indicator-id" 
            className="toggle-indicator" 
            style={{ 
              transform: isDark ? 'translateX(calc(100% + 4px))' : 'translateX(0)' 
            }}
          ></div>
          <button 
            id="toggle-btn-morning" 
            className={`toggle-btn ${!isDark ? 'active' : ''}`} 
            onClick={() => toggleTheme(false)}
          >
            <span id="morning-label" className="label">Jour</span>
            <span id="morning-subtext" className="subtext">Le chantier</span>
          </button>
          <button 
            id="toggle-btn-night" 
            className={`toggle-btn ${isDark ? 'active' : ''}`} 
            onClick={() => toggleTheme(true)}
          >
            <span id="night-label" className="label">Nuit</span>
            <span id="night-subtext" className="subtext">La finition</span>
          </button>
        </div>
        
        <p id="hero-footer-id" className="hero-footer">
          Aurélien Van Moer, électricien de formation — BEP, Bac pro et BTS ELEEC. Électricité générale tertiaire et industrielle, dépannage, rénovation et mise en conformité, du logement au magasin, à l’ERP et à l’atelier. Matériel professionnel fourni. Un seul artisan sur le chantier, à Tourcoing et dans la métropole lilloise. Depuis 2021.
        </p>
      </div>
    </div>

    <section id="avis-section" className="reviews" aria-label="Avis clients">
      <div className="reviews-head">
        <span className="reviews-score">4,9<em>/5</em></span>
        <span className="reviews-meta">
          Note moyenne sur <strong>40 avis Google</strong>
          <a href="#avis" onClick={scrollToId('avis')}>Lire les avis&nbsp;↓</a>
        </span>
      </div>
    </section>

    <SynapseSection />

    <ProcessSection />

    <RanServices />

    <div className="ran-services">
      <ZoneSection />
      <ContactSection />
      <Footer />
    </div>

    <WhatsAppFab />
    <MobileCallBar />
    </>
  );
}
