-- Migration: Enhance Profiles with Settings and Personalization
-- Description: Adds major, interface_mode, accent_color, and notification_settings to public.profiles

-- 1. Add new columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS major TEXT DEFAULT 'Not Specified';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interface_mode TEXT DEFAULT 'light';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT 'brand-purple';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{
  "study_circle_alerts": true,
  "resource_updates": true,
  "system_announcements": false
}'::jsonb;

-- 2. Ensure existing profiles have default values for the new columns
UPDATE public.profiles SET major = 'Not Specified' WHERE major IS NULL;
UPDATE public.profiles SET interface_mode = 'light' WHERE interface_mode IS NULL;
UPDATE public.profiles SET accent_color = 'brand-purple' WHERE accent_color IS NULL;
UPDATE public.profiles SET notification_settings = '{
  "study_circle_alerts": true,
  "resource_updates": true,
  "system_announcements": false
}'::jsonb WHERE notification_settings IS NULL;
