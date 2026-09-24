import { Languages } from 'lucide-react';
import { useThemeLang } from '../context/ThemeLangContext';

// variant="header" : bouton rond classique (desktop, et header mobile).
// variant="bottomnav" : habillé comme les autres items de MobileBottomNav.
// Un appui bascule directement la langue (fr <-> ar), sans menu.
export default function LanguageMenu({ variant = 'header' }) {
  const { t, lang, setLang } = useThemeLang();
  const isBottomNav = variant === 'bottomnav';

  const toggleLang = () => setLang(lang === 'ar' ? 'fr' : 'ar', true);

  return (
    <div className={isBottomNav ? 'mbn-item mbn-lang' : 'settings-wrap'}>
      <button
        type="button"
        className={isBottomNav ? 'mbn-lang-btn' : 'settings-btn'}
        onClick={toggleLang}
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
    </div>
  );
}
