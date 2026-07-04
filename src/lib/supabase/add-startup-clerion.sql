-- Clerion startup'ını ekle
-- Supabase SQL Editor'de çalıştır
-- Not: stage tahmini değerdir, gerektiğinde güncelleyin

INSERT INTO startups (name, slug, logo_url, sector, stage, description_tr, description_en, founded_year, location, website, tags, featured) VALUES
  ('Clerion', 'clerion', '/logos/clerion.png', 'Cloud', 'seed',
   'İşletmelere ölçeklenebilirlik, performans ve maliyet verimliliği için bulut çözümleri sunar. Bulut geçişi, DevOps ve yapay zeka uzmanlığı; AWS iş ortağı.',
   'Empowers businesses with cloud solutions for scalability, performance, and cost efficiency. Expertise in cloud migration, DevOps and AI; AWS partner.',
   NULL, 'Levent, Atom Sok. King Plaza, 34394 İstanbul', 'https://clerion.io', ARRAY['cloud', 'DevOps', 'AWS', 'AI'], true)
ON CONFLICT (slug) DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  sector = EXCLUDED.sector,
  description_tr = EXCLUDED.description_tr,
  description_en = EXCLUDED.description_en,
  location = EXCLUDED.location,
  website = EXCLUDED.website,
  tags = EXCLUDED.tags;
