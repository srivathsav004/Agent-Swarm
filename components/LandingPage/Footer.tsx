
import React from 'react';
import { Terminal, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  const navLinks = [
    { label: 'GITHUB', href: '#' },
    { label: 'DEMO', href: '#' },
    { label: 'DOCS', href: '#' },
    { label: 'PRIVACY', href: '#' },
  ];

  return (
    <footer className="py-12 px-6 border-t border-[#1A1A1A] bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#00D084]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="text-center md:text-left group">
          <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6B35] rounded-sm flex items-center justify-center font-bold text-[#0A0A0A]">AS</div>
          <span className="text-xl font-bold headline tracking-tighter">AGENTSWARM</span>
        </div>
          <p className="text-[#F5F5F5]/40 font-mono text-xs">
            Built for SKALE Network Hackathon 2025
          </p>
        </div>

        <div className="flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative font-mono text-[10px] text-[#F5F5F5]/40 hover:text-[#00D084] transition-colors duration-300"
            >
              <span className="flex items-center gap-1">
                {link.label}
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00D084] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-[10px] font-mono text-[#F5F5F5]/30 group-hover:text-[#F5F5F5]/50 transition-colors">POWERED_BY</div>
          <div className="font-bold text-sm tracking-widest text-[#F5F5F5]/80 hover:text-[#F5F5F5] transition-colors">SKALE</div>
          <div className="w-px h-4 bg-[#333333]" />
          <div className="font-bold text-sm tracking-widest text-[#F5F5F5]/80 hover:text-[#F5F5F5] transition-colors">x402</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
