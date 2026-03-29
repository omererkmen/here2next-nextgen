-- Here2Next NextGen Platform - Seed Data
-- Run this after schema.sql to populate demo data

-- ============================================
-- CORPORATES (Founding members)
-- ============================================
INSERT INTO corporates (id, name, slug, sector, description_tr, description_en, location, website, is_founder, member_since) VALUES
  ('10000000-0000-0000-0000-000000000c01', 'Anadolu Efes', 'anadolu-efes', 'İçecek', 'Türkiye''nin önde gelen içecek şirketi.', 'Turkey''s leading beverage company.', 'İstanbul', 'https://anadoluefes.com', true, 2022),
  ('10000000-0000-0000-0000-000000000c02', 'Arçelik', 'arcelik', 'Beyaz Eşya', 'Global beyaz eşya ve elektronik üreticisi.', 'Global home appliance and electronics manufacturer.', 'İstanbul', 'https://arcelik.com.tr', true, 2022),
  ('10000000-0000-0000-0000-000000000c03', 'Enerjisa Enerji', 'enerjisa', 'Enerji', 'Türkiye''nin en büyük enerji dağıtım şirketi.', 'Turkey''s largest energy distribution company.', 'İstanbul', 'https://enerjisa.com.tr', true, 2022),
  ('10000000-0000-0000-0000-000000000c04', 'Ford Otosan', 'ford-otosan', 'Otomotiv', 'Ford Motor Company ve Koç Holding ortaklığı.', 'Joint venture of Ford Motor Company and Koç Holding.', 'Kocaeli', 'https://fordotosan.com.tr', true, 2022),
  ('10000000-0000-0000-0000-000000000c05', 'Migros', 'migros', 'Perakende', 'Türkiye''nin önde gelen perakende zinciri.', 'Turkey''s leading retail chain.', 'İstanbul', 'https://migros.com.tr', true, 2022),
  ('10000000-0000-0000-0000-000000000c06', 'Tüpraş', 'tupras', 'Enerji', 'Türkiye''nin en büyük sanayi kuruluşu ve rafineri.', 'Turkey''s largest industrial enterprise and refinery.', 'Kocaeli', 'https://tupras.com.tr', true, 2022),
  ('10000000-0000-0000-0000-000000000c07', 'Türk Hava Yolları', 'thy', 'Havacılık', 'Türkiye''nin bayrak taşıyıcı havayolu.', 'Turkey''s flag carrier airline.', 'İstanbul', 'https://turkishairlines.com', true, 2022),
  ('10000000-0000-0000-0000-000000000c08', 'Türkiye İş Bankası', 'isbank', 'Bankacılık', 'Türkiye''nin en büyük özel bankası.', 'Turkey''s largest private bank.', 'İstanbul', 'https://isbank.com.tr', true, 2022),
  ('10000000-0000-0000-0000-000000000c09', 'Koç Holding', 'koc-holding', 'Holding', 'Türkiye''nin en büyük sanayi ve hizmet grubu.', 'Turkey''s largest industrial and service conglomerate.', 'İstanbul', 'https://koc.com.tr', false, 2023),
  ('10000000-0000-0000-0000-000000000c10', 'YNK (Yeni Nesil Kafası)', 'ynk', 'İnovasyon', 'Startup ekosistemi ve girişimcilik kültürünü destekleyen kurucu üye platform.', 'Founding member platform supporting the startup ecosystem and entrepreneurship culture.', 'İstanbul', 'https://yeninesilikafasi.com', true, 2022);

