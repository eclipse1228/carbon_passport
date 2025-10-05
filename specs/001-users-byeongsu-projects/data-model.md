# Data Model: Carbon Passport

## Entity Relationship Diagram

```mermaid
erDiagram
    PASSPORT ||--o{ ROUTE : contains
    PASSPORT ||--o| SURVEY_RESPONSE : has
    ROUTE }o--|| STATION : from
    ROUTE }o--|| STATION : to

    PASSPORT {
        uuid id PK
        text traveler_name
        varchar country
        text photo_url
        date travel_date
        varchar share_hash UK
        timestamp expires_at
        timestamp created_at
        jsonb metadata
    }

    ROUTE {
        uuid id PK
        uuid passport_id FK
        varchar start_station FK
        varchar end_station FK
        integer distance
        decimal co2_train
        decimal co2_car
        decimal co2_bus
        decimal co2_airplane
        decimal co2_saved
        integer sequence_order
        timestamp created_at
    }

    SURVEY_RESPONSE {
        uuid id PK
        uuid passport_id FK
        jsonb responses
        boolean completed
        timestamp completed_at
    }

    STATION {
        varchar code PK
        text name_ko
        text name_en
        text name_ja
        text name_zh
        decimal latitude
        decimal longitude
        boolean is_active
    }
```

## Entity Details

### Passport

**Purpose**: Core entity representing a traveler's carbon passport document.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| traveler_name | text | NOT NULL | Name of the passport holder |
| country | varchar(2) | CHECK (country IN ('KR', 'US', 'JP', 'CN')) | ISO country code |
| photo_url | text | | URL to uploaded photo in Supabase Storage |
| travel_date | date | NOT NULL, DEFAULT CURRENT_DATE | Date of travel |
| share_hash | varchar(32) | UNIQUE | Unique hash for sharing |
| expires_at | timestamp | | Expiration time for shared links |
| created_at | timestamp | DEFAULT NOW() | Creation timestamp |
| metadata | jsonb | DEFAULT '{}' | Additional flexible data |

**Indexes**:

- `idx_passport_share_hash` on (share_hash) WHERE share_hash IS NOT NULL
- `idx_passport_expires` on (expires_at) WHERE expires_at IS NOT NULL

**Validation Rules**:

- `traveler_name` must be 1-100 characters
- `country` must be one of: KR, US, JP, CN
- `photo_url` must be valid Supabase Storage URL if provided
- `expires_at` must be future date when set

### Route

**Purpose**: Individual travel route segments within a passport.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| passport_id | uuid | FOREIGN KEY REFERENCES passports(id) ON DELETE CASCADE | Parent passport |
| start_station | varchar(20) | FOREIGN KEY REFERENCES stations(code) | Starting station code |
| end_station | varchar(20) | FOREIGN KEY REFERENCES stations(code) | Ending station code |
| distance | integer | NOT NULL, CHECK (distance > 0) | Distance in kilometers |
| co2_train | decimal(10,2) | NOT NULL | CO2 emissions by train (kg) |
| co2_car | decimal(10,2) | NOT NULL | CO2 emissions by car (kg) |
| co2_bus | decimal(10,2) | NOT NULL | CO2 emissions by bus (kg) |
| co2_airplane | decimal(10,2) | NOT NULL | CO2 emissions by airplane (kg) |
| co2_saved | decimal(10,2) | NOT NULL | CO2 saved vs car (kg) |
| sequence_order | integer | NOT NULL | Order in route list |
| created_at | timestamp | DEFAULT NOW() | Creation timestamp |

**Indexes**:

- `idx_route_passport` on (passport_id, sequence_order)

**Validation Rules**:

- `start_station` and `end_station` must be different
- All CO2 values must be >= 0
- `sequence_order` must be unique per passport_id

### SurveyResponse

**Purpose**: ESG awareness survey responses linked to a passport.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| passport_id | uuid | UNIQUE, FOREIGN KEY REFERENCES passports(id) ON DELETE CASCADE | Parent passport |
| responses | jsonb | NOT NULL | Survey answer data |
| completed | boolean | DEFAULT false | Whether survey is complete |
| completed_at | timestamp | | Completion timestamp |

**Response Schema** (within jsonb):

