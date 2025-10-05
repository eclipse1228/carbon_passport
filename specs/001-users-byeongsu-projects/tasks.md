# Implementation Tasks: Carbon Passport for KORAIL

**Feature**: Carbon Passport web application  
**Stack**: Next.js 14, TypeScript, Supabase, shadcn/ui, React-Leaflet  
**Branch**: `001-users-byeongsu-projects`

## Setup Tasks

### T001: Initialize Next.js project with TypeScript

**File**: `package.json`, `tsconfig.json`, `next.config.js`

```bash
npx create-next-app@latest carbon-passport --typescript --tailwind --app --no-src-dir
cd carbon-passport
```

### T002: Install core dependencies

**File**: `package.json`

```bash
npm install @supabase/supabase-js @supabase/ssr @tanstack/react-query zustand
npm install react-leaflet leaflet @types/leaflet
npm install react-hook-form zod @hookform/resolvers
npm install next-intl browser-image-compression nanoid
npm install react-dropzone framer-motion react-to-print
```

### T003: Initialize shadcn/ui [P]

**File**: `components.json`, `lib/utils.ts`

```bash
npx shadcn@latest init -y
npx shadcn@latest add button card form input select dialog toast badge separator
```

### T004: Setup environment configuration [P]

**File**: `.env.local`, `.env.example`

- Create `.env.local` with Supabase credentials
- Create `.env.example` as template
- Add to `.gitignore`

### T005: Configure ESLint and Prettier [P]

**File**: `.eslintrc.json`, `.prettierrc`

- Setup TypeScript ESLint rules
- Configure Prettier formatting
- Add format scripts to package.json

## Database & Infrastructure Tasks

### T006: Setup Supabase project

**External**: Supabase Dashboard

- Create new Supabase project
- Note connection strings
- Configure auth settings for anonymous access

### T007: Create database schema

**File**: `supabase/migrations/001_initial_schema.sql`

- Create stations table with initial data
- Create passports table with RLS
- Create routes table
- Create survey_responses table

### T008: Configure Supabase storage bucket [P]

**External**: Supabase Dashboard

- Create `passport-photos` public bucket
- Set CORS and size limits (5MB)
- Configure public access policies

### T009: Setup RLS policies [P]

**File**: `supabase/migrations/002_rls_policies.sql`

- Public read policy for shared passports
- Anonymous insert for passport creation
- Cascade delete policies

## Contract Test Tasks (TDD)

### T010: Create passport API contract tests [P]

**File**: `tests/contract/passport.contract.test.ts`

- POST /api/passport creation test
- GET /api/passport/:id retrieval test
- GET /api/passport/share/:hash test
- POST /api/passport/:id/routes test

### T011: Create survey API contract tests [P]

**File**: `tests/contract/survey.contract.test.ts`

- POST /api/survey submission test
- GET /api/survey/:passportId test
- Validation tests for all 6 questions

### T012: Create share API contract tests [P]

**File**: `tests/contract/share.contract.test.ts`

- POST /api/share link generation test
- GET /api/share/:hash/validate test
- Expiration validation test

### T013: Create stations API contract tests [P]

**File**: `tests/contract/stations.contract.test.ts`

- GET /api/stations list test
- POST /api/stations/distance calculation test
- Locale parameter test

## Core Library Tasks

### T014: Create Supabase client utilities [P]

**File**: `lib/supabase/client.ts`, `lib/supabase/server.ts`

- Browser client with anon key
- Server client for API routes
- Type definitions from database

### T015: Create calculation utilities [P]

**File**: `lib/utils/co2-calculator.ts`, `lib/utils/haversine.ts`

- Haversine distance formula
- CO2 emission calculations for 4 transport modes
- Savings calculation logic

### T016: Create station constants [P]

**File**: `lib/constants/stations.ts`

- Station data with coordinates
- Localized names
- Type definitions

### T017: Setup internationalization [P]

**File**: `middleware.ts`, `i18n.ts`

