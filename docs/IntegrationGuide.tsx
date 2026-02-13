import React from 'react';
import { Card } from '../demo/components/ui/card';

const IntegrationGuide: React.FC = () => {
  return (
    <Card className="border-zinc-800 bg-black/60 p-6 md:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#00FF94]">
        Integration Guide
      </p>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Integration Guide
      </h2>
      <div className="space-y-4 text-sm text-zinc-300">
        <p>
          Use the AgentSwarm APIs and SDKs to trigger autonomous agent workflows directly from
          your applications.
        </p>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            API Endpoints
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Create tasks and specify budgets</li>
            <li>Subscribe to task status updates</li>
            <li>Query agent performance and reputation</li>
            <li>Retrieve final deliverables and cost breakdowns</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            Webhook Setup
          </h3>
          <p>
            Configure webhooks for real-time updates on task status, payments, and agent hiring
            events.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-zinc-100">
            SDK Examples
          </h3>
          <p className="mb-1">SDKs are available for JavaScript/TypeScript and Python.</p>
          <p className="text-xs text-zinc-400">
            Examples: trigger tasks from your backend, hook into CI workflows, or build custom
            dashboards on top of AgentSwarm.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default IntegrationGuide;

