import React, { useState } from 'react';
import axios from 'axios';

export default function InputBox({ onResult }) {
  const [q, setQ] = useState('Apple AirPods Pro 2');
  const [loading, setLoading] = useState(false);

  async function search() {
    if (!q.trim()) return alert('Please enter a product name.');
    setLoading(true);

    try {
      const res = await axios.get('http://localhost:5000/api/price', { params: { product: q } });

      const data = res.data;
      console.log('Fetched data:', data);

      const lastPrice = data.history?.[data.history.length - 1]?.price || 0;
      const futurePrice = data.prediction?.futureAverage || 0;

      const advice =
        futurePrice && lastPrice
          ? futurePrice < lastPrice
            ? `💡 Wait — predicted drop ₹${Math.round(lastPrice - futurePrice)}`
            : '🛒 Buy now — prices expected to rise!'
          : 'No prediction data available';

      onResult({ ...data, advice });
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch. Check backend connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Enter product name"
        />
        <button
          onClick={search}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Enter product name (scraper searches Amazon/Flipkart).
      </p>
    </div>
  );
}
