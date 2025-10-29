import React from 'react';
export default function AdviceCard({advice}){
  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="font-medium">AI Advice</h4>
      <p className="mt-2">{advice || '—'}</p>
    </div>
  )
}
