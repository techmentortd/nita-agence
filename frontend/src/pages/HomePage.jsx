import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Navigation, Building2, Clock, Phone } from 'lucide-react';
import { useGeoPosition } from '../hooks/useGeoPosition';
import { fetchAgences, fetchAgencesStats } from '../services/services';
import { fmtDist } from '../utils/utils';

export function HomePage() {
  const coords = useGeoPosition();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: agences = [], isLoading } = useQuery({
    queryKey: ['home-agences', coords?.lat, coords?.lng],
    queryFn: () => fetchAgences({ lat: coords?.lat, lng: coords?.lng }),
    placeholderData: (prev) => prev,
  });

  const { data: stats = {} } = useQuery({
    queryKey: ['agences-stats'],
    queryFn: fetchAgencesStats,
    placeholderData: { total_agences: 0 },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? agences.filter((a) => a.nom.toLowerCase().includes(q) || (a.quartier || '').toLowerCase().includes(q))
      : agences;
    return list.slice(0, 8);
  }, [agences, search]);

  const nearest = coords?.lat ? filtered[0] : null;

  const goToMap = (agence) => {
    navigate(agence ? `/carte?agenceId=${agence.id}` : '/carte');
  };

  return (
    <>
      <section className="hero">
        <div className="hero-orb o1" />
        <div className="hero-orb o2" />
        <div className="hero-orb o3" />
        <div className="hero-content">
          <h1>
            Trouvez l'agence <em>NITA</em> la plus proche
          </h1>
          <p className="sub">
            Localisation en temps réel, itinéraire et informations pratiques pour toutes les agences NITA de N'Djamena.
          </p>
          <div className="hero-search">
            <div className="hero-search-input">
              <Search size={16} color="#8a93a6" />
              <input
                type="text"
                placeholder="Rechercher un quartier, une agence…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && goToMap()}
              />
            </div>
            <button className="btn btn-orange" onClick={() => goToMap()}>
              Voir la carte
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-pill">
              <div className="n">{stats.total_agences ?? '—'}</div>
              <div className="l">Agences à N'Djamena</div>
            </div>
            <div className="stat-pill">
              <div className="n">{nearest ? fmtDist(nearest.distance_km) : '—'}</div>
              <div className="l">Agence la plus proche</div>
            </div>
            <div className="stat-pill">
              <div className="n">24/7</div>
              <div className="l">Support NITA</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>{coords?.lat ? 'Agences classées par proximité' : 'Nos agences à N\'Djamena'}</h2>
          <a href="/carte" onClick={(e) => { e.preventDefault(); goToMap(); }}>
            Voir toutes sur la carte →
          </a>
        </div>

        {isLoading ? (
          <div className="agence-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skel" style={{ height: 140 }} />
            ))}
          </div>
        ) : (
          <div className="agence-grid">
            {filtered.map((a, idx) => (
              <div key={a.id} className="agence-card">
                {coords?.lat && idx === 0 && <span className="badge-nearest">La plus proche</span>}
                {a.disponible === false && <span className="badge-unavailable">Indisponible</span>}
                <div className="top-row">
                  <div>
                    <div className="name">{a.nom}</div>
                    <div className="quartier">
                      <MapPin size={11} style={{ verticalAlign: '-1px', marginRight: 3 }} />
                      {a.quartier}
                    </div>
                  </div>
                  {a.distance_km != null && (
                    <span className="dist">
                      <Navigation size={10} style={{ verticalAlign: '-1px', marginRight: 3 }} />
                      {fmtDist(a.distance_km)}
                    </span>
                  )}
                </div>

                <span className={`badge-type ${a.type}`}>
                  <Building2 size={10} />
                  {a.type === 'principale' ? 'Agence principale' : 'Agence standard'}
                </span>

                <div className="quartier" style={{ marginTop: 8 }}>
                  <Clock size={11} style={{ verticalAlign: '-1px', marginRight: 3 }} />
                  {a.horaires}
                </div>

                <div className="actions">
                  <button className="btn btn-blue" onClick={() => navigate(`/carte?agenceId=${a.id}`)}>
                    <Navigation size={12} /> Itinéraire
                  </button>
                  <button className="btn btn-ghost" onClick={() => navigate(`/agences/${a.id}`)}>
                    Détails
                  </button>
                  {a.telephone && (
                    <a className="btn btn-ghost" href={`tel:${a.telephone}`}>
                      <Phone size={12} /> Appeler
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default HomePage;