- Next-intl middleware configuration
- Locale detection logic
- URL routing setup

### T018: Create translation files [P]

**File**: `locales/ko/common.json`, `locales/en/common.json`, `locales/ja/common.json`, `locales/zh/common.json`

- Common UI strings
- Form labels
- Error messages
- Survey questions

## Component Development Tasks

### T019: Create PhotoUpload component [P]

**File**: `components/passport/PhotoUpload.tsx`

- react-dropzone integration
- Image compression with browser-image-compression
- Preview display
- Size validation (<5MB)

### T020: Create RouteSelector component [P]

**File**: `components/passport/RouteSelector.tsx`

- Station dropdowns
- Add/remove route logic
- Distance display
- CO2 calculations display

### T021: Create RouteMap component [P]

**File**: `components/passport/RouteMap.tsx`

- React-Leaflet integration
- Curved route paths
- Station markers
- Mobile optimization

### T022: Create PassportDocument component [P]

**File**: `components/passport/PassportDocument.tsx`

- Passport layout
- Photo and info display
- Routes table
- Transport comparison cards

### T023: Create Barcode component [P]

**File**: `components/passport/Barcode.tsx`

- Generate GP + timestamp format
- SVG barcode rendering
- Unique ID display

### T024: Create ESGQuestions component [P]

**File**: `components/survey/ESGQuestions.tsx`

- 6 question forms
- Click-through navigation
- Response validation
- Progress indicator

## API Route Implementation Tasks

### T025: Implement passport API routes

**File**: `app/api/passport/route.ts`, `app/api/passport/[id]/route.ts`

- POST create passport
- GET retrieve by ID
- Error handling

### T026: Implement passport routes API

**File**: `app/api/passport/[id]/routes/route.ts`

- POST add routes to passport
- Calculate emissions
- Store in database

### T027: Implement survey API routes

**File**: `app/api/survey/route.ts`, `app/api/survey/[passportId]/route.ts`

- POST submit survey
- GET retrieve responses
- Completion validation

### T028: Implement share API routes

**File**: `app/api/share/route.ts`, `app/api/share/[hash]/validate/route.ts`

- Generate share hash with nanoid
- Set 30-day expiration
- Validate share links

### T029: Implement stations API routes [P]

**File**: `app/api/stations/route.ts`, `app/api/stations/distance/route.ts`

- GET stations list with locale
- POST distance calculation
- Emission calculations

## Page Implementation Tasks

### T030: Create root layout with providers

**File**: `app/layout.tsx`, `app/[locale]/layout.tsx`

- Supabase provider
- React Query provider
- Internationalization setup
- Global styles

### T031: Create home page (ESG info)

**File**: `app/[locale]/page.tsx`

- ESG information display
- Hero section
- Call-to-action for passport creation
- KORAIL branding

### T032: Create passport cover page [P]

**File**: `app/[locale]/passport/cover/page.tsx`

- Passport cover design
- Navigation to creation
- Animation effects

### T033: Create passport creation page

**File**: `app/[locale]/passport/create/page.tsx`

- Photo upload section
- Traveler info form
- Route selection
- Map preview
- Generate passport button

### T034: Create passport view page

**File**: `app/[locale]/passport/view/page.tsx`

- Full passport display
- All route details
- CO2 comparisons
- Print functionality

### T035: Create shared passport page [P]

**File**: `app/[locale]/passport/[id]/page.tsx`

- Load by share hash
- Check expiration
- Display passport
- No edit capabilities

### T036: Create survey page

**File**: `app/[locale]/survey/page.tsx`

- 6 ESG questions
- Progressive form
- Submit to API
- Completion confirmation

### T037: Create share page [P]

**File**: `app/[locale]/share/page.tsx`

- Generate share link
- QR code display
- Copy to clipboard
- Social sharing options

## State Management Tasks

### T038: Create passport store with Zustand [P]

**File**: `stores/passportStore.ts`

- Passport data state
- Routes array
- CRUD operations
- Persistence

