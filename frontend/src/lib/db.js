// IndexedDB — cache local des agences pour un fonctionnement hors ligne
// complet (le cache HTTP du service worker ne suffit pas pour l'endpoint
// /api/agences car l'URL varie selon la position GPS de l'utilisateur).
import { openDB } from 'idb';

const DB_NAME = 'nita-agences-db';
const DB_VERSION = 1;
const STORE = 'agences';

let dbPromise;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveAgences(agences) {
  const db = await getDb();
  const tx = db.transaction(STORE, 'readwrite');
  await Promise.all(agences.map((a) => tx.store.put({ ...a, cachedAt: Date.now() })));
  await tx.done;
}

export async function getAllAgences() {
  const db = await getDb();
  return db.getAll(STORE);
}

export async function getAgenceById(id) {
  const db = await getDb();
  return db.get(STORE, Number(id));
}
