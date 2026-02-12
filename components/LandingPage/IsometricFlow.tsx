
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * REUSABLE ISOMETRIC CARD COMPONENT
 */
const IsometricCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  extra?: string;
  accent?: string;
  isLarge?: boolean;
  isComplete?: boolean;
  delay?: number;
  tokens?: string;
  rep?: string;
}> = ({ icon, title, subtitle, extra, accent = "#333333", isLarge, isComplete, delay = 0, tokens, rep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`relative group shrink-0 ${isLarge ? 'w-44 h-32 md:w-52 md:h-40' : 'w-36 h-28 md:w-40 md:h-32'}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className="absolute inset-0 bg-[#1A1A1A] border-2 rounded-lg p-3 flex flex-col justify-between transition-all duration-300"
        style={{
          transform: 'rotateX(15deg) rotateY(-5deg)',
          borderColor: accent,
          boxShadow: `8px 8px 0px 0px ${accent}22`,
        }}
      >
        <div className="flex justify-between items-start">
          <span className={`${isLarge ? 'text-2xl' : 'text-xl'}`}>{icon}</span>
          {isComplete && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-5 h-5 bg-[#00FF94] rounded-full flex items-center justify-center text-[#0A0A0A] text-[10px] font-bold"
            >
              ✓
            </motion.div>
          )}
          {rep && (
            <div className="text-[8px] text-[#FF6B35] font-bold flex items-center gap-0.5">
              ⭐ {rep}
            </div>
          )}
        </div>
        <div>
          <h4 className={`headline font-bold leading-none tracking-tight ${isLarge ? 'text-sm' : 'text-[11px]'} uppercase`}>{title}</h4>
          <p className="text-[9px] text-[#F5F5F5]/60 font-mono mt-1 leading-tight">{subtitle}</p>
          {tokens && <p className="text-[10px] text-[#00FF94] font-mono mt-1 font-bold">{tokens}</p>}
          {extra && <p className="text-[9px] text-[#F5F5F5]/40 font-mono mt-0.5 italic">{extra}</p>}
        </div>
      </div>
      
      {/* Tooltip on Hover */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#0A0A0A] border border-[#333333] px-2 py-1 rounded text-[8px] whitespace-nowrap z-50 inter-label uppercase tracking-widest text-[#F5F5F5]/60">
        tx: 0x{Math.random().toString(16).slice(2, 10)}...{Math.random().toString(16).slice(2, 6)}
      </div>
    </motion.div>
  );
};

/**
 * ANIMATED ARROW COMPONENT
 */
const TokenArrow: React.FC<{
  delay: number;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  className?: string;
  isBranch?: boolean;
}> = ({ delay, className = "flex-1" }) => {
  return (
    <div className={`${className} h-px relative flex items-center mx-2`}>
      <svg className="w-full h-4 overflow-visible">
        <motion.path
          d="M 0 8 L 100% 8"
          stroke="#333333"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay }}
        />
        <motion.circle
          r="2.5"
          fill="#00FF94"
          initial={{ cx: "0%" }}
          animate={{ cx: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: delay + 0.5,
          }}
        />
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: delay + 0.5 }}
          className="text-[8px] fill-[#00FF94] font-mono"
          x="50%"
          y="20"
          textAnchor="middle"
        >
          $
        </motion.text>
      </svg>
    </div>
  );
};

const IsometricFlow: React.FC = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  if (!isInView) return <div ref={containerRef} className="h-[400px]" />;

  return (
    <div ref={containerRef} className="w-full relative py-12">
      {/* DESKTOP VIEW */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-7xl mx-auto gap-1">
        
        {/* STAGE 1: USER */}
        <IsometricCard 
          icon="👤"
          title="USER INPUT"
          subtitle='"Build landing page"'
          tokens="100 tokens"
          accent="#333333"
          delay={0}
        />

        <TokenArrow delay={0.3} className="w-16" />

        {/* STAGE 2: ESCROW */}
        <IsometricCard 
          icon="🔒"
          title="ESCROW"
          subtitle="Contract Locked"
          tokens="100 tokens"
          accent="#333333"
          delay={0.5}
        />

        <TokenArrow delay={0.8} className="w-16" />

        {/* STAGE 3: MASTER */}
        <IsometricCard 
          icon="🤖"
          title="MASTER AGENT"
          subtitle="Coordinator"
          rep="850/1000"
          tokens="Fee: 15 tokens"
          accent="#FF6B35"
          isLarge
          delay={1.0}
        />

        <TokenArrow delay={1.3} className="w-16" />

        {/* STAGE 4: WORKERS (Radial Stack) */}
        <div className="flex flex-col gap-4 relative">
          <div className="flex gap-4">
             <IsometricCard 
                icon="📊" title="RESEARCH" subtitle="Market Analysis" 
                tokens="10 tokens" accent="#00FF94" delay={1.5} isComplete />
             <IsometricCard 
                icon="✍️" title="CONTENT" subtitle="Copywriting" 
                tokens="25 tokens" accent="#00FF94" delay={1.8} isComplete />
          </div>
          <div className="flex gap-4 ml-8">
             <IsometricCard 
                icon="📈" title="ANALYST" subtitle="Strategy" 
                tokens="20 tokens" accent="#00FF94" delay={2.1} isComplete />
             <IsometricCard 
                icon="💻" title="CODE" subtitle="React Dev" 
                tokens="30 tokens" accent="#00FF94" delay={2.4} isComplete />
          </div>
        </div>

        <TokenArrow delay={4.2} className="w-16" />

        {/* STAGE 5: COMPLETION */}
        <IsometricCard 
          icon="✅"
          title="COMPLETE"
          subtitle="Agents Paid"
          tokens="User Ref: 15t"
          extra="Atomic Settlement"
          accent="#00FF94"
          delay={4.5}
        />
      </div>

      {/* MOBILE / TABLET VIEW (Stack) */}
      <div className="flex lg:hidden flex-col items-center gap-8 w-full">
        <IsometricCard icon="👤" title="USER" subtitle="Input Task" tokens="100t" delay={0} />
        <div className="h-12 w-px bg-dashed border-l border-[#333333]" />
        
        <IsometricCard icon="🔒" title="ESCROW" subtitle="Locked" tokens="100t" accent="#333333" delay={0.5} />
        <div className="h-12 w-px bg-dashed border-l border-[#333333]" />
        
        <IsometricCard icon="🤖" title="MASTER" subtitle="Coordinator" tokens="15t fee" accent="#FF6B35" isLarge delay={1} />
        <div className="h-12 w-px bg-dashed border-l border-[#333333]" />

        <div className="grid grid-cols-2 gap-4">
            {/* Fix: Removed invalid 'size' prop from IsometricCard components on lines 216-219 */}
            <IsometricCard icon="📊" title="RES" subtitle="10t" accent="#00FF94" delay={1.5} isComplete />
            <IsometricCard icon="✍️" title="CNT" subtitle="25t" accent="#00FF94" delay={1.8} isComplete />
            <IsometricCard icon="📈" title="ANA" subtitle="20t" accent="#00FF94" delay={2.1} isComplete />
            <IsometricCard icon="💻" title="COD" subtitle="30t" accent="#00FF94" delay={2.4} isComplete />
        </div>

        <div className="h-12 w-px bg-dashed border-l border-[#333333]" />
        <IsometricCard icon="✅" title="DONE" subtitle="Settled" accent="#00FF94" delay={4.5} />
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#333333]/20 to-transparent -z-10" />
    </div>
  );
};

export default IsometricFlow;
