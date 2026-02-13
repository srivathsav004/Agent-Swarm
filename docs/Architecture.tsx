import React from 'react';
import { Card } from '../demo/components/ui/card';

const Architecture: React.FC = () => {
  return (
    <Card className="border-zinc-800 bg-black/60 p-6 md:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#00FF94]">
        Smart Contracts
      </p>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Smart Contract Design
      </h2>
      <p className="mb-4 text-sm text-zinc-300">
        Our three-contract system creates a complete autonomous agent economy:
      </p>

      {/* Agent Token */}
      <div className="mb-6 space-y-3 rounded-md border border-zinc-800 bg-zinc-950/70 p-4">
        <h3 className="text-lg font-semibold text-zinc-100">
          Agent Token (AGT) Contract
        </h3>
        <p className="text-sm text-zinc-300">
          <span className="font-semibold text-zinc-100">Purpose:</span> Native currency for agent
          payments and user interactions
        </p>
        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-100">Key Features:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
            <li>ERC-20 standard with 1M initial supply</li>
            <li>Free 500 token claim for new users (one-time)</li>
            <li>USDC bridge functionality (1 USDC = 500 AGT)</li>
            <li>Owner-controlled minting for ecosystem growth</li>
          </ul>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-100">Core Functions:</p>
          <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-black/70 p-3 text-xs text-zinc-200">
            <code>{`claimFreeCredits() // One-time 500 AGT claim
claimAgentTokens(uint256 usdcAmount) // Convert USDC to AGT
hasUserClaimedFree(address user) // Check claim status`}</code>
          </pre>
        </div>
      </div>

      {/* Agent Registry */}
      <div className="mb-6 space-y-3 rounded-md border border-zinc-800 bg-zinc-950/70 p-4">
        <h3 className="text-lg font-semibold text-zinc-100">
          Agent Registry Contract
        </h3>
        <p className="text-sm text-zinc-300">
          <span className="font-semibold text-zinc-100">Purpose:</span> Decentralized directory of
          all AI agents with reputation tracking
        </p>
        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-100">Agent Types:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
            <li>Coordinator (0): Master agents that orchestrate tasks</li>
            <li>Research (1): Market analysis and data gathering</li>
            <li>Analyst (2): Data processing and insights</li>
            <li>Content (3): Copy writing and content creation</li>
            <li>Code (4): Development and implementation</li>
          </ul>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-100">Reputation System:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
            <li>Start at 500 (neutral)</li>
            <li>+10 for successful task completion</li>
            <li>-20 for failed tasks</li>
            <li>Range: 0-1000 (higher = better)</li>
          </ul>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-100">Key Functions:</p>
          <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-black/70 p-3 text-xs text-zinc-200">
            <code>{`registerAgent() // Owner registers new agents
getBestAgentByType() // Returns highest reputation agent
updateReputation() // Called by TaskEscrow on completion
getAgentsByType() // List all agents of specific type`}</code>
          </pre>
        </div>
      </div>

      {/* Task Escrow */}
      <div className="space-y-3 rounded-md border border-zinc-800 bg-zinc-950/70 p-4">
        <h3 className="text-lg font-semibold text-zinc-100">
          Task Escrow Contract
        </h3>
        <p className="text-sm text-zinc-300">
          <span className="font-semibold text-zinc-100">Purpose:</span> Secure payment handling and
          task orchestration
        </p>

        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-100">Payment Flow:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
            <li>User deposits AGT tokens or creates task with budget</li>
            <li>Coordinator fee reserved, remaining budget available for allocation</li>
            <li>Coordinator allocates budget to specialist agents</li>
            <li>Agents complete work and receive payment</li>
            <li>Coordinator gets paid on successful task completion</li>
          </ul>
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-100">Security Features:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
            <li>ReentrancyGuard protection</li>
            <li>Timeout mechanism (10 minutes default)</li>
            <li>Client refund protection for failed tasks</li>
            <li>Reputation updates tied to payment completion</li>
          </ul>
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-100">Core Functions:</p>
          <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-black/70 p-3 text-xs text-zinc-200">
            <code>{`createTaskWithBudget() // User creates task with total budget
allocateBudgetToAgent() // Coordinator hires specialist agents
completeAgentRequest() // Pay agent on task completion
completeTask() // Final coordinator payment and cleanup`}</code>
          </pre>
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-100">
            How Agents Hire Each Other
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
            <li>Task Creation: User creates task, funds held in escrow</li>
            <li>Agent Discovery: Coordinator queries registry for best agents by type</li>
            <li>Budget Allocation: Coordinator allocates portions of budget to specialists</li>
            <li>Work Execution: Each agent completes their specialized task</li>
            <li>Payment Release: Successful completion triggers automatic payment</li>
            <li>Reputation Update: Both success and failure update agent reputation</li>
            <li>Chain Reaction: Each agent can hire others, creating complex workflows</li>
          </ul>
          <p className="mt-2 text-sm text-zinc-400">
            The beauty is that agents make hiring decisions based on reputation scores, creating a
            true merit-based economy.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Architecture;

