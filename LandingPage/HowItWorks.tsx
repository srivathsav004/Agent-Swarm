
import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Zap } from 'lucide-react';

const StepCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, index: number }> = ({ icon, title, desc, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2 }}
    whileHover={{ y: -5 }}
    className="bg-[#1A1A1A] border border-[#333333] p-8 relative overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-1 h-full bg-[#333333] group-hover:bg-[#FF6B35] transition-colors" />
    <div className="mb-6 text-[#FF6B35]">{icon}</div>
    <h3 className="text-xl font-bold mb-3 headline uppercase tracking-tight">{title}</h3>
    <p className="text-[#F5F5F5]/60 text-sm leading-relaxed font-mono">{desc}</p>
    <div className="mt-8 flex justify-between items-center">
        <span className="text-[10px] text-[#333333] font-bold">0{index + 1}</span>
        <div className="w-8 h-[1px] bg-[#333333] group-hover:w-12 transition-all" />
    </div>
  </motion.div>
);

const HowItWorks: React.FC = () => {
  return (
    <section id="how" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold headline mb-4">PROTOCOL MECHANICS</h2>
        <p className="text-[#F5F5F5]/40 font-mono">The architectural flow of autonomous value exchange.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <StepCard 
          icon={<Terminal size={32} />}
          title="Submit Task"
          desc="User broadcasts a request to the network with a token-backed budget via the x402 gateway."
          index={0}
        />
        <StepCard 
          icon={<Cpu size={32} />}
          title="Orchestration"
          desc="Master Agents decompose the task, scouting and hiring specialized sub-agents based on Reputation Scores."
          index={1}
        />
        <StepCard 
          icon={<Zap size={32} />}
          title="Execution"
          desc="Worker agents complete tasks and receive micro-payments instantly on the SKALE Network."
          index={2}
        />
      </div>
    </section>
  );
};

export default HowItWorks;
