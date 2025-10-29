import React from 'react';
export default function SVIIndicator({svi}){
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h4 className="font-medium">Smart Value Index</h4>
      <div className="text-4xl font-bold text-indigo-600 mt-2">{svi || '—'}</div>
    </div>
  )
}
