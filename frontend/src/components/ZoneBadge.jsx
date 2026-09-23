import { MapPinned } from 'lucide-react';
import { zoneInfo } from '../utils/zones';

export default function ZoneBadge({ zone, fallback = 'Super-admin' }) {
  const info = zoneInfo(zone);
  if (!info) {
    return <span className="zone-badge zone-badge-super"><MapPinned size={11} /> {fallback}</span>;
  }
  return (
    <span className="zone-badge" style={{ '--zone-color': info.color }}>
      <MapPinned size={11} /> {info.nom}
    </span>
  );
}