```json
{
  "q1_transport_awareness": "knew" | "new" | "unsure",
  "q2_carbon_goals": 1-5,
  "q3_diesel_replacement": "knew" | "new" | "unsure",
  "q4_social_support": "knew" | "new" | "unsure",
  "q5_recycling_energy": 1-5,
  "q6_transparency": 1-5
}
```

**Validation Rules**:

- `responses` must contain all 6 question keys
- `completed_at` is set when `completed` = true
- Only one survey response per passport

### Station

**Purpose**: Korean railway station master data.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| code | varchar(20) | PRIMARY KEY | Station identifier |
| name_ko | text | NOT NULL | Korean name |
| name_en | text | | English name |
| name_ja | text | | Japanese name |
| name_zh | text | | Chinese name |
| latitude | decimal(10,7) | NOT NULL | GPS latitude |
| longitude | decimal(10,7) | NOT NULL | GPS longitude |
| is_active | boolean | DEFAULT true | Whether station is available |

**Initial Data**:
| code | name_ko | name_en | latitude | longitude |
|------|---------|---------|----------|-----------|
| seoul | 서울역 | Seoul Station | 37.555946 | 126.972317 |
| busan | 부산역 | Busan Station | 35.114495 | 129.033330 |
| dongdaegu | 동대구역 | Dongdaegu Station | 35.879667 | 128.628476 |
| gwangju | 광주역 | Gwangju Station | 35.165343 | 126.909200 |
| gangneung | 강릉역 | Gangneung Station | 37.763782 | 128.901647 |

## State Transitions

### Passport Lifecycle

```
Created → Routes Added → Survey Completed → Shared → Expired
```

### Survey States

```
Not Started → In Progress → Completed
```

## Business Rules

1. **Route Calculation**:
   - Distance calculated using Haversine formula
   - CO2 emissions = distance × emission_rate_per_km
   - Emission rates: Train=0.041, Car=0.171, Bus=0.089, Airplane=0.285 kg/km

2. **Share Link Expiration**:
   - Links expire 30 days after generation
   - Expired links return 404
   - New share regenerates hash and resets expiration

3. **Photo Requirements**:
   - Max size: 5MB after compression
   - Formats: JPEG, PNG, WebP
   - Stored in public Supabase bucket

4. **Survey Completion**:
   - All 6 questions must be answered
   - Cannot be edited after completion
   - Required for share functionality

## Database Migrations

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE stations (
  code VARCHAR(20) PRIMARY KEY,
  name_ko TEXT NOT NULL,
  name_en TEXT,
  name_ja TEXT,
  name_zh TEXT,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE passports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  traveler_name TEXT NOT NULL,
  country VARCHAR(2) CHECK (country IN ('KR', 'US', 'JP', 'CN')),
  photo_url TEXT,
  travel_date DATE NOT NULL DEFAULT CURRENT_DATE,
  share_hash VARCHAR(32) UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passport_id UUID NOT NULL REFERENCES passports(id) ON DELETE CASCADE,
  start_station VARCHAR(20) NOT NULL REFERENCES stations(code),
  end_station VARCHAR(20) NOT NULL REFERENCES stations(code),
  distance INTEGER NOT NULL CHECK (distance > 0),
  co2_train DECIMAL(10,2) NOT NULL,
  co2_car DECIMAL(10,2) NOT NULL,
  co2_bus DECIMAL(10,2) NOT NULL,
  co2_airplane DECIMAL(10,2) NOT NULL,
  co2_saved DECIMAL(10,2) NOT NULL,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(passport_id, sequence_order),
  CHECK (start_station != end_station)
);

CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passport_id UUID UNIQUE NOT NULL REFERENCES passports(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_passport_share_hash ON passports(share_hash) WHERE share_hash IS NOT NULL;
CREATE INDEX idx_passport_expires ON passports(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_route_passport ON routes(passport_id, sequence_order);

-- Insert initial station data
INSERT INTO stations (code, name_ko, name_en, latitude, longitude) VALUES
  ('seoul', '서울역', 'Seoul Station', 37.555946, 126.972317),
  ('busan', '부산역', 'Busan Station', 35.114495, 129.033330),
  ('dongdaegu', '동대구역', 'Dongdaegu Station', 35.879667, 128.628476),
  ('gwangju', '광주역', 'Gwangju Station', 35.165343, 126.909200),
  ('gangneung', '강릉역', 'Gangneung Station', 37.763782, 128.901647);
```
