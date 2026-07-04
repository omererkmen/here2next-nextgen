-- Türkiye İş Bankası: orijinal logo, resmi unvan ve adres güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/isbank.png',
  description_tr = 'Türkiye İş Bankası A.Ş. — Türkiye''nin en büyük özel bankası.',
  description_en = 'Türkiye İş Bankası A.Ş. — Turkey''s largest private bank.',
  location = 'İş Kuleleri 34330 Levent Beşiktaş/İstanbul',
  website = 'https://www.isbank.com.tr'
WHERE slug = 'isbank';
