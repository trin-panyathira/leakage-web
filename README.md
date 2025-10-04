# leakage-web

React + Vite + TypeScript app for maker/approver/super approver workflow.

## Scripts
- dev: start dev server at http://localhost:8000
- build: build for production
- preview: preview production build

## Env / Proxy
The dev server proxies `/api` calls to `http://localhost:8081`.

## Roles
Login lets you pick a username and role. Maker can create requests, Approver/Super Approver can action them, all roles can view History. 