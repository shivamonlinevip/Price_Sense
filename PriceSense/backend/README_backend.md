PriceSense backend (fully scraping-based)
- Endpoint: GET /api/price?product=PRODUCT_NAME
- Stores price history in MongoDB
- Cron updates top products daily
- Ensure MONGO_URI in .env

Start local:

cd backend
npm install
node server.js

