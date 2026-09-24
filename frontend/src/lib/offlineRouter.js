// Routage hors ligne — Dijkstra sur un graphe routier de N'Djamena extrait
// d'OpenStreetMap (voir public/ndjamena-roads.json). Ne s'active que si
// OSRM (le routage en ligne) est indisponible : voir drawRoute() dans
// AgencyMap.jsx. Le graphe est chargé une seule fois puis mis en mémoire.

const GRAPH_URL = '/ndjamena-roads.json';

let graphPromise = null;
let adjacency = null; // index -> [[toIndex, distanceMeters], ...]
let nodes = null; // index -> [lat, lng]

async function loadGraph() {
  if (!graphPromise) {
    graphPromise = fetch(GRAPH_URL)
      .then((res) => {
        if (!res.ok) throw new Error('graph fetch failed');
        return res.json();
      })
      .then((graph) => {
        nodes = graph.nodes;
        adjacency = Array.from({ length: nodes.length }, () => []);
        for (const [from, to, dist] of graph.edges) {
          adjacency[from].push([to, dist]);
        }
        return true;
      })
      .catch(() => {
        graphPromise = null; // permet de réessayer plus tard (ex: après téléchargement)
        return false;
      });
  }
  return graphPromise;
}

// Précharge le graphe en cache navigateur — appelé par le bouton
// "Télécharger la carte hors ligne" pour que le routage fonctionne même
// sans jamais avoir eu de connexion au moment de calculer un itinéraire.
export async function prefetchRoutingGraph() {
  const res = await fetch(GRAPH_URL);
  if (!res.ok) throw new Error('graph prefetch failed');
  return res.blob().then((b) => b.size);
}

function toRad(d) { return (d * Math.PI) / 180; }
function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const a = Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lng2 - lng1) / 2) ** 2;
  return R * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
}

function nearestNodeIndex(lat, lng) {
  let best = -1;
  let bestD = Infinity;
  for (let i = 0; i < nodes.length; i++) {
    const [nlat, nlng] = nodes[i];
    // Comparaison en degrés carrés — assez précis pour choisir le nœud le
    // plus proche sans payer le coût d'un vrai calcul haversine ici.
    const d = (nlat - lat) ** 2 + (nlng - lng) ** 2;
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

// Min-heap simple (tableau binaire) — largement suffisant pour ~70k nœuds.
class MinHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(item) {
    const a = this.a;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1, r = l + 1;
        let smallest = i;
        if (l < a.length && a[l][0] < a[smallest][0]) smallest = l;
        if (r < a.length && a[r][0] < a[smallest][0]) smallest = r;
        if (smallest === i) break;
        [a[smallest], a[i]] = [a[i], a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

function dijkstra(startIdx, endIdx) {
  const dist = new Float64Array(nodes.length).fill(Infinity);
  const prev = new Int32Array(nodes.length).fill(-1);
  const visited = new Uint8Array(nodes.length);
  dist[startIdx] = 0;
  const heap = new MinHeap();
  heap.push([0, startIdx]);
  while (heap.size) {
    const [d, u] = heap.pop();
    if (visited[u]) continue;
    visited[u] = 1;
    if (u === endIdx) break;
    for (const [v, w] of adjacency[u]) {
      if (visited[v]) continue;
      const nd = d + w;
      if (nd < dist[v]) {
        dist[v] = nd;
        prev[v] = u;
        heap.push([nd, v]);
      }
    }
  }
  if (!isFinite(dist[endIdx])) return null;
  const path = [];
  let cur = endIdx;
  while (cur !== -1) {
    path.push(cur);
    cur = prev[cur];
  }
  path.reverse();
  return path;
}

/**
 * Calcule un itinéraire hors ligne entre deux points, en suivant les
 * routes réelles de N'Djamena (graphe pré-téléchargé).
 * @returns {Promise<{coords: [number, number][], distanceM: number} | null>}
 */
export async function computeOfflineRoute(fromLat, fromLng, toLat, toLng) {
  const ok = await loadGraph();
  if (!ok || !nodes?.length) return null;

  const startIdx = nearestNodeIndex(fromLat, fromLng);
  const endIdx = nearestNodeIndex(toLat, toLng);
  if (startIdx === -1 || endIdx === -1) return null;

  const path = dijkstra(startIdx, endIdx);
  if (!path) return null;

  const coords = [[fromLat, fromLng], ...path.map((i) => nodes[i]), [toLat, toLng]];
  let distanceM = haversineM(fromLat, fromLng, ...nodes[startIdx]);
  for (let i = 1; i < path.length; i++) {
    distanceM += haversineM(...nodes[path[i - 1]], ...nodes[path[i]]);
  }
  distanceM += haversineM(...nodes[endIdx], toLat, toLng);

  return { coords, distanceM };
}
