-- Create connections table for social matching
DROP TABLE IF EXISTS public.connections CASCADE;
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user_id_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_connection UNIQUE(user_id_1, user_id_2)
);

-- RLS setup
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own connections." ON public.connections;
CREATE POLICY "Users can view their own connections." ON public.connections 
  FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

DROP POLICY IF EXISTS "Users can insert their own connections." ON public.connections;
CREATE POLICY "Users can insert their own connections." ON public.connections 
  FOR INSERT WITH CHECK (auth.uid() = user_id_1);

DROP POLICY IF EXISTS "Users can update their own connections." ON public.connections;
CREATE POLICY "Users can update their own connections." ON public.connections 
  FOR UPDATE USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);
