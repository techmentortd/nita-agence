import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, Calculator, Info, ShieldCheck, LogOut, Settings2, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useThemeLang } from '../context/ThemeLangContext';
import nitaLogo from '../assets/nita-logo-mark.png';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { t, lang, langAuto, setLang, theme, setTheme } = useThemeLang();
  const [open, setOpen] = useState(false);

  return (
    <header className="nita-header">
      <NavLink to="/" className="nita-logo">
        <img src={nitaLogo} alt="NITA — Transfert d'argent" className="nita-logo-img" />
        <span className="nita-logo-tagline">{t('tagline')}</span>
      </NavLink>

      <nav className="nita-nav">
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
        {isAuthenticated ? (
          <>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
              <ShieldCheck size={14} style={{ verticalAlign: '-2px', marginInlineEnd: 6 }} />
              <span className="label">{t('nav_admin')}</span>
            </NavLink>
            <button onClick={logout} title={t('nav_logout')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--t3)', display: 'flex' }}>
              <LogOut size={14} />
            </button>
          </>
        ) : (
          <NavLink to="/admin/login" className={({ isActive }) => (isActive ? 'active' : '')} title={t('nav_admin_space')}>
            <ShieldCheck size={14} />
          </NavLink>
        )}

        <div className="settings-wrap">
          <button className="settings-btn" onClick={() => setOpen((v) => !v)} aria-label={t('settings_theme')}>
            <Settings2 size={15} />
          </button>
          {open && (
            <>
              <div className="settings-backdrop" onClick={() => setOpen(false)} />
              <div className="settings-dropdown">
                <div className="settings-group-label">{t('settings_theme')}</div>
                <div className="settings-row">
                  {[
                    { val: 'light', label: t('settings_light'), Icon: Sun },
                    { val: 'auto', label: t('settings_auto'), Icon: Monitor },
                    { val: 'dark', label: t('settings_dark'), Icon: Moon },
                  ].map(({ val, label, Icon }) => (
                    <button key={val} className={`settings-opt${theme === val ? ' on' : ''}`} onClick={() => setTheme(val)}>
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>
                <div className="settings-group-label">{t('settings_language')}</div>
                <div className="settings-row">
                  <button className={`settings-opt${lang === 'fr' ? ' on' : ''}`} onClick={() => setLang('fr', true)}>
                    🇫🇷 Français
                  </button>
                  <button className={`settings-opt${lang === 'ar' ? ' on' : ''}`} onClick={() => setLang('ar', true)}>
                    🇹🇩 العربية
                  </button>
                </div>
                {langAuto && <div className="settings-auto-tag">{t('settings_lang_auto_tag')}</div>}
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
