-- Enable Row Level Security for all tables
ALTER TABLE passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Passports are publicly readable" ON passports;
DROP POLICY IF EXISTS "Anyone can create passports" ON passports;
DROP POLICY IF EXISTS "Routes are publicly readable" ON routes;
DROP POLICY IF EXISTS "Anyone can create routes" ON routes;
DROP POLICY IF EXISTS "Survey responses are publicly readable" ON survey_responses;
DROP POLICY IF EXISTS "Anyone can create survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Anyone can update survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Stations are publicly readable" ON stations;

-- Passports table policies
-- Allow anyone to create a passport
CREATE POLICY "Anyone can create passports" 
    ON passports FOR INSERT 
    WITH CHECK (true);

-- Allow reading passports that are shared (have share_hash) and not expired
CREATE POLICY "Passports are publicly readable" 
    ON passports FOR SELECT 
    USING (
        share_hash IS NOT NULL 
        AND (expires_at IS NULL OR expires_at > NOW())
    );

-- Routes table policies
-- Allow anyone to create routes for any passport
CREATE POLICY "Anyone can create routes" 
    ON routes FOR INSERT 
    WITH CHECK (true);

-- Allow reading routes for passports that are publicly readable
CREATE POLICY "Routes are publicly readable" 
    ON routes FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM passports 
            WHERE passports.id = routes.passport_id 
            AND passports.share_hash IS NOT NULL 
            AND (passports.expires_at IS NULL OR passports.expires_at > NOW())
        )
    );

-- Survey responses table policies
-- Allow anyone to create survey responses
CREATE POLICY "Anyone can create survey responses" 
    ON survey_responses FOR INSERT 
    WITH CHECK (true);

-- Allow anyone to update survey responses
CREATE POLICY "Anyone can update survey responses" 
    ON survey_responses FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

-- Allow reading survey responses for passports that are publicly readable
CREATE POLICY "Survey responses are publicly readable" 
    ON survey_responses FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM passports 
            WHERE passports.id = survey_responses.passport_id 
            AND passports.share_hash IS NOT NULL 
            AND (passports.expires_at IS NULL OR passports.expires_at > NOW())
        )
    );

-- Stations table policies
-- Allow everyone to read stations (public reference data)
CREATE POLICY "Stations are publicly readable" 
    ON stations FOR SELECT 
    USING (is_active = true);

-- Create function to generate share hash
CREATE OR REPLACE FUNCTION generate_share_hash()
RETURNS TEXT AS $$
DECLARE
    characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..32 LOOP
        result := result || substr(characters, floor(random() * length(characters) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to set expiration date
CREATE OR REPLACE FUNCTION set_passport_expiration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.share_hash IS NOT NULL AND NEW.expires_at IS NULL THEN
        NEW.expires_at := NOW() + INTERVAL '30 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-set expiration when share_hash is created
CREATE TRIGGER trigger_set_passport_expiration
    BEFORE INSERT OR UPDATE ON passports
    FOR EACH ROW
    WHEN (NEW.share_hash IS NOT NULL)
    EXECUTE FUNCTION set_passport_expiration();