-- ============================================
-- STARTUPS
-- ============================================
INSERT INTO startups (id, name, slug, sector, stage, description_tr, description_en, founded_year, team_size, funding, location, website, tags, featured) VALUES
  ('20000000-0000-0000-0000-000000000a01', 'PayFlex', 'payflex', 'FinTech', 'series_a', 'KOBİ''ler için esnek ödeme çözümleri sunan fintech girişimi.', 'Fintech startup offering flexible payment solutions for SMBs.', 2021, 28, '$2.4M', 'İstanbul', 'https://payflex.io', ARRAY['ödeme', 'KOBİ', 'B2B'], true),
  ('20000000-0000-0000-0000-000000000a02', 'GreenLog', 'greenlog', 'Lojistik', 'seed', 'Sürdürülebilir lojistik optimizasyonu için AI tabanlı platform.', 'AI-based platform for sustainable logistics optimization.', 2022, 12, '$800K', 'Ankara', 'https://greenlog.tech', ARRAY['lojistik', 'AI', 'sürdürülebilirlik'], true),
  ('20000000-0000-0000-0000-000000000a03', 'HealthBridge', 'healthbridge', 'HealthTech', 'series_b', 'Uzaktan hasta takibi ve telemedicine çözümleri.', 'Remote patient monitoring and telemedicine solutions.', 2019, 65, '$8.5M', 'İstanbul', 'https://healthbridge.com.tr', ARRAY['sağlık', 'telemedicine', 'IoT'], true),
  ('20000000-0000-0000-0000-000000000a04', 'AgriSense', 'agrisense', 'AgriTech', 'pre_seed', 'Tarımda akıllı sensör ve veri analitiği çözümleri.', 'Smart sensor and data analytics solutions for agriculture.', 2023, 6, '$250K', 'İzmir', 'https://agrisense.io', ARRAY['tarım', 'IoT', 'veri analitiği'], false),
  ('20000000-0000-0000-0000-000000000a05', 'EduFlow', 'eduflow', 'EdTech', 'series_a', 'Kurumsal eğitim ve yetenek geliştirme platformu.', 'Corporate training and talent development platform.', 2020, 35, '$3.2M', 'İstanbul', 'https://eduflow.co', ARRAY['eğitim', 'HR', 'SaaS'], true),
  ('20000000-0000-0000-0000-000000000a06', 'CyberNest', 'cybernest', 'Siber Güvenlik', 'seed', 'KOBİ''ler için otomatik siber güvenlik çözümleri.', 'Automated cybersecurity solutions for SMBs.', 2022, 15, '$1.1M', 'Ankara', 'https://cybernest.io', ARRAY['güvenlik', 'otomasyon', 'B2B'], false),
  ('20000000-0000-0000-0000-000000000a07', 'RetailAI', 'retailai', 'Perakende Tech', 'series_a', 'Perakende sektörü için talep tahmini ve stok optimizasyonu.', 'Demand forecasting and inventory optimization for retail.', 2021, 22, '$2.8M', 'İstanbul', 'https://retailai.co', ARRAY['perakende', 'AI', 'analitik'], true),
  ('20000000-0000-0000-0000-000000000a08', 'CleanVolt', 'cleanvolt', 'EnerjiTech', 'seed', 'Yenilenebilir enerji yönetimi ve optimizasyonu.', 'Renewable energy management and optimization.', 2023, 9, '$500K', 'Bursa', 'https://cleanvolt.energy', ARRAY['enerji', 'yeşil', 'IoT'], false);

