-- Enerjisa: orijinal logo, resmi unvan ve adres güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/enerjisa.png',
  description_tr = 'Enerjisa Enerji A.Ş. — Türkiye''nin en büyük enerji dağıtım ve perakende satış şirketi. Sabancı Holding ve E.ON ortaklığı.',
  description_en = 'Enerjisa Enerji A.Ş. — Turkey''s largest energy distribution and retail company. Joint venture of Sabancı Holding and E.ON.',
  location = 'Barbaros Mah. Begonya Sok. Nida Kule Ataşehir Batı No:1/1 34746 Ataşehir/İstanbul',
  website = 'https://www.enerjisa.com.tr'
WHERE slug = 'enerjisa';
