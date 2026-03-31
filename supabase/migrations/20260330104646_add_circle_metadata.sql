-- 1. Add metadata columns to study_circles
ALTER TABLE public.study_circles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'IN PROGRESS',
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'MEDIUM',
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days');

-- 2. Update existing rows with some variety (optional for demo)
UPDATE public.study_circles 
SET priority = 'HIGH' 
WHERE name ILIKE '%exam%' OR name ILIKE '%final%';

-- 3. Ensure the project is linked and password is ready (Assuming already linked)
-- cmd /c npx supabase db push --password 54DaRsC7vJhQPujy
