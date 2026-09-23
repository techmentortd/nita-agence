import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Navigation, Building2, Clock, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import { useGeoPosition } from '../hooks/useGeoPosition';
import { fetchAgences, fetchAgencesStats } from '../services/services';
import { fmtDist } from '../utils/utils';
import { useThemeLang } from '../context/ThemeLangContext';
import { horairesLabel } from '../i18n/translations';

export function HomePage() {
  const coords = useGeoPosition();
  const navigate = useNavigate();
  const { t, lang } = useThemeLang();
  const [search, setSearch] = useState('');
  const SeeAllArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

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
              <div className="n">{nearest ? fmtDist(nearest.distance_km) : '—'}</div>
              <div className="l">{t('home_stat_nearest')}</div>
            </div>
            <div className="stat-pill">
              <div className="n">24/7</div>
              <div className="l">{t('home_stat_support')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
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
