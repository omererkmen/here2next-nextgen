-- Arçelik: orijinal logo, resmi unvan ve adres güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/arcelik.png',
  description_tr = 'Arçelik A.Ş. — Koç Topluluğu''na bağlı global beyaz eşya ve tüketici elektroniği üreticisi.',
  description_en = 'Arçelik A.Ş. — Global home appliance and consumer electronics manufacturer, part of Koç Group.',
  location = 'Karaağaç Cad. No:6/2 Sütlüce Beyoğlu/İstanbul',
  website = 'https://www.arcelik.com.tr'
WHERE slug = 'arcelik';
