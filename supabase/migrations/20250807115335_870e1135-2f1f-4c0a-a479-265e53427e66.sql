-- Add missing profile fields
ALTER TABLE public.profiles 
ADD COLUMN avatar_url TEXT,
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female'));