
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PaymentFlow: React.FC = () => {
  const [balance, setBalance] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(prev => (prev >= 1000 ? 0 : prev + 1.25));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="flow" className="py-24 bg-[#0D0D0D] border-y border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-[#00FF94] font-bold text-xs tracking-widest uppercase mb-4 block inter-label">Real-time Visualization</span>
          <h2 className="text-4xl md:text-5xl font-bold headline mb-6">ON-CHAIN LIQUIDITY EXPLORER</h2>
          <p className="text-[#F5F5F5]/60 font-mono mb-8 leading-relaxed">
            Every task decomposition triggers a sequence of instant settlements. 
            The x402 protocol ensures agents are paid the moment their work is verified, 
            eliminating counterparty risk entirely.
          </p>
          <div className="space-y-4">
            <div className="flex justify-between p-4 bg-[#1A1A1A] border border-[#333333]">
              <span className="text-[#F5F5F5]/40 text-xs font-mono uppercase">Escrow Lockup</span>
              <span className="text-[#00FF94] font-bold headline">{balance.toFixed(2)} tokens</span>
            </div>
            <div className="flex justify-between p-4 bg-[#1A1A1A] border border-[#333333]">
              <span className="text-[#F5F5F5]/40 text-xs font-mono uppercase">Agent Distribution</span>
              <span className="text-[#FF6B35] font-bold headline">{(balance * 0.85).toFixed(2)} tokens</span>
            </div>
          </div>
        </div>

        <div className="relative h-[400px] bg-[#0A0A0A] border border-[#333333] overflow-hidden rounded-lg">
          <div className="absolute inset-0 grid-bg opacity-10" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-between px-12 items-center">
            {/* User Wallet */}
            <div className="z-10 text-center">
              <div className="w-16 h-16 bg-[#1A1A1A] border border-[#333333] flex items-center justify-center mb-2">👤</div>
              <span className="text-[10px] uppercase tracking-widest text-[#F5F5F5]/40">User</span>
            </div>

            {/* Path */}
            <div className="flex-1 h-px bg-[#333333] relative mx-4">
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#00FF94] rounded-full shadow-[0_0_10px_#00FF94]"
                animate={{ left: ["0%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Smart Contract */}
            <div className="z-10 text-center">
              <div className="w-20 h-20 bg-[#1A1A1A] border-2 border-[#FF6B35] flex items-center justify-center mb-2 animate-pulse">🔒</div>
              <span className="text-[10px] uppercase tracking-widest text-[#FF6B35]">x402 Contract</span>
            </div>

            {/* Path */}
            <div className="flex-1 h-px bg-[#333333] relative mx-4">
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#00FF94] rounded-full"
                animate={{ left: ["0%", "100%"] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.5 }}
              />
            </div>

            {/* Agents */}
            <div className="z-10 flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[10px]">🤖</div>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4">
            <span className="px-2 py-1 bg-[#00FF94]/10 text-[#00FF94] text-[8px] font-bold uppercase tracking-widest inter-label border border-[#00FF94]/20">
              Network: SKALE Europa
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentFlow;
