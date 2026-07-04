-- GreenLog: web sitesi ulaşılamıyor olarak işaretle (kayıt silinmez)
-- Aynı kalıp ileride benzer durumdaki startuplar için de kullanılabilir
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  website = NULL,
  tags = CASE WHEN 'ulaşılamıyor' = ANY(tags) THEN tags ELSE array_append(tags, 'ulaşılamıyor') END
WHERE slug = 'greenlog';
