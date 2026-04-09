-- Add full content (OCR) support to resources table
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS content TEXT;
