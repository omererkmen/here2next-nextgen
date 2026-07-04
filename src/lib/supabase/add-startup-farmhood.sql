-- Farmhood: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/farmhood.png',
  sector = 'AgriTech/FoodTech',
  description_tr = 'Gıda endüstrisi yan ürünlerini bitkisel proteinlere ve fonksiyonel ürünlere dönüştüren agrifood-tech girişimi. Dondurarak kurutma ve ileri dönüşüm teknolojisiyle protein zenginleştirilmiş atıştırmalıklar üretiyor; döngüsel üretim ve bilim temelli beslenmeyi birleştiriyor.',
  description_en = 'Agrifood-tech startup upcycling food industry byproducts into plant-based proteins and functional products. Produces protein-enriched snacks using freeze-drying and upcycling technology, combining circular production with science-based nutrition.',
  location = 'Nişantaşı Üniversitesi, Sarıyer/İstanbul',
  website = 'https://farmhood.co',
  tags = ARRAY['foodtech', 'döngüsel ekonomi', 'bitkisel protein']
WHERE slug = 'farmhood' OR name ILIKE 'farmhood%';
