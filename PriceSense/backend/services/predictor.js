/*
 Simple predictor: linear regression on the price series to predict next 7 days average.
*/
export function predictPrices(series){
  // series: [{date:'YYYY-MM-DD', price: number}, ...] ordered by date
  const prices = series.map(s=>s.price);
  const n = prices.length;
  if(n === 0) return { predictedTrend: [], futureAverage: null };
  if(n === 1) return { predictedTrend: Array(7).fill(prices[0]), futureAverage: prices[0] };
  // simple linear regression on index vs price
  const xs = Array.from({length:n}, (_,i)=>i);
  const xMean = xs.reduce((a,b)=>a+b,0)/n;
  const yMean = prices.reduce((a,b)=>a+b,0)/n;
  let num=0, den=0;
  for(let i=0;i<n;i++){ num += (xs[i]-xMean)*(prices[i]-yMean); den += (xs[i]-xMean)*(xs[i]-xMean); }
  const slope = den === 0 ? 0 : num/den;
  const intercept = yMean - slope * xMean;
  const pred = [];
  for(let i=1;i<=7;i++){
    const xi = n-1 + i;
    pred.push(Math.round(intercept + slope * xi));
  }
  const avg = Math.round(pred.reduce((a,b)=>a+b,0)/pred.length);
  return { predictedTrend: pred, futureAverage: avg, slope };
}
