-- Shippn: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/shippn.png',
  sector = 'Lojistik',
  description_tr = 'Uluslararası paket yönlendirme ve alışveriş platformu. 40+ ülkeden online alışverişi kapıya teslim eder; DHL ve FedEx ile hızlı gönderim, 50.000+ müşteri.',
  description_en = 'International package forwarding and shopping platform. Shop from 40+ countries with doorstep delivery; fast shipping with DHL & FedEx, trusted by 50,000+ customers.',
  location = 'İstanbul',
  website = 'https://www.shippn.com',
  tags = ARRAY['lojistik', 'e-ticaret', 'cross-border']
WHERE slug = 'shippn' OR name ILIKE 'shippn%';
