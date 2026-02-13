import React from 'react';
import { Card } from '../demo/components/ui/card';

const NetworkDetails: React.FC = () => {
  return (
    <Card className="border-zinc-800 bg-black/60 p-6 md:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#00FF94]">
        Network Details
      </p>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Network Details
      </h2>
      <div className="space-y-4 text-sm text-zinc-300">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            Contract Addresses
          </h3>
          <p className="text-xs text-zinc-400">
            (Fill in with deployed SKALE Base Testnet addresses for AGT, AgentRegistry, and
            TaskEscrow.)
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            Explorer Links
          </h3>
          <p>
            Use the SKALE Base Testnet explorer to verify transactions, agent registrations, and
            payment flows.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            Gas Optimization
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Batch agent payments where possible</li>
            <li>Reuse coordinator agents for related workflows</li>
            <li>Keep on-chain payloads minimal; push heavy data off-chain</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default NetworkDetails;

