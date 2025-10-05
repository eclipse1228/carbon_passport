-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create stations table (reference data)
CREATE TABLE IF NOT EXISTS stations (
    code VARCHAR(20) PRIMARY KEY,
    name_ko TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_ja TEXT,
    name_zh TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create passports table
CREATE TABLE IF NOT EXISTS passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    traveler_name TEXT NOT NULL CHECK (length(traveler_name) >= 1 AND length(traveler_name) <= 100),
    country VARCHAR(2) CHECK (country IN ('KR', 'US', 'JP', 'CN')),
    photo_url TEXT,
    travel_date DATE NOT NULL DEFAULT CURRENT_DATE,
    share_hash VARCHAR(32) UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passport_id UUID NOT NULL REFERENCES passports(id) ON DELETE CASCADE,
    start_station VARCHAR(20) NOT NULL REFERENCES stations(code),
    end_station VARCHAR(20) NOT NULL REFERENCES stations(code),
    distance INTEGER NOT NULL CHECK (distance > 0),
    co2_train DECIMAL(10, 2) NOT NULL CHECK (co2_train >= 0),
    co2_car DECIMAL(10, 2) NOT NULL CHECK (co2_car >= 0),
    co2_bus DECIMAL(10, 2) NOT NULL CHECK (co2_bus >= 0),
    co2_airplane DECIMAL(10, 2) NOT NULL CHECK (co2_airplane >= 0),
    co2_saved DECIMAL(10, 2) NOT NULL CHECK (co2_saved >= 0),
    sequence_order INTEGER NOT NULL CHECK (sequence_order >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT different_stations CHECK (start_station != end_station),
    CONSTRAINT unique_route_order UNIQUE (passport_id, sequence_order)
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passport_id UUID NOT NULL UNIQUE REFERENCES passports(id) ON DELETE CASCADE,
    responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_passport_share_hash 
    ON passports(share_hash) 
    WHERE share_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_passport_expires 
    ON passports(expires_at) 
    WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_passport_travel_date 
    ON passports(travel_date);

CREATE INDEX IF NOT EXISTS idx_routes_passport_id 
    ON routes(passport_id);

CREATE INDEX IF NOT EXISTS idx_routes_stations 
    ON routes(start_station, end_station);

CREATE INDEX IF NOT EXISTS idx_survey_passport_id 
    ON survey_responses(passport_id);

-- Create function to auto-update completed_at
CREATE OR REPLACE FUNCTION update_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed = true AND OLD.completed = false THEN
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for survey completion
CREATE TRIGGER trigger_update_completed_at
    BEFORE UPDATE ON survey_responses
    FOR EACH ROW
    WHEN (NEW.completed IS DISTINCT FROM OLD.completed)
    EXECUTE FUNCTION update_completed_at();

-- Create function to validate expires_at is future date
CREATE OR REPLACE FUNCTION validate_expires_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= NOW() THEN
        RAISE EXCEPTION 'expires_at must be a future date';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for expires_at validation
CREATE TRIGGER trigger_validate_expires_at
    BEFORE INSERT OR UPDATE ON passports
    FOR EACH ROW
    WHEN (NEW.expires_at IS NOT NULL)
    EXECUTE FUNCTION validate_expires_at();