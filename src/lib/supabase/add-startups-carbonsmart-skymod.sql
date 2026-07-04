-- CarbonSmart ve Skymod startup'larını ekle
-- Supabase SQL Editor'de çalıştır
-- Not: stage / team_size / funding tahmini değerlerdir, gerektiğinde güncelleyin

INSERT INTO startups (name, slug, logo_url, sector, stage, description_tr, description_en, founded_year, location, website, tags, featured) VALUES
  ('CarbonSmart', 'carbonsmart', '/logos/carbonsmart.svg', 'ClimateTech', 'seed',
   'Yapay zeka destekli karbon yönetim platformu. Kurumsal ve ürün seviyesinde emisyonları ölçer, raporlar ve azaltır. ISO 14064, ISO 14067 ve CBAM uyumlu.',
   'AI-powered carbon management platform that measures, reports, and reduces corporate and product-level emissions. ISO 14064, ISO 14067, and CBAM compliant.',
   NULL, 'Teknopark İstanbul, Pendik/İstanbul', 'https://www.carbonsmart.io', ARRAY['sürdürülebilirlik', 'AI', 'karbon', 'CBAM'], true),
  ('Skymod', 'skymod', '/logos/skymod.png', 'Yapay Zeka', 'seed',
   'İşletmeler için yapay zeka dönüşüm platformu. SkyStudio ile kurumsal AI chat, agent ve workflow çözümleri; GOAT kurumsal LLM. GDPR, ISO 27001, SOC2 ve KVKK uyumlu.',
   'AI transformation platform for businesses. Enterprise AI chat, agents and workflows with SkyStudio; GOAT enterprise LLM. GDPR, ISO 27001, SOC2 and KVKK compliant.',
   NULL, 'İstanbul', 'https://skymod.ai', ARRAY['AI', 'kurumsal', 'agent', 'LLM'], true)
ON CONFLICT (slug) DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  description_tr = EXCLUDED.description_tr,
  description_en = EXCLUDED.description_en,
  location = EXCLUDED.location,
  website = EXCLUDED.website,
  tags = EXCLUDED.tags;
