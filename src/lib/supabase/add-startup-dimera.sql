-- DIMERA: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/dimera.png',
  sector = 'DeepTech/Materials',
  description_tr = 'Malzeme şirketlerinin formülasyonlarını yapay zeka ve moleküler simülasyonlarla optimize eden platform. Deneme-yanılma testlerini ve laboratuvar maliyetlerini azaltır; yeniden formülasyon döngülerinde ~%80 azalma. Tekstil, plastik, ambalaj ve inşaat sektörlerine hizmet verir.',
  description_en = 'Platform optimizing material formulations with AI and molecular simulations. Cuts trial-and-error testing and lab costs, with ~80% fewer reformulation cycles. Serves textile, plastics, packaging and construction industries.',
  location = 'Portekiz',
  website = 'https://www.dimera.pt',
  tags = ARRAY['ai', 'malzeme bilimi', 'simülasyon', 'sürdürülebilirlik']
WHERE slug = 'dimera' OR name ILIKE 'dimera%';
