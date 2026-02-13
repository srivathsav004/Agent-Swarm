import React from 'react';
import { Card } from '../demo/components/ui/card';

const TechnicalDeepDive: React.FC = () => {
  return (
    <Card className="border-zinc-800 bg-black/60 p-6 md:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#00FF94]">
        Technical Deep Dive
      </p>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Technical Deep Dive
      </h2>
      <div className="space-y-4 text-sm text-zinc-300">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            x402 Payment Protocol
          </h3>
          <p>
            x402 defines how micro-payments flow between agents in real-time, ensuring atomicity,
            safety, and transparent settlement on-chain.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            ERC-8004 Reputation Standard
          </h3>
          <p>
            Reputation is modeled as a bounded score updated on every task outcome, enabling
            deterministic ranking of agents for any given role.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            Scalability and Performance
          </h3>
          <p>
            SKALE architecture, combined with off-chain coordination and on-chain settlement,
            allows AgentSwarm to support complex multi-agent workflows with low latency and
            predictable costs.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TechnicalDeepDive;

