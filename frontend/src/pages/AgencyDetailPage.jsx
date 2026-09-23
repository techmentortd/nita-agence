/**
 * AgencyDetailPage — fiche complète d'une agence NITA
 * Structure calquée sur PharmacyDetail d'iPharmacie : header sticky, hero,
 * boutons d'action, sections d'infos, carte de localisation en bas de page.
 */
import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapPin, Phone, Clock, Building2, Navigation, Star, ShieldCheck, MessageCircle } from 'lucide-react';
import { useGeoPosition } from '../hooks/useGeoPosition';
import { fetchAgenceById, fetchAgences } from '../services/services';
import { fmtDist } from '../utils/utils';
import ZoneBadge from '../components/ZoneBadge';

function whatsappLink(telephone, nom) {
  const digits = (telephone || '').replace(/\D/g, '');
  if (!digits) return null;
  const text = encodeURIComponent(`Bonjour, je voudrais des informations sur l'agence NITA ${nom || ''}.`.trim());
  return `https://wa.me/${digits}?text=${text}`;
}

const ORANGE = '#f2701e';
const BLUE = '#143b8f';

export function AgencyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const coords = useGeoPosition();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const { data: agence, isLoading, isError } = useQuery({
    queryKey: ['agence', id],
    queryFn: () => fetchAgenceById(id),
  });

  const { data: scored } = useQuery({
    queryKey: ['agence-dist', id, coords?.lat, coords?.lng],
    queryFn: () => fetchAgences({ lat: coords?.lat, lng: coords?.lng }),
    enabled: !!coords?.lat,
  });

  const distance = scored?.find((a) => String(a.id) === String(id))?.distance_km;
  const isPrincipale = agence?.type === 'principale';
  const waLink = agence ? whatsappLink(agence.telephone, agence.nom) : null;

  useEffect(() => {
    if (!agence || !mapContainerRef.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, { zoomControl: false, scrollWheelZoom: false })
      .setView([agence.latitude, agence.longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.marker([agence.latitude, agence.longitude], {
      icon: L.divIcon({
        className: '',
        html: `<div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;border:3px solid ${ORANGE};box-shadow:0 4px 16px rgba(0,0,0,.18);font-size:16px;">🏦</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      }),
    }).addTo(map);

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [agence]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="skel" style={{ height: 220 }} />
        <section className="section" style={{ maxWidth: 760 }}>
          <div className="skel" style={{ height: 200, borderRadius: 18 }} />
        </section>
      </div>
    );
  }

  if (isError || !agence) {
    return (
      <section className="section" style={{ maxWidth: 760, textAlign: 'center' }}>
        <p>Agence introuvable.</p>
        <Link to="/" className="btn btn-blue">Retour à l'accueil</Link>
      </section>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ══ En-tête sticky ══ */}
      <div className="adetail-stickybar">
        <button onClick={() => navigate(-1)} className="adetail-back-btn" aria-label="Retour">
          <ArrowLeft size={17} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="adetail-sticky-name">{agence.nom}</div>
          <div className="adetail-sticky-sub">
            <span className="dot" /> {agence.quartier}
          </div>
        </div>
        {isPrincipale && <ShieldCheck size={18} color={ORANGE} />}
      </div>

      {/* ══ Hero ══ */}
      <div className="adetail-hero">
        <div className="adetail-hero-icon"><Building2 size={72} opacity={0.28} color="#fff" /></div>
        <div className="adetail-hero-fade" />

        <div className="adetail-hero-badges">
          {agence.disponible === false && (
            <span className="adetail-badge adetail-badge-danger">Indisponible</span>
          )}
          <span className="adetail-badge">
            {isPrincipale ? <Star size={11} /> : <Building2 size={11} />}
            {isPrincipale ? 'Principale' : 'Standard'}
          </span>
          {agence.zone && <ZoneBadge zone={agence.zone} />}
        </div>

        <div className="adetail-hero-bottom">
          <h1>{agence.nom}</h1>
          {agence.adresse && (
            <p><MapPin size={11} /> {agence.adresse}</p>
          )}
        </div>
      </div>

      {/* ══ Corps ══ */}
      <div className="adetail-body">
        {/* Boutons d'action */}
        <div className="adetail-actions-grid">
          {agence.telephone && (
            <a href={`tel:${agence.telephone}`} className="adetail-btn adetail-btn-primary">
              <Phone size={14} /> Appeler
            </a>
          )}
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="adetail-btn adetail-btn-whatsapp">
              <MessageCircle size={14} /> WhatsApp
            </a>
          )}
          <button onClick={() => navigate(`/carte?agenceId=${agence.id}`)} className="adetail-btn adetail-btn-outline">
            <Navigation size={14} /> Itinéraire
          </button>
        </div>

        {distance != null && (
          <div className="adetail-distance">
            <Navigation size={12} /> À {fmtDist(distance)} de votre position
          </div>
        )}

        {/* Horaires */}
        <section className="adetail-section">
          <h2><Clock size={14} /> Horaires</h2>
          <div className="adetail-card-row">
            <span>Tous les jours</span>
            <span className="adetail-hours-value">{agence.horaires || '—'}</span>
          </div>
        </section>

        {/* Services */}
        {!!agence.services?.length && (
          <section className="adetail-section">
            <h2><Building2 size={14} /> Services</h2>
            <div className="detail-services">
              {agence.services.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </section>
        )}

        {/* Localisation */}
        <section className="adetail-section">
          <h2><MapPin size={14} /> Localisation</h2>
          <div className="adetail-map-box">
            <div ref={mapContainerRef} className="adetail-map" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default AgencyDetailPage;
