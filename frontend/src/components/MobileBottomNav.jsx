import { NavLink } from 'react-router-dom';
import { Home, MapPin, Calculator, Info } from 'lucide-react';
import { useThemeLang } from '../context/ThemeLangContext';
import { useNavVisibility } from '../context/NavVisibilityContext';
import LanguageMenu from './LanguageMenu';

const ITEMS = [
  { to: '/', end: true, Icon: Home, key: 'nav_home' },
  { to: '/carte', end: false, Icon: MapPin, key: 'nav_map' },
  { to: '/calculatrice', end: false, Icon: Calculator, key: 'nav_calc' },
  { to: '/a-propos', end: false, Icon: Info, key: 'nav_about' },
];

// Barre de navigation flottante mobile (≤767px) — remplace les liens
// principaux du header sur mobile pour un accès au pouce, sans empiéter sur
// l'espace des pages (voir le padding-bottom de .app-shell et la réserve
// BOTTOM_NAV_SPACE dans AgencyMap.jsx). Se masque quand la page le demande
// (ex. défilement de la liste d'agences sur /carte) via NavVisibilityContext.
export default function MobileBottomNav() {
  const { t } = useThemeLang();
  const { hidden } = useNavVisibility();

  return (
    <nav className={`mobile-bottom-nav${hidden ? ' mobile-bottom-nav-hidden' : ''}`} aria-label={t('nav_home')}>
      {ITEMS.map(({ to, end, Icon, key }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `mbn-item${isActive ? ' active' : ''}`}>
          <span className="mbn-icon-wrap">
            <Icon size={17} />
          </span>
          <span className="mbn-label">{t(key)}</span>
        </NavLink>
      ))}
      <LanguageMenu variant="bottomnav" />
    </nav>
  );
}
