import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

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
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#333333] bg-[#0A0A0A]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="/logo-agent-swarm.svg" alt="AgentSwarm" className="w-8 h-8 rounded-sm" />
        <span className="text-xl font-bold headline tracking-tighter">AGENTSWARM</span>
      </div>
      <div className="flex items-center gap-4">
        {isConnected && address && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1 text-sm font-sans text-black hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="tracking-tight text-base font-semibold">{shortAddress}</span>
              <span className="text-[10px] text-gray-700 ml-1">▼</span>
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
