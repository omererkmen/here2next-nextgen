-- Voltla: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/voltla.svg',
  sector = 'ClimateTech/EV',
  description_tr = 'Tüm marka elektrikli araç şarj istasyonlarını tek uygulamada toplayan platform. 160+ firma, 20.000+ soket; müsaitlik bilgisi, rota oluşturma ve ödeme.',
  description_en = 'Platform bringing all EV charging stations into a single app. 160+ operators, 20,000+ sockets; availability info, route planning and payments.',
  location = 'Barbaros Mah. Lale Sok. Ağaoğlu My Office No:2 İç Kapı No:13 34752 Ataşehir/İstanbul',
  website = 'https://voltla.com.tr',
  tags = ARRAY['ev', 'şarj', 'mobilite']
WHERE slug = 'voltla' OR name ILIKE 'voltla%';
