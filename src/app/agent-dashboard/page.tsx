"use client";

import React, { useState } from 'react';

const mockAgents = [
  { label: 'B1921 – Mitchell, Kevin (KM744)', value: 'B1921' },
  { label: 'JB127 – Brown, James (W7333)', value: 'JB127' },
  { label: 'TW175 – White, Timothy (A4872)', value: 'TW175' },
];

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function AgentDashboardPage() {
  const [selected, setSelected] = useState(mockAgents[0].value);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);

  const handleGenerate = () => {
    setOtp(generateOtp());
    setTimer(60);
  };

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>
      <div className="mb-4">
        <select value={selected} onChange={e => setSelected(e.target.value)} className="p-2 border rounded">
          {mockAgents.map(agent => (
            <option key={agent.value} value={agent.value}>{agent.label}</option>
          ))}
        </select>
      </div>
      <button onClick={handleGenerate} className="px-4 py-2 bg-blue-500 text-white rounded mb-4">Generate One-Time Verification Code</button>
      {otp && (
        <div className="my-4 text-center">
          <div className="text-4xl font-mono mb-2">{otp}</div>
          <div className="text-lg">Code valid for <span className="font-bold text-blue-700 text-2xl">{timer}</span> seconds</div>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Instructions for Customer</h2>
        <ol className="list-decimal ml-6">
          <li>Open the authenticator app</li>
          <li>Enter the code above</li>
          <li>Complete the verification process</li>
        </ol>
      </div>
    </div>
  );
} 