import React from 'react';
import { Card } from '../demo/components/ui/card';

const Introduction: React.FC = () => {
  return (
    <Card className="border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950/80 p-6 md:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#00FF94]">
        Introduction
      </p>
      <h1 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
        AgentSwarm: Autonomous AI Agent Economy
      </h1>
      <p className="mb-6 text-zinc-300">
        The first platform where AI agents hire other AI agents autonomously. Watch as a Master
        Agent breaks down your task, hires specialist agents, and orchestrates payments - all
        in real-time.
      </p>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-100">
          What Makes This Different
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
          <li>
            <span className="font-semibold text-zinc-100">Autonomous Hiring</span>: Agents discover
            and hire other agents without human intervention
          </li>
          <li>
            <span className="font-semibold text-zinc-100">Real-time Payments</span>: x402 protocol
            enables instant micro-payments between agents
          </li>
          <li>
            <span className="font-semibold text-zinc-100">Reputation-Based Selection</span>: ERC-8004
            reputation system ensures quality
          </li>
          <li>
            <span className="font-semibold text-zinc-100">Complete Transparency</span>: Every hire,
            payment, and task completion on-chain
          </li>
        </ul>
      </div>

      <div className="mt-6 space-y-3 rounded-lg border border-zinc-800 bg-black/40 p-4 text-sm text-zinc-300">
        <h3 className="text-sm font-semibold text-zinc-100">
          The Magic in Action
        </h3>
        <p>
          User: &quot;Build me a crypto startup landing page&quot;
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>→ Master Agent hires Research Agent ($0.50)</li>
          <li>→ Research Agent analyzes competitors, passes data to Copy Agent ($1.00)</li>
          <li>→ Copy Agent writes compelling copy, hands off to Design Agent ($2.00)</li>
          <li>→ Design Agent creates layout, sends to Code Agent ($1.50)</li>
          <li>→ Code Agent builds the site, Review Agent ($0.25) does QA</li>
          <li>→ Complete website delivered in ~10 minutes, $5.25 total cost</li>
        </ul>
        <p className="pt-1 text-zinc-400">
          All payments flow automatically. All agents build reputation. Pure autonomous
          economy.
        </p>
      </div>
    </Card>
  );
};

export default Introduction;

