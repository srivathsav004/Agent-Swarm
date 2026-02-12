import type { Hex } from 'viem';

// SKALE on Base Testnet network config (mirrors public demo and escrow API)
export const SKALE_CHAIN_ID = 324705682;

export const SKALE_RPC_HTTP_URLS: string[] = [
  'https://base-sepolia-testnet.skalenodes.com/v1/base-testnet',
];

export const SKALE_CHAIN = {
  id: SKALE_CHAIN_ID,
  name: 'SKALE on Base Testnet',
  nativeCurrency: { name: 'CREDIT', symbol: 'CREDIT', decimals: 18 },
  rpcUrls: {
    default: { http: SKALE_RPC_HTTP_URLS },
    public: { http: SKALE_RPC_HTTP_URLS },
  },
} as const;

// Deployed contract addresses (from public/app.js and apis/escrow.js)
export const CONTRACTS = {
  AGENT_TOKEN: '0xEC307d7ae333C32b70889F0Fd61ce6f02Ee31Cf8' as Hex,
  TASK_ESCROW: '0x29B8dB70779839AdD01c87bEC59475aBB8e94E62' as Hex,
  AGENT_REGISTRY: '0x5dB6615Be918c7d12c1342C7580BeA4a7726d6b1' as Hex,
} as const;

// Minimal ABIs required by the frontend for reads
export const TOKEN_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'claimFreeCredits',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'hasUserClaimedFree',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'bool' }],
  },
] as const;

export const REGISTRY_ABI = [
  {
    type: 'function',
    name: 'getAgent',
    stateMutability: 'view',
    inputs: [{ name: 'agentId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'walletAddress', type: 'address' },
          { name: 'agentType', type: 'uint8' },
          { name: 'pricePerTask', type: 'uint256' },
          { name: 'reputation', type: 'uint16' },
          { name: 'active', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getAllActiveAgents',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256[]' }],
  },
] as const;

export const ESCROW_ABI = [
  {
    type: 'function',
    name: 'tasks',
    stateMutability: 'view',
    inputs: [{ name: 'taskId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'client', type: 'address' },
          { name: 'coordinatorAgentId', type: 'uint256' },
          { name: 'totalBudget', type: 'uint256' },
          { name: 'remainingBudget', type: 'uint256' },
          { name: 'pendingAllocations', type: 'uint256' },
          { name: 'coordinatorFee', type: 'uint256' },
          { name: 'status', type: 'uint8' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
    ],
  },
] as const;

// Optional: bytecodes can be filled in from your build artifacts if you
// want to support contract deployment from the frontend. For read-only
// interactions they are not required, so they are left as placeholders.
export const AGENT_TOKEN_BYTECODE: Hex | null = null;
export const AGENT_REGISTRY_BYTECODE: Hex | null = null;
export const TASK_ESCROW_BYTECODE: Hex | null = null;

