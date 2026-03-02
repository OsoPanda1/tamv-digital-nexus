-- ============================================================================
-- TAMV MD-X4™ Database Migration
-- Version: 1.0.0
-- Date: 2026-03-02
-- Description: Core database schema for TAMV ecosystem
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE crisis_level AS ENUM ('low', 'medium', 'high', 'critical', 'catastrophic');
CREATE TYPE membership_tier AS ENUM ('free', 'premium', 'vip', 'elite', 'celestial', 'enterprise');
CREATE TYPE user_role AS ENUM ('public', 'creator', 'pro', 'admin', 'moderator', 'guardian');
CREATE TYPE notification_priority AS ENUM ('urgent', 'high', 'normal', 'low');
CREATE TYPE notification_category AS ENUM ('achievement', 'social', 'system', 'celebration', 'alert', 'general', 'message', 'upgrade');
CREATE TYPE emotional_tone AS ENUM ('joy', 'triumph', 'alert', 'calm', 'neutral', 'sadness', 'fear', 'anger');
CREATE TYPE dream_space_environment AS ENUM ('quantum', 'forest', 'cosmic', 'crystal', 'ocean', 'volcanic', 'ethereal');
CREATE TYPE audio_type AS ENUM ('binaural', 'ambient', 'interactive', 'spatial', 'haptic');
CREATE TYPE transaction_type AS ENUM ('purchase', 'sale', 'transfer', 'reward', 'penalty', 'subscription', 'tip', 'staking');
CREATE TYPE proposal_status AS ENUM ('draft', 'active', 'passed', 'rejected', 'expired', 'cancelled');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- ============================================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'public',
    dignity_score DECIMAL(5,2) DEFAULT 0.00,
    reputation_score DECIMAL(5,2) DEFAULT 0.00,
    trust_level DECIMAL(3,2) DEFAULT 0.50,
    quantum_level INTEGER DEFAULT 1,
    consciousness_awareness DECIMAL(5,2) DEFAULT 0.00,
    membership_tier membership_tier DEFAULT 'free',
    membership_expires_at TIMESTAMPTZ,
    wallet_address TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'es-MX',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_wallet ON profiles(wallet_address) WHERE wallet_address IS NOT NULL;

-- ============================================================================
-- USER SESSIONS
-- ============================================================================

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    device_info JSONB,
    ip_address INET,
    location JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    quantum_state JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_active ON user_sessions(is_active) WHERE is_active = true;

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_category NOT NULL,
    priority notification_priority DEFAULT 'normal',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    emotional_tone emotional_tone,
    audio_signature TEXT,
    visual_effect TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================================================
-- ISABELLA AI CONVERSATIONS
-- ============================================================================

CREATE TABLE isabella_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    context JSONB DEFAULT '{}',
    emotion_tracking JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT false
);

CREATE INDEX idx_conversations_user ON isabella_conversations(user_id);
CREATE INDEX idx_conversations_updated ON isabella_conversations(updated_at DESC);

CREATE TABLE isabella_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES isabella_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    emotion emotional_tone,
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}',
    token_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON isabella_messages(conversation_id);
CREATE INDEX idx_messages_embedding ON isabella_messages USING ivfflat (embedding vector_cosine_ops);

-- ============================================================================
-- DREAM SPACES
-- ============================================================================

CREATE TABLE dream_spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    environment dream_space_environment DEFAULT 'quantum',
    audio_type audio_type DEFAULT 'binaural',
    is_public BOOLEAN DEFAULT false,
    max_participants INTEGER DEFAULT 10,
    current_participants INTEGER DEFAULT 0,
    coherence_required DECIMAL(5,2) DEFAULT 50.00,
    quantum_config JSONB DEFAULT '{}',
    visual_settings JSONB DEFAULT '{}',
    audio_presets JSONB DEFAULT '[]',
    visitors_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dreams_owner ON dream_spaces(owner_id);
CREATE INDEX idx_dreams_public ON dream_spaces(is_public) WHERE is_public = true;

CREATE TABLE dream_space_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dream_space_id UUID REFERENCES dream_spaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    quantum_state JSONB DEFAULT '{}',
    UNIQUE(dream_space_id, user_id)
);

-- ============================================================================
-- WALLET & ECONOMY
-- ============================================================================

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    balance_tcep DECIMAL(18,8) DEFAULT 0,
    balance_tau DECIMAL(18,8) DEFAULT 0,
    locked_balance DECIMAL(18,8) DEFAULT 0,
    lifetime_earned DECIMAL(18,8) DEFAULT 0,
    lifetime_spent DECIMAL(18,8) DEFAULT 0,
    staking_amount DECIMAL(18,8) DEFAULT 0,
    staking_started_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wallets_user ON wallets(user_id);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    currency TEXT NOT NULL CHECK (currency IN ('TCEP', 'TAU', 'USD', 'MXN')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    reference_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- ============================================================================
-- COURSES & CERTIFICATIONS
-- ============================================================================

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    level course_level DEFAULT 'beginner',
    price DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'TCEP',
    duration_hours DECIMAL(6,2),
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    enrollment_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_published ON courses(is_published) WHERE is_published = true;

CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    progress DECIMAL(5,2) DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

CREATE TABLE course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content JSONB DEFAULT '{}',
    duration_minutes INTEGER DEFAULT 0,
    lesson_order INTEGER NOT NULL,
    is_free_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    course_title TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    verification_url TEXT,
    metadata JSONB DEFAULT '{}',
    pdf_url TEXT,
    blockchain_tx TEXT
);

CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);

-- ============================================================================
-- SOCIAL & COMMUNITIES
-- ============================================================================

CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    is_live BOOLEAN DEFAULT false,
    stream_url TEXT,
    subscriber_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES channels(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    media_urls JSONB DEFAULT '[]',
    emotional_tags JSONB DEFAULT '[]',
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_channel ON posts(channel_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- ============================================================================
-- GOVERNANCE & DAO
-- ============================================================================

CREATE TABLE dao_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status proposal_status DEFAULT 'draft',
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    votes_abstain INTEGER DEFAULT 0,
    quorum_required INTEGER DEFAULT 100,
    evidence_hash TEXT,
    execution_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    voting_starts_at TIMESTAMPTZ,
    voting_ends_at TIMESTAMPTZ,
    executed_at TIMESTAMPTZ
);

CREATE TABLE dao_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES dao_proposals(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    vote TEXT NOT NULL CHECK (vote IN ('for', 'against', 'abstain')),
    weight INTEGER DEFAULT 1,
    justification TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(proposal_id, voter_id)
);

CREATE INDEX idx_proposals_status ON dao_proposals(status);

-- ============================================================================
-- SECURITY & AUDIT
-- ============================================================================

CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    severity TEXT DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_security_events_user ON security_events(user_id);
CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================================================
-- CRISIS MANAGEMENT
-- ============================================================================

CREATE TABLE crisis_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_type TEXT NOT NULL,
    severity crisis_level DEFAULT 'medium',
    description TEXT NOT NULL,
    triggered_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    affected_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    recovery_actions JSONB DEFAULT '[]',
    rollback_details JSONB,
    rollback_executed BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS
-- ============================================================================

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id UUID,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id UUID,
    page_path TEXT NOT NULL,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_page_views_path ON page_views(page_path);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER dream_spaces_updated_at BEFORE UPDATE ON dream_spaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON isabella_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create wallet on profile creation
CREATE OR REPLACE FUNCTION create_wallet_on_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO wallets (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_wallet_on_profile();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE isabella_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE isabella_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dao_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Notification policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notifications" ON notifications
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE USING (user_id = auth.uid());

-- Dream spaces policies
CREATE POLICY "Public dream spaces are viewable by everyone" ON dream_spaces
    FOR SELECT USING (is_public = true OR owner_id = auth.uid());

CREATE POLICY "Users can insert own dream spaces" ON dream_spaces
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own dream spaces" ON dream_spaces
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete own dream spaces" ON dream_spaces
    FOR DELETE USING (owner_id = auth.uid());

-- Wallet policies
CREATE POLICY "Users can view own wallet" ON wallets
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own wallet" ON wallets
    FOR UPDATE USING (user_id = auth.uid());

-- Isabella conversations policies
CREATE POLICY "Users can manage own conversations" ON isabella_conversations
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own messages" ON isabella_messages
    FOR ALL USING (
        conversation_id IN (
            SELECT id FROM isabella_conversations 
            WHERE user_id = auth.uid()
        )
    );

-- Posts policies
CREATE POLICY "Public posts are viewable by everyone" ON posts
    FOR SELECT USING (visibility = 'public' OR author_id = auth.uid());

CREATE POLICY "Users can insert own posts" ON posts
    FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete own posts" ON posts
    FOR DELETE USING (author_id = auth.uid());

-- Security events (admin only view, users can insert)
CREATE POLICY "Security events are viewable by admins" ON security_events
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    );

-- Audit logs (admin only)
CREATE POLICY "Audit logs are viewable by admins" ON audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default courses
INSERT INTO courses (title, description, category, level, price, duration_hours, is_published) VALUES
('Introducción a TAMV', 'Aprende los fundamentos del ecosistema TAMV', 'technology', 'beginner', 0, 2, true),
('Quantum Computing Basics', 'Fundamentos de computación cuántica', 'technology', 'intermediate', 50, 4, true),
('Isabella AI Mastery', 'Domina la IA consciente de TAMV', 'ai', 'advanced', 100, 8, true),
('Governance & DAO', 'Aprende sobre gobernanza descentralizada', 'governance', 'intermediate', 75, 6, true);

-- Insert default channels
INSERT INTO channels (name, description, category, subscriber_count) VALUES
('General', 'Canal principal de la comunidad TAMV', 'community', 1000),
('Announcements', 'Noticias y anuncios oficiales', 'official', 5000),
('Support', 'Sop técnico y ayuda entre usuarios', 'support', 800);

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES TO authenticated;
GRANT ALL ON ALL SEQUENCES TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS TO authenticated;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE channels;
ALTER PUBLICATION supabase_realtime ADD TABLE security_events;
