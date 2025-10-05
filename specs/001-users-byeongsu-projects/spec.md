# Feature Specification: Carbon Passport for Korea Railroad Corporation (KORAIL)

**Feature Branch**: `001-users-byeongsu-projects`  
**Created**: 2025-10-04  
**Status**: Complete  
**Input**: User description: "/Users/byeongsu/Projects/carbon_passport/spec.md"

## Execution Flow (main)

```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identified: KORAIL ESG initiative, carbon passport system, traveler information, route calculation, survey system
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements

- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

A traveler visiting Korea wants to understand the environmental impact of using KORAIL's train services. They create a personalized "carbon passport" that shows their eco-friendly travel routes through Korea, learn about KORAIL's ESG initiatives, and complete a survey to increase awareness about sustainable rail transportation.

### Acceptance Scenarios

1. **Given** a visitor on the home page, **When** they view KORAIL's ESG information, **Then** they should see clear information about carbon reduction and be prompted to create their carbon passport
2. **Given** a user creating a passport, **When** they enter their name and select their country (Korea, USA, Japan, or China), **Then** the system should display their country's flag and save traveler information
3. **Given** a user with entered information, **When** they input travel destinations, **Then** the system should display the travel route preview and carbon savings compared to other transportation methods
4. **Given** a completed passport creation, **When** the user views their passport, **Then** they should see personalized eco-friendly travel information and be prompted to participate in the ESG survey
5. **Given** a user completing the survey, **When** they answer all 6 questions about ESG awareness, **Then** the system should record responses and enable passport printing/sharing
6. **Given** a completed passport and survey, **When** the user chooses to share, **Then** the system should generate a unique shareable link with a hash identifier

### Edge Cases

- What happens when a user selects a country outside the MVP scope (not Korea, USA, Japan, China)?
- How does the system handle incomplete traveler information?
- What happens if a user tries to skip the survey?
- How does the system handle route calculation failures?
- What happens when printing fails or is not supported by the browser?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display KORAIL's ESG information and carbon reduction initiatives on the home page
- **FR-002**: System MUST allow users to create a carbon passport by entering their name and selecting their country
- **FR-003**: System MUST support country selection from Korea, USA, Japan, and China in the MVP version
- **FR-004**: System MUST display the appropriate country flag when a country is selected
- **FR-005**: System MUST allow users to input travel destinations within Korea
- **FR-006**: System MUST calculate and display travel routes between selected destinations
- **FR-007**: System MUST show carbon emissions comparison between train and other transportation methods
- **FR-008**: System MUST generate a personalized passport document with user information and travel routes
- **FR-009**: System MUST present a 6-question ESG awareness survey with click-through navigation
- **FR-010**: System MUST record survey responses including:
  - Transportation carbon emissions awareness (ITX vs car)
  - KORAIL's 2050 carbon neutrality goals
  - Diesel train replacement plans
  - Social support programs for vulnerable groups
  - Resource recycling and renewable energy efforts
  - ESG transparency and reporting
- **FR-011**: System MUST enable passport printing functionality after survey completion
- **FR-012**: System MUST generate unique shareable links with hash identifiers for each passport
- **FR-013**: System MUST display passport cover page with navigation to subsequent pages
- **FR-014**: System MUST support localization for UI text based on selected country/language
- **FR-015**: System MUST display carbon savings metrics for Korea rail travel
- **FR-016**: System MUST store passport data persistently in a database
- **FR-017**: System MUST handle basic user information storage (data privacy is not a primary concern for MVP)
- **FR-018**: System MUST support low concurrent usage (estimated <10 users per day)
- **FR-019**: Shared passport links MUST remain accessible for 30 days
- **FR-020**: System MUST allow users to upload and preview their photo for the passport
- **FR-021**: System MUST display an interactive map showing travel routes with curved paths and arrow indicators
- **FR-022**: System MUST calculate and display CO₂ emissions comparison for 4 transport modes (train, car, bus, airplane)
- **FR-023**: System MUST generate a unique barcode with format "GP" + timestamp for each passport
- **FR-024**: System MUST display a green certification stamp with "GREEN CERTIFIED" and current year
- **FR-025**: System MUST allow users to add and delete individual routes with real-time updates
- **FR-026**: System MUST calculate emissions using these rates per km:
  - Train: 0.041 kg CO₂/km
  - Car: 0.171 kg CO₂/km
  - Bus: 0.089 kg CO₂/km
  - Airplane: 0.285 kg CO₂/km
- **FR-027**: System MUST use Leaflet.js library for map visualization with station markers
- **FR-028**: System MUST calculate route distances using Haversine formula between station coordinates
- **FR-029**: System MUST display route details in a table format with distance and CO₂ savings
- **FR-030**: System MUST enable passport generation only after photo upload and at least one route selection

### Key Entities _(include if feature involves data)_

- **Traveler**: Represents passport holder with name, photo, travel date, and country of origin (future: with flag)
- **Travel Route**: Individual route between two stations with:
  - Start and end stations (name, coordinates)
  - Distance calculated using Haversine formula
  - CO₂ emissions for multiple transport modes
  - Visual representation on map
- **Station**: Korean railway station with:
  - Name (Korean)
  - GPS coordinates (latitude, longitude)
  - Currently supports: Seoul, Busan, Dongdaegu, Gwangju, Gangneung
- **Transport Mode**: Transportation method with specific CO₂ emission rate per km
- **Carbon Passport**: Digital document containing:
  - Traveler information and photo
  - Multiple travel routes
  - Total distance and CO₂ savings
  - Certification stamp and date
  - Unique barcode identifier
- **Barcode**: Unique identifier with format "GP" + 10-digit timestamp
- **Survey Response**: Collection of answers to 6 ESG awareness questions (not yet implemented)
- **Shareable Link**: Unique URL with hash identifier for passport sharing (not yet implemented)

---

## Technical Details

### CO₂ Emission Rates

| Transport Mode  | CO₂ per km | Source                    |
| --------------- | ---------- | ------------------------- |
| Train (KTX/ITX) | 0.041 kg   | Korean railway average    |
| Car             | 0.171 kg   | Passenger vehicle average |
| Bus             | 0.089 kg   | Public bus average        |
| Airplane        | 0.285 kg   | Domestic flight average   |

### Station Coordinates

| Station              | Latitude  | Longitude  |
| -------------------- | --------- | ---------- |
| 서울역 (Seoul)       | 37.555946 | 126.972317 |
| 부산역 (Busan)       | 35.114495 | 129.033330 |
| 동대구역 (Dongdaegu) | 35.879667 | 128.628476 |
| 광주역 (Gwangju)     | 35.165343 | 126.909200 |
| 강릉역 (Gangneung)   | 37.763782 | 128.901647 |

### Barcode Format

- **Structure**: "GP" + 10-digit timestamp
- **Example**: GP1704240123
- **Visual**: SVG-based barcode rendering with random bar widths

### Map Implementation

- **Library**: Leaflet.js v1.9.4
- **Tiles**: CartoDB light theme
- **Features**: Curved route paths, station markers, arrow indicators
- **Distance Calculation**: Haversine formula for geographic distances

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

### Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

_Updated by main() during processing_

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

## Implementation Status

### ✅ Currently Implemented

- **Page 3 (partial)**: Travel information input page (`input.html`)
  - Photo upload and preview
  - Name and date input
  - Route selection (5 Korean stations)
  - Interactive map with Leaflet.js
  - Route management (add/delete)
  - Real-time CO₂ calculation
- **Page 4 (partial)**: Passport display page (`passport.html`)
  - Traveler photo and information display
  - Map with all selected routes
  - 4-mode transport comparison (train, car, bus, plane)
  - Route details table
  - Green certification stamp
  - Unique barcode generation
  - Print functionality
  - Back navigation

### ❌ Not Yet Implemented

- **Page 1**: KORAIL ESG information home page
- **Page 2**: Passport cover page with navigation
- **Page 3 additions**:
  - Country selection (Korea, USA, Japan, China)
  - Country flag display
  - Localization support
  - Route preview before adding
- **Page 5**: ESG awareness survey (6 questions)
- **Page 6**: Final page with sharing functionality
- **Data persistence**: Currently uses sessionStorage, not database
- **Sharing feature**: Unique link generation with hash
- **Link validity**: 30-day expiration for shared links

### 📝 Notes on Current Implementation

- **Data Storage**: Using sessionStorage (temporary) instead of persistent database
- **Country Support**: No country selection; defaults to Korean traveler
- **Survey**: ESG survey section completely missing
- **Sharing**: No sharing functionality implemented
- **Pages**: Only 2 of 6 planned pages are implemented

---
