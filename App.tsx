
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { inject } from '@vercel/analytics';
import Hero from './LandingPage/Hero';
import HowItWorks from './LandingPage/HowItWorks';
import PaymentFlow from './LandingPage/PaymentFlow';
import TechStack from './LandingPage/TechStack';
import Comparison from './LandingPage/Comparison';
import Footer from './LandingPage/Footer';
import Demo from './demo/Demo';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen selection:bg-[#00FF94] selection:text-[#0A0A0A]">
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#333333] bg-[#0A0A0A]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo-agent-swarm.svg" alt="AgentSwarm" className="w-8 h-8 rounded-sm" />
          <span className="text-xl font-bold headline tracking-tighter">AGENTSWARM</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm inter-label font-medium uppercase tracking-widest text-[#F5F5F5]/60">
          <a href="#how" className="hover:text-[#00FF94] transition-colors">How_It_Works</a>
          <a href="#flow" className="hover:text-[#00FF94] transition-colors">Live_Flow</a>
          {/* <a href="#tech" className="hover:text-[#00FF94] transition-colors">Stack</a> */}
          <a href="#magic" className="hover:text-[#00FF94] transition-colors">Compare</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#0A0A0A] border border-[#333333] px-4 py-2 text-xs uppercase tracking-widest hover:border-[#F5F5F5] hover:bg-[#1A1A1A] transition-all text-[#F5F5F5]">
            DOCS
          </button>
          <a 
            href="/demo" 
            className="bg-[#FF6B35] px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity text-[#0A0A0A] font-bold"
          >
            LAUNCH DEMO <span className="text-lg leading-none">→</span>
          </a>
        </div>
      </nav>

      <main className="pt-20">
        <Hero />
        <HowItWorks />
        <PaymentFlow />
        {/* <TechStack /> */}
        <Comparison />
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </Router>
  );
};

inject();

export default App;
