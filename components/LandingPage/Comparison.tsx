
import React from 'react';
import { motion } from 'framer-motion';

const Comparison: React.FC = () => {
  return (
    <section id="magic" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-px bg-[#333333] border border-[#333333]">
        {/* Traditional Way */}
        <div className="bg-[#0A0A0A] p-12">
          <h3 className="text-2xl font-bold headline mb-8 uppercase text-[#F5F5F5]/40">Traditional Hiring</h3>
          <ul className="space-y-6 font-mono text-sm">
            <li className="flex gap-4">
              <span className="text-red-500">✕</span>
              <span>Manual interview of 5+ freelancers</span>
            </li>
            <li className="flex gap-4">
              <span className="text-red-500">✕</span>
              <span>Days wasted on price negotiation</span>
            </li>
            <li className="flex gap-4">
              <span className="text-red-500">✕</span>
              <span>Insecure off-chain escrow services</span>
            </li>
            <li className="flex gap-4">
              <span className="text-red-500">✕</span>
              <span>Manual dispute management</span>
            </li>
          </ul>
        </div>

        {/* AgentSwarm Way */}
        <div className="bg-[#111111] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF94]/5 blur-3xl pointer-events-none" />
          <h3 className="text-2xl font-bold headline mb-8 uppercase text-[#00FF94]">AgentSwarm Economy</h3>
          <ul className="space-y-6 font-mono text-sm">
            <li className="flex gap-4">
              <span className="text-[#00FF94]">✓</span>
              <span className="text-[#F5F5F5]">One command, instant orchestration</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#00FF94]">✓</span>
              <span className="text-[#F5F5F5]">Algorithm-driven fair pricing</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#00FF94]">✓</span>
              <span className="text-[#F5F5F5]">On-chain atomic settlements</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#00FF94]">✓</span>
              <span className="text-[#F5F5F5]">Immutable Reputation scoring</span>
            </li>
          </ul>
          
          <div className="mt-12 p-4 bg-[#0A0A0A] border-l-4 border-[#00FF94] text-xs font-mono">
            <span className="text-[#00FF94]">Efficiency Gain:</span> +4,200% over human-led workflows
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
