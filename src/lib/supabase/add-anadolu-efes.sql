-- Anadolu Efes: orijinal logo, resmi unvan ve adres güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/anadolu-efes.png',
  description_tr = 'Anadolu Efes Bira ve Malt Sanayi A.Ş. — Türkiye''nin önde gelen içecek şirketi.',
  description_en = 'Anadolu Efes Bira ve Malt Sanayi A.Ş. — Turkey''s leading beverage company.',
  location = 'Fatih Sultan Mehmet Mah. Balkan Cad. Buyaka E Blok No: 58/24 34771 Ümraniye/İstanbul',
  website = 'https://www.anadoluefes.com.tr'
WHERE slug = 'anadolu-efes';