-- ============================================
-- WISHLIST ITEMS
-- ============================================
INSERT INTO wishlist_items (corporate_id, title_tr, title_en, description_tr, description_en, sector, tags, deadline, status) VALUES
  ('10000000-0000-0000-0000-000000000c05', 'Mağaza İçi Müşteri Analitiği', 'In-Store Customer Analytics', 'Mağaza içi müşteri hareketlerini analiz eden, ısı haritası ve davranış analizi sunan bir çözüm arıyoruz.', 'Looking for a solution that analyzes in-store customer movements, providing heat maps and behavior analysis.', 'Perakende Tech', ARRAY['AI', 'computer vision', 'analitik'], '2026-05-15', 'open'),
  ('10000000-0000-0000-0000-000000000c03', 'Akıllı Şebeke Yönetimi', 'Smart Grid Management', 'Dağıtım şebekesinde kestirimci bakım ve arıza tespiti için AI çözümü.', 'AI solution for predictive maintenance and fault detection in the distribution network.', 'EnerjiTech', ARRAY['IoT', 'AI', 'enerji'], '2026-06-01', 'open'),
  ('10000000-0000-0000-0000-000000000c07', 'Yolcu Deneyimi Kişiselleştirme', 'Passenger Experience Personalization', 'Yolcu deneyimini uçuş öncesi, sırası ve sonrasında kişiselleştiren platform.', 'Platform that personalizes passenger experience before, during, and after flights.', 'Seyahat Tech', ARRAY['AI', 'UX', 'kişiselleştirme'], '2026-04-30', 'open'),
  ('10000000-0000-0000-0000-000000000c08', 'KOBİ Kredi Skorlama', 'SMB Credit Scoring', 'Alternatif veri kaynaklarıyla KOBİ''ler için kredi skorlama modeli.', 'Credit scoring model for SMBs using alternative data sources.', 'FinTech', ARRAY['AI', 'fintech', 'veri'], '2026-05-30', 'open'),
  ('10000000-0000-0000-0000-000000000c04', 'Fabrika Dijital İkiz', 'Factory Digital Twin', 'Üretim hattında dijital ikiz teknolojisi ile simülasyon ve optimizasyon.', 'Simulation and optimization with digital twin technology in the production line.', 'Endüstri 4.0', ARRAY['dijital ikiz', 'IoT', 'otomasyon'], '2026-07-01', 'open'),
  ('10000000-0000-0000-0000-000000000c02', 'Sürdürülebilir Ambalaj Çözümü', 'Sustainable Packaging Solution', 'Ürün ambalajlarında plastik kullanımını azaltan yenilikçi malzeme çözümleri.', 'Innovative material solutions to reduce plastic use in product packaging.', 'GreenTech', ARRAY['sürdürülebilirlik', 'malzeme', 'inovasyon'], '2026-06-15', 'open');

-- ============================================
-- EVENTS
-- ============================================
INSERT INTO events (title_tr, title_en, description_tr, description_en, date, time, location, type, max_attendees) VALUES
  ('Here2Next Summit 2026', 'Here2Next Summit 2026', 'Türkiye''nin en büyük startup-kurum işbirliği zirvesi. 50+ kurum, 200+ startup bir arada.', 'Turkey''s largest startup-corporate collaboration summit. 50+ corporates, 200+ startups together.', '2026-05-20', '09:00-18:00', 'İstanbul Kongre Merkezi', 'summit', 500),
  ('PitStop: FinTech Eşleşme Etkinliği', 'PitStop: FinTech Matching Event', 'Bankacılık ve finans sektörü kurumlarıyla fintech startup''larının buluşması.', 'Meeting of banking and finance sector corporates with fintech startups.', '2026-04-10', '14:00-17:00', 'İş Bankası Genel Müdürlüğü', 'pitstop', 60),
  ('Workshop: Kurum İnovasyonu 101', 'Workshop: Corporate Innovation 101', 'Kurumsal şirketlerde inovasyon kültürü ve startup işbirliği yöntemleri.', 'Innovation culture and startup collaboration methods in corporate companies.', '2026-04-25', '10:00-13:00', 'Online (Zoom)', 'workshop', 100),
  ('What''s Next 2025 Recap', 'What''s Next 2025 Recap', 'Geçen yılın en başarılı işbirliklerinin değerlendirildiği etkinlik.', 'Event reviewing last year''s most successful collaborations.', '2025-12-15', '14:00-17:00', 'Boğaziçi Üniversitesi', 'webinar', 120);

