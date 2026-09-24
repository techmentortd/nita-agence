import { useState, useEffect } from 'react';

export function useGeoPosition() {
  const [coords, setCoords] = useState(null); // null=en attente, undefined=refusé/indisponible
  useEffect(() => {
    if (!navigator.geolocation) { setCoords(undefined); return; }

    let gotFix = false;
    const onSuccess = ({ coords: c }) => {
      gotFix = true;
      setCoords({ lat: c.latitude, lng: c.longitude });
    };
    const onError = () => {
      // Un échec du relevé de précision (watchPosition) ne doit pas effacer
      // un premier relevé déjà obtenu.
      if (!gotFix) setCoords(undefined);
    };

    // Premier relevé rapide (réseau/wifi, moins précis mais quasi immédiat)
    // pour ne pas laisser "agence la plus proche" bloqué sur "—" pendant
    // plusieurs secondes le temps d'un lock GPS.
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
  }, []);
  return coords;
}
