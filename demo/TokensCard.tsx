import React from 'react';
import { useAccount } from 'wagmi';
import { createSkaleClient, getBalances, depositTokensToEscrow } from '../service/web3';
import { bridgeUsdcToAgent } from '../service/bridge';
import { formatUnits, parseUnits } from 'viem';
import type { Hex } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { AGENT_PER_USDC } from '../service/contracts';

const TokensCard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = React.useState('');
  const [depositLoading, setDepositLoading] = React.useState(false);
  const [depositStep, setDepositStep] = React.useState<'idle' | 'approving' | 'transferring' | 'success'>('idle');
  const [approvalHash, setApprovalHash] = React.useState<string | null>(null);
  const [transferHash, setTransferHash] = React.useState<string | null>(null);
  const [depositError, setDepositError] = React.useState<string | null>(null);
  const [depositSuccess, setDepositSuccess] = React.useState(false);
  const [walletBalance, setWalletBalance] = React.useState<bigint | null>(null);
  const [tokenSymbol, setTokenSymbol] = React.useState('AGENT');

  const [usdcAmount, setUsdcAmount] = React.useState('');
  const [bridgeLoading, setBridgeLoading] = React.useState(false);
  const [bridgeError, setBridgeError] = React.useState<string | null>(null);
  const [bridgeSuccess, setBridgeSuccess] = React.useState(false);

  const loadBalances = React.useCallback(async () => {
    if (!address) return;
    try {
      const client = createSkaleClient();
      const balances = await getBalances(client, address as Hex);
      setWalletBalance(balances.walletToken);
      setTokenSymbol(balances.symbol);
    } catch (e) {
      console.error('Failed to load balances:', e);
    }
  }, [address]);

  React.useEffect(() => {
    if (isConnected && address) void loadBalances();
  }, [isConnected, address, loadBalances]);

  const handleDepositMax = () => {
    if (walletBalance) setDepositAmount(formatUnits(walletBalance, 18));
  };

  const handleDeposit = async () => {
    if (!address || !depositAmount || parseFloat(depositAmount) <= 0) {
      setDepositError('Please enter a valid amount');
      return;
    }
    if (!walletBalance) {
      setDepositError('Failed to load wallet balance');
      return;
    }
    const amountBigInt = parseUnits(depositAmount, 18);
    if (amountBigInt > walletBalance) {
      setDepositError('Insufficient balance');
      return;
    }
    setDepositError(null);
    setDepositLoading(true);
    setDepositSuccess(false);
    setDepositStep('approving');
    setApprovalHash(null);
    setTransferHash(null);
    
    try {
      // Two-step deposit: 1) Approve escrow, 2) Transfer tokens to escrow
      const result = await depositTokensToEscrow(address as Hex, amountBigInt);
      setApprovalHash(result.approvalHash);
      setDepositStep('transferring');
      setTransferHash(result.depositHash);
      
      setDepositStep('success');
      setDepositSuccess(true);
      await loadBalances();
      
      // Trigger balance update in header
      if ((window as any).triggerBalanceUpdate) {
        (window as any).triggerBalanceUpdate();
      }
      
      // Reset after a moment
      setTimeout(() => {
        setDepositStep('idle');
        setDepositAmount('');
        setApprovalHash(null);
        setTransferHash(null);
      }, 3000);
    } catch (e: any) {
      setDepositError(e?.message ?? 'Deposit failed');
      setDepositStep('idle');
      setApprovalHash(null);
      setTransferHash(null);
    } finally {
      setDepositLoading(false);
    }
  };

  const handleBridge = async () => {
    if (!address || !usdcAmount || parseFloat(usdcAmount) <= 0) {
      setBridgeError('Please enter a valid USDC amount');
      return;
    }
    setBridgeError(null);
    setBridgeLoading(true);
    setBridgeSuccess(false);
    try {
      await bridgeUsdcToAgent(address as Hex, usdcAmount);
      setBridgeSuccess(true);
      await loadBalances();
      
      // Trigger balance update in header
      if ((window as any).triggerBalanceUpdate) {
        (window as any).triggerBalanceUpdate();
      }
    } catch (e: any) {
      setBridgeError(e?.message ?? 'Bridge failed');
    } finally {
      setBridgeLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Tokens</CardTitle>
          <CardDescription>Deposit and buy AGENT tokens</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-sm text-neutral-400 text-center">Connect your wallet to deposit or buy tokens.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col" id="tokens">
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
        <CardDescription>Deposit to escrow or buy AGENT with USDC on Base</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Deposit to escrow */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Deposit to escrow</h4>
          <p className="text-xs text-neutral-400">
            Deposit your {tokenSymbol} tokens to escrow. This will approve escrow and transfer tokens in two transactions. Once deposited, tasks can be executed without additional wallet signatures.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="deposit-amount">Amount ({tokenSymbol})</Label>
              <Input
                id="deposit-amount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="any"
              />
            </div>
            <div className="flex items-end">
              <Button type="button" variant="secondary" size="default" onClick={handleDepositMax}>
                Max
              </Button>
            </div>
          </div>
          {walletBalance !== null && (
            <p className="text-xs text-neutral-400">Available: {formatUnits(walletBalance, 18)} {tokenSymbol}</p>
          )}
          {depositError && <p className="text-xs text-red-400">{depositError}</p>}
          {depositSuccess && (
            <div className="space-y-1">
              <p className="text-xs text-green-400">Tokens deposited successfully. Ready for task execution.</p>
              {approvalHash && (
                <a
                  href={`https://explorer.skale.network/tx/${approvalHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-400 hover:text-neutral-300 underline"
                >
                  View approval TX
                </a>
              )}
              {transferHash && (
                <a
                  href={`https://explorer.skale.network/tx/${transferHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-400 hover:text-neutral-300 underline block"
                >
                  View deposit TX
                </a>
              )}
            </div>
          )}
          <Button
            onClick={handleDeposit}
            disabled={depositLoading || !depositAmount || parseFloat(depositAmount) <= 0}
          >
            {depositLoading ? (
              depositStep === 'approving' ? 'Step 1: Approving escrow…' : depositStep === 'transferring' ? 'Step 2: Transferring tokens…' : 'Processing…'
            ) : (
              'Deposit to escrow'
            )}
          </Button>
        </div>

        <div className="border-t border-neutral-700" />

        {/* Buy with USDC on Base */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Buy with USDC on Base</h4>
          <p className="text-xs text-neutral-400">
            Buy agent tokens using USDC on Base. Rate: 1 USDC = {AGENT_PER_USDC} AGENT.
          </p>
          <div className="space-y-1">
            <Label htmlFor="usdc-amount">USDC amount</Label>
            <Input
              id="usdc-amount"
              type="number"
              value={usdcAmount}
              onChange={(e) => setUsdcAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="any"
            />
          </div>
          {usdcAmount && parseFloat(usdcAmount) > 0 && (
            <p className="text-xs text-neutral-400">
              You will receive {parseFloat(usdcAmount) * AGENT_PER_USDC} AGENT (after switching to Base, then SKALE).
            </p>
          )}
          {bridgeError && <p className="text-xs text-red-400">{bridgeError}</p>}
          {bridgeSuccess && <p className="text-xs text-green-400">Bridge complete. AGENT is in your wallet.</p>}
          <Button
            onClick={handleBridge}
            disabled={bridgeLoading || !usdcAmount || parseFloat(usdcAmount) <= 0}
          >
            {bridgeLoading ? 'Bridging…' : 'Bridge USDC → AGENT'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokensCard;
