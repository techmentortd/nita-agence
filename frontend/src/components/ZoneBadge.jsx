import { MapPinned } from 'lucide-react';
import { zoneInfo } from '../utils/zones';
import { useThemeLang } from '../context/ThemeLangContext';

export default function ZoneBadge({ zone, fallback = 'Super-admin' }) {
  const { t } = useThemeLang();
  const info = zoneInfo(zone);
  if (!info) {
    return <span className="zone-badge zone-badge-super"><MapPinned size={11} /> {fallback}</span>;
  }
  return (
    <span className="zone-badge" style={{ '--zone-color': info.color }}>
      <MapPinned size={11} /> {t('zone_prefix')} {info.id}
    </span>
  );
}
