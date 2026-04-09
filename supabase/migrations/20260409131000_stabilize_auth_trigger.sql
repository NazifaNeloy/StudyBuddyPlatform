-- Stabilization Migration: Strict Schema Binding
-- This migration re-links the Auth trigger with explicit schema references.

-- 1. Explicitly drop the old trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Fully qualified function replacement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- We wrap the entire insert in an EXCEPTION block for extreme safety
  BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, gender, skills, batch, interests)
    VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'full_name', 'Neural Student'),
      COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
      COALESCE(new.raw_user_meta_data->>'gender', 'Hidden'),
      ARRAY(SELECT jsonb_array_elements_text(COALESCE(new.raw_user_meta_data->'skills', '[]'::jsonb))),
      COALESCE(new.raw_user_meta_data->>'batch', '0'),
      ARRAY(SELECT jsonb_array_elements_text(COALESCE(new.raw_user_meta_data->'interests', '[]'::jsonb)))
    )
    ON CONFLICT (id) DO UPDATE SET
      gender = EXCLUDED.gender,
      skills = EXCLUDED.skills,
      batch = EXCLUDED.batch,
      interests = EXCLUDED.interests,
      updated_at = now();
  EXCEPTION WHEN OTHERS THEN
    -- If profile creation fails, we still allow the user to be created in auth.users
    -- This avoids the "Database error saving new user" fatal loop
    RAISE WARNING 'Profile creation failed for user %: %', new.id, SQLERRM;
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-create trigger with explicit schema name
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Ensure some existing users don't break selecting
UPDATE public.profiles SET skills = '{}' WHERE skills IS NULL;
UPDATE public.profiles SET interests = '{}' WHERE interests IS NULL;
