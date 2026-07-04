-- Viza (getviza.ai): orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/getviza.png',
  sector = 'Seyahat Tech',
  description_tr = 'Vize başvuru sürecini uçtan uca dijitalleştiren yapay zeka destekli platform. Doğru evrak hazırlığı, belge analiziyle eksik/hata tespiti ve adım adım süreç yönetimi; Randevu Asistanı uygun tarihleri otomatik takip eder.',
  description_en = 'AI-powered platform digitalizing the visa application process end to end. Correct document preparation, error detection through document analysis and step-by-step process management; the Appointment Assistant automatically tracks available dates.',
  location = 'İstanbul',
  website = 'https://getviza.ai',
  tags = ARRAY['ai', 'vize', 'traveltech']
WHERE name = 'Viza' OR slug = 'viza';
