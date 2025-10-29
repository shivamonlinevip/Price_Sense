# PriceSense Fullstack (Scraping-based)

This package contains a fullstack PriceSense app (backend + frontend).
- Backend (Node.js + Express + Puppeteer + MongoDB) scrapes product prices and stores history.
- Frontend (React + Vite + Tailwind + Recharts) visualizes price trends, SVI, and advice.

## Quick local run
1. Start MongoDB Atlas (create cluster) and copy MONGO_URI into backend/.env
2. Backend:
   cd backend
   npm install
   node server.js
3. Frontend:
   cd frontend
   npm install
   npm run dev
4. Open http://localhost:5173 and search a product (e.g., "Apple AirPods Pro 2").

## Deploy to Render + Vercel
1. Push repo to GitHub.
2. Deploy backend on Render as a Web Service (Node). Set environment variable MONGO_URI.
3. Deploy frontend on Vercel (select frontend folder). Set VITE_BACKEND_URL to backend URL.
4. Visit frontend URL and demo.

## Notes
- Puppeteer is configured headless with --no-sandbox flags making it cloud-compatible.

