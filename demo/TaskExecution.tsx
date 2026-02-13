import React from 'react';
import { useAccount } from 'wagmi';
import { createSkaleClient, getBalances, AGENT_TYPES, type AgentPipelineSelection } from '../service/web3';
import { allocateBudget, completeAgentRequest, completeTask, createTaskForClient } from '../service/escrowApi';
import { runAgent } from '../service/agentsApi';
import { formatUnits } from 'viem';
import type { Hex } from 'viem';

interface AgentExecution {
  agentType: string;
  agentId: number;
  status: 'pending' | 'allocating' | 'processing' | 'completed' | 'failed';
  input?: string;
  output?: string;
  txHash?: string;
  paymentAmount?: bigint;
  timestamp?: Date;
  requestId?: string;
  reputationBefore?: number;
  reputationAfter?: number;
}

interface TaskExecutionProps {
  prompt: string;
  pipeline: AgentPipelineSelection;
  totalBudget: bigint;
  tokenSymbol: string;
}

const TaskExecution: React.FC<TaskExecutionProps> = ({ prompt, pipeline, totalBudget, tokenSymbol }) => {
  const { isConnected, address } = useAccount();
  const [step, setStep] = React.useState<'checking' | 'creating' | 'executing' | 'completed'>('checking');
  const [error, setError] = React.useState<string | null>(null);
  const [taskId, setTaskId] = React.useState<number | null>(null);
  const [createTaskTxHash, setCreateTaskTxHash] = React.useState<Hex | null>(null);
  const [executions, setExecutions] = React.useState<AgentExecution[]>([]);
  const [coordinatorPaid, setCoordinatorPaid] = React.useState(false);
  const [finalOutput, setFinalOutput] = React.useState<string | null>(null);
  const [hasStarted, setHasStarted] = React.useState(false);

  const coordinator = pipeline.Coordinator;
  if (!coordinator) {
    return <div className="text-red-500">No coordinator selected</div>;
  }

  // Initialize executions for all selected agents
  React.useEffect(() => {
    const initialExecutions: AgentExecution[] = [];
    
    // Add coordinator first (will process first)
    initialExecutions.push({
      agentType: 'Coordinator',
      agentId: coordinator.id,
      status: 'pending',
      input: prompt,
    });

    // Add other agents
    AGENT_TYPES.slice(1).forEach((type) => {
      const agent = pipeline[type];
      if (agent) {
        initialExecutions.push({
          agentType: type,
          agentId: agent.id,
          status: 'pending',
        });
      }
    });

    setExecutions(initialExecutions);
  }, [pipeline, coordinator.id, prompt]);

  // Auto-start execution when component mounts
  React.useEffect(() => {
    if (!hasStarted && isConnected && address && executions.length > 0) {
      setHasStarted(true);
      startExecution();
    }
  }, [hasStarted, isConnected, address, executions.length]);

  const updateExecution = (agentType: string, updates: Partial<AgentExecution>) => {
    setExecutions((prev) =>
      prev.map((exec) =>
        exec.agentType === agentType ? { ...exec, ...updates } : exec
      )
    );
  };

  const startExecution = async () => {
    if (!address) return;
    setError(null);
    setStep('checking');

    try {
      // Step 1: Check escrow balance (approved amount)
      const client = createSkaleClient();
      const balances = await getBalances(client, address as Hex);
      
      if (balances.escrowBalance < totalBudget) {
        setError(`Insufficient escrow balance. Please deposit ${formatUnits(totalBudget - balances.escrowBalance, 18)} more ${tokenSymbol} to escrow.`);
        setStep('checking');
        return;
      }

      // Step 2: Create task via server wallet using client's deposited funds
      setStep('creating');
      updateExecution('Coordinator', {
        status: 'processing',
      });

      const result = await createTaskForClient({
        client: address,
        coordinatorAgentId: coordinator.id,
        totalBudget: totalBudget.toString(),
        taskHash: `ipfs://${prompt.substring(0, 50)}`,
      });

      const createdTaskId = result.taskId ? Number(result.taskId) : null;
      if (!createdTaskId) {
        throw new Error('Server did not return a taskId');
      }

      setTaskId(createdTaskId);
      setCreateTaskTxHash((result.txHash || null) as Hex | null);
      
      // Step 3: Execute agents
      setStep('executing');
      await executeAgents(createdTaskId);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to execute task');
      setStep('checking');
    }
  };

  const executeAgents = async (taskId: number) => {
    if (!address) return;
    
    try {
      // Step 1: Coordinator in this demo is a simple pass-through (no LLM call)
      const coordinatorOutput = prompt;

      updateExecution('Coordinator', {
        status: 'completed',
        output: coordinatorOutput,
        timestamp: new Date(),
      });

      // Step 2: Coordinator hires research agent and passes output
      let currentInput = coordinatorOutput;
      const agentTypes = AGENT_TYPES.slice(1); // Research, Analyst, Content, Code

      for (const agentType of agentTypes) {
        const agent = pipeline[agentType];
        if (!agent) continue;

        // Coordinator allocates budget to this agent
        updateExecution(agentType, {
          status: 'allocating',
          input: currentInput,
          timestamp: new Date(),
        });

        // Allocate budget to agent (coordinator is doing this)
        try {
          const allocateResult = await allocateBudget({
            taskId: taskId.toString(),
            toAgentId: agent.id,
            amount: agent.pricePerTask.toString(),
            input: currentInput,
          });

          updateExecution(agentType, {
            status: 'processing',
            requestId: allocateResult.requestId,
            txHash: allocateResult.txHash,
          });

          // Wait for agent processing
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Complete the request (agent finishes work on-chain)
          const completeResult = await completeAgentRequest({
            requestId: allocateResult.requestId!,
            success: true,
            agentType: agentType,
          });

          // Call the real agent via backend API (OpenRouter)
          const agentResult = await runAgent({
            agentType,
            input: currentInput,
          });

          if (!agentResult.success) {
            throw new Error(agentResult.error || `Agent ${agentType} failed`);
          }

          const output = agentResult.output || currentInput;

          updateExecution(agentType, {
            status: 'completed',
            output: output,
            paymentAmount: agent.pricePerTask,
            txHash: completeResult.txHash,
            reputationBefore: agent.reputation,
            reputationAfter: Math.min(agent.reputation + 10, 1000),
          });

          currentInput = output; // Chain output to next agent
        } catch (e: any) {
          updateExecution(agentType, {
            status: 'failed',
            output: `Error: ${e?.message ?? 'Failed to process'}`,
          });
          throw e;
        }
      }

      // Step 3: Finalize task and pay coordinator
      await completeTask({
        taskId: taskId.toString(),
        success: true,
      });

      setCoordinatorPaid(true);
      setFinalOutput(currentInput);
      setStep('completed');

      // Update coordinator execution with payment
      updateExecution('Coordinator', {
        paymentAmount: coordinator.pricePerTask,
        reputationBefore: coordinator.reputation,
        reputationAfter: Math.min(coordinator.reputation + 10, 1000),
      });
    } catch (e: any) {
      setError(e?.message ?? 'Failed to execute agents');
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          Task Execution
        </h3>

        {/* Step 1: Checking */}
        {step === 'checking' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-300 animate-pulse">
                {step === 'checking' ? '1' : '⟳'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Checking Escrow Balance...
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Verifying sufficient tokens are deposited in escrow
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Creating Task */}
        {step === 'creating' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-300">
                ✓
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Escrow Approved
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-300 animate-pulse">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Creating Task...
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Transferring {formatUnits(totalBudget, 18)} {tokenSymbol} to escrow and creating task with coordinator agent #{coordinator.id}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Executing */}
        {step === 'executing' && taskId && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-300">
                ✓
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Task #{taskId} Created
                </p>
                {createTaskTxHash && (
                  <a
                    href={`https://base-sepolia-testnet-explorer.skalenodes.com//tx/${createTaskTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-400 hover:underline"
                  >
                    View TX: {createTaskTxHash.slice(0, 10)}...
                  </a>
                )}
                <p className="text-xs text-neutral-400 mt-1">
                  Funds transferred to escrow. Coordinator processing task...
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-300 animate-pulse">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Executing Agent Pipeline...
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Coordinator → Research → Analyst → Content → Code
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Completed */}
        {step === 'completed' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold text-neutral-300">
                ✓
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Task Completed Successfully
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/50 border border-red-800">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Agent Execution Cards */}
      {executions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">
            Agent Execution Flow
          </h4>
          {executions.map((execution, idx) => (
            <AgentCard key={`${execution.agentType}-${idx}`} execution={execution} tokenSymbol={tokenSymbol} />
          ))}
        </div>
      )}

      {/* Final Output */}
      {finalOutput && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Final Output
          </h4>
          <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
            <pre className="text-xs text-neutral-300 whitespace-pre-wrap">
              {finalOutput}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

interface AgentCardProps {
  execution: AgentExecution;
  tokenSymbol: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ execution, tokenSymbol }) => {
  const getStatusColor = () => {
    switch (execution.status) {
      case 'completed':
        return 'border-green-700 bg-green-950/50';
      case 'failed':
        return 'border-red-800 bg-red-950/50';
      case 'processing':
      case 'allocating':
        return 'border-neutral-600 bg-neutral-800';
      default:
        return 'border-neutral-700 bg-neutral-800';
    }
  };

  const getStatusIcon = () => {
    switch (execution.status) {
      case 'completed':
        return '✓';
      case 'failed':
        return '✗';
      case 'processing':
      case 'allocating':
        return '⟳';
      default:
        return '○';
    }
  };

  const getStatusIconColor = () => {
    switch (execution.status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'processing':
      case 'allocating':
        return 'text-neutral-300';
      default:
        return 'text-neutral-500';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-5 transition-all ${getStatusColor()}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-lg font-bold ${getStatusIconColor()}`}>{getStatusIcon()}</span>
            <span className="text-sm font-semibold text-white uppercase">
              {execution.agentType}
            </span>
            <span className="text-xs text-neutral-500">
              Agent #{execution.agentId}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {execution.reputationBefore !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-neutral-400">Reputation:</span>
                <span className="text-green-400 font-medium">
                  {execution.reputationBefore}
                  {execution.reputationAfter !== undefined && ` → ${execution.reputationAfter}`}
                </span>
              </div>
            )}
            {execution.paymentAmount && (
              <div className="flex items-center gap-1">
                <span className="text-neutral-400">Paid:</span>
                <span className="text-neutral-300 font-semibold">
                  {formatUnits(execution.paymentAmount, 18)} {tokenSymbol}
                </span>
              </div>
            )}
            {execution.timestamp && (
              <div className="text-neutral-500">
                {execution.timestamp.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
        {execution.txHash && (
          <a
            href={`https://base-sepolia-testnet-explorer.skalenodes.com//tx/${execution.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-400 hover:underline font-medium"
          >
            TX
          </a>
        )}
      </div>

      {execution.input && (
        <div className="mb-3">
          <p className="text-xs text-neutral-400 mb-1 font-medium">Input:</p>
          <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3">
            <p className="text-xs text-neutral-300 whitespace-pre-wrap line-clamp-3">
              {execution.input}
            </p>
          </div>
        </div>
      )}

      {execution.output && (
        <div>
          <p className="text-xs text-neutral-400 mb-1 font-medium">Output:</p>
          <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-3">
            <pre className="text-xs text-neutral-300 whitespace-pre-wrap">
              {execution.output}
            </pre>
          </div>
        </div>
      )}

      {execution.status === 'processing' || execution.status === 'allocating' ? (
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
          <span className="text-xs text-neutral-400">
            {execution.status === 'allocating' ? 'Allocating budget...' : 'Processing...'}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default TaskExecution;
