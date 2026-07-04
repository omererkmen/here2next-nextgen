-- Jobtogo: orijinal logo ve bilgi güncellemesi
-- Supabase SQL Editor'de çalıştır

UPDATE startups SET
  logo_url = '/logos/jobtogo.svg',
  sector = 'HR/Freelance',
  description_tr = 'Şirketlerle freelancer''ların çalışmasını kolaylaştıran platform. Fatura ve sözleşme derdi olmadan freelancer eşleşmesi.',
  description_en = 'Platform that makes it easy for companies to work with freelancers. Freelancer matching without invoice and contract hassle.',
  location = 'İstanbul',
  website = 'https://www.jobtogo.co',
  tags = ARRAY['hr', 'freelance', 'marketplace']
WHERE slug = 'jobtogo' OR name ILIKE 'jobtogo%';
