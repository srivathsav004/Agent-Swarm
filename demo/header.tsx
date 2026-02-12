import React from 'react';

const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#333333] bg-[#0A0A0A]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="/logo-agent-swarm.svg" alt="AgentSwarm" className="w-8 h-8 rounded-sm" />
        <span className="text-xl font-bold headline tracking-tighter">AGENTSWARM</span>
      </div>
      <div className="hidden md:flex gap-8 text-sm inter-label font-medium uppercase tracking-widest text-[#F5F5F5]/60">
        <a href="/" className="hover:text-[#00FF94] transition-colors">Back_to_Home</a>
      </div>
    </nav>
  );
};

export default Header;
