-- "Devam etmeyen startuplar" gruplaması
-- Startups tablosuna is_active kolonu ekler ve ulaşılamayan startupları işaretler
-- Supabase SQL Editor'de çalıştır

ALTER TABLE startups ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Devam etmeyen startuplar (siteleri ulaşılamıyor):
UPDATE startups SET is_active = FALSE, website = NULL
WHERE slug IN ('greenlog', 'retailai', 'eduflow', 'payflex');

-- GreenLog'a önceden eklenen geçici etiketi kaldır:
UPDATE startups SET tags = array_remove(tags, 'ulaşılamıyor') WHERE slug = 'greenlog';

-- İleride yenisi çıktığında:
-- UPDATE startups SET is_active = FALSE, website = NULL WHERE slug = '<slug>';
