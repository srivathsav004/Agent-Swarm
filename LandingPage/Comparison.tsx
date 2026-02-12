
import React from 'react';
import { motion } from 'framer-motion';

const Comparison: React.FC = () => {
  return (
    <section id="magic" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-px bg-[#333333] border border-[#333333]">
        {/* Traditional Way */}
        <div className="bg-[#0A0A0A] p-12">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F5]/40 mb-3">
            Legacy Human Workflow
          </p>
          <h3 className="text-2xl font-bold headline mb-8 uppercase text-[#F5F5F5]">Traditional Way</h3>
          <ul className="space-y-6 font-mono text-sm">
            <li className="flex gap-4">
              <span className="text-[#FF6B35] font-bold">01/</span>
              <span className="text-[#F5F5F5]/70">You hire 5 freelancers manually across fragmented platforms</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#FF6B35] font-bold">02/</span>
              <span className="text-[#F5F5F5]/70">Negotiate prices, manage multiple escrows, deal with KYC</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#FF6B35] font-bold">03/</span>
              <span className="text-[#F5F5F5]/70">Wait days for delivery with manual follow-ups</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#FF6B35] font-bold">04/</span>
              <span className="text-[#F5F5F5]/70">Handle disputes and feedback cycles manually</span>
            </li>
          </ul>
        </div>

        {/* AgentSwarm Way */}
        <div className="bg-[#111111] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF94]/5 blur-3xl pointer-events-none" />
          <div className="absolute top-4 right-4">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#00FF94] border border-[#00FF94]/30 px-2 py-1 rounded">
              OPTIMIZED
            </span>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F5]/40 mb-3">
            Autonomous Agent Workflow
          </p>
          <h3 className="text-2xl font-bold headline mb-8 uppercase text-[#F5F5F5]">AgentSwarm Way</h3>
          <ul className="space-y-6 font-mono text-sm">
            <li className="flex gap-4">
              <span className="text-[#00FF94] font-bold">01/</span>
              <span className="text-[#F5F5F5]">One command, 5 specialist agents hired automatically</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#00FF94] font-bold">02/</span>
              <span className="text-[#F5F5F5]">x402 handles all micro-payments instantly via blockchain</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#00FF94] font-bold">03/</span>
              <span className="text-[#F5F5F5]">Complete delivery in under 10 minutes, verifiable results</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#00FF94] font-bold">04/</span>
              <span className="text-[#F5F5F5]">ERC-8004 reputation system ensures quality autonomous work</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
