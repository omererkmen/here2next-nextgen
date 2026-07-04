-- Ecomercek: logo ve bilgi güncellemesi
-- Logo: public/logos/ecomercek.png olarak eklenmeli
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/ecomercek.png',
  sector = 'Health/Wellness',
  description_tr = 'Kozmetik, cilt bakımı, kişisel hijyen ve ev bakım ürünlerini bilimsel verilere dayanarak sağlık ve çevre etkisine göre tarafsız şekilde değerlendiren platform. 30.000+ içerik ve 5.000+ ürün incelemesi; Eczacıbaşı Momentum destekli.',
  description_en = 'Platform neutrally evaluating cosmetics, skincare, personal hygiene and home care products based on scientific data for health and environmental impact. 30,000+ ingredient and 5,000+ product reviews; backed by Eczacıbaşı Momentum.',
  location = 'İstanbul',
  website = 'https://ecomercek.com',
  tags = ARRAY['sağlık', 'kozmetik', 'sürdürülebilirlik']
WHERE slug ILIKE 'ecomercek%' OR name ILIKE 'ecomercek%';
