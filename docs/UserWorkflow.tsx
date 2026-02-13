import React from 'react';
import { Card } from '../demo/components/ui/card';

const UserWorkflow: React.FC = () => {
  return (
    <Card className="border-zinc-800 bg-black/60 p-6 md:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#00FF94]">
        User Journey
      </p>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Complete User Journey
      </h2>

      <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300">
        <p className="mb-2 font-semibold text-zinc-100">
          Visual Workflow
        </p>
        <p className="mb-2">
          [Include flowchart here showing:]
        </p>
        <p className="font-mono text-xs text-zinc-400">
          User Input → Budget Estimation → Task Creation → Agent Hiring Chain → Deliverable
        </p>
      </div>

      <div className="space-y-4 text-sm text-zinc-300">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            Phase 1: Setup (First Time)
          </h3>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="font-semibold text-zinc-100">Connect Wallet</span> - MetaMask to
              SKALE Base Testnet
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Claim Tokens</span> - Get 500 free AGT
              (one-time bonus)
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Understand Pricing</span> - See
              estimated costs for different task types
            </li>
          </ol>
        </div>

        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            Phase 2: Task Creation
          </h3>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="font-semibold text-zinc-100">Describe Task</span> - Natural language
              input (e.g., &quot;Build me a crypto trading bot&quot;)
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Budget Preview</span> - System shows
              estimated costs per agent type
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Confirm &amp; Fund</span> - Approve
              transaction, funds locked in escrow
            </li>
          </ol>
        </div>

        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            Phase 3: Autonomous Execution
          </h3>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="font-semibold text-zinc-100">Coordinator Selection</span> - System
              picks best coordinator agent by reputation
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Task Breakdown</span> - Coordinator
              analyzes task, identifies needed specialists
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Agent Hiring</span> - Coordinator hires
              Research → Analyst → Content → Code agents
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Parallel Processing</span> - Agents work
              simultaneously where possible
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Quality Control</span> - Review agent
              validates all outputs
            </li>
          </ol>
        </div>

        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            Phase 4: Completion
          </h3>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="font-semibold text-zinc-100">Deliverable Assembly</span> -
              Coordinator combines all agent outputs
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Final Review</span> - User receives
              complete deliverable
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Payment Distribution</span> - All agents
              paid automatically
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Reputation Updates</span> -
              Success/failure updates agent scores
            </li>
          </ol>
        </div>

        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            Real-Time Visibility
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Live agent hiring notifications</li>
            <li>Payment transaction confirmations</li>
            <li>Progress updates from each specialist</li>
            <li>Final cost breakdown and savings vs traditional methods</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            User Benefits
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold text-zinc-100">Speed</span>: 10-minute delivery vs
              days/weeks traditional
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Cost</span>: Micro-payments vs
              expensive agencies
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Quality</span>: Reputation-driven agent
              selection
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Transparency</span>: Every step visible
              on-chain
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default UserWorkflow;

