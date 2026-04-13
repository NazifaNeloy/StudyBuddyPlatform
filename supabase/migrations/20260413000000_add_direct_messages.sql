-- Migration: Add Direct Messages Table
-- Created: 2026-04-13

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_read BOOLEAN DEFAULT false
);

-- 2. Enable RLS
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Users can view their own direct messages." ON public.direct_messages;
CREATE POLICY "Users can view their own direct messages." ON public.direct_messages 
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send their own direct messages." ON public.direct_messages;
CREATE POLICY "Users can send their own direct messages." ON public.direct_messages 
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 4. Enable Realtime
-- Note: Realtime must also be enabled in the Supabase Dashboard for this table
ALTER PUBLICATION supabase_realtime ADD TABLE direct_messages;

-- 5. Circle Join Requests Table
CREATE TABLE IF NOT EXISTS public.circle_join_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID REFERENCES public.study_circles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  inviter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_join_request UNIQUE(circle_id, user_id)
);

-- 6. Enable RLS
ALTER TABLE public.circle_join_requests ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
DROP POLICY IF EXISTS "Users can view their own join requests." ON public.circle_join_requests;
CREATE POLICY "Users can view their own join requests." ON public.circle_join_requests 
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = inviter_id OR EXISTS (
    SELECT 1 FROM public.study_circles WHERE id = circle_id AND created_by = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create join requests." ON public.circle_join_requests;
CREATE POLICY "Users can create join requests." ON public.circle_join_requests 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = inviter_id);

DROP POLICY IF EXISTS "Circle owners can update join requests." ON public.circle_join_requests;
CREATE POLICY "Circle owners can update join requests." ON public.circle_join_requests 
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.study_circles WHERE id = circle_id AND created_by = auth.uid()
  ));
