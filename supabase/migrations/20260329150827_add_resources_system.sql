-- 1. Create a Storage Bucket for 'resources' if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'resources') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'resources', 
            'resources', 
            true, 
            5242880, -- 5MB limit
            '{application/pdf,image/png,image/jpeg,image/gif,text/plain}'
        );
    ELSE
        UPDATE storage.buckets SET 
            file_size_limit = 5242880,
            allowed_mime_types = '{application/pdf,image/png,image/jpeg,image/gif,text/plain}'
        WHERE id = 'resources';
    END IF;
END $$;

-- 2. Create the resources table (idempotent)
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Add missing columns safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='circle_id') THEN
        ALTER TABLE public.resources ADD COLUMN circle_id UUID REFERENCES public.study_circles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='user_id') THEN
        ALTER TABLE public.resources ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='file_path') THEN
        ALTER TABLE public.resources ADD COLUMN file_path TEXT;
    END IF;
END $$;

-- 4. Enforce constraints
DO $$
BEGIN
    ALTER TABLE public.resources ALTER COLUMN circle_id SET NOT NULL;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not set NOT NULL on circle_id';
END $$;

-- 5. Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for the resources table
DROP POLICY IF EXISTS "Members can view resources in their circles." ON public.resources;
CREATE POLICY "Members can view resources in their circles."
  ON public.resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.circle_members
      WHERE circle_id = resources.circle_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can upload resources to their circles." ON public.resources;
CREATE POLICY "Members can upload resources to their circles."
  ON public.resources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.circle_members
      WHERE circle_id = resources.circle_id
      AND user_id = auth.uid()
    )
    AND auth.uid() = user_id
  );

-- 7. Storage Policies for the 'resources' bucket
-- Note: Policy names are unique per table, not per bucket, so use granular names
DROP POLICY IF EXISTS "Resource Bucket Public Access" ON storage.objects;
CREATE POLICY "Resource Bucket Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'resources');

DROP POLICY IF EXISTS "Resource Bucket Auth Upload" ON storage.objects;
CREATE POLICY "Resource Bucket Auth Upload" ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'resources' 
    AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Resource Bucket User Delete" ON storage.objects;
CREATE POLICY "Resource Bucket User Delete" ON storage.objects FOR DELETE 
USING (
    bucket_id = 'resources' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);
