-- Ajoute les services "Transfert international" et "Recharge MyNITA" aux
-- agences existantes qui ne les ont pas encore (idempotent, ne touche pas
-- aux autres champs ni aux services déjà personnalisés par un admin).
UPDATE agences
SET services = services || '["Transfert international"]'::jsonb
WHERE NOT (services @> '["Transfert international"]'::jsonb);

UPDATE agences
SET services = services || '["Recharge MyNITA"]'::jsonb
WHERE NOT (services @> '["Recharge MyNITA"]'::jsonb);
