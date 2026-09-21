import { useState, useEffect } from 'react';

export function useGeoPosition() {
  const [coords, setCoords] = useState(null); // null=en attente, undefined=refusé/indispo
  useEffect(() => {
    if (!navigator.geolocation) { setCoords(undefined); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => setCoords({ lat: c.latitude, lng: c.longitude }),
      () => setCoords(undefined),
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);
  return coords;
}