### T039: Create survey store with Zustand [P]

**File**: `stores/surveyStore.ts`

- Survey responses
- Progress tracking
- Validation state

### T040: Create custom hooks [P]

**File**: `hooks/usePassport.ts`, `hooks/useSurvey.ts`

- Data fetching with React Query
- Mutation hooks
- Error handling

## Integration Test Tasks

### T041: Create passport creation flow test [P]

**File**: `tests/integration/passport-creation.test.tsx`

- Photo upload
- Route selection
- Passport generation
- End-to-end flow

### T042: Create survey completion flow test [P]

**File**: `tests/integration/survey-completion.test.tsx`

- All 6 questions
- Validation
- Submission
- Completion state

### T043: Create share link flow test [P]

**File**: `tests/integration/share-link.test.tsx`

- Link generation
- Access via hash
- Expiration check

## Polish & Optimization Tasks

### T044: Add loading states and skeletons [P]

**File**: Various component files

- Loading skeletons for all async operations
- Suspense boundaries
- Error boundaries

### T045: Implement print styles [P]

**File**: `styles/print.css`

- Print-specific CSS
- Hide navigation
- Optimize layout

### T046: Add error handling and toasts

**File**: Various components

- Global error handler
- User-friendly error messages
- Success notifications

### T047: Optimize images and assets [P]

**File**: `public/` directory

- Compress images
- Add favicon
- OpenGraph images

### T048: Add analytics and monitoring [P]

**File**: `app/layout.tsx`

- Vercel Analytics
- Error tracking
- Performance monitoring

### T049: Create E2E tests with Playwright [P]

**File**: `e2e/passport-flow.spec.ts`

- Full user journey
- Cross-browser testing
- Mobile testing

### T050: Documentation and deployment

**File**: `README.md`, `vercel.json`

- Setup instructions
- Environment variables guide
- Deployment configuration

---

## Parallel Execution Examples

### Initial Setup (T001-T005)

```bash
# Can run in parallel after T001
Task("Install dependencies", "Execute T002", "coder")
Task("Setup shadcn/ui", "Execute T003", "coder")
Task("Configure environment", "Execute T004", "coder")
Task("Setup linting", "Execute T005", "coder")
```

### Contract Tests (T010-T013) - All parallel

```bash
# All contract tests can run in parallel
Task("Passport contract tests", "Execute T010", "tester")
Task("Survey contract tests", "Execute T011", "tester")
Task("Share contract tests", "Execute T012", "tester")
Task("Stations contract tests", "Execute T013", "tester")
```

### Component Development (T019-T024) - All parallel

```bash
# All components in different files, can develop in parallel
Task("PhotoUpload component", "Execute T019", "coder")
Task("RouteSelector component", "Execute T020", "coder")
Task("RouteMap component", "Execute T021", "coder")
Task("PassportDocument component", "Execute T022", "coder")
Task("Barcode component", "Execute T023", "coder")
Task("ESGQuestions component", "Execute T024", "coder")
```

## Task Dependencies

1. **Setup Phase** (T001-T009): Must complete before all others
2. **Contract Tests** (T010-T013): Should complete before API implementation
3. **Core Libraries** (T014-T018): Required before components and APIs
4. **Components** (T019-T024): Can be developed in parallel
5. **API Routes** (T025-T029): Depend on database setup
6. **Pages** (T030-T037): Depend on components and APIs
7. **State Management** (T038-T040): Can be parallel with pages
8. **Integration Tests** (T041-T043): After pages complete
9. **Polish** (T044-T050): Final phase

## Success Criteria

- [ ] All contract tests passing
- [ ] All 30 functional requirements implemented
- [ ] 4 languages fully supported
- [ ] Share links expire after 30 days
- [ ] Performance targets met (<200ms load)
- [ ] E2E tests passing on all browsers
- [ ] Deployed successfully to Vercel

---

_Generated from implementation plan at `/specs/001-users-byeongsu-projects/plan.md`_
