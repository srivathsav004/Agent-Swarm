import React from 'react';
import { Card } from '../demo/components/ui/card';

const UserWorkflow: React.FC = () => {
  return (
    <Card className="border-zinc-800 bg-black/60 p-6 md:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#00FF94]">
        User Journey
      </p>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">
        How Agent Swarm Works
      </h2>

      {/* Main Flowchart */}
      <div className="relative">
        {/* User Input Stage */}
        <WorkflowStage
          number={1}
          title="Describe Your Task"
          icon={<MessageIcon />}
          color="from-blue-500/20 to-blue-600/20"
          borderColor="border-blue-500/50"
          steps={[
            'Enter natural language prompt',
            'Choose from example templates',
            'Define what you want built'
          ]}
        />

        <FlowArrow />

        {/* Cost Estimation Stage */}
        <WorkflowStage
          number={2}
          title="AI Selects Best Agents"
          icon={<TargetIcon />}
          color="from-purple-500/20 to-purple-600/20"
          borderColor="border-purple-500/50"
          steps={[
            'System scans Agent Registry on-chain',
            'Selects highest reputation agents',
            'Calculates total budget (AGT tokens)'
          ]}
        />

        <div className="my-4 rounded-lg border border-zinc-800 bg-zinc-950/80 p-3">
          <p className="text-xs text-zinc-400 mb-2 font-medium">Selected Agent Pipeline:</p>
          <div className="flex flex-wrap items-center gap-2">
            <AgentBadge type="Coordinator" color="bg-amber-500/20 border-amber-500/50" />
            <Arrow />
            <AgentBadge type="Research" color="bg-cyan-500/20 border-cyan-500/50" />
            <Arrow />
            <AgentBadge type="Analyst" color="bg-pink-500/20 border-pink-500/50" />
            <Arrow />
            <AgentBadge type="Content" color="bg-emerald-500/20 border-emerald-500/50" />
            <Arrow />
            <AgentBadge type="Code" color="bg-indigo-500/20 border-indigo-500/50" />
          </div>
        </div>

        <FlowArrow />

        {/* Token Management Stage */}
        <WorkflowStage
          number={3}
          title="Fund Your Escrow"
          icon={<WalletIcon />}
          color="from-green-500/20 to-green-600/20"
          borderColor="border-green-500/50"
          steps={[
            'Deposit AGT tokens to escrow (2 txs: approve + deposit)',
            'Or bridge USDC from Base → AGT on SKALE',
            'Funds locked until task completion'
          ]}
        />

        <FlowArrow />

        {/* Task Execution Stage */}
        <WorkflowStage
          number={4}
          title="Task Execution Pipeline"
          icon={<BoltIcon />}
          color="from-orange-500/20 to-orange-600/20"
          borderColor="border-orange-500/50"
        />

        {/* Detailed Execution Flow */}
        <div className="ml-8 mt-3 space-y-2">
          <ExecutionStep
            number="4a"
            title="Create Task"
            description="Coordinator agent hired • Budget transferred to escrow • Task recorded on-chain"
            status="on-chain"
          />
          
          <div className="ml-6 border-l-2 border-zinc-700 pl-4 space-y-2">
            <ExecutionStep
              number="1"
              title="Research Agent"
              description="Gathers information • Analyzes requirements • Produces research brief"
              status="execution"
            />
            <ExecutionStep
              number="2"
              title="Analyst Agent"
              description="Evaluates research • Identifies insights • Creates strategic recommendations"
              status="execution"
            />
            <ExecutionStep
              number="3"
              title="Content Agent"
              description="Crafts messaging • Writes copy • Structures content for output"
              status="execution"
            />
            <ExecutionStep
              number="4"
              title="Code Agent"
              description="Generates HTML/CSS • Builds deliverable • Produces final output"
              status="execution"
            />
          </div>

          <ExecutionStep
            number="4b"
            title="Complete Task"
            description="All agents paid from escrow • Reputation scores updated • Final deliverable ready"
            status="on-chain"
          />
        </div>

        <FlowArrow />

        {/* Deliverable Stage */}
        <WorkflowStage
          number={5}
          title="Receive Deliverable"
          icon={<SparkleIcon />}
          color="from-[#00FF94]/20 to-[#00FF94]/30"
          borderColor="border-[#00FF94]/50"
          steps={[
            'View rendered output in browser',
            'See complete execution history',
            'All transactions verifiable on SKALE Explorer'
          ]}
        />

        {/* Key Benefits */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <BenefitCard
            icon={<ClockIcon />}
            title="10 Minutes"
            description="vs days/weeks traditional"
          />
          <BenefitCard
            icon={<DollarIcon />}
            title="Micro-payments"
            description="Pay per task, no retainers"
          />
          <BenefitCard
            icon={<StarIcon />}
            title="Reputation"
            description="Best agents auto-selected"
          />
          <BenefitCard
            icon={<EyeIcon />}
            title="Transparent"
            description="Every step on-chain"
          />
        </div>
      </div>
    </Card>
  );
};

// Sub-components
const WorkflowStage: React.FC<{
  number: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  steps?: string[];
}> = ({ number, title, icon, color, borderColor, steps }) => (
  <div className={`rounded-xl border-2 ${borderColor} bg-gradient-to-r ${color} p-4`}>
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 border border-zinc-700">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
            {number}
          </span>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        {steps && (
          <ul className="mt-2 space-y-1 text-xs text-zinc-300">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#00FF94]">•</span>
                {step}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

const FlowArrow: React.FC = () => (
  <div className="flex justify-center py-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-zinc-600">
      <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const AgentBadge: React.FC<{ type: string; color: string }> = ({ type, color }) => (
  <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-white ${color}`}>
    {type}
  </span>
);

const Arrow: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-zinc-600">
    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExecutionStep: React.FC<{
  number: string;
  title: string;
  description: string;
  status: 'on-chain' | 'execution';
}> = ({ number, title, description, status }) => (
  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
    <div className="flex items-center gap-2">
      <span className={`flex h-5 w-5 items-center justify-center rounded text-xs font-bold ${
        status === 'on-chain' ? 'bg-[#00FF94]/20 text-[#00FF94]' : 'bg-blue-500/20 text-blue-400'
      }`}>
        {number}
      </span>
      <span className="font-medium text-white">{title}</span>
      <span className={`ml-auto text-xs px-2 py-0.5 rounded ${
        status === 'on-chain' ? 'bg-[#00FF94]/10 text-[#00FF94]' : 'bg-blue-500/10 text-blue-400'
      }`}>
        {status === 'on-chain' ? '⛓️ On-chain' : '🤖 Execution'}
      </span>
    </div>
    <p className="mt-1 text-xs text-zinc-400 pl-7">{description}</p>
  </div>
);

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-center">
    <div className="flex justify-center text-zinc-300">{icon}</div>
    <p className="mt-1 font-semibold text-white text-sm">{title}</p>
    <p className="text-xs text-zinc-500">{description}</p>
  </div>
);

// Professional SVG Icons
const MessageIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const TargetIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const WalletIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/>
  </svg>
);

const BoltIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const SparkleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const DollarIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const StarIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default UserWorkflow;

