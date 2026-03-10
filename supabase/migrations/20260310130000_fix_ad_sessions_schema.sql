-- Fix ad_sessions schema: add missing columns that the edge function needs
-- and add 'expired' to the status constraint for stale session cleanup

-- Add missing columns
ALTER TABLE ad_sessions ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE ad_sessions ADD COLUMN IF NOT EXISTS postback_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE ad_sessions ADD COLUMN IF NOT EXISTS estimated_price DECIMAL(10,5) DEFAULT 0;

-- Update status check constraint to include 'expired'
ALTER TABLE ad_sessions DROP CONSTRAINT IF EXISTS ad_sessions_status_check;
ALTER TABLE ad_sessions ADD CONSTRAINT ad_sessions_status_check
  CHECK (status = ANY (ARRAY['started', 'completed', 'closed', 'rejected', 'error', 'expired']));

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_ad_sessions_status_session ON ad_sessions(status, session_id);
CREATE INDEX IF NOT EXISTS idx_ad_sessions_user_type ON ad_sessions(user_id, ad_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_events_session ON ad_events(session_id);
