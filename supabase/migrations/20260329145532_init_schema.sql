-- Create profiles table (skip if exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  focus_hours NUMERIC DEFAULT 0,
  badges INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add columns if the table existed previously but lacked these new fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS focus_hours NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS badges INTEGER DEFAULT 0;

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies completely and recreate
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create trigger correctly using OR REPLACE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create Study Circles table safely
CREATE TABLE IF NOT EXISTS public.study_circles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.study_circles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Study circles are viewable by everyone." ON public.study_circles;
CREATE POLICY "Study circles are viewable by everyone." ON public.study_circles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create study circles." ON public.study_circles;
CREATE POLICY "Authenticated users can create study circles." ON public.study_circles FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Creator can update their study circle." ON public.study_circles;
CREATE POLICY "Creator can update their study circle." ON public.study_circles FOR UPDATE USING (auth.uid() = created_by);

-- Create junction table for Circle Members safely
CREATE TABLE IF NOT EXISTS public.circle_members (
  circle_id UUID REFERENCES public.study_circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (circle_id, user_id)
);

ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Circle members are viewable by everyone." ON public.circle_members;
CREATE POLICY "Circle members are viewable by everyone." ON public.circle_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join a circle." ON public.circle_members;
CREATE POLICY "Users can join a circle." ON public.circle_members FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave a circle." ON public.circle_members;
CREATE POLICY "Users can leave a circle." ON public.circle_members FOR DELETE USING (auth.uid() = user_id);

-- Create Sessions Table safely
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID REFERENCES public.study_circles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Study sessions are viewable by everyone." ON public.study_sessions;
CREATE POLICY "Study sessions are viewable by everyone." ON public.study_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Circle members can add sessions." ON public.study_sessions;
CREATE POLICY "Circle members can add sessions." ON public.study_sessions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.circle_members WHERE circle_id = study_sessions.circle_id AND user_id = auth.uid()));
