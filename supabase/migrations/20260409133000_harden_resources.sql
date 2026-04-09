-- Hardening Resource Library for Production
-- Enables file size tracking and Personal Vault (non-circle) storage

-- 1. Schema Modifications
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT 0;
ALTER TABLE public.resources ALTER COLUMN circle_id DROP NOT NULL;

-- 2. Security Re-calibration (RLS)

-- Select Policy: Access personal files OR circle-shared files
DROP POLICY IF EXISTS "Users can view their own or circle resources." ON public.resources;
DROP POLICY IF EXISTS "Members can view resources in their circles." ON public.resources;
CREATE POLICY "Users can view their own or circle resources."
  ON public.resources FOR SELECT
  USING (
    user_id = auth.uid() 
    OR circle_id IS NULL 
    OR EXISTS (SELECT 1 FROM public.circle_members WHERE circle_id = resources.circle_id AND user_id = auth.uid())
  );

-- Insert Policy: Upload personal files OR upload to circle if member
DROP POLICY IF EXISTS "Users can upload their own resources." ON public.resources;
DROP POLICY IF EXISTS "Members can upload resources to their circles." ON public.resources;
CREATE POLICY "Users can upload their own resources."
  ON public.resources FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND (
      circle_id IS NULL 
      OR EXISTS (SELECT 1 FROM public.circle_members WHERE circle_id = resources.circle_id AND user_id = auth.uid())
    )
  );
