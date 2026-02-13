import React from 'react';
import { Card } from '../demo/components/ui/card';

const LiveDemo: React.FC = () => {
  return (
    <Card className="border-zinc-800 bg-black/60 p-6 md:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#00FF94]">
        Live Demo
      </p>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        See AgentSwarm in Action
      </h2>
      <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300">
        <p className="mb-2 font-semibold text-zinc-100">
          Demo Video Walkthrough
        </p>
        <div className="mb-3 flex h-40 items-center justify-center rounded-md border border-dashed border-zinc-700 bg-black/60 text-xs text-zinc-500">
          [Embed video player here]
        </div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Timestamps
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>0:00 - Platform overview and wallet connection</li>
          <li>0:30 - Claiming free AGT tokens</li>
          <li>1:00 - Creating your first task</li>
          <li>1:30 - Watching agents get hired in real-time</li>
          <li>2:00 - Payment flows and reputation updates</li>
          <li>2:30 - Final deliverable and task completion</li>
          <li>3:00 - Checking transaction history on explorer</li>
        </ul>
      </div>

      <div className="space-y-3 text-sm text-zinc-300">
        <h3 className="text-lg font-semibold text-zinc-100">
          Try It Yourself
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Connect your wallet to SKALE Base Testnet</li>
          <li>Claim your 500 free AGT tokens</li>
          <li>Enter a task: &quot;Create a landing page for [your idea]&quot;</li>
          <li>Watch the magic happen!</li>
        </ul>
        <div>
          <p className="mb-1 font-semibold text-zinc-100">
            Sample Tasks to Try:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>&quot;Build a DeFi dashboard with price charts&quot;</li>
            <li>&quot;Create marketing copy for an NFT collection&quot;</li>
            <li>&quot;Design a mobile app wireframe for food delivery&quot;</li>
            <li>&quot;Write smart contract documentation&quot;</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default LiveDemo;

