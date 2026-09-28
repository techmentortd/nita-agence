import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, MapPinOff, Navigation, Building2, Clock, Phone, ArrowRight, ArrowLeft, WifiOff, RotateCw } from 'lucide-react';
import { useGeoLocation } from '../hooks/useGeoPosition';
import { fetchAgences, fetchAgencesStats } from '../services/services';
import { fmtDist, haversineKm } from '../utils/utils';
import { useThemeLang } from '../context/ThemeLangContext';
import { horairesLabel } from '../i18n/translations';
import { saveAgences, getAllAgences } from '../lib/db';

export function HomePage() {
  const { coords, error: geoError, retry: retryGeo } = useGeoLocation();
  const navigate = useNavigate();
  const { t, lang } = useThemeLang();
  const [search, setSearch] = useState('');
  const [offlineData, setOfflineData] = useState(false);
  const SeeAllArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  // Les agences sont chargées une seule fois, sans la position : la distance
  // est calculée ici dès que la géolocalisation répond, sans attendre un
  // second aller-retour serveur. Hors ligne : repli sur la copie IndexedDB
  // (même logique que la carte, voir components/AgencyMap.jsx).
  const { data: rawAgences = [], isLoading } = useQuery({
    queryKey: ['home-agences'],
    queryFn: async () => {
      try {
        const rows = await fetchAgences();
        setOfflineData(false);
        if (rows?.length) saveAgences(rows);
        return rows;
      } catch (err) {
        const cached = await getAllAgences();
        if (!cached.length) throw err;
        setOfflineData(true);
        return cached;
      }
    },
  });

  // Même classement que le serveur (backend agenceController.scoreAgence) :
  // distance, avec un bonus de 0,4 km pour l'agence principale.
  const agences = useMemo(() => {
    if (!coords?.lat) return rawAgences;
    return rawAgences
      .map((a) => {
        const d = haversineKm(coords.lat, coords.lng, a.latitude, a.longitude);
        const score = Math.max(0, d - (a.type === 'principale' ? 0.4 : 0));
        return { ...a, distance_km: Math.round(d * 100) / 100, score };
      })
      .sort((a, b) => a.score - b.score);
  }, [rawAgences, coords?.lat, coords?.lng]);

  const { data: stats = {} } = useQuery({
    queryKey: ['agences-stats'],
    queryFn: async () => {
      try {
        return await fetchAgencesStats();
      } catch {
        const cached = await getAllAgences();
        return { total_agences: cached.length };
      }
    },
    placeholderData: { total_agences: 0 },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? agences.filter((a) => a.nom.toLowerCase().includes(q) || (a.quartier || '').toLowerCase().includes(q))
      : agences;
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
            {t('home_h1_before')} <em>NITA</em> {t('home_h1_after')}
          </h1>
          <p className="sub">{t('home_sub')}</p>
          <div className="hero-search">
            <div className="hero-search-input">
              <Search size={16} color="#8a93a6" />
              <input
                type="text"
                placeholder={t('home_search_ph')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && goToMap()}
              />
            </div>
            <button className="btn btn-orange" onClick={() => goToMap()}>
              {t('home_btn_map')}
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-pill">
              <div className="n">{stats.total_agences ?? '—'}</div>
              <div className="l">{t('home_stat_agences')}</div>
            </div>
            <div className="stat-pill">
              <div className="n">
                {nearest ? (
                  fmtDist(nearest.distance_km)
                ) : coords === null || (coords?.lat && isLoading) ? (
                  // En attente de la position (ou des agences) : on montre que
                  // ça charge plutôt qu'un "—" qui ressemble à un bug.
                  <span className="stat-spinner" role="status" aria-label={t('home_locating')} />
                ) : geoError ? (
                  <MapPinOff size={22} color="var(--t3)" style={{ verticalAlign: 'middle' }} aria-label={t('geo_off_short')} />
                ) : (
                  '—'
                )}
              </div>
              <div className="l">{t('home_stat_nearest')}</div>
            </div>
            <div className="stat-pill">
              <div className="n">24/7</div>
              <div className="l">{t('home_stat_support')}</div>
            </div>
          </div>

          {geoError && !coords?.lat && (
            <div className="geo-notice" role="alert">
              <span className="geo-notice-icon"><MapPinOff size={17} /></span>
              <div className="geo-notice-text">
                <strong>{t(`geo_err_${geoError}_title`)}</strong>
                <span>{t(`geo_err_${geoError}_help`)}</span>
              </div>
              {geoError !== 'unsupported' && (
                <button className="geo-notice-btn" onClick={retryGeo}>
                  <RotateCw size={13} /> {t('geo_retry')}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        {offlineData && (
          <div className="offline-banner">
            <WifiOff size={13} /> {t('map_offline_data')}
          </div>
        )}

        <div className="section-title">
          <h2>{coords?.lat ? t('home_title_near') : t('home_title_all')}</h2>
          <a href="/carte" onClick={(e) => { e.preventDefault(); goToMap(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            {t('home_see_all')} <SeeAllArrow size={13} />
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
                {coords?.lat && idx === 0 && <span className="badge-nearest">{t('home_badge_nearest')}</span>}
                {a.disponible === false && <span className="badge-unavailable">{t('home_badge_unavailable')}</span>}
                <div className="top-row">
                  <div>
                    <div className="name">{a.nom}</div>
                    <div className="quartier">
                      <MapPin size={11} style={{ verticalAlign: '-1px', marginInlineEnd: 3 }} />
                      {a.quartier}
                    </div>
                  </div>
                  {a.distance_km != null && (
                    <span className="dist">
                      <Navigation size={10} style={{ verticalAlign: '-1px', marginInlineEnd: 3 }} />
                      {fmtDist(a.distance_km)}
                    </span>
                  )}
                </div>

                <span className={`badge-type ${a.type}`}>
                  <Building2 size={10} />
                  {a.type === 'principale' ? t('home_type_principale') : t('home_type_standard')}
                </span>

                <div className="quartier" style={{ marginTop: 8 }}>
                  <Clock size={11} style={{ verticalAlign: '-1px', marginInlineEnd: 3 }} />
                  {horairesLabel(a.horaires, lang)}
                </div>

                <div className="actions">
                  <button className="btn btn-blue" onClick={() => navigate(`/carte?agenceId=${a.id}`)}>
                    <Navigation size={12} /> {t('home_btn_itinerary')}
                  </button>
                  <button className="btn btn-ghost" onClick={() => navigate(`/agences/${a.id}`)}>
                    {t('home_btn_details')}
                  </button>
                  {a.telephone && (
                    <a className="btn btn-ghost" href={`tel:${a.telephone}`}>
                      <Phone size={12} /> {t('home_btn_call')}
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
