-- YNK (Yeni Nesil Kafası): orijinal logo ve bilgi güncellemesi
-- Web sitesi yok; LinkedIn sayfası kullanılıyor
-- Supabase SQL Editor'de çalıştır

UPDATE corporates SET
  logo_url = '/logos/ynk.png',
  sector = 'E-Learning',
  description_tr = 'Yeni Nesil Kafası — Girişimcilik ekosistemindeki verimsizlikleri çözmek için içerik, ürün ve programlar yaratan platform.',
  description_en = 'Yeni Nesil Kafası — Platform creating content, products and programs to solve inefficiencies in the entrepreneurship ecosystem.',
  location = 'İstanbul',
  website = 'https://www.linkedin.com/company/yeni-nesil-kafasi'
WHERE slug = 'ynk';
