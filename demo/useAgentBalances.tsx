import React from 'react';
import { useAccount } from 'wagmi';
import type { Hex } from 'viem';
import { createSkaleClient, getBalances, hasClaimedFreeCredits, claimFreeCredits, getUsdcBalance, type BalanceSummary } from '../service/web3';

// Create a custom event for balance updates
const BALANCE_UPDATE_EVENT = 'agent-balance-update';

export function useAgentBalances() {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = React.useState<BalanceSummary | null>(null);
  const [usdcBalance, setUsdcBalance] = React.useState<bigint | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasClaimed, setHasClaimed] = React.useState<boolean | null>(null);
  const [claimLoading, setClaimLoading] = React.useState(false);

  const refresh = React.useCallback(async () => {
    if (!isConnected || !address) return;
    setLoading(true);
    setError(null);
    try {
      console.log('Refreshing balances for address:', address);
      const client = createSkaleClient();
      const [data, claimed, usdc] = await Promise.all([
        getBalances(client, address as Hex),
        hasClaimedFreeCredits(client, address as Hex),
        getUsdcBalance(address as Hex)
      ]);
      console.log('USDC balance received:', usdc.toString());
      setBalances(data);
      setHasClaimed(claimed);
      setUsdcBalance(usdc);
    } catch (e: any) {
      console.error('Balance refresh error:', e);
      setError(e?.message ?? 'Failed to load balances');
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  // Listen for balance update events
  React.useEffect(() => {
    const handleBalanceUpdate = () => {
      void refresh();
    };
    
    window.addEventListener(BALANCE_UPDATE_EVENT, handleBalanceUpdate);
    return () => {
      window.removeEventListener(BALANCE_UPDATE_EVENT, handleBalanceUpdate);
    };
  }, [refresh]);

  // Export function to trigger balance update
  React.useEffect(() => {
    (window as any).triggerBalanceUpdate = () => {
      window.dispatchEvent(new CustomEvent(BALANCE_UPDATE_EVENT));
    };
    return () => {
      delete (window as any).triggerBalanceUpdate;
    };
  }, []);

  const handleClaimFreeCredits = React.useCallback(async () => {
    if (!isConnected || !address || claimLoading) return;
    setClaimLoading(true);
    setError(null);
    try {
      await claimFreeCredits(address as Hex);
      setHasClaimed(true);
      // Refresh balances after claiming
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to claim free credits');
    } finally {
      setClaimLoading(false);
    }
  }, [address, isConnected, claimLoading, refresh]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    isConnected,
    address,
    balances,
    usdcBalance,
    loading,
    error,
    hasClaimed,
    claimLoading,
    refresh,
    claimFreeCredits: handleClaimFreeCredits,
  };
}

