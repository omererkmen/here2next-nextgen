-- ComplyLab: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/complylab.png',
  sector = 'RegTech/AI',
  description_tr = 'Kurumsal içerik, iletişim ve yapay zeka çıktıları için AI destekli sürekli uyumluluk platformu. Marka kuralları, şirket politikaları ve regülasyonlara göre 7/24 otomatik denetim; on-prem veya bulut kurulum. Harvard Innovation Labs bünyesinde kuluçkalanmıştır.',
  description_en = 'AI-powered continuous compliance platform for enterprise content, communications and AI-generated outputs. 24/7 automated checks against brand rules, policies and regulations; on-prem or cloud deployment. Incubated at Harvard Innovation Labs.',
  location = 'İstanbul / Boston',
  website = 'https://complylab.ai',
  tags = ARRAY['ai governance', 'compliance', 'regtech']
WHERE slug ILIKE 'complylab%' OR name ILIKE 'complylab%';
