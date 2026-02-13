import { createWalletClient, createPublicClient, custom, http, parseUnits, type Hex } from 'viem';
import { baseSepolia } from 'viem/chains';
import {
  SKALE_CHAIN,
  CONTRACTS,
  TOKEN_ABI,
  ERC20_ABI,
  BRIDGE_OWNER_ADDRESS,
  USDC_BASE_ADDRESS,
  USDC_DECIMALS,
} from './contracts';

const SKALE_CHAIN_ID_HEX = `0x${SKALE_CHAIN.id.toString(16)}`;
const BASE_CHAIN_ID_HEX = `0x${baseSepolia.id.toString(16)}`;

function getEthereum() {
  if (typeof window === 'undefined') return null;
  return (window as any).ethereum;
}

export async function ensureBaseNetwork(): Promise<void> {
  const ethereum = getEthereum();
  if (!ethereum?.request) throw new Error('Wallet not available');

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_ID_HEX }],
    });
  } catch (switchErr: any) {
    if (switchErr?.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: BASE_CHAIN_ID_HEX,
            chainName: 'Base Sepolia',
            rpcUrls: ['https://sepolia.base.org'],
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          },
        ],
      });
    } else throw switchErr;
  }
}

export async function ensureSkaleNetwork(): Promise<void> {
  const ethereum = getEthereum();
  if (!ethereum?.request) throw new Error('Wallet not available');

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SKALE_CHAIN_ID_HEX }],
    });
  } catch (switchErr: any) {
    if (switchErr?.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: SKALE_CHAIN_ID_HEX,
            chainName: 'SKALE Base Sepolia',
            rpcUrls: [SKALE_CHAIN.rpcUrls.default.http[0]],
            nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
          },
        ],
      });
    } else throw switchErr;
  }
}

export async function transferUsdcToOwnerOnBase(userAddress: Hex, usdcAmount: string): Promise<Hex> {
  const ethereum = getEthereum();
  if (!ethereum) throw new Error('Wallet not available');

  await ensureBaseNetwork();

  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(ethereum),
  });

  const amountWei = parseUnits(usdcAmount, USDC_DECIMALS);

  const hash = await walletClient.writeContract({
    chain: baseSepolia,
    address: USDC_BASE_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [BRIDGE_OWNER_ADDRESS, amountWei],
    account: userAddress,
  });

  return hash;
}

/** Contract expects USDC amount in human units (e.g. 10 for 10 USDC), not wei. */
export async function claimAgentTokensOnSkale(userAddress: Hex, usdcAmount: string): Promise<Hex> {
  const ethereum = getEthereum();
  if (!ethereum) throw new Error('Wallet not available');

  await ensureSkaleNetwork();

  const walletClient = createWalletClient({
    chain: SKALE_CHAIN,
    transport: custom(ethereum),
  });

  const amountHuman = BigInt(Math.floor(parseFloat(usdcAmount) || 0));

  const hash = await walletClient.writeContract({
    chain: SKALE_CHAIN,
    address: CONTRACTS.AGENT_TOKEN,
    abi: TOKEN_ABI,
    functionName: 'claimAgentTokens',
    args: [amountHuman],
    account: userAddress,
  });

  return hash;
}

/** Step 1: Transfer USDC to owner on Base. Step 2: Switch to SKALE and claim AGENT. */
export async function bridgeUsdcToAgent(userAddress: Hex, usdcAmount: string): Promise<{ usdcTxHash: Hex; claimTxHash: Hex }> {
  const usdcTxHash = await transferUsdcToOwnerOnBase(userAddress, usdcAmount);

  const baseClient = createPublicClient({
    chain: baseSepolia,
    transport: getEthereum() ? custom(getEthereum()!) : http(),
  });
  await baseClient.waitForTransactionReceipt({ hash: usdcTxHash });

  await ensureSkaleNetwork();
  const claimTxHash = await claimAgentTokensOnSkale(userAddress, usdcAmount);

  const skaleClient = createPublicClient({
    chain: SKALE_CHAIN,
    transport: http(SKALE_CHAIN.rpcUrls.default.http[0]),
  });
  await skaleClient.waitForTransactionReceipt({ hash: claimTxHash });

  return { usdcTxHash, claimTxHash };
}
