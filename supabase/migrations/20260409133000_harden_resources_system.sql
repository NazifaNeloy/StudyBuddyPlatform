-- 1. Add file_size column to track real storage usage (in bytes)
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT 0;

-- 2. Make circle_id nullable to allow for personal/general storage
ALTER TABLE public.resources ALTER COLUMN circle_id DROP NOT NULL;

-- 3. Update RLS SELECT policy to include personal files
DROP POLICY IF EXISTS "Members can view resources in their circles." ON public.resources;
CREATE POLICY "Users can view their own or circle resources."
  ON public.resources FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.circle_members
      WHERE circle_id = resources.circle_id
      AND user_id = auth.uid()
    )
  );

-- 4. Update RLS INSERT policy to allow personal uploads (null circle_id)
DROP POLICY IF EXISTS "Members can upload resources to their circles." ON public.resources;
CREATE POLICY "Users can upload their own resources."
  ON public.resources FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      circle_id IS NULL 
      OR 
      EXISTS (
        SELECT 1 FROM public.circle_members
        WHERE circle_id = resources.circle_id
        AND user_id = auth.uid()
      )
    )
  );
