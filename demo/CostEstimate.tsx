import React from 'react';
import { useAccount } from 'wagmi';
import { createSkaleClient, getActiveAgents, selectBestPipeline, calculatePipelineBudget, AGENT_TYPES, type AgentPipelineSelection, getBalances } from '../service/web3';
import { formatUnits } from 'viem';
import type { Hex } from 'viem';

interface CostEstimateProps {
  prompt: string;
  onProceed?: (pipeline: AgentPipelineSelection, totalBudget: bigint, tokenSymbol: string) => void;
}

const CostEstimate: React.FC<CostEstimateProps> = ({ prompt, onProceed }) => {
  const { isConnected, address } = useAccount();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pipeline, setPipeline] = React.useState<AgentPipelineSelection | null>(null);
  const [totalBudget, setTotalBudget] = React.useState<bigint | null>(null);
  const [tokenSymbol, setTokenSymbol] = React.useState<string>('AGENT');
  const [escrowBalance, setEscrowBalance] = React.useState<bigint | null>(null);
  const [walletBalance, setWalletBalance] = React.useState<bigint | null>(null);
  const [checkingFunds, setCheckingFunds] = React.useState(false);

  const scrollToTokens = () => {
    document.getElementById('tokens')?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (!isConnected || !address || !prompt.trim()) {
      return;
    }

    const estimateCost = async () => {
      setLoading(true);
      setError(null);
      try {
        const client = createSkaleClient();
        
        // Fetch all active agents
        const agents = await getActiveAgents(client);
        
        if (agents.length === 0) {
          setError('No active agents found on-chain.');
          setLoading(false);
          return;
        }

        // Select best pipeline based on reputation
        const bestPipeline = selectBestPipeline(agents);
        setPipeline(bestPipeline);

        // Calculate total budget
        const budget = calculatePipelineBudget(bestPipeline);
        setTotalBudget(budget);

        // Check balances and escrow balance
        setCheckingFunds(true);
        const balances = await getBalances(client, address as Hex);
        setEscrowBalance(balances.escrowBalance);
        setWalletBalance(balances.walletToken);
        setTokenSymbol(balances.symbol);
        setCheckingFunds(false);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to estimate cost. Please try again.');
        console.error('Cost estimation error:', e);
      } finally {
        setLoading(false);
      }
    };

    void estimateCost();
  }, [isConnected, address, prompt]);

  if (!isConnected) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <div className="w-5 h-5 animate-spin rounded-full border-2 border-neutral-500 border-t-transparent" />
        <span className="text-sm text-neutral-400">
          Analyzing agents and calculating budget...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-950/50 border border-red-800 p-4">
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  if (!pipeline || totalBudget === null) {
    return null;
  }

  const hasAnyAgent = Object.values(pipeline).some(agent => agent !== null);

  if (!hasAnyAgent) {
    return (
      <div className="rounded-lg bg-neutral-800 border border-neutral-700 p-4">
        <p className="text-sm text-neutral-400">
          No suitable agents found for this task.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Estimated Cost
        </h3>
        <div className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700">
          <span className="text-neutral-400 text-sm font-medium">💰</span>
          <span className="text-neutral-300 text-sm font-medium">Best Agents Selected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENT_TYPES.map((type) => {
          const agent = pipeline[type];
          if (!agent) return null;

          return (
            <div
              key={type}
              className="rounded-lg border border-neutral-700 bg-neutral-800 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-white uppercase">
                      {type}
                    </span>
                    <span className="text-xs text-neutral-500">
                      #{agent.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-neutral-400">
                        Reputation:
                      </span>
                      <span className="text-sm font-semibold text-green-400">
                        {agent.reputation}/1000
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {formatUnits(agent.pricePerTask, 18)} {tokenSymbol}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-neutral-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-neutral-400">
            Total Budget Required:
          </span>
          <span className="text-2xl font-bold text-white">
            {formatUnits(totalBudget, 18)} {tokenSymbol}
          </span>
        </div>
        
        {checkingFunds ? (
          <div className="flex items-center gap-2 mt-4">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-neutral-500 border-t-transparent" />
            <span className="text-sm text-neutral-400">Checking funds...</span>
          </div>
        ) : escrowBalance !== null && walletBalance !== null && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Wallet Balance:</span>
              <span className={`font-medium ${walletBalance >= totalBudget ? 'text-green-400' : 'text-red-400'}`}>
                {formatUnits(walletBalance, 18)} {tokenSymbol}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Escrow Balance:</span>
              <span className={`font-medium ${escrowBalance >= totalBudget ? 'text-green-400' : 'text-red-400'}`}>
                {formatUnits(escrowBalance, 18)} {tokenSymbol}
              </span>
            </div>
            
            {escrowBalance >= totalBudget ? (
              <div className="mt-6 pt-6 border-t border-neutral-700">
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 mb-4">
                  <p className="text-sm text-neutral-300">
                    ✓ Sufficient funds available. Ready to proceed.
                  </p>
                </div>
                {onProceed && (
                  <button
                    type="button"
                    onClick={() => onProceed(pipeline, totalBudget, tokenSymbol)}
                    className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
                  >
                    Proceed to Execute Task
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-neutral-700">
                <div className="bg-red-950/50 border border-red-800 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-300">
                    ⚠ Insufficient funds. Please deposit more tokens or approve escrow.
                  </p>
                </div>
                {walletBalance < totalBudget && (
                  <p className="text-sm text-neutral-400 mb-3">
                    Need {formatUnits(totalBudget - walletBalance, 18)} more {tokenSymbol} in wallet.
                  </p>
                )}
                {escrowBalance < totalBudget && (
                  <p className="text-sm text-neutral-400 mb-3">
                    Need to deposit {formatUnits(totalBudget - escrowBalance, 18)} more {tokenSymbol} to escrow.
                  </p>
                )}
                <button
                  type="button"
                  onClick={scrollToTokens}
                  className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
                >
                  Deposit to Escrow (Tokens panel →)
                </button>
              </div>
            )}
          </div>
        )}
        
        <p className="mt-4 text-xs text-neutral-500">
          Selected agents are chosen based on highest reputation scores. Budget covers all agent tasks in the pipeline.
        </p>
      </div>
    </div>
  );
};

export default CostEstimate;
