-- Harden Matching Engine and Handle NULLs in Existing Data
-- This migration fixes the "Database error saving new user" issue

-- Normalize existing data to prevent matching engine failures on NULLs
UPDATE public.profiles SET skills = '{}' WHERE skills IS NULL;
UPDATE public.profiles SET interests = '{}' WHERE interests IS NULL;

-- Harden Handle New User Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, gender, skills, batch, interests)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'gender', 'Hidden'),
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(new.raw_user_meta_data->'skills', '[]'::jsonb))),
    COALESCE(new.raw_user_meta_data->>'batch', 'N/A'),
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

-- Harden Match Engine Function
CREATE OR REPLACE FUNCTION public.match_potential_buddies()
RETURNS trigger AS $$
BEGIN
    -- Only match if skills or interests are provided and it's a new or updated profile
    IF (array_length(NEW.skills, 1) > 0 OR array_length(NEW.interests, 1) > 0) THEN
        -- Notify existing users who match the new profile
        BEGIN
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
        EXCEPTION WHEN OTHERS THEN
            -- Log error or ignore to prevent blocking profile creation
            NULL;
        END;

        -- Notify the current user about existing matches (limit to 3 for brevity)
        BEGIN
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
        EXCEPTION WHEN OTHERS THEN
            -- Log error or ignore to prevent blocking profile creation
            NULL;
        END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
