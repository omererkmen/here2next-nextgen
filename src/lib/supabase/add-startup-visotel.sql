-- Visotel (eski adıyla Vishotel): orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

-- Not: sitede kullanılabilir logo yok (49x27 px beyaz ikon), baş harf placeholder ile devam
UPDATE startups SET
  name = 'Visotel',
  sector = 'Seyahat Tech',
  description_tr = 'Tatil destinasyonlarını ve resort otelleri rezervasyon öncesinde gerçekçi VR/360 deneyimiyle keşfetmeyi sağlayan seyahat teknolojisi platformu. Odalar, havuzlar ve tesisler gerçek ölçek ve ışıkla incelenir; otel seçimindeki belirsizliği ortadan kaldırır.',
  description_en = 'Travel tech platform enabling travelers to explore holiday destinations and resorts through immersive VR/360 before booking. Rooms, pools and facilities can be inspected in true scale and lighting, removing uncertainty from hotel selection.',
  location = 'Gaziantep',
  website = 'https://visotel.online',
  tags = ARRAY['traveltech', 'vr', '360']
WHERE name ILIKE 'vis%otel%' OR slug ILIKE 'vis%otel%';
