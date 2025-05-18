"use client";

import React, { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import type { AgGridReact as AgGridReactType } from "ag-grid-react";
import type { ColDef, ICellRendererParams, ValueGetterParams } from "ag-grid-community";
import { useAgentContext } from '@/context/AgentContext';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const enabledColumnDefs: ColDef[] = [
  { headerName: "Name", field: "name", flex: 1, cellClass: "ag-left-aligned-cell" },
  {
    headerName: "Username / Rep ID",
    valueGetter: (p: ValueGetterParams) => `${p.data.username} (${p.data.repId})`,
    flex: 1,
    cellClass: "ag-left-aligned-cell",
  },
  { headerName: "Department", field: "department", flex: 1, cellClass: "ag-left-aligned-cell" },
  {
    headerName: "Open",
    field: "open",
    flex: 0.5,
    cellRenderer: (p: ICellRendererParams) => (p.value ? "✅" : "❌"),
    cellClass: "ag-left-aligned-cell",
  },
  {
    headerName: "Pay",
    field: "pay",
    flex: 0.5,
    cellRenderer: (p: ICellRendererParams) => (p.value ? "✅" : "❌"),
    cellClass: "ag-left-aligned-cell",
  },
  {
    headerName: "Actions",
    field: "actions",
    flex: 1,
    cellRenderer: (params: ICellRendererParams) => {
      const [isExpanded, setIsExpanded] = useState(false);
      const { revokeAgent } = useAgentContext();
      return (
        <div>
          <button
            className="px-2 py-1 bg-blue-100 rounded"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>
          {isExpanded && (
            <div className="mt-2 p-4 bg-gray-50 rounded border">
              <h3 className="font-bold mb-2">Agent Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Name:</strong> {params.data.name}</div>
                <div><strong>Username:</strong> {params.data.username}</div>
                <div><strong>Rep ID:</strong> {params.data.repId}</div>
                <div><strong>Department:</strong> {params.data.department}</div>
                <div><strong>Permissions:</strong></div>
                <div>
                  <div>• Open Accounts: {params.data.permissions.open ? "✅" : "❌"}</div>
                  <div>• Take Payments: {params.data.permissions.pay ? "✅" : "❌"}</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded mt-4" onClick={() => revokeAgent(params.data.repId)}>Revoke Agent Access</button>
            </div>
          )}
        </div>
      );
    },
    cellClass: "ag-left-aligned-cell",
  },
];

const allEmployeesColumnDefs: ColDef[] = [
  { headerName: "Name", field: "name", flex: 1, cellClass: "ag-left-aligned-cell" },
  {
    headerName: "Username / Rep ID",
    valueGetter: (p: ValueGetterParams) => `${p.data.username} (${p.data.repId})`,
    flex: 1,
    cellClass: "ag-left-aligned-cell",
  },
  { headerName: "Department", field: "department", flex: 1, cellClass: "ag-left-aligned-cell" },
  {
    headerName: "Status",
    field: "enabled",
    flex: 1,
    cellRenderer: (p: ICellRendererParams) => (
      p.value ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-600 font-bold">No</span>
    ),
    cellClass: "ag-left-aligned-cell",
  },
  {
    headerName: "Actions",
    field: "actions",
    flex: 1,
    cellRenderer: (params: ICellRendererParams) => {
      const [isExpanded, setIsExpanded] = useState(false);
      const { revokeAgent } = useAgentContext();
      return (
        <div>
          <button
            className="px-2 py-1 bg-blue-100 rounded"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>
          {isExpanded && (
            <div className="mt-2 p-4 bg-gray-50 rounded border">
              <h3 className="font-bold mb-2">Employee Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Name:</strong> {params.data.name}</div>
                <div><strong>Username:</strong> {params.data.username}</div>
                <div><strong>Rep ID:</strong> {params.data.repId}</div>
                <div><strong>Department:</strong> {params.data.department}</div>
                <div><strong>Status:</strong> {params.data.enabled ? "Enabled" : "Disabled"}</div>
                <div><strong>Permissions:</strong></div>
                <div>
                  <div>• Open Accounts: {params.data.permissions.open ? "✅" : "❌"}</div>
                  <div>• Take Payments: {params.data.permissions.pay ? "✅" : "❌"}</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded mt-4" onClick={() => revokeAgent(params.data.repId)}>Revoke Agent Access</button>
            </div>
          )}
        </div>
      );
    },
    cellClass: "ag-left-aligned-cell",
  },
];

export default function AgentManagementPage() {
  const [tab, setTab] = useState<"enabled" | "all">("enabled");
  const [quickFilter, setQuickFilter] = useState("");
  const gridRef = useRef<AgGridReactType>(null);
  const { agents, revokeAgent } = useAgentContext();

  // Show only enabled agents for the "Enabled Agents" tab
  const filteredAgents = tab === "enabled"
    ? agents.filter(agent => agent.enabled)
    : agents;

  const columnDefs = tab === "enabled" ? enabledColumnDefs : allEmployeesColumnDefs;

  return (
    <main
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-2xl font-bold mb-4 text-left">Agent Management</h1>

      <div className="flex gap-4 mb-4">
        <button
          className={`text-left ${tab === "enabled" ? "font-bold border-b-2 border-blue-500" : ""}`}
          onClick={() => setTab("enabled")}
        >
          Enabled Agents
        </button>
        <button
          className={`text-left ${tab === "all" ? "font-bold border-b-2 border-blue-500" : ""}`}
          onClick={() => setTab("all")}
        >
          All Employees
        </button>
      </div>

      <div className="bg-transparent rounded-xl p-6 w-full">
        <input
          type="text"
          placeholder="Search employees..."
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
          className="mb-4 p-2 border rounded w-1/3 text-left"
        />

        <div
          className="ag-theme-quartz"
          style={{
            height: 400,
            width: "100%",
            "--ag-background-color": "#fff",
            "--ag-header-background-color": "#fff",
            "--ag-odd-row-background-color": "#fff",
            "--ag-row-border-color": "rgb(239, 239, 240)",
            "--ag-header-column-separator-display": "none",
          } as React.CSSProperties}
        >
          <AgGridReact
            ref={gridRef}
            rowData={filteredAgents}
            columnDefs={columnDefs}
            quickFilterText={quickFilter}
            domLayout="autoHeight"
          />
        </div>
      </div>
    </main>
  );
} 