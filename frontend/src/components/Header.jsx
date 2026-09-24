import { useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MapPin, Calculator, Info, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useThemeLang } from '../context/ThemeLangContext';
import LanguageMenu from './LanguageMenu';
import nitaLogo from '../assets/nita-logo-mark.png';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { t, lang } = useThemeLang();
  const location = useLocation();
  const navPrimaryRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  // Pilule active qui glisse d'un onglet à l'autre au lieu de sauter — mesure
  // la position réelle du lien actif (largeur variable selon la langue/le
  // texte). useLayoutEffect évite tout flash avant peinture.
  useLayoutEffect(() => {
    const measure = () => {
      const container = navPrimaryRef.current;
      const activeEl = container?.querySelector('a.active');
      if (!activeEl) return;
      setIndicator({ left: activeEl.offsetLeft, width: activeEl.offsetWidth, ready: true });
    };
    measure();
    // Re-mesure après chargement des polices/premier rendu (largeurs de texte).
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [location.pathname, lang]);

  return (
    <header className="nita-header">
      <NavLink to="/" className="nita-logo">
        <img src={nitaLogo} alt="NITA — Transfert d'argent" className="nita-logo-img" />
        <span className="nita-logo-tagline">{t('tagline')}</span>
      </NavLink>

      <nav className="nita-nav">
        {/* Liens principaux — cachés sur mobile, remplacés par MobileBottomNav */}
        <div className="nita-nav-primary" ref={navPrimaryRef}>
          {indicator.ready && (
            <span
              className="nita-nav-indicator"
              style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
            />
          )}
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            <Home size={14} style={{ verticalAlign: '-2px', marginInlineEnd: 6 }} />
            <span className="label">{t('nav_home')}</span>
          </NavLink>
          <NavLink to="/carte" className={({ isActive }) => (isActive ? 'active' : '')}>
            <MapPin size={14} style={{ verticalAlign: '-2px', marginInlineEnd: 6 }} />
            <span className="label">{t('nav_map')}</span>
          </NavLink>
          <NavLink to="/calculatrice" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Calculator size={14} style={{ verticalAlign: '-2px', marginInlineEnd: 6 }} />
            <span className="label">{t('nav_calc')}</span>
          </NavLink>
          <NavLink to="/a-propos" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Info size={14} style={{ verticalAlign: '-2px', marginInlineEnd: 6 }} />
            <span className="label">{t('nav_about')}</span>
          </NavLink>
        </div>
        {isAuthenticated && (
          <div className="nita-nav-admin">
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
              <ShieldCheck size={14} style={{ verticalAlign: '-2px', marginInlineEnd: 6 }} />
              <span className="label">{t('nav_admin')}</span>
            </NavLink>
            <button onClick={logout} title={t('nav_logout')} className="nita-nav-logout-btn">
              <LogOut size={14} />
            </button>
          </div>
        )}

        {/* Sur mobile, le sélecteur de langue vit dans MobileBottomNav — cette
            instance reste réservée au desktop (voir CSS .settings-wrap). */}
        <LanguageMenu variant="header" />
      </nav>
    </header>
  );
}
