-- ON (ON Dijital / Burgan Bank): orijinal logo, resmi unvan ve adres güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/on.svg',
  sector = 'Dijital Bankacılık',
  description_tr = 'ON Dijital — Burgan Bank A.Ş.''nin dijital bankacılık markası. Tüm bankacılık hizmetlerini dijital platformlar üzerinden sunar.',
  description_en = 'ON Dijital — Digital banking brand of Burgan Bank A.Ş., offering all banking services through digital platforms.',
  location = 'Maslak Mah. Eski Büyükdere Cad. No:13 34485 Sarıyer/İstanbul',
  website = 'https://on.com.tr'
WHERE slug = 'on' OR name = 'ON';
