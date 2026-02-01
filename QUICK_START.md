# 🚀 Quick Start Guide - Mock API Demo

## 1️⃣ Start the Application (30 seconds)

```bash
cd leakage-web
npm install
npm run dev
```

Open browser: **http://localhost:80**

✅ **No backend needed!** The mock API is already enabled.

---

## 2️⃣ Test as Sales

### Login
- Username: `sales1`
- Role: `sales`

### Create a Request
1. Click **"Make Request"**
2. Enter ID Card: `1234567890123`
3. Click **"Search"**
4. Select **CA001** (John Doe)
5. Click **"View Info"**
6. Enter new values:
   - New Loan Amount: `450000`
   - New Rate 1st: `5.0`
   - New Rate 2nd: `5.5`
   - New Rate 3rd: `6.0`
7. Click **"Submit Request"**

✅ Request created!

---

## 3️⃣ Test as Approver

### Login (New Tab or Logout)
- Username: `approver1`
- Role: `approver`

### Approve a Request
1. Click **"Approve"**
2. See pending requests
3. Click **"Approve"** on any request

✅ Request approved!

---

## 4️⃣ Test as Super Approver

### Login (New Tab or Logout)
- Username: `super1`
- Role: `super_approver`

### Approve Escalated Request
1. Click **"Approve"**
2. See escalated requests (PENDING_SUPER)
3. Click **"Approve"** on Request #3

✅ Request approved by super approver!

---

## 5️⃣ Send Email (Back to Sales)

### Login as Sales
- Username: `sales1`
- Role: `sales`

### Send Email
1. Click **"History"**
2. Find an **APPROVED** request
3. Click **"Send Email"**

✅ Email sent!

---

## 📋 Cheat Sheet

### Test ID Cards
```
1234567890123  → John Doe (2 accounts)
9876543210987  → Jane Smith (1 account)
1111222233334  → Bob Johnson (1 account)
```

### Login Roles
```
sales           → Create requests, send emails
approver        → Approve/reject/escalate requests
super_approver  → Approve/reject escalated requests
```

### Pre-loaded Requests
```
Request #1 → PENDING_APPROVER (waiting for approver)
Request #2 → APPROVED (ready for email)
Request #3 → PENDING_SUPER (waiting for super approver)
```

---

## 🔧 Toggle Real Backend

If you want to use the real backend instead:

1. Edit `src/api/client.ts`
2. Change: `const USE_MOCK_API = false`
3. Start backend: `cd ../svc-leakage && mvn spring-boot:run`

---

## 📚 More Information

- **[MOCK_API_GUIDE.md](./MOCK_API_GUIDE.md)** - Detailed mock API documentation
- **[DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md)** - All test data and scenarios
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details

---

## ✨ Features

✅ Full workflow (create → approve → escalate → super approve → email)  
✅ Role-based access control  
✅ Realistic network delays  
✅ Pre-loaded sample data  
✅ No backend required  
✅ Easy to demo  

**Enjoy your demo! 🎉**

