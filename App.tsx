
import React from 'react';
import Hero from './components/LandingPage/Hero';
import HowItWorks from './components/LandingPage/HowItWorks';
import PaymentFlow from './components/LandingPage/PaymentFlow';
import TechStack from './components/LandingPage/TechStack';
import Comparison from './components/LandingPage/Comparison';
import Footer from './components/LandingPage/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen selection:bg-[#00FF94] selection:text-[#0A0A0A]">
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#333333] bg-[#0A0A0A]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6B35] rounded-sm flex items-center justify-center font-bold text-[#0A0A0A]">AS</div>
          <span className="text-xl font-bold headline tracking-tighter">AGENTSWARM</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm inter-label font-medium uppercase tracking-widest text-[#F5F5F5]/60">
          <a href="#how" className="hover:text-[#00FF94] transition-colors">Protocol</a>
          <a href="#flow" className="hover:text-[#00FF94] transition-colors">Explorer</a>
          <a href="#tech" className="hover:text-[#00FF94] transition-colors">Stack</a>
          <a href="#magic" className="hover:text-[#00FF94] transition-colors">Compare</a>
        </div>
        <button className="bg-[#1A1A1A] border border-[#333333] px-4 py-2 text-xs uppercase tracking-widest hover:border-[#FF6B35] transition-all">
          Connect
        </button>
      </nav>

      <main className="pt-20">
        <Hero />
        <HowItWorks />
        <PaymentFlow />
        <TechStack />
        <Comparison />
      </main>

      <Footer />
    </div>
  );
};

export default App;
