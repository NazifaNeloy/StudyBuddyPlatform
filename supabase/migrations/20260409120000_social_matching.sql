-- Social Matching Migration (Hardened)
-- Run this in the Supabase SQL Editor

-- 1. Extend Profiles Table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS batch TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Normalize existing data to prevent matching engine failures on NULLs
UPDATE public.profiles SET skills = '{}' WHERE skills IS NULL;
UPDATE public.profiles SET interests = '{}' WHERE interests IS NULL;

-- 2. Update Signup Trigger Function (Hardened)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, gender, skills, batch, interests)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'gender',
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(new.raw_user_meta_data->'skills', '[]'::jsonb))),
    new.raw_user_meta_data->>'batch',
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(new.raw_user_meta_data->'interests', '[]'::jsonb)))
  )
  ON CONFLICT (id) DO UPDATE SET
    gender = EXCLUDED.gender,
    skills = EXCLUDED.skills,
    batch = EXCLUDED.batch,
    interests = EXCLUDED.interests,
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Match Engine Function (Hardened with NULL safety)
CREATE OR REPLACE FUNCTION public.match_potential_buddies()
RETURNS trigger AS $$
BEGIN
    -- Only match if skills or interests are provided and it's a new or updated profile
    IF (array_length(NEW.skills, 1) > 0 OR array_length(NEW.interests, 1) > 0) THEN
        -- Notify existing users who match the new profile
        INSERT INTO public.notifications (user_id, type, content, metadata)
        SELECT 
            p.id,
            'match_found',
            'Synchronized Node Found: ' || COALESCE(NEW.full_name, 'Neural Student') || ' shares your cognitive interests!',
            jsonb_build_object(
              'matched_user_id', NEW.id, 
              'match_name', COALESCE(NEW.full_name, 'Neural Student'), 
              'overlap_type', CASE WHEN p.skills && NEW.skills THEN 'skills' ELSE 'interests' END
            )
        FROM public.profiles p
        WHERE p.id != NEW.id
        AND (p.skills && NEW.skills OR p.interests && NEW.interests);

        -- Notify the current user about existing matches (limit to 3 for brevity)
        INSERT INTO public.notifications (user_id, type, content, metadata)
        SELECT 
            NEW.id,
            'match_found',
            'Synchronized Node Found: ' || COALESCE(p.full_name, 'Neural Student') || ' shares your cognitive interests!',
            jsonb_build_object(
              'matched_user_id', p.id, 
              'match_name', COALESCE(p.full_name, 'Neural Student'), 
              'overlap_type', CASE WHEN p.skills && NEW.skills THEN 'skills' ELSE 'interests' END
            )
        FROM public.profiles p
        WHERE p.id != NEW.id
        AND (p.skills && NEW.skills OR p.interests && NEW.interests)
        LIMIT 3;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Automated Match Trigger
DROP TRIGGER IF EXISTS trigger_match_on_profile_update ON public.profiles;
CREATE TRIGGER trigger_match_on_profile_update
  AFTER INSERT OR UPDATE OF skills, interests ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.match_potential_buddies();
