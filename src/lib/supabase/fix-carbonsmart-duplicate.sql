-- Eski "Carbon Smart" mükerrer kaydını sil, Skymod sektörünü düzelt
-- Supabase SQL Editor'de çalıştır

-- Önce kontrol:
SELECT id, name, slug, sector FROM startups WHERE name ILIKE '%carbon%smart%';

-- Yeni kayıt (slug='carbonsmart') kalır, eskisi silinir:
DELETE FROM startups WHERE name ILIKE '%carbon%smart%' AND slug <> 'carbonsmart';

-- Skymod'un sektörü eski kayıttan kalmıştı:
UPDATE startups SET sector = 'Yapay Zeka' WHERE slug = 'skymod';
