# leakage-web

React + Vite + TypeScript app for maker/approver/super approver workflow.

## 🎯 Mock API Mode (Demo Without Backend)

**NEW!** The frontend now includes a complete mock API for demos without running the backend.

- ✅ **No backend required** - All API calls are mocked in the frontend
- ✅ **Full workflow support** - Create, approve, reject, escalate, and send emails
- ✅ **Pre-loaded sample data** - 3 sample requests and 4 test customers
- ✅ **Easy toggle** - Switch between mock and real API with one flag

### Quick Start (Mock Mode)
```bash
npm install
npm run dev
```
Then open http://localhost:80 and login with any username and role.

📖 **See [MOCK_API_GUIDE.md](./MOCK_API_GUIDE.md)** for detailed instructions
🔑 **See [DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md)** for test credentials and data

### Toggle Mock API
Edit `src/api/client.ts`:
```typescript
const USE_MOCK_API = true  // true = mock, false = real backend
```

## Build & Run (Real Backend Mode)
Build: npm install
Run: npm run dev

Make sure `svc-leakage` backend is running on port 8081.

## Build Docker
docker build -t leakage-web .
docker tag leakage-web:latest trinisdocker/leakage-web:latest
docker push trinisdocker/leakage-web:latest

## Scripts
- dev: start dev server at http://localhost:80
- build: build for production
- preview: preview production build

## Env / Proxy
The dev server proxies `/api` calls to `http://localhost:8081` (when using real backend).

## Roles
Login lets you pick a username and role. Maker can create requests, Approver/Super Approver can action them, all roles can view History.
