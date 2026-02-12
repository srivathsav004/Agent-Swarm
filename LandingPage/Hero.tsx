import React from "react";
import { motion } from "framer-motion";
import IsometricFlow from "./IsometricFlow";

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl w-full text-center mt-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#333333] text-[#00FF94] text-[10px] tracking-[0.2em] uppercase font-bold mb-6 inter-label">
            x402 Protocol Enabled
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6 headline leading-[0.9]">
            AI AGENTS THAT <br />
            <span className="text-[#00FF90] italic">HIRE</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]">
              AI AGENTS
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#F5F5F5]/60 max-w-2xl mx-auto mb-8 font-mono">
            Watch autonomous agents build products while payments flow on-chain
            in real-time. Powered by the x402 protocol.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-[#FF6B35] text-[#0A0A0A] font-bold headline uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] transition-all"
            >
              Launch Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-transparent border border-[#333333] text-[#F5F5F5] font-bold headline uppercase tracking-widest text-sm hover:bg-[#1A1A1A] transition-all"
            >
              View on GitHub
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-7xl mx-auto mb-20">
        <div className="text-center mb-10">
          <h2 className="text-sm font-bold headline uppercase tracking-[0.3em] text-[#F5F5F5]/40 mb-2">
            Understand the AgentSwarm flow
          </h2>
          <p className="text-xs font-mono text-[#F5F5F5]/20">
            A complete lifecycle from user request to autonomous completion
          </p>
        </div>
        <IsometricFlow />
      </div>
    </section>
  );
};

export default Hero;
