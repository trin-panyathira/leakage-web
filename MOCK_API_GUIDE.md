# Mock API Guide

## Overview
The frontend now includes a complete mock API implementation that allows you to demo the application without running the backend service (`svc-leakage`).

## How to Enable/Disable Mock API

Edit `leakage-web/src/api/client.ts` and change the `USE_MOCK_API` flag:

```typescript
// Set to true to use mock data (no backend needed)
// Set to false to use real backend API
const USE_MOCK_API = true
```

## Mock Data Included

### Mock Customers (for ID Card Search)

1. **ID Card: `1234567890123`**
   - **CA001**: John Doe, Loan: ฿500,000, Rates: 5.5%, 6.0%, 6.5%
   - **CA002**: John Doe, Loan: ฿300,000, Rates: 5.0%, 5.5%, 6.0%

2. **ID Card: `9876543210987`**
   - **CA003**: Jane Smith, Loan: ฿750,000, Rates: 6.0%, 6.5%, 7.0%

3. **ID Card: `1111222233334`**
   - **CA004**: Bob Johnson, Loan: ฿1,000,000, Rates: 5.25%, 5.75%, 6.25%

### Pre-loaded Requests

The mock API comes with 3 sample requests:
1. **Request #1**: PENDING_APPROVER - Leakage request for CA001
2. **Request #2**: APPROVED - Leakage request for CA003
3. **Request #3**: PENDING_SUPER - Leakage request for CA004 (escalated)

## Testing the Workflow

### As Maker (username: maker1, role: maker)
1. Search for customer using ID card: `1234567890123`
2. Select a CA account (e.g., CA001)
3. View customer info
4. Create a leakage request with new rates
5. View history to see your created requests
6. Send email for approved requests

### As Approver (username: approver1, role: approver)
1. View pending requests (status: PENDING_APPROVER)
2. Approve, reject, or escalate requests
3. View history to see requests you've acted on

### As Super Approver (username: super1, role: super_approver)
1. View pending requests (status: PENDING_SUPER)
2. Approve or reject escalated requests
3. View history to see requests you've acted on

## Features

- ✅ All API endpoints are mocked
- ✅ Realistic network delay (300ms) for better demo experience
- ✅ Full workflow support (create, approve, reject, escalate, email)
- ✅ Role-based access control
- ✅ Persistent state during session (data resets on page refresh)
- ✅ Error handling for invalid operations

## Running the Demo

```bash
cd leakage-web
npm install
npm run dev
```

The app will run on http://localhost:80 with no backend required!

## Customizing Mock Data

To add more mock customers or modify existing data, edit:
- `leakage-web/src/api/mockData.ts`

To adjust network delay or modify API behavior, edit:
- `leakage-web/src/api/mockClient.ts`

