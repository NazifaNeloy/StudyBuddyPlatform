-- Add category column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'primary';

-- Update RLS for safety (though not strictly required for a new column)
DROP POLICY IF EXISTS "Users can view their own tasks." ON public.tasks;
CREATE POLICY "Users can view their own tasks." ON public.tasks FOR SELECT USING (auth.uid() = user_id);
