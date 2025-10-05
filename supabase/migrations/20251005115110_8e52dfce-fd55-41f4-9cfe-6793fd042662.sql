-- Fix blog_posts RLS policies to allow public reads of published posts

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "public_read_published" ON blog_posts;
DROP POLICY IF EXISTS "admin_full_access" ON blog_posts;
DROP POLICY IF EXISTS "service_role_full_access" ON blog_posts;

-- Create PERMISSIVE policy for public to read published posts
CREATE POLICY "public_read_published" 
ON blog_posts 
FOR SELECT 
TO public
USING (status = 'published');

-- Create PERMISSIVE policy for admin full access
CREATE POLICY "admin_full_access" 
ON blog_posts 
FOR ALL
TO public
USING (author_telegram_id = 1226785406)
WITH CHECK (author_telegram_id = 1226785406);

-- Create policy for service role (bypass RLS)
CREATE POLICY "service_role_full_access" 
ON blog_posts 
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);