-- 8 startup: logo ve bilgi güncellemesi
-- Logolar public/logos/ altına şu adlarla eklenmeli:
-- selfweller.svg, rentiva.png, prozon.png, poliark.png,
-- kybeles-garden.png, archis-academy.svg, arvis.png, skann.png
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/selfweller.svg',
  description_tr = 'Ruh sağlığı profesyonellerince hazırlanan içerikleri algoritmayla kişiselleştiren, sesli öz-terapi ve mindfulness seansları üreten yapay zeka destekli uygulama.',
  description_en = 'AI-powered app generating personalized audio self-therapy and mindfulness sessions from content prepared by mental health professionals.',
  location = 'İzmir',
  website = 'https://selfweller.com',
  tags = ARRAY['healthtech', 'ai', 'mindfulness']
WHERE name ILIKE 'selfweller%';

UPDATE startups SET
  logo_url = '/logos/rentiva.png',
  description_tr = 'Araç sahipleriyle kiralayanları buluşturan kişiden kişiye araç paylaşım platformu. Tüm kiralamalar Allianz kasko güvencesinde; web ve mobil üzerinden günlük/aylık kiralama.',
  description_en = 'Peer-to-peer car sharing platform connecting car owners with renters. All rentals covered by Allianz comprehensive insurance; daily and monthly rentals via web and mobile.',
  location = 'İstanbul',
  website = 'https://rentiva.com',
  tags = ARRAY['mobility', 'car-sharing']
WHERE name ILIKE 'rentiva%';

UPDATE startups SET
  logo_url = '/logos/prozon.png',
  description_tr = 'Bordro ve özlük yazılımı, SGK teşvik portalı ve hibe/Ar-Ge danışmanlığını tek platformda sunan İK teknolojisi şirketi. 80.000+ işyeri tarafından kullanılıyor.',
  description_en = 'HR tech company offering payroll software, SGK incentive portal and grant/R&D consulting on one platform, trusted by 80,000+ workplaces.',
  location = 'Altunizade/İstanbul',
  website = 'https://prozon.net',
  tags = ARRAY['hr', 'payroll', 'sgk']
WHERE name ILIKE 'prozon%';

UPDATE startups SET
  logo_url = '/logos/poliark.png',
  description_tr = 'Gayrimenkul ve mimari için multimodal yapay zeka temel modeli KEND''i geliştiren şirket. Metin komutlarından kat planı ve 3D bina modelleri üretir.',
  description_en = 'Developer of KEND, a multimodal AI foundation model for real estate and architecture that turns text prompts into floorplans and 3D building models.',
  location = 'İstanbul / New York',
  website = 'https://poliark.com',
  tags = ARRAY['ai', 'architecture', '3d']
WHERE name ILIKE 'poliark%';

UPDATE startups SET
  logo_url = '/logos/kybeles-garden.png',
  description_tr = 'Fermente alg bazlı, biyoyararlanımı yüksek hammaddeler tasarlayan ve üreten alg biyoteknolojisi şirketi. Tarım (biyogübre), gıda ve kozmetikte endüstriyel ölçekte kullanım; ODTÜ Teknokent çıkışlı.',
  description_en = 'Algae biotechnology company designing and producing fermented algae-based raw materials with high bioavailability for industrial use in agriculture (biofertilizers), food and cosmetics. Founded at ODTÜ Teknokent.',
  location = 'Ankara',
  website = 'https://kybelesgarden.com',
  tags = ARRAY['biotech', 'agriculture', 'alg']
WHERE name ILIKE 'kybeles%';

UPDATE startups SET
  logo_url = '/logos/archis-academy.svg',
  description_tr = 'Proje bazlı iş simülasyonları ve mentorlukla yazılım eğitimi veren edtech platformu. Frontend, backend, DevOps, QA, mobil ve agentic AI alanlarında doğrulanmış portfolyo ile işe yerleştirme odaklı.',
  description_en = 'Edtech platform offering project-based work simulations and mentoring in frontend, backend, DevOps, QA, mobile and agentic AI, helping learners build verified portfolios and get hired.',
  location = 'Eskişehir / Florida',
  website = 'https://archisacademy.com',
  tags = ARRAY['edtech', 'yazılım', 'kariyer']
WHERE name ILIKE 'archis%';

UPDATE startups SET
  logo_url = '/logos/arvis.png',
  description_tr = 'Platform bağımsız orta-çekirdek strateji, RPG ve kart oyunları geliştiren Türk oyun stüdyosu (Board Royale, Deck Dash); masa, mobil, PC ve konsol.',
  description_en = 'Platform-agnostic Turkish game studio developing mid-core strategy, RPG and card games (Board Royale, Deck Dash) across board, mobile, PC and console.',
  location = 'İstanbul / Kanada',
  website = 'https://arvisgames.com',
  tags = ARRAY['gaming', 'strateji', 'mobile']
WHERE name = 'Arvis' OR slug = 'arvis';

UPDATE startups SET
  logo_url = '/logos/skann.png',
  description_tr = 'Otomotiv endüstrisi için yapay zeka ve bilgisayarlı görü tabanlı hasar/kusur muayene çözümleri (DeepScan, PureVision, TireScope). Sigorta, filo, kiralama ve üretim hatlarına hizmet verir.',
  description_en = 'AI and computer vision based vehicle damage/defect inspection solutions for the automotive industry (DeepScan, PureVision, TireScope), serving insurance, fleets, rental and manufacturing lines.',
  location = 'Ankara',
  website = 'https://www.skann.ai',
  tags = ARRAY['ai', 'computer vision', 'otomotiv']
WHERE name ILIKE 'skann%';
