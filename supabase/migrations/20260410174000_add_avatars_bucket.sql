-- Migration: Add Avatars Bucket and RLS Policies
-- Description: Creates a storage bucket for user profile pictures and sets up security policies.

-- 1. Create the 'avatars' bucket if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'avatars', 
            'avatars', 
            true, 
            5242880, -- 5MB limit
            '{image/png,image/jpeg,image/gif,image/webp}'
        );
    END IF;
END $$;

-- 2. Storage Policies for the 'avatars' bucket

-- Select Policy: Allow public read access to avatars
DROP POLICY IF EXISTS "Avatar Public Access" ON storage.objects;
CREATE POLICY "Avatar Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Insert/Update Policy: Allow users to upload their own avatar
-- The file path should be {auth.uid()}/avatar.png or similar
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);
