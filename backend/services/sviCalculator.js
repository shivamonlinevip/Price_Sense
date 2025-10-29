/*
 SV I calculation (heuristic):
 SVI = scale( (rating_norm + spec_norm + stability_norm) * (avgPrice / currentPrice) )
*/
export function calculateSVI(productData, prediction){
  // productData: { rating, specScore, prices: [{date,price}] }
  const prices = productData.prices && productData.prices.length ? productData.prices.map(p=>p.price) : [];
  const avgPrice = prices.length ? prices.reduce((a,b)=>a+b,0)/prices.length : (prediction.futureAverage || 0);
  const currentPrice = prices.length ? prices[prices.length-1] : (prediction.futureAverage || 0);
  const Rrating = (productData.rating || 4.0) / 5 * 10; // 0-10
  const Rspecs = Math.min(10, productData.specScore || 7.0);
  const volatility = prices.length ? (Math.sqrt(prices.reduce((s,p)=>s+Math.pow(p - avgPrice,2),0)/prices.length)) : 0;
  const stability = Math.max(0, 10 - (volatility / (avgPrice || 1) * 100));
  const raw = (Rrating + Rspecs + stability)/3 * ( (avgPrice || currentPrice) / (currentPrice || avgPrice || 1) );
  const svi = Math.max(0, Math.min(10, Number(raw.toFixed(2))));
  return svi;
}
