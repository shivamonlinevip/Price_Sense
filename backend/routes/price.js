import express from 'express';
import { scrapePrice } from '../services/scraper.js';
import { savePriceRecord, getPriceHistory } from '../services/dbHandler.js';
import { predictPrices } from '../services/predictor.js';
import { calculateSVI } from '../services/sviCalculator.js';
import fs from 'fs';
const fallbackData = JSON.parse(fs.readFileSync('./data/sampleProducts.json', 'utf-8'));

const router = express.Router();

// GET /api/price?product=...
router.get('/', async (req,res)=>{
  const q = req.query.product;
  if(!q) return res.status(400).json({ error: 'product query required' });
  try {
    let result = await scrapePrice(q); // fully scraping-based
    if(!result){
      const mock = fallbackData.products.find(p=> p.product.toLowerCase().includes(q.toLowerCase()));
      if(mock) result = { product: mock.product, price: mock.prices.at(-1).price, source: 'mock' };
      else return res.status(404).json({ error: 'no product data available' });
    }
    // save record
    await savePriceRecord({ product: result.product, price: result.price, source: result.source||'scraper' });
    const history = await getPriceHistory(result.product);
    // prediction and SVI using history (or recent prices)
    const series = history.length ? history.map(h=> ({ date: h.date, price: h.price })) : [{ date: new Date().toISOString(), price: result.price }];
    const prediction = predictPrices(series);
    const svi = calculateSVI({ rating: result.rating||4.2, specScore: result.specScore||7.5, prices: series }, prediction);
    return res.json({ ...result, history: series, prediction, svi });
  } catch(e){
    console.error('route error', e);
    return res.status(500).json({ error: 'server error' });
  }
});

export default router;
