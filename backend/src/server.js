/**
 * Project: NITA Agences
 * Description: Localisation des agences NITA à N'Djamena — API
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
];
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin && NODE_ENV !== 'production') return callback(null, true);
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS bloqué pour: ${origin}`));
  },
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ api: 'NITA Agences 📍', status: 'running', environment: NODE_ENV });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/agences', require('./routes/agences'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admins', require('./routes/admins'));

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} non trouvée` });
});

app.use((err, req, res, next) => {
  console.error('❌', err.message);
  res.status(500).json({ message: err.message || 'Erreur serveur' });
});

const migrate = require('./config/migrate');

(async () => {
  try {
    if (process.env.DATABASE_URL) {
      await migrate();
    } else {
      console.warn('⚠️ DATABASE_URL non défini — migrations ignorées');
    }
    app.listen(PORT, () => {
      console.log(`✅ Backend NITA Agences démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur fatale au démarrage:', err.message);
    process.exit(1);
  }
})();

module.exports = app;
