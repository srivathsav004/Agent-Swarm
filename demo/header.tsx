import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAgentBalances } from './useAgentBalances';
import { formatUnits } from 'viem';

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const { balances, loading, refresh, hasClaimed, claimLoading, claimFreeCredits, error } = useAgentBalances();

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
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#333333] bg-[#0A0A0A]/80 backdrop-blur-md px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src="/logo-agent-swarm.svg" alt="AgentSwarm" className="w-8 h-8 rounded-sm" />
        <div className="flex flex-col">
          <span className="text-xl font-bold headline tracking-tighter">AGENTSWARM</span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-[#F5F5F5]/40 font-mono">
            x402 Budget-Based Agent Payments
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isConnected && (
          <div className="flex items-center gap-3">
            {/* Show free claim banner for first-time users */}
            {hasClaimed === false && !loading && (
              <div className="flex items-center gap-3 rounded-2xl border border-[#FFB800] bg-gradient-to-r from-[#FFB800]/10 to-[#FF9500]/10 backdrop-blur-sm px-3 py-2 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FFB800] to-[#FF9500]" />
                  <span className="text-[9px] text-[#FFB800] mt-1 uppercase tracking-wider">Free</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-[#FFB800] leading-tight">500 AGENT</span>
                  <span className="text-[9px] text-[#666] uppercase tracking-wider">Credits Available</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Claim button clicked, address:', address);
                    claimFreeCredits();
                  }}
                  disabled={claimLoading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FF9500] px-3 py-1.5 text-xs font-bold text-white hover:from-[#FF9500] hover:to-[#FF8800] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="flex items-center gap-2 rounded-xl border border-red-500 bg-red-500/10 px-3 py-1.5">
                <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#0F0F0F]/60 backdrop-blur-sm px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-[#00FF94] animate-pulse delay-150" />
                </div>
                <span className="text-sm text-[#A3A3A3] font-medium">Loading...</span>
              </div>
            ) : balances ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#A3A3A3] font-medium">Wallet:</span>
                  <div className="flex items-center gap-2 rounded-xl bg-[#00FF94]/10 px-3 py-1.5 border border-[#00FF94]/20 hover:bg-[#00FF94]/15 transition-all duration-200 cursor-pointer" onClick={refresh} title="Click to refresh balances">
                    <img src="/agent-token.jpg" alt="AGENT" className="w-5 h-5 rounded-full" />
                    <span className="text-sm font-bold text-[#00FF94]">
                      {Number(formatUnits(balances.walletToken, balances.decimals)).toFixed(0)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#A3A3A3] font-medium">Escrow:</span>
                  <div className="flex items-center gap-2 rounded-xl bg-[#FFB800]/10 px-3 py-1.5 border border-[#FFB800]/20 hover:bg-[#FFB800]/15 transition-all duration-200 cursor-pointer" onClick={refresh} title="Click to refresh balances">
                    <img src="/agent-token.jpg" alt="AGENT" className="w-5 h-5 rounded-full" />
                    <span className="text-sm font-bold text-[#FFB800]">
                      {Number(formatUnits(balances.escrowAllowance, balances.decimals)).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#0F0F0F]/60 backdrop-blur-sm px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-[#FF4444]" />
                <span className="text-sm text-[#A3A3A3] font-medium">Balance unavailable</span>
              </div>
            )}
          </div>
        )}

        {isConnected && address && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#0F0F0F]/60 backdrop-blur-sm px-3 py-2 hover:bg-[#1A1A1A]/60 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 group-hover:from-gray-300 group-hover:to-gray-500 transition-all">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 003-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-[#F5F5F5] leading-tight">{shortAddress}</span>
                <span className="text-[9px] text-[#666] uppercase tracking-wider">Connected</span>
              </div>
              <svg className="h-4 w-4 text-[#666] group-hover:text-[#F5F5F5] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-700 bg-[#1a1a1a] shadow-lg py-2 text-xs font-sans text-white">
                <div className="px-4 pb-2 text-[10px] uppercase tracking-[0.12em] text-gray-400">
                  Connected wallet
                </div>
                <div className="px-4 pb-3 text-base font-medium text-white flex items-center justify-between">
                  {shortAddress}
                  <button type="button" onClick={handleCopy} className="ml-auto text-gray-400 hover:text-white transition-colors flex items-center">
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00FF94]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
                  className="w-full text-left px-4 py-2 text-base text-red-400 hover:bg-red-500/20 transition-colors"
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
