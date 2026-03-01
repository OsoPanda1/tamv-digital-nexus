-- ============================================================================
-- TAMV MD-X4™ - Supabase Migration
-- UTAMV BCI, Membership, and Dashboard Tables
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- MEMBERSHIP SYSTEM TABLES
-- ============================================================================

-- Membership tiers configuration
CREATE TABLE IF NOT EXISTS membership_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  price_max DECIMAL(10,2),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  features JSONB NOT NULL DEFAULT '[]',
  limits JSONB NOT NULL DEFAULT '{}',
  support JSONB NOT NULL DEFAULT '{}',
  sla JSONB,
  visibility JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO membership_tiers (id, name, price, billing_cycle, features, limits, support, visibility) VALUES
('free', 'Free', 0, 'monthly', 
  '["basic_access", "public_dream_spaces", "free_courses", "basic_wallet", "community_forums", "email_support"]',
  '{"users": 1, "apiCallsPerDay": 100, "storageGB": 1}', 
  '{"channels": ["email"], "responseTime": "48 hours"}',
  '{"nodes": 0, "metrics": ["basic"]}' 
),
('starter', 'Starter', 30, 'monthly',
  '["everything_in_free", "premium_courses_limited", "api_access_basic", "private_groups"]',
  '{"users": 5, "apiCallsPerDay": 1000, "storageGB": 10}',
  '{"channels": ["email"], "responseTime": "24 hours"}',
  '{"nodes": 10, "metrics": ["basic", "standard"]}'
),
('pro', 'Pro', 180, 'monthly',
  '["everything_in_starter", "all_courses_access", "api_extended", "bci_basic"]',
  '{"users": 20, "apiCallsPerDay": 10000, "storageGB": 50}',
  '{"channels": ["email", "chat"], "responseTime": "4 hours"}',
  '{"nodes": 25, "metrics": ["basic", "standard", "advanced"]}'
),
('business', 'Business', 550, 'monthly',
  '["everything_in_pro", "priority_support", "sla_99_9", "bci_advanced"]',
  '{"users": 100, "apiCallsPerDay": 100000, "storageGB": 200}',
  '{"channels": ["email", "chat", "phone"], "responseTime": "1 hour"}',
  '{"nodes": 48, "metrics": ["basic", "standard", "advanced", "complete"]}'
),
('enterprise', 'Enterprise', 2400, 'yearly',
  '["everything_in_business", "dedicated_infrastructure", "on_premise_option", "compliance_support"]',
  '{"users": -1, "apiCallsPerDay": -1, "storageGB": -1}',
  '{"channels": ["email", "chat", "phone", "dedicated"], "responseTime": "15 minutes"}',
  '{"nodes": 48, "metrics": ["basic", "standard", "advanced", "complete"]}'
),
('custom', 'Custom', 10000, 'custom',
  '["everything_in_enterprise", "white_label", "fully_customized", "co_governance"]',
  '{"users": -1, "apiCallsPerDay": -1, "storageGB": -1}',
  '{"channels": ["email", "chat", "phone", "dedicated"], "responseTime": "Immediate"}',
  '{"nodes": -1, "metrics": ["all"]}'
)
ON CONFLICT (id) DO NOTHING;

