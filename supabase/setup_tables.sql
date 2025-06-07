-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS billing_transactions CASCADE;
DROP TABLE IF EXISTS company_users CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS billing_cycles CASCADE;
DROP TABLE IF EXISTS company_features CASCADE;
DROP TABLE IF EXISTS user_invitations CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    tax_id VARCHAR(100),
    website VARCHAR(255),
    registration_number VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    logo TEXT
);

-- User Profiles Table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL,
    company_id UUID REFERENCES companies(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Invitations Table
CREATE TABLE user_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    company_id UUID REFERENCES companies(id) NOT NULL,
    role_id VARCHAR(50) NOT NULL,
    invited_by UUID REFERENCES user_profiles(id) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    token VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled'))
);

-- Company Features Table
CREATE TABLE company_features (
    company_id UUID REFERENCES companies(id) NOT NULL,
    feature_id VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    config JSONB,
    override_reason TEXT,
    override_by UUID REFERENCES user_profiles(id),
    override_date TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (company_id, feature_id)
);

-- Billing Cycles Table
CREATE TABLE billing_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) NOT NULL,
    plan VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    renewal_date TIMESTAMP WITH TIME ZONE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    interval VARCHAR(10) NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_plan CHECK (plan IN ('free', 'basic', 'standard', 'premium', 'enterprise')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'pending', 'overdue', 'cancelled', 'trial')),
    CONSTRAINT valid_interval CHECK (interval IN ('monthly', 'quarterly', 'annual'))
);

-- User Sessions Table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) NOT NULL,
    company_id UUID REFERENCES companies(id) NOT NULL,
    original_user_id UUID REFERENCES user_profiles(id),
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Company Users (Join table for users and companies with roles)
CREATE TABLE company_users (
    user_id UUID REFERENCES user_profiles(id) NOT NULL,
    company_id UUID REFERENCES companies(id) NOT NULL,
    role_id VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    custom_permissions TEXT[],
    PRIMARY KEY (user_id, company_id)
);

-- Billing Transactions Table
CREATE TABLE billing_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) NOT NULL,
    billing_cycle_id UUID REFERENCES billing_cycles(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_reference VARCHAR(255),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

-- Indices for better query performance
CREATE INDEX idx_user_profiles_company ON user_profiles(company_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_invitations_company ON user_invitations(company_id);
CREATE INDEX idx_user_invitations_email ON user_invitations(email);
CREATE INDEX idx_company_features_company ON company_features(company_id);
CREATE INDEX idx_billing_cycles_company ON billing_cycles(company_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_company ON user_sessions(company_id);
CREATE INDEX idx_company_users_user ON company_users(user_id);
CREATE INDEX idx_company_users_company ON company_users(company_id);
CREATE INDEX idx_billing_transactions_company ON billing_transactions(company_id);
CREATE INDEX idx_billing_transactions_cycle ON billing_transactions(billing_cycle_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_transactions ENABLE ROW LEVEL SECURITY;

-- Companies: Users can only view their own company and admins can view all
CREATE POLICY "Users can view own company"
    ON companies FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE auth_id = auth.uid()::text 
        AND company_id = companies.id
    ));

-- User Profiles: Users can view profiles in their company, admins can view all
CREATE POLICY "Users can view profiles in their company"
    ON user_profiles FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_profiles up
        WHERE up.auth_id = auth.uid()::text 
        AND up.company_id = user_profiles.company_id
    ));

-- Company Features: Users can view features for their company
CREATE POLICY "Users can view company features"
    ON company_features FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE auth_id = auth.uid()::text 
        AND company_id = company_features.company_id
    ));

-- Billing Cycles: Only company admins can view billing info
CREATE POLICY "Admins can view billing cycles"
    ON billing_cycles FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE auth_id = auth.uid()::text 
        AND role IN ('admin', 'console_admin')
        AND company_id = billing_cycles.company_id
    ));

-- User Sessions: Users can only view their own sessions
CREATE POLICY "Users can view own sessions"
    ON user_sessions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE auth_id = auth.uid()::text 
        AND id = user_sessions.user_id
    ));

-- Additional RLS Policies for INSERT, UPDATE, DELETE

-- Companies: Only admins can modify company data
CREATE POLICY "Admins can modify company data"
    ON companies FOR ALL
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE auth_id = auth.uid()::text 
        AND role IN ('admin', 'console_admin')
        AND company_id = companies.id
    ));

-- User Profiles: Users can update their own profile, admins can modify all
CREATE POLICY "Users can modify own profile"
    ON user_profiles FOR UPDATE
    USING (auth_id = auth.uid()::text)
    WITH CHECK (auth_id = auth.uid()::text);

CREATE POLICY "Admins can modify all profiles"
    ON user_profiles FOR ALL
    USING (EXISTS (
        SELECT 1 FROM user_profiles up 
        WHERE up.auth_id = auth.uid()::text 
        AND up.role IN ('admin', 'console_admin')
        AND up.company_id = user_profiles.company_id
    ));

-- User Invitations: Only admins can create/modify invitations
CREATE POLICY "Admins can manage invitations"
    ON user_invitations FOR ALL
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE auth_id = auth.uid()::text 
        AND role IN ('admin', 'console_admin')
        AND company_id = user_invitations.company_id
    ));

-- Company Features: Only admins can modify features
CREATE POLICY "Admins can manage features"
    ON company_features FOR ALL
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE auth_id = auth.uid()::text 
        AND role IN ('admin', 'console_admin')
        AND company_id = company_features.company_id
    ));

-- Billing: Only admins can manage billing
CREATE POLICY "Admins can manage billing"
    ON billing_cycles FOR ALL
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE auth_id = auth.uid()::text 
        AND role IN ('admin', 'console_admin')
        AND company_id = billing_cycles.company_id
    ));

CREATE POLICY "Admins can manage transactions"
    ON billing_transactions FOR ALL
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE auth_id = auth.uid()::text 
        AND role IN ('admin', 'console_admin')
        AND company_id = billing_transactions.company_id
    ));

-- Creates updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_cycles_updated_at
    BEFORE UPDATE ON billing_cycles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
