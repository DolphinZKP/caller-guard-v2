console.log("Worker script loaded!");

import {
  Account,
  initThreadPool,
  PrivateKey,
  ProgramManager,
} from "@aleohq/sdk";

// Initialize the thread pool for Aleo operations
await initThreadPool();

// Define your Aleo program for minting agent badges
const mint_agent_program = `
program mint_agent.aleo;

function mint_badge:
    input r0 as field.public;  // rep_id
    input r1 as field.public;  // bank_name
    output r0 as field.private;
    output r1 as field.private;
`;

async function mintAgent(repId: string, bankName: string) {
  try {
    const programManager = new ProgramManager(undefined, undefined, undefined);
    
    // Create a temporary account for the execution
    const account = new Account();
    programManager.setAccount(account);

    // Execute the program
    const executionResponse = await programManager.run(
      mint_agent_program,
      "mint_badge",
      [repId, bankName],
      false
    );

    return {
      status: "success",
      repId,
      bankName,
      outputs: executionResponse.getOutputs()
    };
  } catch (error) {
    console.error("Error minting agent:", error);
    return {
      status: "error",
      repId,
      bankName,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Handle messages from the main thread
onmessage = async function (e) {
  console.log("Worker received message:", e.data);
  try {
    if (e.data.type === "mint_agent") {
      const result = await mintAgent(e.data.rep_id, e.data.bank_name);
      console.log("Worker finished mintAgent, posting result:", result);
      postMessage({
        type: "mint_agent",
        result: result
      });
    }
  } catch (error) {
    postMessage({
      type: "error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};