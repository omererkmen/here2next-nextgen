-- NeoHub: orijinal logo, resmi unvan ve adres güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/neohub.png',
  sector = 'İnovasyon',
  description_tr = 'NEOHUB Teknoloji Yazılım Pazarlama ve Danışmanlık A.Ş. — DenizBank Finansal Hizmetler Grubu''nun fintech ve inovasyon şirketi.',
  description_en = 'NEOHUB Teknoloji Yazılım Pazarlama ve Danışmanlık A.Ş. — Fintech and innovation company of DenizBank Financial Services Group.',
  location = 'Esentepe Mah. Büyükdere Cad. No:141-1 34394 Şişli/İstanbul',
  website = 'https://www.neohub.io'
WHERE slug ILIKE '%neohub%' OR name ILIKE '%neohub%';
