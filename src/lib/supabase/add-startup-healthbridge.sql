-- HealthBridge: orijinal logo ve bilgi güncellemesi (healthbridge.com.tr)
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/healthbridge.png',
  sector = 'HealthTech/Turizm',
  description_tr = 'Doktorlar tarafından kurulan, TURSAB üyesi sağlık turizmi acentası. Diş tedavisi, saç ekimi, obezite tedavisi ve onkoloji alanlarında uçtan uca hizmet; seyahat, konaklama ve VIP transfer organizasyonu dahil.',
  description_en = 'Health tourism agency founded by doctors, member of TURSAB. End-to-end services in dental treatment, hair transplant, obesity treatment and oncology, including travel, accommodation and VIP transfer.',
  location = 'İstanbul',
  website = 'https://healthbridge.com.tr',
  tags = ARRAY['sağlık turizmi', 'diş', 'saç ekimi', 'onkoloji']
WHERE slug = 'healthbridge' OR name ILIKE 'healthbridge%';
