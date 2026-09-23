import { useEffect, useState } from 'react';

const DISMISS_KEY = 'nita_install_dismissed_at';
const DISMISS_DAYS = 14;

function wasDismissedRecently() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const days = (Date.now() - Number(raw)) / (1000 * 60 * 60 * 24);
  return days < DISMISS_DAYS;
}

function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true // iOS Safari
  );
}

export function useInstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState(null);
  const [dismissed, setDismissed] = useState(wasDismissedRecently);
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredEvent(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const canPrompt = !!deferredEvent && !installed && !dismissed;
  // Pour un bouton de secours explicite (page À propos) : ignore le
  // cooldown de 14 jours du toast, tant que le navigateur a bien proposé
  // l'événement natif et que l'app n'est pas déjà installée.
  const canInstall = !!deferredEvent && !installed;

  const promptInstall = async () => {
    if (!deferredEvent) return;
    deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;
    setDeferredEvent(null);
    if (outcome !== 'accepted') dismiss();
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  };

  return { canPrompt, canInstall, promptInstall, dismiss, installed };
}
