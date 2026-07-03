-- Add Doğuş Otomotiv to the live database
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

INSERT INTO corporates (id, name, slug, logo_url, sector, description_tr, description_en, location, website, is_founder, member_since) VALUES
  ('10000000-0000-0000-0000-000000000c11', 'Doğuş Otomotiv', 'dogus-otomotiv', '/logos/dogus-otomotiv.svg', 'Otomotiv', 'Doğuş Otomotiv Servis ve Ticaret A.Ş. — Volkswagen Grubu markalarının Türkiye distribütörü, Doğuş Grubu''nun otomotiv şirketi.', 'Doğuş Otomotiv Servis ve Ticaret A.Ş. — Turkish distributor of Volkswagen Group brands, the automotive company of Doğuş Group.', 'Şekerpınar Mah. Anadolu Cad. No:22 ve 45, 41420 Çayırova/Kocaeli', 'https://www.dogusotomotiv.com.tr', false, 2025)
ON CONFLICT (slug) DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  location = EXCLUDED.location,
  description_tr = EXCLUDED.description_tr,
  description_en = EXCLUDED.description_en,
  website = EXCLUDED.website;

-- Tüm kurumların üyelik yılını 2025 yap
UPDATE corporates SET member_since = 2025;
