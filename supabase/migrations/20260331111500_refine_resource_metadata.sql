-- Refine resources table with better metadata
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS key_points JSONB DEFAULT '[]';

-- Ensure type can handle longer strings
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.resources ALTER COLUMN type TYPE TEXT;
