-- Empler AI: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/empler.png',
  sector = 'AI/Automation',
  description_tr = 'AI Agent ekipleriyle çok adımlı AEO, içerik, satış ve pazarlama görevlerini otomatikleştiren platform. AI agent''lar, workflow araçları, veri tabloları ve sohbetle otomasyon oluşturma tek yerde.',
  description_en = 'Platform automating multi-step AEO, content, sales and marketing tasks with AI Agent Teams. AI agents, workflow tools, data tables, and chat-enabled automation creation all in one place.',
  location = 'İstanbul',
  website = 'https://www.empler.ai',
  tags = ARRAY['ai', 'automation', 'agent', 'marketing']
WHERE slug ILIKE 'empler%' OR name ILIKE 'empler%';
