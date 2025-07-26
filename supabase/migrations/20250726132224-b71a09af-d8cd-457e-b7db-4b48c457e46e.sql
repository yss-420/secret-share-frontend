-- Update the default value for gems column in users table to 100
ALTER TABLE public.users ALTER COLUMN gems SET DEFAULT 100;

-- Update existing users who have exactly 50 gems to give them the proper welcome bonus
UPDATE public.users 
SET gems = 100 
WHERE gems = 50 AND total_gems_spent = 0;