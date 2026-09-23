-- Les zones passent d'un identifiant textuel (nord/centre/est/sud/ouest)
-- à un identifiant numérique (voir backend/src/data/zones.js).
UPDATE agences SET zone = '1' WHERE zone = 'nord';
UPDATE agences SET zone = '2' WHERE zone = 'centre';
UPDATE agences SET zone = '3' WHERE zone = 'est';
UPDATE agences SET zone = '4' WHERE zone = 'sud';
UPDATE agences SET zone = '5' WHERE zone = 'ouest';

UPDATE admins SET zone = '1' WHERE zone = 'nord';
UPDATE admins SET zone = '2' WHERE zone = 'centre';
UPDATE admins SET zone = '3' WHERE zone = 'est';
UPDATE admins SET zone = '4' WHERE zone = 'sud';
UPDATE admins SET zone = '5' WHERE zone = 'ouest';
