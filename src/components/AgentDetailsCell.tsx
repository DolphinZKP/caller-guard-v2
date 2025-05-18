"use client";
import React, { useState } from "react";

export default function AgentDetailsCell(props: any) {
  const data = props.data;
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) return null;

  return (
    <div>
      <button
        className="px-2 py-1 bg-blue-100 rounded"
        onClick={() => setIsExpanded((v) => !v)}
      >
        {isExpanded ? "Hide Details" : "View Details"}
      </button>
      {isExpanded && (
        <div className="mt-2 p-4 bg-gray-50 rounded border">
          <h3 className="font-bold mb-2">Agent Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <div><strong>Name:</strong> {data.name}</div>
            <div><strong>Username:</strong> {data.username}</div>
            <div><strong>Rep ID:</strong> {data.repId}</div>
            <div><strong>Department:</strong> {data.department}</div>
            <div><strong>Permissions:</strong></div>
            <div>
              <div>• Open Accounts: {data.permissions?.open ? "✅" : "❌"}</div>
              <div>• Take Payments: {data.permissions?.pay ? "✅" : "❌"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 