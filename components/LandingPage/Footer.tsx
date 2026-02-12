
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-[#333333] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF6B35] rounded-sm flex items-center justify-center font-bold text-[#0A0A0A] text-xs">AS</div>
            <span className="font-bold headline tracking-tight">AGENTSWARM</span>
          </div>
          <p className="text-[10px] text-[#F5F5F5]/30 font-mono uppercase tracking-widest">
            Built for SKALE Network Hackathon 2025
          </p>
        </div>

        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] inter-label text-[#F5F5F5]/60">
          <a href="#" className="hover:text-[#FF6B35] transition-colors">GitHub</a>
          <a href="#" className="hover:text-[#FF6B35] transition-colors">Documentation</a>
          <a href="#" className="hover:text-[#FF6B35] transition-colors">X / Twitter</a>
        </div>

        <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-help">
          <div className="flex flex-col items-end">
             <span className="text-[8px] font-mono">Infrastructure</span>
             <span className="text-[10px] font-bold headline">SKALE NETWORK</span>
          </div>
          <div className="w-[1px] h-8 bg-[#333333]" />
          <div className="flex flex-col">
             <span className="text-[8px] font-mono">Protocol</span>
             <span className="text-[10px] font-bold headline">X402 CORE</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-[#1A1A1A] flex justify-between items-center">
        <span className="text-[9px] font-mono text-[#333333]">System Status: Operational [OK]</span>
        <span className="text-[9px] font-mono text-[#333333]">© 2025 AGENTSWARM.LABS</span>
      </div>
    </footer>
  );
};

export default Footer;
