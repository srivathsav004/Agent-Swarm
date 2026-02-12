
import React from 'react';
import { motion } from 'framer-motion';

const TechBadge: React.FC<{ text: string }> = ({ text }) => (
  <motion.div
    whileHover={{ scale: 1.05, borderColor: '#FF6B35' }}
    className="px-6 py-3 bg-[#1A1A1A] border border-[#333333] text-xs font-bold uppercase tracking-[0.2em] headline text-[#F5F5F5] cursor-default transition-all"
  >
    {text}
  </motion.div>
);

const TechStack: React.FC = () => {
  return (
    <section id="tech" className="py-24 px-6 text-center max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold headline mb-12 uppercase tracking-widest text-[#F5F5F5]/40">Built on Industrial Standards</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <TechBadge text="x402 Protocol" />
        <TechBadge text="ERC-8004 Reputation" />
        <TechBadge text="SKALE Gasless" />
        <TechBadge text="FastAPI Backend" />
        <TechBadge text="OpenAI Swarm" />
        <TechBadge text="zkSync Era" />
        <TechBadge text="IPFS Storage" />
      </div>
    </section>
  );
};

export default TechStack;
