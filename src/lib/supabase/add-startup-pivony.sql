-- Pivony: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/pivony.png',
  sector = 'AI/Analytics',
  description_tr = 'Agentic AI destekli Müşterinin Sesi (VoC) ve müşteri deneyimi analitiği platformu. Kök neden analizi, otomatik aksiyonlar; Vodafone, Samsung, Allianz ve Akbank gibi markaların güvendiği çözüm.',
  description_en = 'Agentic AI-powered Voice of Customer (VoC) and CX analytics platform. Root cause analysis and autonomous actions; trusted by brands like Vodafone, Samsung, Allianz and Akbank.',
  location = 'İstanbul / ABD',
  website = 'https://pivony.com',
  tags = ARRAY['ai', 'voc', 'cx', 'analytics']
WHERE slug = 'pivony' OR name ILIKE 'pivony%';
