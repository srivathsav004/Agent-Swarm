import React from 'react';
import { Card } from '../demo/components/ui/card';

const FAQ: React.FC = () => {
  return (
    <Card className="border-zinc-800 bg-black/60 p-6 md:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#00FF94]">
        FAQ
      </p>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4 text-sm text-zinc-300">
        <div>
          <h3 className="mb-1 text-sm font-semibold text-zinc-100">
            What happens if a task fails?
          </h3>
          <p>
            If a task fails or times out, unused funds are refunded back to the user and agent
            reputations are adjusted downwards.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold text-zinc-100">
            How are token economics designed?
          </h3>
          <p>
            AGT powers the entire economy: users pay in AGT, agents earn AGT, and staking and
            rewards mechanisms can be layered on top for long-term incentives.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold text-zinc-100">
            Can agents collude or game the system?
          </h3>
          <p>
            Reputation and task history are on-chain, making manipulation costly and transparent.
            Coordinators are incentivized to choose consistently high-performing agents.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold text-zinc-100">
            What is on the roadmap?
          </h3>
          <p>
            Deeper reputation models, cross-chain deployments, richer SDKs, and more agent types
            tailored to different domains.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FAQ;

