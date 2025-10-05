# Quickstart: Carbon Passport

## Prerequisites

1. **Node.js 20+** and npm installed
2. **Supabase account** (free tier is sufficient)
3. **Vercel account** for deployment (optional for local development)

## Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd carbon-passport

# Install dependencies
npm install

# Install shadcn/ui CLI
npx shadcn@latest init
```

### 2. Configure Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the database migrations in Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create all tables (copy from data-model.md)
-- ... (full migration script from data-model.md)
```

3. Configure Storage:
   - Go to Storage in Supabase dashboard
   - Create a new bucket called `passport-photos`
   - Set it as public bucket

4. Configure RLS policies:

```sql
-- Allow public read for shared passports
CREATE POLICY "Public can view shared passports" ON passports
  FOR SELECT USING (
    share_hash IS NOT NULL
    AND expires_at > NOW()
  );

-- Allow anonymous creation
CREATE POLICY "Anyone can create passport" ON passports
  FOR INSERT WITH CHECK (true);

-- Similar policies for other tables...
```

### 3. Environment Variables

Create `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Testing the Application

### Manual Test Flow

1. **Home Page** (http://localhost:3000)
   - Verify ESG information displays
   - Click "Create Passport" button

2. **Create Passport Flow**
   - Upload a photo (< 5MB)
   - Enter name
   - Select country (KR, US, JP, CN)
   - Add at least one route:
     - Select start station
     - Select end station
     - Click "Add Route"
   - Verify map shows route
   - Verify CO2 calculations display
   - Click "Generate Passport"

3. **View Passport**
   - Verify photo displays
   - Verify all routes show on map
   - Verify 4 transport mode comparisons
   - Verify barcode generated
   - Click "Continue to Survey"

4. **Complete Survey**
   - Answer all 6 questions
   - Submit survey
   - Verify completion confirmation

5. **Share Passport**
   - Click "Generate Share Link"
   - Copy the generated link
   - Open in new browser/incognito
   - Verify passport loads via share link
   - Verify link expires after 30 days

### API Testing with cURL

#### Create Passport

```bash
curl -X POST http://localhost:3000/api/passport \
  -H "Content-Type: application/json" \
  -d '{
    "travelerName": "Test User",
    "country": "KR",
    "travelDate": "2025-01-15"
  }'
```

#### Add Routes

```bash
curl -X POST http://localhost:3000/api/passport/{passport_id}/routes \
  -H "Content-Type: application/json" \
  -d '{
    "routes": [
      {
        "startStation": "seoul",
        "endStation": "busan"
      }
    ]
  }'
```

#### Submit Survey

```bash
curl -X POST http://localhost:3000/api/survey \
  -H "Content-Type: application/json" \
  -d '{
    "passportId": "{passport_id}",
    "responses": {
      "q1_transport_awareness": "new",
      "q2_carbon_goals": 5,
      "q3_diesel_replacement": "knew",
      "q4_social_support": "new",
      "q5_recycling_energy": 4,
      "q6_transparency": 5
    }
  }'
```

#### Generate Share Link

```bash
curl -X POST http://localhost:3000/api/share \
  -H "Content-Type: application/json" \
  -d '{
    "passportId": "{passport_id}"
  }'
```

### Automated Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

## Verification Checklist

### Functional Requirements

- [ ] ESG information displays on home page (FR-001)
- [ ] User can enter name and select country (FR-002, FR-003)
- [ ] Country flag displays when selected (FR-004)
- [ ] Travel destinations can be input (FR-005)
- [ ] Routes calculate and display correctly (FR-006, FR-007)
- [ ] Passport document generates with all info (FR-008)
- [ ] 6-question survey works (FR-009, FR-010)
- [ ] Print functionality works (FR-011)
- [ ] Share links generate with hash (FR-012)
- [ ] Localization works for 4 languages (FR-014)
- [ ] Photo upload and preview works (FR-020)
- [ ] Map displays with curved routes (FR-021)
- [ ] 4 transport modes show comparisons (FR-022)
- [ ] Barcode generates correctly (FR-023)
- [ ] Green stamp displays (FR-024)

### Performance Requirements

- [ ] Page load < 200ms
- [ ] Interaction response < 100ms
- [ ] Map renders smoothly on mobile
- [ ] Photos compress to < 1MB

### Data Persistence

- [ ] Passports save to database
- [ ] Routes save with correct calculations
- [ ] Survey responses save
- [ ] Share links expire after 30 days

## Common Issues & Solutions

| Issue                     | Solution                                        |
| ------------------------- | ----------------------------------------------- |
| Supabase connection error | Check env variables and Supabase project status |
| Map not loading           | Ensure Leaflet CSS is imported in globals.css   |
| Photo upload fails        | Check Supabase storage bucket permissions       |
| Share link 404            | Verify share_hash exists and not expired        |
| Localization not working  | Check locale files exist in /locales directory  |

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_BASE_URL (your-app.vercel.app)
```

### Production Checklist

- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Storage bucket configured
- [ ] RLS policies enabled
- [ ] Domain configured
- [ ] Analytics enabled

## Support

For issues or questions:

1. Check the [specification](./spec.md)
2. Review [data model](./data-model.md)
3. Check API contracts in `/contracts`
4. File an issue in the repository
