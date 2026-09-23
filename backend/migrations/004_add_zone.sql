ALTER TABLE agences ADD COLUMN IF NOT EXISTS zone VARCHAR(20);
ALTER TABLE admins ADD COLUMN IF NOT EXISTS zone VARCHAR(20);
CREATE INDEX IF NOT EXISTS idx_agences_zone ON agences(zone);

-- Rattache les agences déjà en base à leur zone, par quartier (voir
-- backend/src/data/zones.js pour la même correspondance côté seed).
UPDATE agences SET zone = 'nord' WHERE quartier IN ('Farcha', 'Chari Mongo', 'Djambal Bahr', 'Karkandjié', 'Sabangali');
UPDATE agences SET zone = 'centre' WHERE quartier IN ('Centre-ville', 'Moursal', 'Ridina', 'Paris-Congo', 'Nouveau pont', 'Klemat');
UPDATE agences SET zone = 'est' WHERE quartier IN ('Chagoua', 'Dembé', 'N''Djari', 'Gassi', 'Habena', 'Klessoum');
UPDATE agences SET zone = 'sud' WHERE quartier IN ('Amsinéné', 'Goudji', 'Diguel', 'Toukra', 'Palmal', 'Ngon-mba');
UPDATE agences SET zone = 'ouest' WHERE quartier IN ('Walia', 'Amriguébé', 'Ardep-Djoumal', 'Hamama', 'Aéroport', 'N''Guéli');
UPDATE agences SET zone = 'centre' WHERE zone IS NULL;
