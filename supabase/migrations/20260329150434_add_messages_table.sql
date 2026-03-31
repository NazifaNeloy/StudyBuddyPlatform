-- 1. Create messages table for shared study circle chats (if not exists)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add missing columns to messages table if it already existed without them
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='circle_id') THEN
        ALTER TABLE public.messages ADD COLUMN circle_id UUID REFERENCES public.study_circles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='user_id') THEN
        ALTER TABLE public.messages ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='user_name') THEN
        ALTER TABLE public.messages ADD COLUMN user_name TEXT;
    END IF;
END $$;

-- 3. Ensure foreign keys and NOT NULL constraints if they were added above
-- (Using DO blocks to safely alter columns)
DO $$
BEGIN
    -- Make them NOT NULL if they aren't (only if they are empty or we don't care about existing data)
    -- For a new project, we can just enforce it.
    ALTER TABLE public.messages ALTER COLUMN circle_id SET NOT NULL;
    ALTER TABLE public.messages ALTER COLUMN user_id SET NOT NULL;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not set NOT NULL constraints, table might have existing data.';
END $$;

-- 4. Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. Allow circle members to read and post messages
DROP POLICY IF EXISTS "Members can view messages in their circles." ON public.messages;
CREATE POLICY "Members can view messages in their circles."
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.circle_members
      WHERE circle_id = messages.circle_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can post messages in their circles." ON public.messages;
CREATE POLICY "Members can post messages in their circles."
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.circle_members
      WHERE circle_id = messages.circle_id
      AND user_id = auth.uid()
    )
    AND auth.uid() = user_id
  );

-- 6. Enable real-time for messages table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages'
  ) THEN
    -- Ensure the publication exists first (standard in Supabase)
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    END IF;
  END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not add table to publication.';
END $$;
