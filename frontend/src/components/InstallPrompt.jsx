import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import nitaLogo from '../assets/nita-logo-mark.png';

export default function InstallPrompt() {
  const { canPrompt, promptInstall, dismiss } = useInstallPrompt();

  if (!canPrompt) return null;

  return (
    <div className="install-toast" role="dialog" aria-label="Installer l'application">
      <img src={nitaLogo} alt="" className="install-toast-logo" />
      <div className="install-toast-text">
        <strong>Installer NITA Agences</strong>
        <span>Accès rapide, même hors ligne</span>
      </div>
      <button className="install-toast-btn" onClick={promptInstall}>
        <Download size={13} /> Installer
      </button>
      <button className="install-toast-close" onClick={dismiss} aria-label="Fermer">
        <X size={14} />
      </button>
    </div>
  );
}
