-- Bren (Brenpower) ve Harcy: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/bren.png',
  sector = 'Industrial IoT',
  description_tr = 'Bataryasız ve kablosuz IoT sensörler + yapay zeka ile endüstriyel izleme: buhar kapanı, enerji ve hava kalitesi takibi, kestirimci bakım. %20-30 enerji tasarrufu sağlar.',
  description_en = 'Batteryless and wireless IoT sensors + AI for industrial monitoring: steam traps, energy and air quality tracking with predictive maintenance. Delivers 20-30% energy savings.',
  location = 'İstanbul / Bromley, İngiltere',
  website = 'https://www.brenpower.co',
  tags = ARRAY['iot', 'enerji', 'kestirimci bakım']
WHERE slug = 'bren' OR name ILIKE 'bren%';

UPDATE startups SET
  logo_url = '/logos/harcy.png',
  sector = 'Sustainability/Materials',
  description_tr = 'Atıklardan yeni nesil yapı malzemeleri geliştiren Ar-Ge firması. Patentli Harcy Polyester Yünü, tekstil ve PET atıklarından üretilen çevre dostu ısı ve ses yalıtım malzemesi; m²''de 2 kg atık ve 2,7 kg CO₂ kurtarır.',
  description_en = 'R&D company developing next-generation building materials from waste. Patented Harcy Polyester Wool is an eco-friendly thermal and acoustic insulation material made from textile and PET waste, saving 2 kg of waste and 2.7 kg of CO₂ per m².',
  location = 'İstanbul',
  website = 'https://harcy.com.tr',
  tags = ARRAY['sürdürülebilirlik', 'döngüsel ekonomi', 'yalıtım']
WHERE slug = 'harcy' OR name ILIKE 'harcy%';
