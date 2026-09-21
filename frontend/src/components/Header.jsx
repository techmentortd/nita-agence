import { NavLink } from 'react-router-dom';
import { Home, MapPin, Calculator, Info, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import nitaLogo from '../assets/nita-logo-mark.png';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="nita-header">
      <NavLink to="/" className="nita-logo">
        <img src={nitaLogo} alt="NITA — Transfert d'argent" className="nita-logo-img" />
        <span className="nita-logo-tagline">Le transfert le plus fiable au Tchad</span>
      </NavLink>

      <nav className="nita-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          <Home size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          <span className="label">Accueil</span>
        </NavLink>
        <NavLink to="/carte" className={({ isActive }) => (isActive ? 'active' : '')}>
          <MapPin size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          <span className="label">Carte des agences</span>
        </NavLink>
        <NavLink to="/calculatrice" className={({ isActive }) => (isActive ? 'active' : '')}>
          <Calculator size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          <span className="label">Calculatrice</span>
        </NavLink>
        <NavLink to="/a-propos" className={({ isActive }) => (isActive ? 'active' : '')}>
          <Info size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          <span className="label">À propos</span>
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
              <ShieldCheck size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
              <span className="label">Admin</span>
            </NavLink>
            <button onClick={logout} title="Déconnexion" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--t3)', display: 'flex' }}>
              <LogOut size={14} />
            </button>
          </>
        ) : (
          <NavLink to="/admin/login" className={({ isActive }) => (isActive ? 'active' : '')} title="Espace administrateur">
            <ShieldCheck size={14} />
          </NavLink>
        )}
      </nav>
    </header>
  );
}
