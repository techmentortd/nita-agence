import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { useThemeLang } from '../context/ThemeLangContext';
import nitaLogo from '../assets/nita-logo-mark.png';

export default function InstallPrompt() {
  const { canPrompt, promptInstall, dismiss } = useInstallPrompt();
  const { t } = useThemeLang();

  if (!canPrompt) return null;

  return (
    <div className="install-toast" role="dialog" aria-label={t('install_toast_title')}>
      <img src={nitaLogo} alt="" className="install-toast-logo" />
      <div className="install-toast-text">
        <strong>{t('install_toast_title')}</strong>
        <span>{t('install_toast_sub')}</span>
      </div>
      <button className="install-toast-btn" onClick={promptInstall}>
        <Download size={13} /> {t('install_toast_btn')}
      </button>
      <button className="install-toast-close" onClick={dismiss} aria-label="Fermer">
        <X size={14} />
      </button>
    </div>
  );
}
