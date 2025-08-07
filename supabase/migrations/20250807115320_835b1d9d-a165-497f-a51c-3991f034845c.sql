-- Add additional profile fields
ALTER TABLE public.profiles 
ADD COLUMN phone TEXT,
ADD COLUMN avatar_url TEXT,
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female'));

-- Update existing profiles to have these fields
UPDATE public.profiles SET gender = 'male' WHERE gender IS NULL;