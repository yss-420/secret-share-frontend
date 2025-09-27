-- Enable RLS on publicly readable tables (excluding views)

-- Enable RLS on gem_packages (protect pricing strategy)
ALTER TABLE public.gem_packages ENABLE ROW LEVEL SECURITY;

-- Drop existing public policy and create authenticated-only access
DROP POLICY IF EXISTS "Gem packages are publicly readable" ON public.gem_packages;

-- Create policies for gem_packages - allow read access to authenticated users only
CREATE POLICY "Authenticated users can view gem packages" 
ON public.gem_packages 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Enable RLS on r2_assets (protect media assets)  
ALTER TABLE public.r2_assets ENABLE ROW LEVEL SECURITY;

-- Drop existing public policy and create authenticated-only access
DROP POLICY IF EXISTS "r2_assets_read" ON public.r2_assets;

-- Create policies for r2_assets - allow read access to authenticated users only
CREATE POLICY "Authenticated users can view assets" 
ON public.r2_assets 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Service role needs access to all these tables for backend operations
CREATE POLICY "Service role full access to gem packages" 
ON public.gem_packages 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to r2 assets" 
ON public.r2_assets 
FOR ALL 
USING (auth.role() = 'service_role');