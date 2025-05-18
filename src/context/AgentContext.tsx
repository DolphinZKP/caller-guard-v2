"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { agents as initialAgents, Agent } from "@/utils/agents";

type AgentContextType = {
  agents: Agent[];
  enableAgent: (repId: string) => void;
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  const enableAgent = (repId: string) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.repId === repId ? { ...agent, enabled: true } : agent
      )
    );
  };

  return (
    <AgentContext.Provider value={{ agents, enableAgent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgentContext() {
  const context = useContext(AgentContext);
  if (!context) throw new Error("useAgentContext must be used within AgentProvider");
  return context;
} 