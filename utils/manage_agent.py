from blockchain import blockchain_call
import time

def mint_new_agent(rep_id, bank_name, project_path=None):
    """Create a new agent record on the blockchain"""
    result = blockchain_call(
        "agent_manager.aleo",
        "mint_agent",
        [rep_id, bank_name],
        project_path=project_path
    )
    
    return {
        "success": True,
        "agent_id": result["outputs"][0] if "outputs" in result else None,
        "rep_id": rep_id,
        "bank_name": bank_name
    }

def revoke_agent(agent_id, rep_id, bank_name, project_path=None):
    """Revoke an agent's access"""
    result = blockchain_call(
        "agent_manager.aleo",
        "revoke_agent",
        [agent_id],
        project_path=project_path
    )
    
    return {
        "success": True,
        "agent_id": agent_id,
        "status": "revoked"
    }

def check_agent_status(agent_id, project_path=None):
    """Check if an agent is active"""
    result = blockchain_call(
        "agent_manager.aleo",
        "is_agent_active",
        [agent_id]
    )
    
    return {
        "agent_id": agent_id,
        "is_active": result["outputs"][0] if "outputs" in result else False
    }

#if __name__ == "__main__":
    # Example usage of generate_zk_proof
    # placeholder variables
    #rep_id = "1233field"
    #bank_name = "5678field"
    #mint_new_agent(rep_id, bank_name,project_path="aleo_py/agent_manager")
    #revoke_agent(rep_id, rep_id, bank_name, project_path="aleo_py/agent_manager")
    #check_agent_status(rep_id, project_path="aleo_py/agent_manager")
 