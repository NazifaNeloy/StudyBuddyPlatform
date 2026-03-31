-- Add streak tracking to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_focus_date DATE;

-- Ensure numeric focus_hours is handled correctly
ALTER TABLE public.profiles ALTER COLUMN focus_hours SET DEFAULT 0;