-- ============================================
-- NEWS
-- ============================================
INSERT INTO news_articles (title_tr, title_en, summary_tr, summary_en, slug, category, author, published_at) VALUES
  ('Migros ve RetailAI İşbirliğiyle Mağaza Analitiği Dönüşümü', 'Store Analytics Transformation with Migros and RetailAI Partnership', 'Migros, RetailAI''ın yapay zeka çözümlerini 150 mağazasında denemeye başladı. İlk sonuçlar %15 verimlilik artışı gösteriyor.', 'Migros has started piloting RetailAI''s AI solutions in 150 stores. Initial results show 15% efficiency improvement.', 'migros-retailai-isbirligi', 'İşbirliği', 'Here2Next Editör', '2026-03-15'),
  ('Here2Next Üye Sayısı 50''yi Aştı', 'Here2Next Membership Exceeds 50', 'Platformumuza katılan kurum sayısı 50''yi aşarak yeni bir kilometre taşına ulaştı.', 'The number of corporate members joining our platform has exceeded 50, reaching a new milestone.', 'uye-sayisi-50', 'Platform', 'Here2Next', '2026-03-10'),
  ('HealthBridge, Enerjisa İle Saha Sağlığı Projesi Başlattı', 'HealthBridge Launched Field Health Project with Enerjisa', 'HealthBridge''in uzaktan sağlık takibi çözümü Enerjisa''nın saha çalışanlarına uygulanıyor.', 'HealthBridge''s remote health monitoring solution is being applied to Enerjisa''s field workers.', 'healthbridge-enerjisa', 'İşbirliği', 'Here2Next Editör', '2026-03-01'),
  ('Startup Dostu Manifesto''ya 3 Yeni İmza', '3 New Signatures for Startup-Friendly Manifesto', 'Boyner, Getir ve Doğuş Holding, Startup Dostu Şirket Manifestosu''nu imzalayan yeni kurumlar oldu.', 'Boyner, Getir, and Doğuş Holding are the new corporations signing the Startup-Friendly Manifesto.', 'manifesto-yeni-imzalar', 'Manifesto', 'Here2Next', '2026-02-20');

-- ============================================
-- MATCH RESULTS
-- ============================================
INSERT INTO match_results (startup_id, corporate_id, score, reasons_tr, reasons_en, status) VALUES
  ('20000000-0000-0000-0000-000000000a01', '10000000-0000-0000-0000-000000000c08', 94, ARRAY['Fintech alanında güçlü uyum', 'KOBİ odaklı çözüm - bankanın ihtiyaç listesiyle eşleşiyor', 'İstanbul merkezli - kolay koordinasyon'], ARRAY['Strong alignment in fintech', 'SMB-focused solution matches bank''s wishlist', 'Istanbul-based - easy coordination'], 'pending'),
  ('20000000-0000-0000-0000-000000000a07', '10000000-0000-0000-0000-000000000c05', 91, ARRAY['Perakende analitiği uzmanlığı', 'Mağaza içi müşteri analizi ihtiyacıyla örtüşüyor', 'Proven çözüm - pilot aşamasında'], ARRAY['Retail analytics expertise', 'Aligns with in-store customer analysis need', 'Proven solution - in pilot phase'], 'connected'),
  ('20000000-0000-0000-0000-000000000a08', '10000000-0000-0000-0000-000000000c03', 87, ARRAY['Enerji sektörü odaklı', 'Yenilenebilir enerji yönetimi uzmanlığı', 'IoT tabanlı çözüm altyapısı'], ARRAY['Energy sector focused', 'Renewable energy management expertise', 'IoT-based solution infrastructure'], 'pending'),
  ('20000000-0000-0000-0000-000000000a03', '10000000-0000-0000-0000-000000000c07', 82, ARRAY['Yolcu sağlık takibi potansiyeli', 'Telemedicine çözümleri uçuş deneyimine uyarlanabilir', 'Geniş ekip ve deneyim'], ARRAY['Passenger health monitoring potential', 'Telemedicine solutions adaptable to flight experience', 'Large team and experience'], 'pending'),
  ('20000000-0000-0000-0000-000000000a05', '10000000-0000-0000-0000-000000000c09', 79, ARRAY['Kurumsal eğitim platformu', 'Grup şirketleri için ölçeklenebilir', 'HR Tech alanında güçlü referanslar'], ARRAY['Corporate training platform', 'Scalable for group companies', 'Strong references in HR Tech'], 'pending');
