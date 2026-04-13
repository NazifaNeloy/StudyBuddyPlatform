-- Fix Library Upload: Increase file size limit + fix ambiguous RLS policies
-- Run this in Supabase SQL Editor

-- 1. Increase storage bucket file size limit to 50MB and expand allowed types
UPDATE storage.buckets 
SET 
  file_size_limit = 52428800,  -- 50MB
  allowed_mime_types = ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'video/mp4',
    'audio/mpeg'
  ]
WHERE id = 'resources';

-- 2. Make circle_id nullable so personal uploads (no circle context) work
ALTER TABLE public.resources ALTER COLUMN circle_id DROP NOT NULL;

-- 3. Drop ALL existing conflicting policies on the resources table
DROP POLICY IF EXISTS "Members can view resources in their circles." ON public.resources;
DROP POLICY IF EXISTS "Members can upload resources to their circles." ON public.resources;
DROP POLICY IF EXISTS "Users can view their own or circle resources." ON public.resources;
DROP POLICY IF EXISTS "Users can upload their own resources." ON public.resources;

-- 4. Clean, simple SELECT policy: see your own or circle files
CREATE POLICY "resources_select_policy"
  ON public.resources FOR SELECT
  USING (
    user_id = auth.uid()
    OR (
      circle_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.circle_members 
        WHERE circle_members.circle_id = resources.circle_id 
        AND circle_members.user_id = auth.uid()
      )
    )
  );

-- 5. Clean INSERT policy: upload if authenticated and user_id matches
CREATE POLICY "resources_insert_policy"
  ON public.resources FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      circle_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.circle_members 
        WHERE circle_members.circle_id = resources.circle_id 
        AND circle_members.user_id = auth.uid()
      )
    )
  );

-- 6. Allow owners to delete their own resources
DROP POLICY IF EXISTS "resources_delete_policy" ON public.resources;
CREATE POLICY "resources_delete_policy"
  ON public.resources FOR DELETE
  USING (user_id = auth.uid());

-- 7. Ensure storage INSERT policy exists for auth users
DROP POLICY IF EXISTS "Resource Bucket Auth Upload" ON storage.objects;
CREATE POLICY "Resource Bucket Auth Upload" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'resources' 
    AND auth.role() = 'authenticated'
  );
