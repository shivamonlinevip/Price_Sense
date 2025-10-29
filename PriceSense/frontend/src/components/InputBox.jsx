import React, {useState} from 'react';
import axios from 'axios';
export default function InputBox({onResult}){
  const [q,setQ] = useState('Apple AirPods Pro 2');
  const [loading,setLoading] = useState(false);
  async function search(){
    setLoading(true);
    try{
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL||'http://localhost:5000'}/api/price`, { params: { product: q } });
      // provide advice text from svi/prediction
      const advice = res.data.prediction && res.data.svi ? ( res.data.prediction.futureAverage < res.data.history[res.data.history.length-1].price ? `Wait — predicted drop ₹${res.data.history[res.data.history.length-1].price - res.data.prediction.futureAverage}` : 'Buy now' ) : 'No advice';
      onResult({ ...res.data, advice });
    }catch(e){ alert('Failed to fetch. See console.'); console.error(e); }finally{ setLoading(false); }
  }
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex gap-2">
        <input className="flex-1 p-2 border rounded" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={search} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading? 'Loading...' : 'Search'}</button>
      </div>
      <p className="text-sm text-gray-500 mt-2">Enter product name (scraper searches Amazon/Flipkart).</p>
    </div>
  )
}
