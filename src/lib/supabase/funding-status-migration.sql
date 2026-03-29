-- Add funding_status column to startups table
ALTER TABLE startups ADD COLUMN IF NOT EXISTS funding_status TEXT DEFAULT 'no_funding';

-- Update existing startups: if they have funding value, set status to 'funded'
UPDATE startups SET funding_status = 'funded' WHERE funding IS NOT NULL AND funding != '';
UPDATE startups SET funding_status = 'no_funding' WHERE funding IS NULL OR funding = '';
