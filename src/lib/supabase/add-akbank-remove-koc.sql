-- Koç Holding kaydını sil (bağlı wishlist ve eşleşmeler cascade ile silinir)
-- ve Akbank'ı ekle
-- Supabase SQL Editor'de çalıştır

DELETE FROM corporates WHERE slug = 'koc-holding';

INSERT INTO corporates (id, name, slug, logo_url, sector, description_tr, description_en, location, website, is_founder, member_since) VALUES
  ('10000000-0000-0000-0000-000000000c12', 'Akbank', 'akbank', '/logos/akbank.svg', 'Bankacılık', 'Akbank T.A.Ş. — Türkiye''nin önde gelen özel bankalarından, Sabancı Topluluğu üyesi.', 'Akbank T.A.Ş. — One of Turkey''s leading private banks, a member of Sabancı Group.', 'Sabancı Center 4. Levent 34330 Beşiktaş/İstanbul', 'https://www.akbank.com', false, 2025)
ON CONFLICT (slug) DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  location = EXCLUDED.location,
  description_tr = EXCLUDED.description_tr,
  description_en = EXCLUDED.description_en,
  website = EXCLUDED.website;
