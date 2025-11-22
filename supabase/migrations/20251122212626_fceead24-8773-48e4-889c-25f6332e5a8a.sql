-- Phase 1: Create User Roles System
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT NOT NULL REFERENCES public.users(telegram_id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security Definer Function (RLS-Safe)
CREATE OR REPLACE FUNCTION public.has_role(_telegram_id BIGINT, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _telegram_id
      AND role = _role
  )
$$;

-- Grant admin role to authorized user
INSERT INTO public.user_roles (user_id, role)
VALUES (1226785406, 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Phase 4: Update blog_posts RLS Policies
DROP POLICY IF EXISTS "admin_full_access" ON public.blog_posts;
DROP POLICY IF EXISTS "service_role_full_access" ON public.blog_posts;
DROP POLICY IF EXISTS "anon_read_published" ON public.blog_posts;

-- Admins can do everything
CREATE POLICY "admins_full_access" ON public.blog_posts
FOR ALL
USING (public.has_role(author_telegram_id, 'admin'))
WITH CHECK (public.has_role(author_telegram_id, 'admin'));

-- Anyone can read published posts
CREATE POLICY "anyone_read_published" ON public.blog_posts
FOR SELECT
USING (status = 'published');

-- Service role still has full access (for edge functions)
CREATE POLICY "service_role_full_access" ON public.blog_posts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add RLS Policies to user_roles Table
CREATE POLICY "admins_manage_roles" ON public.user_roles
FOR ALL
USING (public.has_role((SELECT telegram_id FROM public.users WHERE id = auth.uid()), 'admin'))
WITH CHECK (public.has_role((SELECT telegram_id FROM public.users WHERE id = auth.uid()), 'admin'));

CREATE POLICY "users_view_own_roles" ON public.user_roles
FOR SELECT
USING (user_id = (SELECT telegram_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "service_role_manage_roles" ON public.user_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Phase 5: Add Audit Logging
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_audit_log" ON public.admin_audit_log
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "admins_view_audit_log" ON public.admin_audit_log
FOR SELECT
USING (public.has_role((SELECT telegram_id FROM public.users WHERE id = auth.uid()), 'admin'));

-- Cleanup: Delete unauthorized blog posts
DELETE FROM public.blog_posts 
WHERE author_telegram_id != 1226785406;