-- User memberships
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID,
  tier_id TEXT NOT NULL REFERENCES membership_tiers(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired', 'pending')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  price DECIMAL(10,2) NOT NULL,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  usage JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================================================
-- BCI SYSTEM TABLES
-- ============================================================================

-- BCI sessions
CREATE TABLE IF NOT EXISTS bci_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'muse' CHECK (device_type IN ('muse', 'emotiv', 'neurosky', 'openbci', 'custom')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  data_points INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BCI raw data (for analysis)
CREATE TABLE IF NOT EXISTS bci_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES bci_sessions(id) ON DELETE CASCADE,
  timestamp BIGINT NOT NULL,
  channels JSONB NOT NULL,
  quality DECIMAL(3,2) DEFAULT 1.0,
  artifacts JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_bci_data_session ON bci_data(session_id);
CREATE INDEX IF NOT EXISTS idx_bci_data_timestamp ON bci_data(timestamp);

-- Emotional states (processed)
CREATE TABLE IF NOT EXISTS emotional_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES bci_sessions(id) ON DELETE SET NULL,
  primary_emotion TEXT NOT NULL,
  secondary_emotion TEXT,
  confidence DECIMAL(3,2) NOT NULL DEFAULT 0.5,
  valence DECIMAL(3,2) NOT NULL DEFAULT 0,
  arousal DECIMAL(3,2) NOT NULL DEFAULT 0.5,
  dimensions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user queries
CREATE INDEX IF NOT EXISTS idx_emotional_states_user ON emotional_states(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_states_created ON emotional_states(created_at DESC);

-- Affective embeddings (user emotional profiles)
CREATE TABLE IF NOT EXISTS affective_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_state JSONB NOT NULL DEFAULT '{}',
  baseline JSONB NOT NULL DEFAULT '{}',
  history JSONB NOT NULL DEFAULT '[]',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NODE METRICS TABLES
-- ============================================================================

-- Federation nodes
CREATE TABLE IF NOT EXISTS federation_nodes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance')),
  capabilities JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default nodes
INSERT INTO federation_nodes (id, name, region, country, endpoint, status, capabilities) VALUES
('MX-CEN', 'México Central', 'América del Norte', 'México', 'https://mx-cen.tamv.network', 'online', '{"quantum": true, "bci": true, "xr": true, "ai": true}'),
('MX-NOR', 'México Norte', 'América del Norte', 'México', 'https://mx-nor.tamv.network', 'online', '{"quantum": false, "bci": true, "xr": true, "ai": true}'),
('BR-LE', 'Brasil Leste', 'América del Sur', 'Brasil', 'https://br-le.tamv.network', 'online', '{"quantum": true, "bci": true, "xr": true, "ai": true}'),
('AR-BA', 'Argentina Buenos Aires', 'América del Sur', 'Argentina', 'https://ar-ba.tamv.network', 'online', '{"quantum": true, "bci": true, "xr": true, "ai": true}'),
('CO-BOG', 'Colombia Bogotá', 'América del Sur', 'Colombia', 'https://co-bog.tamv.network', 'online', '{"quantum": true, "bci": true, "xr": true, "ai": true}'),
('ES-MAD', 'España Madrid', 'Europa', 'España', 'https://es-mad.tamv.network', 'online', '{"quantum": true, "bci": true, "xr": true, "ai": true}'),
('US-EAST', 'US East', 'América del Norte', 'Estados Unidos', 'https://us-east.tamv.network', 'online', '{"quantum": true, "bci": true, "xr": true, "ai": true}')
ON CONFLICT (id) DO NOTHING;

-- Node metrics (time series)
CREATE TABLE IF NOT EXISTS node_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id TEXT NOT NULL REFERENCES federation_nodes(id) ON DELETE CASCADE,
  latency_ms INTEGER NOT NULL,
  load_percent INTEGER NOT NULL,
  health_score INTEGER NOT NULL,
  uptime_days INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  requests_per_minute INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for metrics queries
CREATE INDEX IF NOT EXISTS idx_node_metrics_node ON node_metrics(node_id);
CREATE INDEX IF NOT EXISTS idx_node_metrics_created ON node_metrics(created_at DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Check membership access
CREATE OR REPLACE FUNCTION check_membership_access(
  p_user_id UUID,
  p_feature TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_tier_id TEXT;
  v_features JSONB;
BEGIN
  SELECT tier_id INTO v_tier_id
  FROM memberships
  WHERE user_id = p_user_id AND status = 'active';
  
  IF v_tier_id IS NULL THEN
    v_tier_id := 'free';
  END IF;
  
  SELECT features INTO v_features
  FROM membership_tiers
  WHERE id = v_tier_id;
  
  RETURN v_features ? p_feature OR v_features ? 'everything_in_' || v_tier_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log BCI data
CREATE OR REPLACE FUNCTION log_bci_data(
  p_session_id UUID,
  p_timestamp BIGINT,
  p_channels JSONB,
  p_quality DECIMAL DEFAULT 1.0
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO bci_data (session_id, timestamp, channels, quality)
  VALUES (p_session_id, p_timestamp, p_channels, p_quality)
  RETURNING id INTO v_id;
  
  UPDATE bci_sessions
  SET data_points = data_points + 1
  WHERE id = p_session_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get dashboard visibility
CREATE OR REPLACE FUNCTION get_dashboard_visibility(
  p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_tier_id TEXT;
  v_visibility JSONB;
BEGIN
  SELECT tier_id INTO v_tier_id
  FROM memberships
  WHERE user_id = p_user_id AND status = 'active';
  
  IF v_tier_id IS NULL THEN
    v_tier_id := 'free';
  END IF;
  
  SELECT visibility INTO v_visibility
  FROM membership_tiers
  WHERE id = v_tier_id;
  
  RETURN v_visibility;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get visible nodes
CREATE OR REPLACE FUNCTION get_visible_nodes(
  p_user_id UUID
) RETURNS SETOF federation_nodes AS $$
DECLARE
  v_tier_id TEXT;
  v_node_count INTEGER;
BEGIN
  SELECT COALESCE(
    (SELECT tier_id FROM memberships WHERE user_id = p_user_id AND status = 'active'),
    'free'
  ) INTO v_tier_id;
  
  SELECT (visibility->>'nodes')::INTEGER INTO v_node_count
  FROM membership_tiers WHERE id = v_tier_id;
  
  IF v_node_count IS NULL OR v_node_count = 0 THEN
    RETURN;
  END IF;
  
  IF v_node_count < 0 THEN
    -- Unlimited access
    RETURN QUERY SELECT * FROM federation_nodes;
  ELSE
    RETURN QUERY SELECT * FROM federation_nodes LIMIT v_node_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE bci_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bci_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE affective_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_metrics ENABLE ROW LEVEL SECURITY;

-- Membership policies
CREATE POLICY "Users can view own membership"
  ON memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to memberships"
  ON memberships FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- BCI sessions policies
CREATE POLICY "Users can view own BCI sessions"
  ON bci_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own BCI sessions"
  ON bci_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own BCI sessions"
  ON bci_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- BCI data policies
CREATE POLICY "Users can view own BCI data"
  ON bci_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bci_sessions 
      WHERE bci_sessions.id = bci_data.session_id 
      AND bci_sessions.user_id = auth.uid()
    )
  );

-- Emotional states policies
CREATE POLICY "Users can view own emotional states"
  ON emotional_states FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotional states"
  ON emotional_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Node metrics policies (based on membership)
CREATE POLICY "Node metrics visible based on membership"
  ON node_metrics FOR SELECT
  USING (true); -- Visibility handled by function

-- Federation nodes policies
CREATE POLICY "Federation nodes visible based on membership"
  ON federation_nodes FOR SELECT
  USING (true); -- Visibility handled by function

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_federation_nodes_updated_at
  BEFORE UPDATE ON federation_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON membership_tiers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON memberships TO authenticated;
GRANT SELECT, INSERT, UPDATE ON bci_sessions TO authenticated;
GRANT SELECT, INSERT ON bci_data TO authenticated;
GRANT SELECT, INSERT ON emotional_states TO authenticated;
GRANT SELECT, INSERT, UPDATE ON affective_embeddings TO authenticated;
GRANT SELECT ON federation_nodes TO authenticated;
GRANT SELECT ON node_metrics TO authenticated;

-- Service role grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
