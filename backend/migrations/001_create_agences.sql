CREATE TABLE IF NOT EXISTS agences (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (type IN ('principale', 'standard')),
  quartier VARCHAR(100),
  adresse VARCHAR(255),
  telephone VARCHAR(30),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  horaires VARCHAR(100) DEFAULT 'Lun-Sam 8h-18h',
  services JSONB DEFAULT '[]',
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agences_actif ON agences(actif);
