import { createPublicClient, createWalletClient, http, custom, type PublicClient, type WalletClient, type Hex, parseUnits } from 'viem';
import { SKALE_CHAIN, CONTRACTS, TOKEN_ABI, REGISTRY_ABI, ESCROW_ABI } from './contracts';

export type AgentTypeKey = 'Coordinator' | 'Research' | 'Analyst' | 'Content' | 'Code';

export const AGENT_TYPES: AgentTypeKey[] = ['Coordinator', 'Research', 'Analyst', 'Content', 'Code'];

export interface OnChainAgent {
  id: number;
  walletAddress: Hex;
  agentType: number;
  pricePerTask: bigint;
  reputation: number;
  active: boolean;
}

export interface AgentPipelineSelection {
  Coordinator: OnChainAgent | null;
  Research: OnChainAgent | null;
  Analyst: OnChainAgent | null;
  Content: OnChainAgent | null;
  Code: OnChainAgent | null;
}

export interface BalanceSummary {
  walletToken: bigint;
  escrowAllowance: bigint;
  decimals: number;
  symbol: string;
}

export function createSkaleClient(): PublicClient {
  if (typeof window !== 'undefined' && (window as any)?.ethereum) {
    return createPublicClient({
      chain: SKALE_CHAIN,
      transport: custom((window as any).ethereum),
    });
  }

  // Fallback to public RPC for read-only
  return createPublicClient({
    chain: SKALE_CHAIN,
    transport: http(SKALE_CHAIN.rpcUrls.default.http[0]),
  });
}

export function createSkaleWalletClient(): WalletClient | null {
  if (typeof window !== 'undefined' && (window as any)?.ethereum) {
    return createWalletClient({
      chain: SKALE_CHAIN,
      transport: custom((window as any).ethereum),
    });
  }

  return null; // No wallet available for write operations
}

export async function getBalances(client: PublicClient, userAddress: Hex): Promise<BalanceSummary> {
  const [walletToken, escrowAllowance, decimals] = await Promise.all([
    client.readContract({
      address: CONTRACTS.AGENT_TOKEN,
      abi: TOKEN_ABI,
      functionName: 'balanceOf',
      args: [userAddress],
    }) as Promise<bigint>,
    client.readContract({
      address: CONTRACTS.AGENT_TOKEN,
      abi: TOKEN_ABI,
      functionName: 'allowance',
      args: [userAddress, CONTRACTS.TASK_ESCROW],
    }) as Promise<bigint>,
    client.readContract({
      address: CONTRACTS.AGENT_TOKEN,
      abi: TOKEN_ABI,
      functionName: 'decimals',
      args: [],
    }) as Promise<number>,
  ]);

  // Try to get symbol, but fallback to default if it fails
  let symbol = 'TOKEN';
  try {
    symbol = await client.readContract({
      address: CONTRACTS.AGENT_TOKEN,
      abi: TOKEN_ABI,
      functionName: 'symbol',
      args: [],
    }) as Promise<string>;
  } catch (error) {
    console.warn('Failed to get token symbol, using default:', error);
    symbol = 'AGENT';
  }

  return {
    walletToken,
    escrowAllowance,
    decimals,
    symbol,
  };
}

export async function hasClaimedFreeCredits(client: PublicClient, userAddress: Hex): Promise<boolean> {
  try {
    const hasClaimed = await client.readContract({
      address: CONTRACTS.AGENT_TOKEN,
      abi: TOKEN_ABI,
      functionName: 'hasUserClaimedFree',
      args: [userAddress],
    }) as Promise<boolean>;
    return hasClaimed;
  } catch (error) {
    console.error('Error checking claim status:', error);
    return true; // Assume claimed if we can't check
  }
}

export async function claimFreeCredits(userAddress: Hex): Promise<void> {
  const walletClient = createSkaleWalletClient();
  if (!walletClient) {
    throw new Error('Wallet not connected');
  }

  try {
    const hash = await walletClient.writeContract({
      address: CONTRACTS.AGENT_TOKEN,
      abi: TOKEN_ABI,
      functionName: 'claimFreeCredits',
      args: [],
      account: userAddress,
    });
    
    // Wait for transaction confirmation
    const publicClient = createSkaleClient();
    await publicClient.waitForTransactionReceipt({ hash });
    
  } catch (error) {
    console.error('Error claiming free credits:', error);
    throw error;
  }
}

