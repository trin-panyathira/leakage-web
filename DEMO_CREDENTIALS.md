# Demo Credentials & Test Data

## Quick Start - Login Credentials

### Maker
- **Username**: `maker1` (or any name)
- **Role**: `maker`

### Approver
- **Username**: `approver1` (or any name)
- **Role**: `approver`

### Super Approver
- **Username**: `super1` (or any name)
- **Role**: `super_approver`

---

## Test ID Cards for Customer Search

Copy and paste these ID cards when testing:

### ID Card 1: `1234567890123`
**Customer**: John Doe  
**Accounts**:
- **CA001** - Loan: ฿500,000 | Rates: 5.5%, 6.0%, 6.5% | Advisor: Advisor A
- **CA002** - Loan: ฿300,000 | Rates: 5.0%, 5.5%, 6.0% | Advisor: Advisor B

### ID Card 2: `9876543210987`
**Customer**: Jane Smith  
**Accounts**:
- **CA003** - Loan: ฿750,000 | Rates: 6.0%, 6.5%, 7.0% | Advisor: Advisor C

### ID Card 3: `1111222233334`
**Customer**: Bob Johnson  
**Accounts**:
- **CA004** - Loan: ฿1,000,000 | Rates: 5.25%, 5.75%, 6.25% | Advisor: Advisor D

---

## Demo Workflow Scenarios

### Scenario 1: Create New Request (as Maker)
1. Login as `maker1` with role `maker`
2. Go to "Make Request"
3. Enter ID Card: `1234567890123`
4. Click "Search"
5. Select account **CA001**
6. Click "View Info"
7. Enter new loan amount and rates
8. Submit request

### Scenario 2: Approve Request (as Approver)
1. Login as `approver1` with role `approver`
2. Go to "Approve"
3. See pending requests
4. Click "Approve" or "Escalate to Super Approver"

### Scenario 3: Super Approve (as Super Approver)
1. Login as `super1` with role `super_approver`
2. Go to "Approve"
3. See escalated requests (PENDING_SUPER)
4. Click "Approve" or "Reject"

### Scenario 4: Send Email (as Maker)
1. Login as `maker1` with role `maker`
2. Go to "History"
3. Find an APPROVED request
4. Click "Send Email"
5. See "Already sent email" status

---

## Pre-loaded Sample Data

The mock API includes 3 pre-loaded requests:

1. **Request #1** - PENDING_APPROVER
   - Customer: John Doe (CA001)
   - Created by: maker1
   - Status: Waiting for approver

2. **Request #2** - APPROVED
   - Customer: Jane Smith (CA003)
   - Created by: maker1
   - Approved by: approver1

3. **Request #3** - PENDING_SUPER
   - Customer: Bob Johnson (CA004)
   - Created by: maker2
   - Escalated by: approver1
   - Status: Waiting for super approver

---

## Tips

- 💡 Data persists during your session but resets on page refresh
- 💡 All operations have a 300ms delay to simulate real API calls
- 💡 Try different roles to see different views and permissions
- 💡 Check the browser console for any errors

