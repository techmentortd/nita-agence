import { useThemeLang } from '../context/ThemeLangContext';

export default function Footer() {
  const { t } = useThemeLang();
  return (
    <footer className="nita-footer">
      <div className="nita-footer-line">© {new Date().getFullYear()} {t('footer_brand')}</div>
      <div className="nita-footer-line nita-footer-sub">{t('footer_location')}</div>
    </footer>
  );
}
