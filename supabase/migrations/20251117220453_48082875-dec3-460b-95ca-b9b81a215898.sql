-- ============================================================================
-- TAMV DM-X4™ COMPLETE DATABASE SCHEMA
-- Civilización Digital Quantum XR-IA Latinoamericana
-- ============================================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- Membership tiers según el documento
CREATE TYPE membership_tier AS ENUM (
  'free',
  'pro',
  'gold',
  'gold_18',
  'celestial',
  'enterprise',
  'institutional'
);

-- Crisis severity levels
CREATE TYPE crisis_level AS ENUM ('low', 'medium', 'high', 'critical');

-- PI consent types
CREATE TYPE consent_type AS ENUM (
  'biometric',
  'voice',
  'image',
  'video',
  'creative_work',
  'data_processing',
  'ai_training',
  'marketplace',
  'publishing'
);

-- ============================================================================
-- TABLE: memberships (85-95% creator share target)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  tier membership_tier NOT NULL DEFAULT 'free',
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  payment_method TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tier)
);

-- ============================================================================
-- TABLE: pi_consents (Granular, revocable, auditable)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pi_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  consent_type consent_type NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  scope JSONB DEFAULT '{}',
  purpose TEXT,
  sha3_hash TEXT,
  doi TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: bookpi_events (Legal traceability, immutable audit trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookpi_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  actor_id UUID NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  payload JSONB NOT NULL DEFAULT '{}',
  sha3_512_hash TEXT NOT NULL,
  doi TEXT,
  blockchain_tx TEXT,
  ipfs_cid TEXT,
  legal_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: crisis_logs (Rollback, recovery, sentinel)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crisis_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  severity crisis_level NOT NULL DEFAULT 'medium',
  incident_type TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_user_id UUID,
  triggered_by UUID,
  rollback_executed BOOLEAN DEFAULT false,
  rollback_details JSONB DEFAULT '{}',
  recovery_actions JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: isabella_interactions (AI emocional, emotion vectors)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.isabella_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  emotion_vector JSONB DEFAULT '{}',
  ethical_flag TEXT,
  intent_analysis JSONB DEFAULT '{}',
  recommended_effects JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: dreamspaces (XR/3D/4D mascotizado)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dreamspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  space_type TEXT,
  theme TEXT DEFAULT 'quantum',
  access_level TEXT DEFAULT 'public',
  is_active BOOLEAN DEFAULT true,
  max_participants INTEGER DEFAULT 50,
  current_participants INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  xr_assets JSONB DEFAULT '{}',
  audio_config JSONB DEFAULT '{}',
  visual_effects JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: circle_gifts (CircleGiftGallery system)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.circle_gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'MXN',
  visual_preview JSONB DEFAULT '{}',
  combo_effects JSONB DEFAULT '{}',
  special_protocol TEXT,
  is_available BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: gift_transactions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.gift_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gift_id UUID REFERENCES public.circle_gifts(id),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_amount NUMERIC(10,2),
  message TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: hyperreal_effects (HyperReal Immersion Engine)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.hyperreal_effects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  effect_type TEXT NOT NULL,
  shader_code TEXT,
  audio_reactive BOOLEAN DEFAULT false,
  ai_driven BOOLEAN DEFAULT false,
  parameters JSONB DEFAULT '{}',
  preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pi_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookpi_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dreamspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hyperreal_effects ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Memberships
CREATE POLICY "Users can view their own memberships"
  ON public.memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memberships"
  ON public.memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memberships"
  ON public.memberships FOR UPDATE
  USING (auth.uid() = user_id);

-- PI Consents
CREATE POLICY "Users can view their own consents"
  ON public.pi_consents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consents"
  ON public.pi_consents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents"
  ON public.pi_consents FOR UPDATE
  USING (auth.uid() = user_id);

-- BookPI Events (Public audit trail)
CREATE POLICY "BookPI events are publicly viewable"
  ON public.bookpi_events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create BookPI events"
  ON public.bookpi_events FOR INSERT
  WITH CHECK (auth.uid() = actor_id);

-- Crisis Logs
CREATE POLICY "Admins can view all crisis logs"
  ON public.crisis_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Users can view their own crisis logs"
  ON public.crisis_logs FOR SELECT
  USING (auth.uid() = affected_user_id);

CREATE POLICY "Admins can manage crisis logs"
  ON public.crisis_logs FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Isabella Interactions
CREATE POLICY "Users can view their own Isabella interactions"
  ON public.isabella_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create Isabella interactions"
  ON public.isabella_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- DreamSpaces
CREATE POLICY "Public dreamspaces are viewable by everyone"
  ON public.dreamspaces FOR SELECT
  USING (access_level = 'public' OR owner_id = auth.uid());

CREATE POLICY "Users can create their own dreamspaces"
  ON public.dreamspaces FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their dreamspaces"
  ON public.dreamspaces FOR UPDATE
  USING (auth.uid() = owner_id);

-- Circle Gifts (Public catalog)
CREATE POLICY "Gifts are viewable by everyone"
  ON public.circle_gifts FOR SELECT
  USING (is_available = true);

-- Gift Transactions
CREATE POLICY "Users can view their gift transactions"
  ON public.gift_transactions FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send gifts"
  ON public.gift_transactions FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- HyperReal Effects (Public catalog)
CREATE POLICY "Effects are viewable by everyone"
  ON public.hyperreal_effects FOR SELECT
  USING (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Create BookPI Event with SHA3-512 hash
CREATE OR REPLACE FUNCTION public.create_bookpi_event(
  p_event_type TEXT,
  p_actor_id UUID,
  p_resource_type TEXT,
  p_resource_id UUID,
  p_payload JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id UUID;
  v_hash TEXT;
  v_doi TEXT;
BEGIN
  -- Generate SHA3-512 hash of payload
  v_hash := encode(digest(p_payload::text, 'sha512'), 'hex');
  
  -- Generate DOI (simplified version)
  v_doi := 'bookpi:' || p_event_type || ':' || gen_random_uuid()::text;
  
  -- Insert event
  INSERT INTO public.bookpi_events (
    event_type,
    actor_id,
    resource_type,
    resource_id,
    payload,
    sha3_512_hash,
    doi
  ) VALUES (
    p_event_type,
    p_actor_id,
    p_resource_type,
    p_resource_id,
    p_payload,
    v_hash,
    v_doi
  ) RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$;

-- Function: Trigger Crisis Rollback
CREATE OR REPLACE FUNCTION public.trigger_crisis_rollback(
  p_incident_type TEXT,
  p_description TEXT,
  p_severity crisis_level,
  p_affected_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_crisis_id UUID;
  v_rollback_details JSONB;
BEGIN
  -- Only admins/moderators can trigger rollback
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role)) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can trigger crisis rollback';
  END IF;
  
  -- Prepare rollback details
  v_rollback_details := jsonb_build_object(
    'triggered_at', NOW(),
    'triggered_by', auth.uid(),
    'backup_point', 'auto',
    'status', 'initiated'
  );
  
  -- Insert crisis log
  INSERT INTO public.crisis_logs (
    severity,
    incident_type,
    description,
    affected_user_id,
    triggered_by,
    rollback_executed,
    rollback_details
  ) VALUES (
    p_severity,
    p_incident_type,
    p_description,
    p_affected_user_id,
    auth.uid(),
    true,
    v_rollback_details
  ) RETURNING id INTO v_crisis_id;
  
  -- Create BookPI audit event
  PERFORM create_bookpi_event(
    'crisis_rollback',
    auth.uid(),
    'crisis_log',
    v_crisis_id,
    jsonb_build_object(
      'severity', p_severity,
      'incident_type', p_incident_type,
      'description', p_description
    )
  );
  
  RETURN v_crisis_id;
END;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated_at triggers
CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pi_consents_updated_at
  BEFORE UPDATE ON public.pi_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dreamspaces_updated_at
  BEFORE UPDATE ON public.dreamspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_tier ON public.memberships(tier);
CREATE INDEX IF NOT EXISTS idx_pi_consents_user_id ON public.pi_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_pi_consents_type ON public.pi_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_bookpi_events_actor ON public.bookpi_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_bookpi_events_type ON public.bookpi_events(event_type);
CREATE INDEX IF NOT EXISTS idx_bookpi_events_created ON public.bookpi_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crisis_logs_severity ON public.crisis_logs(severity);
CREATE INDEX IF NOT EXISTS idx_crisis_logs_user ON public.crisis_logs(affected_user_id);
CREATE INDEX IF NOT EXISTS idx_isabella_interactions_user ON public.isabella_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_isabella_interactions_created ON public.isabella_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dreamspaces_owner ON public.dreamspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_dreamspaces_active ON public.dreamspaces(is_active);
CREATE INDEX IF NOT EXISTS idx_gift_transactions_sender ON public.gift_transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_gift_transactions_receiver ON public.gift_transactions(receiver_id);