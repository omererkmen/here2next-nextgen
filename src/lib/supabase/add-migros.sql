-- Migros: orijinal logo, resmi unvan ve adres güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/migros.svg',
  description_tr = 'Migros Ticaret A.Ş. — Türkiye''nin önde gelen perakende zinciri.',
  description_en = 'Migros Ticaret A.Ş. — Turkey''s leading retail chain.',
  location = 'Atatürk Mah. Turgut Özal Bulvarı No:7 34758 Ataşehir/İstanbul',
  website = 'https://www.migroskurumsal.com'
WHERE slug = 'migros';
