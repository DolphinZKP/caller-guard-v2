"use client";

import React, { useState } from 'react';

const mockAgents = [
  { name: 'Brown, James', username: 'JB127', repId: 'W7333', department: 'Technical Support', permissions: { open: false, pay: false } },
  { name: 'Mitchell, Kevin', username: 'KM744', repId: 'B1921', department: 'Customer Support', permissions: { open: false, pay: false } },
  { name: 'White, Timothy', username: 'TW175', repId: 'A4872', department: 'Sales', permissions: { open: false, pay: false } },
];

const mockEmployees = [
  ...mockAgents,
  { name: 'Moore, Linda', username: 'LM777', repId: 'S9194', department: 'Customer Support', permissions: { open: true, pay: false } },
];

export default function AgentManagementPage() {
  const [tab, setTab] = useState<'enabled' | 'all'>('enabled');
  const [search, setSearch] = useState('');
  const agents = tab === 'enabled' ? mockAgents : mockEmployees;

  // Filter agents by search term (name, username, repId, etc.)
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(search.toLowerCase()) ||
    agent.username.toLowerCase().includes(search.toLowerCase()) ||
    agent.repId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Agent Management</h1>
      <div className="flex gap-4 mb-4">
        <button className={tab === 'enabled' ? 'font-bold border-b-2 border-blue-500' : ''} onClick={() => setTab('enabled')}>Enabled Agents</button>
        <button className={tab === 'all' ? 'font-bold border-b-2 border-blue-500' : ''} onClick={() => setTab('all')}>All Employees</button>
      </div>
      <input
        type="text"
        placeholder="Search employees..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-1/3"
      />
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Username / Rep ID</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Permissions</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAgents.map((agent, idx) => (
            <tr key={idx} className="text-center">
              <td className="p-2 border">{agent.name}</td>
              <td className="p-2 border">{agent.username} ({agent.repId})</td>
              <td className="p-2 border">{agent.department}</td>
              <td className="p-2 border">
                Open: {agent.permissions.open ? '✅' : '❌'} Pay: {agent.permissions.pay ? '✅' : '❌'}
              </td>
              <td className="p-2 border">
                <button className="px-2 py-1 bg-blue-100 rounded">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 