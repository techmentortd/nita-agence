import { useState } from 'react';
import { LocateFixed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ZONES } from '../utils/zones';

const EMPTY = { nom: '', type: 'standard', quartier: '', zone: '', adresse: '', telephone: '', latitude: '', longitude: '', horaires: '7h-23h, tous les jours', services: 'Dépôt, Retrait, Transfert national' };

export default function AdminAgencyForm({ initial, onCancel, onSubmit, saving }) {
  const { zone: adminZone } = useAuth();
  // Un chef de zone ne peut créer/modifier que dans sa propre zone.
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, services: (initial.services || []).join(', ') }
      : { ...EMPTY, zone: adminZone || '' }
  );
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocateError("La géolocalisation n'est pas disponible sur cet appareil");
      return;
    }
    setLocating(true);
    setLocateError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => {
        setLocateError('Position indisponible — autorisez la géolocalisation ou saisissez les coordonnées manuellement');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      services: form.services.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <div>
          <label htmlFor="nom">Nom de l'agence</label>
          <input id="nom" value={form.nom} onChange={set('nom')} required />
        </div>
        <div>
          <label htmlFor="type">Type</label>
          <select id="type" value={form.type} onChange={set('type')}>
            <option value="standard">Standard</option>
            <option value="principale">Principale</option>
          </select>
        </div>
        <div>
          <label htmlFor="quartier">Quartier</label>
          <input id="quartier" value={form.quartier} onChange={set('quartier')} required />
        </div>
        <div>
          <label htmlFor="zone">Zone</label>
          <select id="zone" value={form.zone} onChange={set('zone')} disabled={!!adminZone} required>
            <option value="" disabled>Choisir une zone…</option>
            {ZONES.map((z) => (
              <option key={z.id} value={z.id}>{z.nom}</option>
            ))}
          </select>
          {adminZone && (
            <span style={{ fontSize: 11, color: 'var(--t3)', display: 'block', marginTop: 4 }}>
              Vous êtes chef de zone — limité à votre zone.
            </span>
          )}
        </div>
        <div>
          <label htmlFor="telephone">Téléphone</label>
          <input id="telephone" value={form.telephone} onChange={set('telephone')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="adresse">Adresse / repère</label>
          <input id="adresse" value={form.adresse} onChange={set('adresse')} required />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <label htmlFor="latitude" style={{ margin: 0 }}>Coordonnées GPS</label>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locating}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: 700, color: 'var(--orange-dark)',
                background: '#fff1e2', border: 'none', borderRadius: 999,
                padding: '5px 10px', cursor: locating ? 'default' : 'pointer',
              }}
            >
              <LocateFixed size={12} />
              {locating ? 'Détection…' : 'Détecter ma position'}
            </button>
          </div>
          {locateError && (
            <div style={{ fontSize: 11, color: 'var(--red)', marginBottom: 6 }}>{locateError}</div>
          )}
        </div>
        <div>
          <label htmlFor="latitude">Latitude</label>
          <input id="latitude" type="number" step="any" value={form.latitude} onChange={set('latitude')} required />
        </div>
        <div>
          <label htmlFor="longitude">Longitude</label>
          <input id="longitude" type="number" step="any" value={form.longitude} onChange={set('longitude')} required />
        </div>
        <div>
          <label htmlFor="horaires">Horaires</label>
          <input id="horaires" value={form.horaires} onChange={set('horaires')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="services">Services (séparés par des virgules)</label>
          <input id="services" value={form.services} onChange={set('services')} />
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="btn btn-orange" disabled={saving}>
          {saving ? 'Enregistrement…' : initial ? 'Enregistrer les modifications' : "Créer l'agence"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
