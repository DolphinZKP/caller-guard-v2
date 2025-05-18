"use client";

import React, { useState } from 'react';

const mockEmployees = [
  { name: 'Linda Moore', username: 'LM777', repId: 'S9194', department: 'Customer Support', permissions: { open: true, pay: false } },
  { name: 'James Brown', username: 'JB127', repId: 'W7333', department: 'Technical Support', permissions: { open: false, pay: false } },
  { name: 'Kevin Mitchell', username: 'KM744', repId: 'B1921', department: 'Customer Support', permissions: { open: false, pay: false } },
];

export default function HrAdminPage() {
  const [selected, setSelected] = useState(0);
  const employee = mockEmployees[selected];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">HR Admin</h1>
      <div className="mb-4">
        <select value={selected} onChange={e => setSelected(Number(e.target.value))} className="p-2 border rounded">
          {mockEmployees.map((emp, idx) => (
            <option key={emp.repId} value={idx}>{emp.repId} – {emp.name} ({emp.username})</option>
          ))}
        </select>
      </div>
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
      <button className="px-4 py-2 bg-green-500 text-white rounded">Mint Badge and Enable Agent</button>
    </div>
  );
} 