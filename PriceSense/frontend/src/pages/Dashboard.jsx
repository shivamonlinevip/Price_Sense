import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import PriceGraph from '../components/PriceGraph';
import SVIIndicator from '../components/SVIIndicator';
import AdviceCard from '../components/AdviceCard';
export default function Dashboard(){
  const [data, setData] = useState(null);
  return (
    <div className="container mx-auto p-6">
      <InputBox onResult={setData} />
      {data && <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 bg-white p-4 rounded shadow"><PriceGraph data={data} /></div>
        <div className="space-y-4">
          <SVIIndicator svi={data.svi} />
          <AdviceCard advice={data.advice} />
        </div>
      </div>}
    </div>
  )
}
