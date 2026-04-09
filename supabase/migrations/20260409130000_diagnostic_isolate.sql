-- Isolation Migration: Disable Match Trigger for Diagnostics
-- This will help identify if the error is in the matching engine or account creation.

ALTER TABLE public.profiles DISABLE TRIGGER trigger_match_on_profile_update;

-- Optional: Reset handle_new_user to absolute simplicity for testing
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, gender, skills, batch, interests)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Diagnose User'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'gender', 'Hidden'),
    '{}', -- Hardcoded empty array for testing
    COALESCE(new.raw_user_meta_data->>'batch', '0'),
    '{}'  -- Hardcoded empty array for testing
  )
  ON CONFLICT (id) DO UPDATE SET
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
