"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAgentContext } from '@/context/AgentContext';
import type { Agent } from '@/utils/agents';

const Select = dynamic(() => import('react-select'), { ssr: false });

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

type OptionType = { value: string; label: string };

export default function AgentDashboardPage() {
  const { agents } = useAgentContext();
  const enabledAgents = agents.filter((a: Agent) => a.enabled);
  const options: OptionType[] = enabledAgents.map((agent: Agent) => ({
    value: agent.repId,
    label: `${agent.repId} – ${agent.name} (${agent.username})`,
  }));
  const [selected, setSelected] = useState<OptionType | null>(options[0] || null);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);

  const handleSelect = (option: SingleValue<OptionType>) => {
    setSelected(option || null);
  };

  const handleGenerate = () => {
    setOtp(generateOtp());
    setTimer(60);
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && otp) {
      setOtp('');
      setTimer(0);
    }
  }, [timer, otp]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>
      <div className="mb-4">
        <Select
          options={options}
          value={selected}
          onChange={handleSelect}
          isSearchable
          placeholder="Search and select an agent..."
          className="mb-4 w-1/2"
        />
      </div>
      <button onClick={handleGenerate} className="px-4 py-2 bg-blue-500 text-white rounded mb-4" disabled={!selected}>Generate One-Time Verification Code</button>
      {otp && (
        <div className="my-4 text-center">
          <div className="text-4xl font-mono mb-2">{otp}</div>
          <div className="text-lg">Code valid for <span className="font-bold text-blue-700 text-2xl">{timer}</span> seconds</div>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Instructions for Customer</h2>
        <ol className="list-decimal ml-6">
          <li>Open the authenticator app, enter the bank name and the rep_ID</li>
          <li>Enter the 6 code. They have 1 minute to do so.</li>
          <li>Complete the verification process</li>
        </ol>
      </div>
    </div>
  );
} 