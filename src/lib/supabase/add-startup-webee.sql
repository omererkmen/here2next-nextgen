-- WeBee: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/webee.png',
  sector = 'Hospitality/Travel',
  description_tr = 'Oteller için dijital misafir deneyimi platformu. Markalı misafir uygulaması, mobil check-in, dijital anahtar, personel operasyon uygulaması (EaSee), AI mesajlaşma ve upsell çözümleri; 26 ülkede 220+ otel kullanıyor.',
  description_en = 'Digital guest experience platform for hotels. Branded guest app, mobile check-in, digital key, staff operations app (EaSee), AI messaging and upsell solutions; used by 220+ hotels in 26 countries.',
  location = 'İstanbul / Londra',
  website = 'https://getwebee.com',
  tags = ARRAY['hospitality', 'guest experience', 'ai']
WHERE slug = 'webee' OR name ILIKE 'webee%';
