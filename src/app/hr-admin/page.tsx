"use client";

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SingleValue } from 'react-select';
import { useAgentContext } from '@/context/AgentContext';
import type { Agent } from '@/utils/agents';
import { ProgramManager } from '@aleohq/sdk';

const Select = dynamic(() => import('react-select'), { ssr: false });

type OptionType = { value: string; label: string };


// Hash a string to a 32-byte hex string (Aleo field)
async function stringToAleoField(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToDecimal(hexStr: string): string {
  return BigInt('0x' + hexStr).toString(10);
}

export default function HrAdminPage() {
  const { agents, enableAgent } = useAgentContext();
  const notEnabledAgents = agents.filter((agent: Agent) => !agent.enabled);
  const options: OptionType[] = notEnabledAgents.map((agent: Agent) => ({
    value: agent.repId,
    label: `${agent.repId} – ${agent.name} (${agent.username})`,
  }));
  const [selected, setSelected] = useState<OptionType | null>(options[0] || null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState<Agent | null>(null);

  const employee = notEnabledAgents.find((a: Agent) => a.repId === selected?.value);

  const handleSelect = (newValue: unknown) => {
    setSelected(newValue as OptionType | null);
  };

  const handleMint = () => {
    setShowConfirm(true);
  };

  const confirmMint = async () => {
    if (employee) {
      // Hash to Aleo field format
      const repIdField = hexToDecimal(await stringToAleoField(employee.repId))+"field";
      const bankNameField = hexToDecimal(await stringToAleoField(employee.department))+"field";

      enableAgent(employee.repId);
      workerRef.current?.postMessage({
        type: "mint_agent",
        rep_id: repIdField,      // <-- decimal string (correct for SDK)
        bank_name: bankNameField // <-- decimal string (correct for SDK)
      });
    }
    setShowConfirm(false);
    setSuccess(employee || null);
  };

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Adjust the path if needed (this assumes worker.ts is in the same folder as your page)
    workerRef.current = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    workerRef.current.onmessage = (event) => {
      if (event.data.type === "mint_agent") {
        console.log(`Minted agent: ${JSON.stringify(event.data.result)}`);
        //alert(`Minted agent: ${JSON.stringify(event.data.result)}`);
      }
    };
    console.log("Worker script loaded!");
    return () => workerRef.current?.terminate();
  }, []);

  if (success) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Agent Successfully Enabled <span className="inline-block align-middle ml-2">✅</span></h1>
        <div className="bg-green-50 border border-green-400 rounded p-6 mb-4">
          <h2 className="text-xl font-bold mb-2">Agent Badge Minted!</h2>
          <p><b>Employee:</b> {success.name}</p>
          <p><b>Rep ID:</b> {success.repId}</p>
          <p className="mt-2">The employee can now generate one-time verification codes for caller authentication.</p>
        </div>
        <button className="px-4 py-2 bg-white border rounded" onClick={() => { setSuccess(null); setSelected(options[0] || null); }}>Enable Another Agent</button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">HR Admin</h1>
      <div className="mb-4">
        <Select
          options={options}
          value={selected}
          onChange={handleSelect}
          isSearchable
          placeholder="Search and select an employee..."
          className="mb-4 w-1/2"
        />
      </div>
      {employee && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Employee Details</h2>
          <div className="mb-1">Name: {employee.name}</div>
          <div className="mb-1">Username: {employee.username}</div>
          <div className="mb-1">Rep ID: {employee.repId}</div>
          <div className="mb-1">Department: {employee.department}</div>
          <div className="mb-1">Permissions:</div>
          <div className="ml-4">Can Open Accounts: {employee.permissions.open ? '✅' : '❌'}</div>
          <div className="ml-4">Can Take Payments: {employee.permissions.pay ? '✅' : '❌'}</div>
        </div>
      )}
      <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleMint} disabled={!employee}>Mint Badge and Enable Agent</button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Confirm Enable Agent</h2>
            <p>Are you sure you want to enable <b>{employee?.name}</b> (Rep ID: {employee?.repId}) as an agent?</p>
            <div className="mt-4 flex gap-4">
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={confirmMint}>Yes, Enable</button>
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 