export async function getActiveAgents(client: PublicClient): Promise<OnChainAgent[]> {
  const agentIds = (await client.readContract({
    address: CONTRACTS.AGENT_REGISTRY,
    abi: REGISTRY_ABI,
    functionName: 'getAllActiveAgents',
    args: [],
  })) as bigint[];

  if (!agentIds.length) return [];

  const agents: OnChainAgent[] = [];

  for (const id of agentIds) {
    const raw = (await client.readContract({
      address: CONTRACTS.AGENT_REGISTRY,
      abi: REGISTRY_ABI,
      functionName: 'getAgent',
      args: [id],
    })) as any;

    agents.push({
      id: Number(id),
      walletAddress: raw.walletAddress as Hex,
      agentType: Number(raw.agentType),
      pricePerTask: BigInt(raw.pricePerTask),
      reputation: Number(raw.reputation),
      active: Boolean(raw.active),
    });
  }

  return agents.filter((a) => a.active);
}

export function selectBestPipeline(agents: OnChainAgent[]): AgentPipelineSelection {
  const byType: Record<number, OnChainAgent[]> = {};
  for (const a of agents) {
    if (!byType[a.agentType]) byType[a.agentType] = [];
    byType[a.agentType].push(a);
  }

  const pickBest = (typeIndex: number): OnChainAgent | null => {
    const list = byType[typeIndex];
    if (!list || !list.length) return null;
    return [...list].sort((a, b) => b.reputation - a.reputation)[0] ?? null;
  };

  return {
    Coordinator: pickBest(0),
    Research: pickBest(1),
    Analyst: pickBest(2),
    Content: pickBest(3),
    Code: pickBest(4),
  };
}

export function calculatePipelineBudget(pipeline: AgentPipelineSelection): bigint {
  let total = 0n;
  (Object.values(pipeline) as (OnChainAgent | null)[]).forEach((agent) => {
    if (agent) {
      total += agent.pricePerTask;
    }
  });
  return total;
}

export async function approveEscrow(userAddress: Hex, amount: bigint): Promise<Hex> {
  const walletClient = createSkaleWalletClient();
  if (!walletClient) {
    throw new Error('Wallet not connected');
  }

  const hash = await walletClient.writeContract({
    address: CONTRACTS.AGENT_TOKEN,
    abi: TOKEN_ABI,
    functionName: 'approve',
    args: [CONTRACTS.TASK_ESCROW, amount],
    account: userAddress,
  });

  const publicClient = createSkaleClient();
  await publicClient.waitForTransactionReceipt({ hash });
  
  return hash;
}

export async function createTask(
  userAddress: Hex,
  coordinatorAgentId: number,
  totalBudget: bigint,
  taskHash: string = 'ipfs://task'
): Promise<{ taskId: number; txHash: Hex }> {
  const walletClient = createSkaleWalletClient();
  if (!walletClient) {
    throw new Error('Wallet not connected');
  }

  const hash = await walletClient.writeContract({
    address: CONTRACTS.TASK_ESCROW,
    abi: ESCROW_ABI,
    functionName: 'createTaskWithBudget',
    args: [BigInt(coordinatorAgentId), totalBudget, taskHash],
    account: userAddress,
  });

  const publicClient = createSkaleClient();
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // Extract task ID from event logs
  let taskId: number | null = null;
  for (const log of receipt.logs) {
    try {
      const decoded = publicClient.decodeEventLog({
        abi: ESCROW_ABI,
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName === 'TaskCreated') {
        taskId = Number((decoded.args as any).taskId || (decoded.args as any)[0]);
        break;
      }
    } catch {
      // Try extracting from topics directly
      if (log.topics.length >= 2) {
        try {
          // TaskCreated(uint256 indexed taskId, ...) - taskId is in topics[1]
          taskId = Number(BigInt(log.topics[1]));
          break;
        } catch {}
      }
    }
  }

  if (taskId === null) {
    throw new Error('Failed to extract task ID from transaction. Please check the transaction receipt.');
  }

  return { taskId, txHash: hash };
}

