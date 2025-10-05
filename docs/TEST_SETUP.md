# Test Setup Documentation

## Completed Tasks (T010-T013)

### ✅ T010: Passport API Contract Tests
**File**: `tests/contract/passport.contract.test.ts`
- POST /api/passport - Create passport with validation
- GET /api/passport/:id - Retrieve by ID
- GET /api/passport/share/:hash - Retrieve by share link
- POST /api/passport/:id/routes - Add travel routes
- POST /api/passport/:id/photo - Upload photo with validation

### ✅ T011: Survey API Contract Tests  
**File**: `tests/contract/survey.contract.test.ts`
- POST /api/survey - Submit survey responses
- GET /api/survey/:passportId - Retrieve survey
- PUT /api/survey/:passportId - Update responses
- Validation for all 6 survey questions
- Partial vs complete survey handling

### ✅ T012: Share API Contract Tests
**File**: `tests/contract/share.contract.test.ts`
- POST /api/share - Generate share link
- GET /api/share/:hash/validate - Validate link
- DELETE /api/share/:hash - Revoke link
- PUT /api/share/:hash/extend - Extend expiration
- Security and expiration tests

### ✅ T013: Stations API Contract Tests
**File**: `tests/contract/stations.contract.test.ts`
- GET /api/stations - List all stations
- GET /api/stations/:code - Get specific station
- GET /api/stations/distance - Calculate distance & CO2
- GET /api/stations/nearby - Find nearby stations
- Multi-locale support (ko, en, ja, zh)

## Test Infrastructure

### Configuration Files
- `jest.config.js` - Jest configuration with Next.js support
- `jest.setup.js` - Test environment setup
- `package.json` - Test scripts added

### Test Utilities
**File**: `tests/utils/test-helpers.ts`
- Test data factories
- API test client
- Database cleanup helpers
- Mock data
- Validation utilities
- CO2 calculation helpers

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test passport.contract.test.ts
```

## Test Strategy

### TDD Approach
1. **Contract First**: Tests define the API behavior before implementation
2. **Validation**: All inputs are validated with appropriate error responses
3. **Edge Cases**: Tests cover success, failure, and edge cases
4. **Security**: Tests verify authentication and authorization where needed

### Coverage Areas
- ✅ API endpoints contracts
- ✅ Input validation
- ✅ Error handling
- ✅ Business logic (CO2 calculations, distance)
- ✅ Data integrity
- ✅ Security (share links, expiration)

## Next Steps

These contract tests serve as the specification for implementing:
1. API routes in `/app/api/`
2. Server actions for data mutations
3. React components that consume these APIs
4. Integration tests once APIs are implemented

## Expected Test Results

Currently, all tests will fail as the APIs are not yet implemented. This is expected in TDD:
1. **Red**: Write tests that fail
2. **Green**: Implement code to make tests pass
3. **Refactor**: Improve code while keeping tests green

## CO2 Emission Rates (from spec)

Used in distance/emissions calculations:
- Train: 0.02 kg CO2/km
- Car: 0.2 kg CO2/km  
- Bus: 0.1 kg CO2/km
- Airplane: 0.3 kg CO2/km

## Important Notes

1. **Database Connection**: Tests assume Supabase is configured
2. **Environment Variables**: Tests use mock values from jest.setup.js
3. **Async Operations**: All API tests are async
4. **Cleanup**: Test utilities include cleanup functions
5. **Isolation**: Each test should be independent