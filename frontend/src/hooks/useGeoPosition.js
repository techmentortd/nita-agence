import { useState, useEffect, useCallback } from 'react';

// Raison d'un échec de géolocalisation, pour expliquer à l'utilisateur quoi
// faire : 'denied' (permission refusée), 'unavailable' (GPS/localisation
// coupé), 'timeout' (trop long), 'unsupported' (navigateur sans API).
const ERROR_BY_CODE = { 1: 'denied', 2: 'unavailable', 3: 'timeout' };

export function useGeoLocation() {
  const [coords, setCoords] = useState(null); // null=en attente, undefined=refusé/indisponible
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setCoords((c) => (c?.lat ? c : null));
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) { setCoords(undefined); setError('unsupported'); return; }

    let gotFix = false;
    const onSuccess = ({ coords: c }) => {
      gotFix = true;
      setError(null);
      setCoords({ lat: c.latitude, lng: c.longitude });
    };
    const onError = (err) => {
      // Un échec du relevé de précision (watchPosition) ne doit pas effacer
      // un premier relevé déjà obtenu.
      if (!gotFix) {
        setCoords(undefined);
        setError(ERROR_BY_CODE[err?.code] || 'unavailable');
      }
    };

    // Premier relevé rapide (réseau/wifi, moins précis mais quasi immédiat)
    // pour ne pas laisser "agence la plus proche" bloqué pendant plusieurs
    // secondes le temps d'un lock GPS.
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    });

    // Affine ensuite la position en tâche de fond (GPS) sans jamais faire
    // régresser l'UI si ce relevé plus précis échoue.
    const watchId = navigator.geolocation.watchPosition(onSuccess, () => {}, {
      enableHighAccuracy: true,
      maximumAge: 60000,
      timeout: 15000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [attempt]);

  // Si l'utilisateur autorise la localisation dans les réglages du
  // navigateur pendant que la page est ouverte, on relance tout seul.
  useEffect(() => {
    let status;
    const onChange = () => { if (status.state === 'granted') retry(); };
    navigator.permissions?.query({ name: 'geolocation' })
      .then((s) => { status = s; s.addEventListener('change', onChange); })
      .catch(() => {});
    return () => status?.removeEventListener('change', onChange);
  }, [retry]);

  return { coords, error, retry };
}

export function useGeoPosition() {
  return useGeoLocation().coords;
}
