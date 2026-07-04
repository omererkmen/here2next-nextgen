-- Boyner: orijinal logo, resmi unvan ve adres güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/boyner.png',
  sector = 'Perakende',
  description_tr = 'Boyner Büyük Mağazacılık A.Ş. — Türkiye''nin önde gelen perakende ve moda şirketlerinden biri.',
  description_en = 'Boyner Büyük Mağazacılık A.Ş. — One of Turkey''s leading retail and fashion companies.',
  location = 'Maslak Mah. Büyükdere Cad. USO Center Binası No.245/2 34396 Sarıyer/İstanbul',
  website = 'https://www.boyner.com.tr'
WHERE slug = 'boyner' OR name ILIKE 'boyner%';
