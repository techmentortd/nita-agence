/**
 * AgencyMap — carte des agences NITA (N'Djamena)
 * OpenStreetMap + Leaflet, itinéraire réel via OSRM, panneau latéral animé.
 */
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, ChevronUp, LayoutGrid, Building2, Navigation, MapPin, Star, Phone, Download, Check, WifiOff } from 'lucide-react';
import { fetchAgences } from '../services/services';
import { fmtDist } from '../utils/utils';
import { saveAgences, getAllAgences } from '../lib/db';
import { downloadOfflineMap, getOfflineMapCacheInfo, estimateTileCount } from '../lib/offlineMap';
import { useThemeLang } from '../context/ThemeLangContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const NDJAMENA = { lat: 12.1348, lng: 15.0557 };
const ORANGE = '#f2701e';
const BLUE = '#143b8f';

export default function AgencyMap() {
  const { t } = useThemeLang();
  const [searchParams] = useSearchParams();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const routingRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userCircleRef = useRef(null);

  const [agences, setAgences] = useState([]);
  const [userLocation, setUserLocation] = useState({ ...NDJAMENA });
  const [refLocation, setRefLocation] = useState({ ...NDJAMENA });
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [distFilter, setDistFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [geoOk, setGeoOk] = useState(false);
  const [geoFar, setGeoFar] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [offlineData, setOfflineData] = useState(false);
  const [dlState, setDlState] = useState('idle'); // idle | downloading | done | error
  const [dlProgress, setDlProgress] = useState({ done: 0, total: 0 });
  const [tileCache, setTileCache] = useState({ cached: 0 });

  useEffect(() => {
    getOfflineMapCacheInfo().then(setTileCache);
  }, [dlState]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Chargement des agences (score recalculé côté serveur dès qu'on a le GPS) ──
     Hors ligne : repli sur la copie IndexedDB (le tri par distance se fait
     alors côté client, la formule est la même que côté serveur). */
  useEffect(() => {
    const params = geoOk ? { lat: userLocation.lat, lng: userLocation.lng } : {};
    fetchAgences(params)
      .then((rows) => {
        setAgences(rows || []);
        setOfflineData(false);
        setLoading(false);
        if (rows?.length) saveAgences(rows);
      })
      .catch(async () => {
        const cached = await getAllAgences();
        if (cached.length) {
          const withDist = geoOk
            ? cached
                .map((a) => {
                  const R = 6371;
                  const toRad = (d) => (d * Math.PI) / 180;
                  const dLat = toRad(a.latitude - userLocation.lat);
                  const dLng = toRad(a.longitude - userLocation.lng);
                  const h =
                    Math.sin(dLat / 2) ** 2 +
                    Math.cos(toRad(userLocation.lat)) * Math.cos(toRad(a.latitude)) * Math.sin(dLng / 2) ** 2;
                  return { ...a, distance_km: Math.round(R * 2 * Math.asin(Math.min(1, Math.sqrt(h))) * 100) / 100 };
                })
                .sort((a, b) => a.distance_km - b.distance_km)
            : cached;
          setAgences(withDist);
          setOfflineData(true);
        }
        setLoading(false);
      });
  }, [geoOk]);

  /* ── Géolocalisation ── */
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setGeoOk(true);
        const R = 6371;
        const toRad = (d) => (d * Math.PI) / 180;
        const a =
          Math.sin(toRad(loc.lat - NDJAMENA.lat) / 2) ** 2 +
          Math.cos(toRad(NDJAMENA.lat)) * Math.cos(toRad(loc.lat)) * Math.sin(toRad(loc.lng - NDJAMENA.lng) / 2) ** 2;
        const distFromNdj = R * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
        if (distFromNdj <= 100) {
          setRefLocation(loc);
          setGeoFar(false);
          if (mapRef.current) mapRef.current.setView([loc.lat, loc.lng], 14);
        } else {
          setRefLocation({ ...NDJAMENA });
          setGeoFar(true);
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  /* ── Init carte ── */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || loading) return;
    const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([NDJAMENA.lat, NDJAMENA.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;
  }, [loading]);

  const getFiltered = () => {
    const q = search.trim().toLowerCase();
    return agences.filter((a) => {
      if (q && !a.nom.toLowerCase().includes(q) && !(a.quartier || '').toLowerCase().includes(q)) return false;
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (distFilter !== 'all' && a.distance_km != null && a.distance_km > Number(distFilter)) return false;
      return true;
    });
  };

  /* ── Marqueurs ── */
  useEffect(() => {
    if (!mapRef.current || !agences.length) return;

    markersRef.current.forEach((m) => mapRef.current.removeLayer(m));
    markersRef.current.clear();

    const filtered = getFiltered();
    filtered.forEach((a, idx) => {
      const isNearest = idx === 0 && geoOk;
      const isSel = selected?.id === a.id;
      const isPrincipale = a.type === 'principale';

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:${isSel ? 46 : 38}px;height:${isSel ? 46 : 38}px;
          border-radius:50%;display:flex;align-items:center;justify-content:center;
          background:${isSel ? ORANGE : '#fff'};
          border:3px solid ${isSel ? '#fff' : isPrincipale ? ORANGE : BLUE};
          box-shadow:${isNearest ? `0 0 0 8px rgba(242,112,30,.18),` : ''}0 4px 16px rgba(0,0,0,.18);
          font-size:${isSel ? 20 : 16}px;color:${isSel ? '#fff' : isPrincipale ? ORANGE : BLUE};
          transition:all .2s;
        ">🏦</div>`,
        iconSize: [isSel ? 46 : 38, isSel ? 46 : 38],
        iconAnchor: [isSel ? 23 : 19, isSel ? 23 : 19],
      });

      const marker = L.marker([a.latitude, a.longitude], { icon }).addTo(mapRef.current);
      marker.on('click', () => {
        setSelected(a);
        mapRef.current.panTo([a.latitude, a.longitude], { animate: true });
      });
      markersRef.current.set(a.id, marker);
    });

    if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current);
    if (userCircleRef.current) mapRef.current.removeLayer(userCircleRef.current);
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: L.divIcon({
        className: '',
        html: `<div style="width:18px;height:18px;background:${BLUE};border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 8px rgba(20,59,143,.15);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    }).addTo(mapRef.current);
    userCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
      radius: 150,
      color: BLUE,
      fillColor: BLUE,
      fillOpacity: 0.05,
      weight: 1,
    }).addTo(mapRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agences, selected, search, typeFilter, distFilter, userLocation]);

  /* ── Paramètre d'URL ?agenceId= ── */
  useEffect(() => {
    if (!agences.length || !mapRef.current) return;
    const id = searchParams.get('agenceId');
    if (!id) return;
    const a = agences.find((x) => x.id.toString() === id);
    if (a) {
      setSelected(a);
      mapRef.current.flyTo([a.latitude, a.longitude], 15, { duration: 0.8 });
      drawRoute(a);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agences]);

  const drawRoute = async (a) => {
    if (!mapRef.current || !userLocation) return;
    if (routingRef.current) {
      routingRef.current.forEach((l) => mapRef.current.removeLayer(l));
      routingRef.current = null;
    }
    const from = [userLocation.lat, userLocation.lng];
    const to = [a.latitude, a.longitude];
    const layers = [];
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${a.longitude},${a.latitude}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.routes?.length) {
        const coords = json.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        layers.push(L.polyline(coords, { color: ORANGE, weight: 5, opacity: 0.9 }).addTo(mapRef.current));
      } else throw new Error('no route');
    } catch {
      layers.push(L.polyline([from, to], { color: ORANGE, weight: 5, opacity: 0.85, dashArray: '10, 8' }).addTo(mapRef.current));
    }
    layers.push(
      L.marker(to, {
        icon: L.divIcon({
          className: '',
          html: `<div style="width:12px;height:12px;background:${ORANGE};border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      }).addTo(mapRef.current)
    );
    routingRef.current = layers;
    mapRef.current.fitBounds(L.latLngBounds(L.latLng(...from), L.latLng(...to)), { padding: [60, 60], maxZoom: 15 });
  };

  const focusOn = (a, withRoute = false) => {
    setSelected(a);
    mapRef.current?.flyTo([a.latitude, a.longitude], 15, { duration: 0.7 });
    setTimeout(() => markersRef.current.get(a.id)?.openPopup(), 120);
    if (withRoute) setTimeout(() => drawRoute(a), 200);
  };

  const handleDownloadOfflineMap = async () => {
    setDlState('downloading');
    setDlProgress({ done: 0, total: estimateTileCount() });
    try {
      await downloadOfflineMap((done, total) => setDlProgress({ done, total }));
      setDlState('done');
      getOfflineMapCacheInfo().then(setTileCache);
    } catch {
      setDlState('error');
    }
  };

  const filtered = getFiltered();

  const SHEET_H = 340;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        top: isMobile ? 62 : 62,
        display: 'flex',
        background: '#eef1f6',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .map-sidebar-panel::-webkit-scrollbar { width:4px; }
        .map-sidebar-panel::-webkit-scrollbar-thumb { background:rgba(0,0,0,.15); border-radius:2px; }
        .ag-card { transition: background .15s, box-shadow .15s; }
        .ag-card:hover { background: #fff6ee !important; }
        .ag-card.active { background: #fff1e2 !important; box-shadow: inset 3px 0 0 ${ORANGE}; }
        @keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      `}</style>

      {/* ── PANNEAU LATÉRAL / BOTTOM SHEET ── */}
      <div
        className="map-sidebar"
        style={
          isMobile
            ? {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: SHEET_H,
                zIndex: 20,
                transform: sheetOpen ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
                background: '#fff',
                borderRadius: '20px 20px 0 0',
                borderTop: '1px solid #e5e9f0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }
            : {
                width: panelOpen ? 300 : 0,
                minWidth: panelOpen ? 300 : 0,
                flexShrink: 0,
                background: '#fff',
                borderRight: '1px solid #e5e9f0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'width .2s ease, min-width .2s ease',
                position: 'relative',
                zIndex: 500,
              }
        }
      >
        {isMobile && (
          <div onClick={() => setSheetOpen((v) => !v)} style={{ padding: '10px 0 4px', display: 'flex', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 2 }} />
          </div>
        )}

        <div style={{ padding: '12px 14px', borderBottom: '1px solid #e5e9f0', flexShrink: 0 }}>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8a93a6' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={t('map_search_ph')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px 8px 30px', border: '1px solid #e5e9f0', borderRadius: 10, fontSize: 13, background: '#f8f9fb', color: '#142244', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { val: 'all', label: t('map_filter_all'), Icon: LayoutGrid },
              { val: 'principale', label: t('map_filter_principale'), Icon: Star },
              { val: 'standard', label: t('map_filter_standard'), Icon: Building2 },
            ].map(({ val, label, Icon }) => (
              <button
                key={val}
                onClick={() => setTypeFilter(val)}
                style={{
                  flex: 1,
                  padding: '5px 4px',
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 8,
                  border: `1px solid ${typeFilter === val ? ORANGE : '#e5e9f0'}`,
                  background: typeFilter === val ? ORANGE : '#f8f9fb',
                  color: typeFilter === val ? '#fff' : '#4b5872',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {[
              { val: 'all', label: t('map_dist_label') },
              { val: '2', label: '2 km' },
              { val: '5', label: '5 km' },
              { val: '10', label: '10 km' },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setDistFilter(val)}
                style={{
                  flex: 1,
                  padding: '5px 2px',
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 8,
                  border: `1px solid ${distFilter === val ? BLUE : '#e5e9f0'}`,
                  background: distFilter === val ? BLUE : '#f8f9fb',
                  color: distFilter === val ? '#fff' : '#4b5872',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                <Navigation size={10} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '8px 14px', borderBottom: '1px solid #e5e9f0', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#4b5872', fontWeight: 600 }}>{t('map_agence_count').replace('{n}', filtered.length)}</span>
          <span style={{ fontSize: 11, color: geoOk && !geoFar ? '#16a34a' : '#4b5872', display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={11} /> {geoOk && !geoFar ? t('map_located') : t('map_ndjamena')}
          </span>
        </div>

        {offlineData && (
          <div style={{ padding: '8px 14px', background: '#fff7ed', borderBottom: '1px solid #e5e9f0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#c2410c' }}>
            <WifiOff size={12} /> {t('map_offline_data')}
          </div>
        )}

        <div style={{ padding: '10px 14px', borderBottom: '1px solid #e5e9f0', flexShrink: 0 }}>
          {dlState === 'downloading' ? (
            <div>
              <div style={{ fontSize: 11, color: '#4b5872', fontWeight: 700, marginBottom: 5 }}>
                {t('map_dl_downloading')} {dlProgress.done}/{dlProgress.total}
              </div>
              <div style={{ height: 6, background: '#eef1f6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${dlProgress.total ? (dlProgress.done / dlProgress.total) * 100 : 0}%`, background: ORANGE, transition: 'width .2s' }} />
              </div>
            </div>
          ) : (
            <button
              onClick={handleDownloadOfflineMap}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '8px 10px', fontSize: 12, fontWeight: 700, borderRadius: 9,
                border: `1px solid ${dlState === 'done' ? '#bbf7d0' : '#e5e9f0'}`,
                background: dlState === 'done' ? '#f0fdf4' : '#f8f9fb',
                color: dlState === 'done' ? '#16a34a' : '#142244',
                cursor: 'pointer',
              }}
            >
              {dlState === 'done' ? <Check size={13} /> : <Download size={13} />}
              {dlState === 'done'
                ? t('map_dl_available').replace('{n}', tileCache.cached)
                : dlState === 'error'
                ? t('map_dl_retry')
                : t('map_dl_download')}
            </button>
          )}
        </div>

        <div className="map-sidebar-panel" style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#4b5872', fontSize: 13 }}>{t('map_loading')}</div>
          ) : !filtered.length ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#4b5872', fontSize: 13 }}>{t('map_none_found')}</div>
          ) : (
            filtered.map((a, idx) => (
              <div
                key={a.id}
                className={`ag-card${selected?.id === a.id ? ' active' : ''}`}
                onClick={() => focusOn(a, false)}
                style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #e5e9f0', display: 'flex', gap: 10, alignItems: 'center' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, overflow: 'hidden', background: '#fff1e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} color={ORANGE} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#142244', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {idx === 0 && geoOk && <Star size={11} fill={ORANGE} color={ORANGE} style={{ marginRight: 3, verticalAlign: 'middle' }} />}
                      {a.nom}
                    </span>
                    {a.distance_km != null && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Navigation size={10} />
                        {fmtDist(a.distance_km)}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 20,
                        background: a.type === 'principale' ? '#fff1e6' : '#eef1fa',
                        color: a.type === 'principale' ? ORANGE : BLUE,
                      }}
                    >
                      {a.type === 'principale' ? t('map_badge_principale') : t('map_badge_standard')}
                    </span>
                  </div>
                  {a.adresse && <div style={{ fontSize: 11, color: '#8a93a6', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.adresse}</div>}
                  <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        focusOn(a, true);
                      }}
                      style={{ padding: '4px 8px', fontSize: 11, fontWeight: 700, borderRadius: 7, background: ORANGE, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Navigation size={10} />
                      {t('map_itinerary')}
                    </button>
                    {a.telephone && (
                      <a
                        href={`tel:${a.telephone}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '4px 8px', fontSize: 11, fontWeight: 700, borderRadius: 7, background: '#f8f9fb', color: '#142244', border: '1px solid #e5e9f0', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <Phone size={10} />
                        {t('map_call')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {!isMobile && (
        <button
          onClick={() => setPanelOpen((v) => !v)}
          aria-label={panelOpen ? t('map_hide_filters') : t('map_show_filters')}
          title={panelOpen ? t('map_hide_filters') : t('map_show_filters')}
          style={{
            position: 'absolute',
            left: panelOpen ? 300 : 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            minWidth: 36,
            height: 56,
            padding: '0 8px',
            background: ORANGE,
            border: 'none',
            borderRadius: panelOpen ? '0 10px 10px 0' : '10px 0 0 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
            fontWeight: 700,
            transition: 'left .2s ease',
            boxShadow: '2px 0 16px rgba(242,112,30,.45)',
          }}
        >
          {panelOpen ? '‹' : '›'}
        </button>
      )}

      {isMobile && (
        <button
          onClick={() => setSheetOpen((v) => !v)}
          aria-label={sheetOpen ? t('map_hide_panel') : t('map_show_panel')}
          style={{
            position: 'absolute',
            bottom: sheetOpen ? SHEET_H + 12 : 16,
            right: 68,
            zIndex: 30,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid #e5e9f0',
            boxShadow: '0 2px 16px rgba(0,0,0,.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'bottom 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <ChevronUp size={20} color="#4b5872" style={{ transform: sheetOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s ease' }} />
        </button>
      )}

      {/* ── CARTE ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', zIndex: 1 }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {selected && (
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 400,
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,.18)',
              border: '1px solid #e5e9f0',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              maxWidth: 380,
              width: 'calc(100% - 48px)',
              animation: 'slideUp .2s ease',
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 10, background: '#fff1e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={24} color={ORANGE} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#142244' }}>{selected.nom}</div>
              <div style={{ fontSize: 12, color: '#8a93a6', marginTop: 2 }}>{selected.adresse}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: ORANGE, marginTop: 2 }}>
                {selected.type === 'principale' ? t('home_type_principale') : t('home_type_standard')} {selected.distance_km != null && `· ${fmtDist(selected.distance_km)}`}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <button onClick={() => drawRoute(selected)} style={{ padding: '6px 12px', fontSize: 12, fontWeight: 700, background: ORANGE, color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer' }}>
                {t('map_itinerary')}
              </button>
              {selected.telephone && (
                <a href={`tel:${selected.telephone}`} style={{ padding: '6px 12px', fontSize: 12, fontWeight: 700, background: '#f8f9fb', color: '#142244', border: '1px solid #e5e9f0', borderRadius: 9, textDecoration: 'none', textAlign: 'center' }}>
                  {t('map_call')}
                </a>
              )}
            </div>
            <button
              onClick={() => {
                setSelected(null);
                if (routingRef.current) {
                  routingRef.current.forEach((l) => mapRef.current?.removeLayer(l));
                  routingRef.current = null;
                }
              }}
              style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', border: '1px solid #e5e9f0', background: '#f8f9fb', cursor: 'pointer', fontSize: 14, color: '#4b5872', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ×
            </button>
          </div>
        )}

        <button
          onClick={() => {
            if (mapRef.current) mapRef.current.setView([userLocation.lat, userLocation.lng], 15);
          }}
          style={{
            position: 'absolute',
            bottom: isMobile ? (sheetOpen ? SHEET_H + 12 : 16) : selected ? 90 : 20,
            right: 16,
            zIndex: 400,
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid #e5e9f0',
            boxShadow: '0 4px 16px rgba(0,0,0,.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'bottom .4s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
          title={t('map_locate_me')}
        >
          <LocateFixed size={18} color={geoOk ? ORANGE : '#4b5872'} />
        </button>
      </div>
    </div>
  );
}
