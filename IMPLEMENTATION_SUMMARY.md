# Mock API Implementation Summary

## What Was Done

The frontend (`leakage-web`) has been enhanced with a complete mock API system that allows you to run and demo the application **without the backend** (`svc-leakage`).

## Files Created

### 1. `src/api/mockData.ts` (298 lines)
**Purpose**: Mock data store and business logic
- Mock customer database with 4 test customers and 3 ID cards
- Mock request storage with 3 pre-loaded sample requests
- All CRUD operations for requests (create, approve, reject, escalate, send email)
- Customer search and info retrieval
- Request history filtering by user

### 2. `src/api/mockClient.ts` (100 lines)
**Purpose**: Mock API client that mimics the real backend
- Routes API calls to mock functions
- Simulates 300ms network delay for realistic demo
- Implements all 8 API endpoints:
  - `GET /api/customers/search?idCard={id}`
  - `GET /api/customers/{caId}/info`
  - `POST /api/requests/leakage`
  - `GET /api/requests/pending`
  - `POST /api/requests/{id}/approve`
  - `POST /api/requests/{id}/reject`
  - `POST /api/requests/{id}/escalate`
  - `GET /api/requests/history`
  - `POST /api/requests/{id}/send-email`
- Role-based access control (same as backend)
- Error handling for invalid operations

### 3. Documentation Files
- **`MOCK_API_GUIDE.md`**: Complete guide on using the mock API
- **`DEMO_CREDENTIALS.md`**: Quick reference for test data and credentials
- **`IMPLEMENTATION_SUMMARY.md`**: This file

## Files Modified

### `src/api/client.ts`
- Added `USE_MOCK_API` flag to toggle between mock and real API
- Kept original real API implementation intact
- Simple one-line change to switch modes

### `README.md`
- Added Mock API Mode section at the top
- Quick start instructions for demo mode
- Links to documentation files

## Mock Data Included

### Test Customers (3 ID Cards, 4 Accounts)
1. **1234567890123** → John Doe (CA001, CA002)
2. **9876543210987** → Jane Smith (CA003)
3. **1111222233334** → Bob Johnson (CA004)

### Pre-loaded Requests (3 Requests)
1. Request #1: PENDING_APPROVER (by maker1)
2. Request #2: APPROVED (by maker1, approved by approver1)
3. Request #3: PENDING_SUPER (by maker2, escalated by approver1)

## How It Works

```
User Action → React Component → State Layer (requests.ts) 
    → API Client (client.ts) → Mock Client (mockClient.ts) 
    → Mock Data Store (mockData.ts) → Return Mock Response
```

## Benefits

✅ **No Backend Dependency**: Demo the app without running Spring Boot  
✅ **Fast Setup**: Just `npm run dev` and you're ready  
✅ **Realistic Behavior**: Network delays, error handling, role checks  
✅ **Full Feature Coverage**: All workflows work (create, approve, reject, escalate, email)  
✅ **Easy Toggle**: One flag to switch between mock and real API  
✅ **Persistent Session**: Data persists during session (resets on refresh)  
✅ **Developer Friendly**: Easy to add more mock data or modify behavior  

## Usage

### Enable Mock Mode (Default)
```typescript
// src/api/client.ts
const USE_MOCK_API = true
```

### Disable Mock Mode (Use Real Backend)
```typescript
// src/api/client.ts
const USE_MOCK_API = false
```

## Testing Scenarios

All workflows can be tested:
1. ✅ Maker: Search customer, create leakage request
2. ✅ Approver: View pending, approve/reject/escalate
3. ✅ Super Approver: View escalated, approve/reject
4. ✅ All roles: View history
5. ✅ Maker: Send email for approved requests

## Future Enhancements (Optional)

- Add localStorage persistence to keep data across page refreshes
- Add more mock customers and scenarios
- Add configurable network delay
- Add mock API error scenarios for testing error handling
- Add export/import mock data functionality

## Notes

- Mock data resets on page refresh (by design for clean demos)
- Network delay is set to 300ms (configurable in mockClient.ts)
- All role-based permissions are enforced (same as backend)
- Error messages match backend behavior

