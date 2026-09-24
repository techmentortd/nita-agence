import { useState } from 'react';
import { Languages, Sun, Moon, Monitor } from 'lucide-react';
import { useThemeLang } from '../context/ThemeLangContext';

// variant="header" : bouton rond classique (desktop, et header mobile).
// variant="bottomnav" : habillé comme les autres items de MobileBottomNav,
// dropdown ouvert vers le haut puisqu'il est ancré en bas de l'écran.
export default function LanguageMenu({ variant = 'header' }) {
  const { t, lang, langAuto, setLang, theme, setTheme, themeEnabled } = useThemeLang();
  const [open, setOpen] = useState(false);
  const isBottomNav = variant === 'bottomnav';

  return (
    <div className={isBottomNav ? 'mbn-item mbn-lang' : 'settings-wrap'}>
      <button
        type="button"
        className={isBottomNav ? `mbn-lang-btn${open ? ' active' : ''}` : 'settings-btn'}
        onClick={() => setOpen((v) => !v)}
        aria-label={t('settings_language')}
      >
        {isBottomNav ? (
          <>
            <span className="mbn-icon-wrap"><Languages size={18} /></span>
            <span className="mbn-label">{lang === 'ar' ? 'AR' : 'FR'}</span>
          </>
        ) : (
          <Languages size={15} />
        )}
      </button>
      {open && (
        <>
          <div className="settings-backdrop" onClick={() => setOpen(false)} />
          <div className={`settings-dropdown${isBottomNav ? ' settings-dropdown-up' : ''}`}>
            {themeEnabled && (
              <>
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
              </>
            )}
            <div className="settings-row">
              <button className={`settings-opt${lang === 'fr' ? ' on' : ''}`} onClick={() => { setLang('fr', true); setOpen(false); }}>
                🇫🇷 Français
              </button>
              <button className={`settings-opt${lang === 'ar' ? ' on' : ''}`} onClick={() => { setLang('ar', true); setOpen(false); }}>
                🇹🇩 العربية
              </button>
            </div>
            {langAuto && <div className="settings-auto-tag">{t('settings_lang_auto_tag')}</div>}
          </div>
        </>
      )}
    </div>
  );
}
