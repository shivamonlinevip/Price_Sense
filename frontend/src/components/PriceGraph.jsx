import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
export default function PriceGraph({data}){
  const past = data.history.map(h=> ({ date: h.date, price: h.price }));
  const future = data.prediction ? data.prediction.predictedTrend.map((p,i)=> ({ date: 'f'+(i+1), price: p })) : [];
  const combined = [...past, ...future];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={combined}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
