"use client";

import React, { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import type { AgGridReact as AgGridReactType } from "ag-grid-react";
import type { ColDef, ICellRendererParams, ValueGetterParams } from "ag-grid-community";
import { useAgentContext } from '@/context/AgentContext';
import AgentDetailsCell from "@/components/AgentDetailsCell";
import { Account, ProgramManager, AleoNetworkClient, initializeWasm } from '@aleohq/sdk';

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
      // We'll handle the details display outside the grid
      return (
        <button
          className="px-2 py-1 bg-blue-100 rounded"
          onClick={() => params.context.onViewDetails(params.data)}
        >
          {params.context.selectedAgent && params.context.selectedAgent.repId === params.data.repId ? "Hide Details" : "View Details"}
        </button>
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
];

export default function AgentManagementPage() {
  const [tab, setTab] = useState<"enabled" | "all">("enabled");
  const [quickFilter, setQuickFilter] = useState("");
  const gridRef = useRef<AgGridReactType>(null);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const { agents, revokeAgent } = useAgentContext();

  // Show only enabled agents for the "Enabled Agents" tab
  const filteredAgents = tab === "enabled"
    ? agents.filter(agent => agent.enabled)
    : agents;

  const columnDefs = tab === "enabled" ? enabledColumnDefs : allEmployeesColumnDefs;

  // AG Grid context for passing callbacks
  const gridContext = tab === "enabled" ? { onViewDetails: (agent: any) => setSelectedAgent(selectedAgent && selectedAgent.repId === agent.repId ? null : agent), selectedAgent } : {};

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
            context={gridContext}
            suppressRowClickSelection={true}
            rowSelection="single"
          />
        </div>

        {/* Show agent details below the selected row for Enabled Agents tab */}
        {tab === "enabled" && selectedAgent && (
          <div className="mt-4 border rounded bg-white p-6">
            <h3 className="font-bold mb-2">Agent Details</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div><strong>Name:</strong> {selectedAgent.name}</div>
              <div><strong>Username:</strong> {selectedAgent.username}</div>
              <div><strong>Rep ID:</strong> {selectedAgent.repId}</div>
              <div><strong>Department:</strong> {selectedAgent.department}</div>
              <div><strong>Status:</strong> <span className="text-green-600 font-bold">Active</span></div>
              <div><strong>Position:</strong> {selectedAgent.position || "-"}</div>
              <div><strong>Aleo Address:</strong> <span className="text-green-700 font-mono">{selectedAgent.aleoAddress || "aleo1..."}</span></div>
              <div><strong>OTP Digits:</strong> {selectedAgent.otpDigits || 6}</div>
              <div><strong>Enabled At:</strong> {selectedAgent.enabledAt || "-"}</div>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white rounded mb-4" onClick={() => { revokeAgent(selectedAgent.repId); setSelectedAgent(null); }}>Revoke Agent Access</button>
            <h4 className="font-bold mt-4 mb-2">Recent Activity</h4>
            <div className="bg-blue-50 p-4 rounded">No recent activity found for this agent</div>
          </div>
        )}
      </div>
    </main>
  );
} 