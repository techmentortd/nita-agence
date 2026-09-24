import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'classic',
      },
      includeAssets: ['logo.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        id: '/',
        name: 'NITA Agences',
        short_name: 'NITA Agences',
        description: "Localisez les agences NITA à N'Djamena, même hors ligne.",
        theme_color: '#143b8f',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        categories: ['finance', 'navigation', 'utilities'],
        start_url: '/',
        scope: '/',
        lang: 'fr',
        dir: 'ltr',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Carte des agences', url: '/carte', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
          { name: 'Calculatrice de frais', url: '/calculatrice', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        // Les tuiles OSM peuvent dépasser la limite par défaut de precache (2 Mo)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // Le service worker précédent est immédiatement remplacé et prend le
        // contrôle sans attendre la fermeture des onglets ouverts — combiné à
        // registerType: 'autoUpdate', l'app reste à jour sur toutes les
        // versions d'Android/Chrome sans action de l'utilisateur.
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // Données des agences — toujours essayer le réseau d'abord,
            // repli sur le cache si hors ligne (IndexedDB prend le relais
            // pour les requêtes avec lat/lng variables, voir lib/db.js)
            urlPattern: /\/api\/agences.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-agences-cache',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Tuiles OpenStreetMap — mise en cache automatique de toute
            // zone déjà consultée en ligne (voir aussi le préchargement
            // explicite dans lib/offlineMap.js pour couvrir N'Djamena
            // entière sans avoir eu à naviguer dessus au préalable)
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 4000, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/router\.project-osrm\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'osrm-routes',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Graphe routier pour le calcul d'itinéraire hors ligne (voir
            // lib/offlineRouter.js) — préchargé explicitement par le bouton
            // "Télécharger la carte hors ligne" (lib/offlineMap.js).
            urlPattern: /\/ndjamena-roads\.json$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ndjamena-roads',
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
