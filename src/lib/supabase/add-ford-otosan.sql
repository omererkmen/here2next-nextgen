-- Ford Otosan: orijinal logo, resmi unvan ve adres güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/ford-otosan.svg',
  description_tr = 'Ford Otomotiv Sanayi A.Ş. — Ford Motor Company ve Koç Holding ortaklığı.',
  description_en = 'Ford Otomotiv Sanayi A.Ş. — Joint venture of Ford Motor Company and Koç Holding.',
  location = 'Denizevler Mah. Ali Uçar Cad. No:53 41650 Gölcük/Kocaeli',
  website = 'https://www.ford.com.tr'
WHERE slug = 'ford-otosan';
