-- mgames: açıklamayı sadeleştir, kişisel bilgileri kaldır, sektörü düzelt
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  sector = 'Gaming',
  description_tr = 'Kültür, sanat ve fanteziyi birleştiren temalı bir yarış oyunu evreni geliştirmeyi hedefleyen erken aşama oyun girişimi. Türkiye''nin şehirlerini, kültürünü ve mitolojisini temalı arabalar ve pistlerle dünyaya tanıtmayı amaçlıyor.',
  description_en = 'Early-stage game venture aiming to build a themed racing universe combining culture, art and fantasy. Seeks to introduce Turkey''s cities, culture and mythology to global players through themed cars and tracks.',
  location = 'Kütahya',
  tags = ARRAY['gaming', 'yarış', 'kültür']
WHERE name = 'mgames';
