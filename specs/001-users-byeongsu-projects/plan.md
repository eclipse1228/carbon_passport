# Implementation Plan: Carbon Passport for KORAIL

**Branch**: `001-users-byeongsu-projects` | **Date**: 2025-10-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-users-byeongsu-projects/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code, or `AGENTS.md` for all other agents).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Carbon Passport is a web application for KORAIL that allows travelers to create personalized eco-friendly travel documents showcasing their rail journeys in Korea. The system calculates CO2 savings compared to other transport modes, collects ESG awareness through surveys, and generates shareable digital passports. Built with Next.js 14, Supabase, and shadcn/ui for a modern, performant user experience supporting 4 languages.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+  
**Primary Dependencies**: Next.js 14, React 18, Supabase Client, shadcn/ui, React-Leaflet  
**Storage**: Supabase (PostgreSQL) for data, Supabase Storage for photos  
**Testing**: Jest + React Testing Library for unit/integration, Playwright for E2E  
**Target Platform**: Web browsers (Chrome, Safari, Firefox, Edge) - Desktop & Mobile  
**Project Type**: web (frontend + backend integrated via Next.js)  
**Performance Goals**: <200ms page load, <100ms interaction response, support for 10 concurrent users  
**Constraints**: 30-day link expiration, photo size <5MB, map rendering on mobile devices  
**Scale/Scope**: MVP for <10 daily users, 6 pages, 4 languages, 5 Korean stations

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Core Principles (Based on Template Constitution)

- ✅ **Library-First**: Components will be modular and reusable (passport components, survey module)
- ✅ **CLI Interface**: N/A for web application - using REST API instead
- ✅ **Test-First**: Will implement TDD with contract tests, integration tests before implementation
- ✅ **Integration Testing**: Focus on API contracts, Supabase integration, map rendering
- ✅ **Observability**: Structured logging via Next.js, Vercel Analytics for monitoring
- ✅ **Simplicity**: Starting with MVP features, avoiding premature optimization

## Project Structure

### Documentation (this feature)

```
specs/001-users-byeongsu-projects/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
carbon-passport/
├── app/                           # Next.js App Router
│   ├── [locale]/                 # Internationalization routing
│   │   ├── page.tsx              # Home - ESG information
│   │   ├── passport/
│   │   │   ├── cover/page.tsx    # Passport cover page
│   │   │   ├── create/page.tsx   # Create passport (photo, routes)
│   │   │   ├── view/page.tsx     # View generated passport
│   │   │   └── [id]/page.tsx     # Shared passport by ID
│   │   ├── survey/page.tsx       # ESG awareness survey
│   │   └── share/page.tsx        # Share & print options
│   ├── api/                      # API Routes
│   │   ├── passport/route.ts     # CRUD operations for passports
│   │   ├── survey/route.ts       # Survey submission
│   │   ├── share/route.ts        # Generate share links
│   │   └── stations/route.ts     # Station data endpoint
│   └── layout.tsx                # Root layout with providers
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── passport/
│   │   ├── PhotoUpload.tsx       # Photo upload with preview
│   │   ├── RouteSelector.tsx     # Station selection UI
│   │   ├── RouteMap.tsx          # Leaflet map component
│   │   ├── PassportDocument.tsx  # Passport display
│   │   └── Barcode.tsx           # Barcode generator
│   └── survey/
│       └── ESGQuestions.tsx      # Survey component
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   ├── utils/
│   │   ├── co2-calculator.ts     # Emission calculations
│   │   └── haversine.ts          # Distance calculations
│   └── constants/
│       └── stations.ts           # Station data
├── hooks/
│   ├── usePassport.ts            # Passport state management
│   └── useSurvey.ts              # Survey state management
├── locales/                      # i18n translations
│   ├── ko/                       # Korean
│   ├── en/                       # English
│   ├── ja/                       # Japanese
│   └── zh/                       # Chinese
├── tests/
│   ├── contract/                 # API contract tests
│   ├── integration/              # User flow tests
│   └── unit/                     # Component tests
└── styles/
    └── globals.css               # Global styles
```

**Structure Decision**: Web application structure with Next.js App Router, integrated frontend/backend, internationalization support, and modular component architecture.

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - Supabase RLS policies for passport data protection
   - React-Leaflet optimization for mobile devices
   - Image compression strategies before upload
   - Internationalization routing with Next.js App Router
   - Share link generation and expiration mechanism

2. **Generate and dispatch research agents**:

   ```
   Task: "Research Supabase RLS best practices for multi-user data isolation"
   Task: "Find React-Leaflet performance optimization for mobile browsers"
   Task: "Research browser-side image compression techniques"
   Task: "Best practices for next-intl with App Router"
   Task: "Implement time-based URL expiration patterns"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all technical decisions documented

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:
   - Passport (id, traveler_name, country, photo_url, travel_date, share_hash, expires_at)
   - Route (passport_id, start_station, end_station, distance, co2_saved)
   - SurveyResponse (passport_id, responses, completed_at)
   - Station (code, name_ko, name_en, latitude, longitude)

2. **Generate API contracts** from functional requirements:
   - POST /api/passport - Create new passport
   - GET /api/passport/:id - Retrieve passport
   - POST /api/passport/:id/routes - Add routes
   - POST /api/survey - Submit survey responses
   - POST /api/share - Generate share link
   - GET /api/stations - Get station list

3. **Generate contract tests** from contracts:
   - passport.contract.test.ts
   - survey.contract.test.ts
   - share.contract.test.ts
   - stations.contract.test.ts

4. **Extract test scenarios** from user stories:
   - Complete passport creation flow
   - Survey completion workflow
   - Share link generation and access

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
   - Add Next.js 14, Supabase, shadcn/ui context
   - Update recent changes section

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md, CLAUDE.md

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each API endpoint → contract test task [P]
- Each entity → Supabase table/model task [P]
- Each page → component creation task
- Each user flow → integration test task

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Database → API → Components → Pages
- Mark [P] for parallel execution (independent components)

**Estimated Output**: 30-35 numbered, ordered tasks in tasks.md covering:

- Supabase setup and schema (5 tasks)
- API route implementation (6 tasks)
- Component development (10 tasks)
- Page assembly (6 tasks)
- Testing (8 tasks)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following TDD principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, verify all 30 requirements)

## Complexity Tracking

_No violations identified - design follows simplicity principles_

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---

_Based on Constitution template - See `/memory/constitution.md`_
