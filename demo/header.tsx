import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAgentBalances } from './useAgentBalances';
import { formatUnits } from 'viem';

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const { balances, usdcBalance, loading, refresh, hasClaimed, claimLoading, claimFreeCredits, error } = useAgentBalances();

  const scrollToTokens = () => {
    document.getElementById('tokens')?.scrollIntoView({ behavior: 'smooth' });
  };

  const shortAddress = React.useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const handleCopy = async () => {
    if (!address) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    } catch (e) {}
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-neutral-800 bg-black/95 backdrop-blur-md px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src="/logo-agent-swarm.svg" alt="AgentSwarm" className="w-8 h-8 rounded-sm" />
        <div className="flex flex-col">
          <span className="text-xl font-semibold tracking-tight text-white">AGENTSWARM</span>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
            x402 Budget-Based Agent Payments
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isConnected && (
          <div className="flex items-center gap-3">
            {/* Show free claim banner for first-time users */}
            {hasClaimed === false && !loading && (
              <div className="flex items-center gap-3 rounded-lg border border-amber-700 bg-amber-950/50 px-3 py-2">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[9px] text-amber-400 mt-1 uppercase tracking-wider font-medium">Free</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-amber-300 leading-tight">500 AGENT</span>
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider">Credits Available</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Claim button clicked, address:', address);
                    claimFreeCredits();
                  }}
                  disabled={claimLoading}
                  className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-950 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claimLoading ? (
                    <>
                      <div className="w-3 h-3 animate-spin rounded-full border border-white border-t-transparent" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Claim Now
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Show error message if any */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-950/50 px-3 py-1.5">
                <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-red-300">{error}</span>
              </div>
            )}


            {loading ? (
              <div className="flex items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse delay-150" />
                </div>
                <span className="text-sm text-neutral-400 font-medium">Loading...</span>
              </div>
            ) : balances ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400 font-medium">Wallet:</span>
                  <div className="flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-1.5 border border-neutral-700 cursor-pointer hover:bg-neutral-800 transition-colors" onClick={refresh} title="Click to refresh balances">
                    <img src="/agent-token.jpg" alt="AGENT" className="w-5 h-5 rounded-full" />
                    <span className="text-sm font-semibold text-white">
                      {Number(formatUnits(balances.walletToken, balances.decimals)).toFixed(0)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400 font-medium">Escrow:</span>
                  <button
                    type="button"
                    onClick={scrollToTokens}
                    className="flex items-center gap-2 rounded-lg bg-amber-950/50 px-3 py-1.5 border border-amber-700 hover:bg-amber-900/50 transition-colors cursor-pointer"
                    title="Deposit tokens in the Tokens panel"
                  >
                    <img src="/agent-token.jpg" alt="AGENT" className="w-5 h-5 rounded-full" />
                    <span className="text-sm font-semibold text-amber-300">
                      {Number(formatUnits(balances.escrowBalance, balances.decimals)).toFixed(0)}
                    </span>
                  </button>
                </div>

                {usdcBalance !== null && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400 font-medium">USDC:</span>
                    <div className="flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-1.5 border border-neutral-700">
                      <img src="/usdc-icon.svg" alt="USDC" className="w-5 h-5 rounded-full" />
                      <span className="text-sm font-semibold text-white">
                        {Number(formatUnits(usdcBalance, 6)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-neutral-400 font-medium">Balance unavailable</span>
              </div>
            )}
          </div>
        )}

        {isConnected && address && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 hover:bg-neutral-800 transition-colors group"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-neutral-600 group-hover:bg-neutral-500 transition-colors">
                <svg className="h-3 w-3 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 003-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white leading-tight">{shortAddress}</span>
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider">Connected</span>
              </div>
              <svg className="h-4 w-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-700 bg-neutral-900 shadow-lg py-2 text-sm">
                <div className="px-4 pb-2 text-[10px] uppercase tracking-wider text-neutral-500">
                  Connected wallet
                </div>
                <div className="px-4 pb-3 text-sm font-medium text-white flex items-center justify-between">
                  {shortAddress}
                  <button type="button" onClick={handleCopy} className="ml-auto text-neutral-400 hover:text-white transition-colors flex items-center">
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    disconnect();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </nav>
  );
};

export default Header;
