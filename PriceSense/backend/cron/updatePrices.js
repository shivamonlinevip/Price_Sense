import { scrapePrice } from '../services/scraper.js';
import { savePriceRecord } from '../services/dbHandler.js';

export async function updateTopProducts(list){
  for(const p of list){
    try{
      const res = await scrapePrice(p.product);
      if(res){
        await savePriceRecord({ product: res.product, price: res.price, source: res.source });
        console.log('[updateTopProducts] saved', res.product, res.price);
      }
    }catch(e){ console.error('updateTopProducts error', e); }
  }
}
