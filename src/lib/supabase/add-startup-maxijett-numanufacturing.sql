-- MaxiJett ve NuManufacturing: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/maxijett.png',
  sector = 'Lojistik',
  description_tr = 'Restoranların yemek siparişlerini platform bağımsız biçimde ortak kurye havuzuyla taşıyan yapay zeka destekli son etap lojistik platformu. 950+ aktif restoran, 1000+ moto kurye, 15M+ başarılı teslimat; Yemeksepeti, Trendyol ve Getir entegrasyonları, bayilik modeliyle büyüme.',
  description_en = 'AI-powered last-mile logistics platform delivering restaurant orders platform-independently via a shared courier pool. 950+ active restaurants, 1,000+ couriers, 15M+ successful deliveries; Yemeksepeti, Trendyol and Getir integrations, growing through a franchise model.',
  website = 'https://www.maxijett.com.tr',
  tags = ARRAY['lojistik', 'son etap', 'kurye', 'ai']
WHERE slug ILIKE 'maxijett%' OR name ILIKE 'maxijett%';

UPDATE startups SET
  name = 'NuManufacturing',
  logo_url = '/logos/numanufacturing.png',
  sector = 'Endüstri 4.0',
  description_tr = 'Fiziksel dünyayı anlayan ve aksiyon alan endüstriyel yapay zeka çözümleri: NumBox edge sensörler, Bestekar AI platformu, NuSense fiber optik izleme. Kestirimci bakım, enerji optimizasyonu ve yapısal izleme; İstanbul''dan Avrupa ve Körfez''e hizmet.',
  description_en = 'Industrial AI that understands and acts on the physical world: NumBox edge sensors, Bestekar AI platform, NuSense fiber optic sensing. Predictive maintenance, energy optimization and structural monitoring, serving Europe and the Gulf from Istanbul.',
  location = 'Bilişim Vadisi / İstanbul',
  website = 'https://www.numanufacturing.com',
  tags = ARRAY['edge ai', 'iot', 'kestirimci bakım', 'sensör']
WHERE slug ILIKE '%numanufacturing%' OR name ILIKE '%numanufacturing%';
