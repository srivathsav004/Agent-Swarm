import { createPublicClient, createWalletClient, http, custom, type PublicClient, type WalletClient, type Hex, parseUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { SKALE_CHAIN, CONTRACTS, TOKEN_ABI, REGISTRY_ABI, ESCROW_ABI, ERC20_ABI, USDC_BASE_ADDRESS, USDC_DECIMALS } from './contracts';

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
  escrowBalance: bigint; // Actual tokens held by escrow contract for this user
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

export function createBaseClient(): PublicClient {
  if (typeof window !== 'undefined' && (window as any)?.ethereum) {
    return createPublicClient({
      chain: baseSepolia,
      transport: custom((window as any).ethereum),
    });
  }

  // Fallback to public RPC for read-only - try multiple endpoints
  return createPublicClient({
    chain: baseSepolia,
    transport: http('https://base-sepolia.blockscout.com'),
  });
}

export async function getUsdcBalance(userAddress: Hex): Promise<bigint> {
  try {
    console.log('Fetching USDC balance for address:', userAddress);
    console.log('USDC contract address:', USDC_BASE_ADDRESS);
    
    // Try using Blockscout API directly
    const apiUrl = `https://base-sepolia.blockscout.com/api/v2/addresses/${userAddress}/tokens`;
    console.log('Fetching from API:', apiUrl);
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    
    // Find USDC token in the response
    const usdcToken = data.items?.find((token: any) => 
      token.token?.address_hash?.toLowerCase() === USDC_BASE_ADDRESS.toLowerCase()
    );
    
    console.log('Looking for USDC with address:', USDC_BASE_ADDRESS.toLowerCase());
    console.log('Available token addresses:', data.items?.map((item: any) => item.token?.address_hash?.toLowerCase()));
    console.log('Found USDC token:', usdcToken);
    
    if (usdcToken && usdcToken.value) {
      const balance = BigInt(usdcToken.value);
      console.log('USDC balance from API:', balance.toString());
      console.log('USDC balance formatted:', Number(balance) / 1_000_000);
      return balance;
    } else {
      console.log('USDC token not found in API response');
      return 0n;
    }
  } catch (error) {
    console.error('Failed to get USDC balance:', error);
    return 0n;
  }
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

  // Get user's actual deposit balance from escrow contract
  let escrowBalance = 0n;
  try {
    escrowBalance = await client.readContract({
      address: CONTRACTS.TASK_ESCROW,
      abi: ESCROW_ABI,
      functionName: 'getUserDepositBalance',
      args: [userAddress],
    }) as Promise<bigint>;
  } catch (error) {
    // Fallback: if getUserDepositBalance doesn't exist (old contract), use allowance
    console.warn('getUserDepositBalance not available, using allowance:', error);
    escrowBalance = escrowAllowance;
  }

  return {
    walletToken,
    escrowAllowance,
    escrowBalance, // Actual tokens deposited to escrow contract
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

  // Check current allowance and add to it (approve accumulates, doesn't overwrite)
  const publicClient = createSkaleClient();
  const currentAllowance = await publicClient.readContract({
    address: CONTRACTS.AGENT_TOKEN,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: [userAddress, CONTRACTS.TASK_ESCROW],
  }) as bigint;

  // Total allowance = current + new amount
  const totalAllowance = currentAllowance + amount;

  const hash = await walletClient.writeContract({
    chain: SKALE_CHAIN,
    address: CONTRACTS.AGENT_TOKEN,
    abi: TOKEN_ABI,
    functionName: 'approve',
    args: [CONTRACTS.TASK_ESCROW, totalAllowance],
    account: userAddress,
  });

  await publicClient.waitForTransactionReceipt({ hash });
  
  return hash;
}

/** Deposit tokens to escrow contract using the contract's deposit function. Requires approval first. */
export async function depositToEscrow(userAddress: Hex, amount: bigint): Promise<Hex> {
  const walletClient = createSkaleWalletClient();
  if (!walletClient) {
    throw new Error('Wallet not connected');
  }

  // Use the escrow contract's deposit function (tracks per-user deposits)
  const hash = await walletClient.writeContract({
    chain: SKALE_CHAIN,
    address: CONTRACTS.TASK_ESCROW,
    abi: ESCROW_ABI,
    functionName: 'deposit',
    args: [amount],
    account: userAddress,
  });

  const publicClient = createSkaleClient();
  await publicClient.waitForTransactionReceipt({ hash });
  
  return hash;
}

/** Two-step deposit: 1) Approve escrow, 2) Deposit tokens to escrow using contract's deposit function */
export async function depositTokensToEscrow(userAddress: Hex, amount: bigint): Promise<{ approvalHash: Hex; depositHash: Hex }> {
  // Step 1: Approve escrow to spend tokens (accumulate with existing allowance)
  const approvalHash = await approveEscrow(userAddress, amount);
  
  // Step 2: Deposit tokens to escrow contract (tracks per-user balance)
  const depositHash = await depositToEscrow(userAddress, amount);
  
  return { approvalHash, depositHash };
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
    chain: SKALE_CHAIN,
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

