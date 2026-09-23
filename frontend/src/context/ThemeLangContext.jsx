import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { TR } from '../i18n/translations';

const ThemeLangContext = createContext(null);

function detectLang() {
  const saved = localStorage.getItem('nita-lang');
  if (saved) return { lang: saved, auto: false };
  const browser = (navigator.language || 'fr').toLowerCase();
  return browser.startsWith('ar') ? { lang: 'ar', auto: true } : { lang: 'fr', auto: false };
}

export function ThemeLangProvider({ children }) {
  const [{ lang, auto: langAuto }, setLangState] = useState(detectLang);
  const [theme, setThemeState] = useState(() => localStorage.getItem('nita-theme') || 'auto');

  const applyLangDOM = useCallback((l) => {
    document.documentElement.setAttribute('lang', l);
    document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
  }, []);

  const applyTheme = useCallback((th) => {
    const dark = th === 'dark' || (th === 'auto' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, []);

  useEffect(() => { applyLangDOM(lang); }, [lang, applyLangDOM]);
  useEffect(() => { applyTheme(theme); }, [theme, applyTheme]);

  useEffect(() => {
    if (theme !== 'auto' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('auto');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme, applyTheme]);

  const setLang = (l, manual = false) => {
    if (manual) localStorage.setItem('nita-lang', l);
    setLangState({ lang: l, auto: manual ? false : langAuto });
  };

  const setTheme = (th) => {
    localStorage.setItem('nita-theme', th);
    setThemeState(th);
  };

  const t = useCallback((key) => (TR[lang] || TR.fr)[key] ?? key, [lang]);

  return (
    <ThemeLangContext.Provider value={{ lang, langAuto, setLang, theme, setTheme, t }}>
      {children}
    </ThemeLangContext.Provider>
  );
}

export function useThemeLang() {
  return useContext(ThemeLangContext);
}
