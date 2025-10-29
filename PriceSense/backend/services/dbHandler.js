import PriceRecord from '../models/productModel.js';

export async function savePriceRecord(record){
  try{
    const entry = new PriceRecord(record);
    await entry.save();
  }catch(e){ console.error('savePriceRecord', e); }
}

export async function getPriceHistory(product){
  try{
    const docs = await PriceRecord.find({ product }).sort({ date: 1 }).limit(365);
    return docs.map(d=> ({ date: d.date.toISOString().split('T')[0], price: d.price }));
  }catch(e){ console.error('getPriceHistory', e); return []; }
}
