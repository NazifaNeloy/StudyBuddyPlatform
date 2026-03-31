-- Add summary and keywords support to resources table
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS keywords TEXT[]; -- For array of keywords
