-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Study Circles Table
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS study_circles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Timer State Table (Shared Pomodoro)
CREATE TABLE IF NOT EXISTS timer_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID REFERENCES study_circles(id) ON DELETE CASCADE,
  is_running BOOLEAN DEFAULT false,
  seconds_remaining INTEGER DEFAULT 1500, -- 25 minutes
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Messages Table (Live Chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID REFERENCES study_circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID REFERENCES study_circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  type TEXT, -- 'pdf', 'image', 'link'
  url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime
-- ALTER PUBLICATION supabase_realtime ADD TABLE resources;
