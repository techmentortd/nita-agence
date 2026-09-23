// Préchargement des tuiles OpenStreetMap pour N'Djamena — permet de
// consulter la carte sans connexion même dans des zones jamais visitées.
//
// ⚠️ Le serveur de tuiles public tile.openstreetmap.org a une politique
// d'usage qui interdit le téléchargement en masse (bulk downloading) :
// https://operations.osmfoundation.org/policies/tiles/
// On reste donc volontairement modeste (zooms 13-15, ~350 tuiles max,
// requêtes espacées) — correct pour un usage occasionnel par un
// utilisateur qui prépare sa carte hors-ligne. Pour un usage fréquent ou
// à grande échelle, il faut passer par un fournisseur payant (MapTiler,
// Thunderforest, etc.) ou un serveur de tuiles auto-hébergé.

const NDJAMENA_BBOX = { south: 12.02, north: 12.18, west: 14.98, east: 15.14 };
const ZOOM_LEVELS = [13, 14, 15];
const TILE_SUBDOMAINS = ['a', 'b', 'c'];
const BATCH_SIZE = 6;
const BATCH_DELAY_MS = 250;

function lngToTileX(lng, zoom) {
  return Math.floor(((lng + 180) / 360) * 2 ** zoom);
}

function latToTileY(lat, zoom) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom
  );
}

function tileUrlsForBbox(bbox, zoom) {
  const xMin = lngToTileX(bbox.west, zoom);
  const xMax = lngToTileX(bbox.east, zoom);
  const yMin = latToTileY(bbox.north, zoom);
  const yMax = latToTileY(bbox.south, zoom);
  const urls = [];
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      const sub = TILE_SUBDOMAINS[(x + y) % TILE_SUBDOMAINS.length];
      urls.push(`https://${sub}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`);
    }
  }
  return urls;
}

export function estimateTileCount() {
  return ZOOM_LEVELS.reduce((sum, z) => sum + tileUrlsForBbox(NDJAMENA_BBOX, z).length, 0);
}

/**
 * Télécharge les tuiles de N'Djamena dans le cache du service worker.
 * @param {(done: number, total: number) => void} onProgress
 * @returns {Promise<{ success: number, failed: number, total: number }>}
 */
export async function downloadOfflineMap(onProgress) {
  const allUrls = ZOOM_LEVELS.flatMap((z) => tileUrlsForBbox(NDJAMENA_BBOX, z));
  const total = allUrls.length;
  let done = 0;
  let success = 0;
  let failed = 0;

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((url) => fetch(url, { mode: 'cors' }))
    );
    for (const r of results) {
      done++;
      if (r.status === 'fulfilled' && r.value.ok) success++;
      else failed++;
    }
    onProgress?.(done, total);
    if (i + BATCH_SIZE < allUrls.length) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  return { success, failed, total };
}

export async function getOfflineMapCacheInfo() {
  if (!('caches' in window)) return { cached: 0, available: false };
  try {
    const cache = await caches.open('osm-tiles');
    const keys = await cache.keys();
    return { cached: keys.length, available: true };
  } catch {
    return { cached: 0, available: false };
  }
}
