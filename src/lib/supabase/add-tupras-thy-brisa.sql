-- Tüpraş, Türk Hava Yolları ve Brisa: orijinal logo, resmi unvan ve adres güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/tupras.png',
  description_tr = 'Türkiye Petrol Rafinerileri A.Ş. (Tüpraş) — Türkiye''nin en büyük sanayi kuruluşu ve rafineri şirketi, Koç Topluluğu üyesi.',
  description_en = 'Türkiye Petrol Rafinerileri A.Ş. (Tüpraş) — Turkey''s largest industrial enterprise and refinery company, a member of Koç Group.',
  location = 'Güney Mah. Petrol Cad. No:25 41790 Körfez/Kocaeli',
  website = 'https://www.tupras.com.tr'
WHERE slug = 'tupras';

UPDATE corporates SET
  logo_url = '/logos/thy.png',
  description_tr = 'Türk Hava Yolları A.O. — Türkiye''nin bayrak taşıyıcı havayolu.',
  description_en = 'Türk Hava Yolları A.O. — Turkey''s flag carrier airline.',
  location = 'Yeşilköy Mah. Havaalanı Cad. No:3/1 34149 Bakırköy/İstanbul',
  website = 'https://www.turkishairlines.com'
WHERE slug = 'thy';

UPDATE corporates SET
  logo_url = '/logos/brisa.svg',
  sector = 'Lastik',
  description_tr = 'Brisa Bridgestone Sabancı Lastik San. ve Tic. A.Ş. — Türkiye lastik sektörünün lideri, Sabancı Holding ve Bridgestone ortaklığı.',
  description_en = 'Brisa Bridgestone Sabancı Lastik San. ve Tic. A.Ş. — Leader of the Turkish tire industry, joint venture of Sabancı Holding and Bridgestone.',
  location = 'Sanayi Cad. No:98 41310 İzmit/Kocaeli',
  website = 'https://www.brisa.com.tr'
WHERE slug ILIKE '%brisa%' OR name ILIKE 'brisa%';
