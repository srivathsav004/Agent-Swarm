import React from 'react';
import Header from './header';

const Demo: React.FC = () => {
  return (
    <div className="min-h-screen selection:bg-[#00FF94] selection:text-[#0A0A0A]">
      <Header />

      <main className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 headline leading-[0.9] text-[#F5F5F5]">
            DEMO
          </h1>
          <p className="text-lg text-[#F5F5F5]/60 max-w-2xl mx-auto font-mono">
            Demo page - Coming soon
          </p>
        </div>
      </main>
    </div>
  );
};

export default Demo;