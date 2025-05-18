console.log("Worker script loaded!");

import {
  Account,
  initThreadPool,
  PrivateKey,
  ProgramManager,
} from "@aleohq/sdk";

// Initialize the thread pool for Aleo operations
await initThreadPool();

async function mintAgent(repId: string, bankName: string) {
  try {
    const programManager = new ProgramManager("https://vm.aleo.org/api");
    
    // Create a temporary account for the execution
    const account = new Account();
    programManager.setAccount(account);

    // Use your deployed program ID and transition name
    const programId = "agent_manager.aleo"; // <-- update if your program ID is different
    const transition = "mint_agent";

    // Arguments: repId and bankName (already hashed to field)
    // Format inputs as "{value}field.private"
    const inputs = [
      `${repId}field`,
      `${bankName}field`
    ];

    console.log("Formatted inputs for SDK:", inputs); // Added for debugging

    const executionResponse = await programManager.run(
      programId,
      transition,
      inputs, // Use the formatted inputs
      true    // Auto-estimate and pay fee
    );

    return {
      status: "success",
      repId,
      bankName,
      outputs: executionResponse.getOutputs()
    };
  } catch (error) {
    console.error("Error minting agent:", error, typeof error);
    // Log the arguments that caused the error
    console.error("Failed with inputs:", { repId, bankName, formattedInputs: [`${repId}field`, `${bankName}field`] }); 
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
    console.error("Worker error:", error, typeof error);
    postMessage({
      type: "error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

function hexToDecimal(hexStr: string): string {
  return BigInt('0x' + hexStr).toString(10);
}