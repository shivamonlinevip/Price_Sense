import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cron from 'node-cron';
import priceRouter from './routes/price.js';
import { updateTopProducts } from './cron/updatePrices.js';
import fs from 'fs';
const fallbackData = JSON.parse(fs.readFileSync('./data/sampleProducts.json', 'utf-8'));

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error', err));

app.use('/api/price', priceRouter);

app.get('/', (req,res)=> res.send('PriceSense Backend ✅'));

// Schedule daily update at 06:00 UTC
cron.schedule('0 6 * * *', async ()=>{
  console.log('[cron] updating top products...');
  try {
    await updateTopProducts(fallbackData.products.slice(0, 10));
  } catch(e){ console.error('[cron] error', e); }
});

app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`));
