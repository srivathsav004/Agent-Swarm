import React from 'react';
import { useAccount } from 'wagmi';

const DEFAULT_PROMPT =
  'Create a landing page for my AI agent marketplace with sections for use-cases, pricing, and live agent demos.';

export interface PromptSectionProps {
  prompt: string;
  setPrompt: (v: string) => void;
  error: string | null;
  onEstimate: () => void;
}

const PromptSection: React.FC<PromptSectionProps> = ({ prompt, setPrompt, error, onEstimate }) => {
  const { isConnected } = useAccount();

  return (
    <div className="h-full flex flex-col">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm p-3 md:p-4 flex flex-col h-full">
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-1.5 w-fit border border-neutral-700">
              <span className="text-sm font-medium text-neutral-400">💬</span>
              <span className="text-sm font-medium text-neutral-300">Agent Task Prompt</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              What should the agents build?
            </h2>
            <p className="text-sm text-neutral-400">
              Describe the product, page, or workflow you want and estimate the required on-chain budget.
            </p>
          </div>

          {/* Example prompts */}
          <div className="space-y-1.5">
            <p className="text-xs text-neutral-500 font-medium">Example prompts:</p>
            <div className="grid gap-1.5">
              <button
                type="button"
                onClick={() => setPrompt('Create a modern landing page for a SaaS product with hero section, features, pricing, and testimonials.')}
                className="text-left p-1.5 rounded-lg border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
              >
                <p className="text-xs text-neutral-300">🚀 SaaS Landing Page</p>
                <p className="text-xs text-neutral-500 mt-1">Modern landing page with hero, features, pricing, testimonials</p>
              </button>
              <button
                type="button"
                onClick={() => setPrompt('Build a task management dashboard with drag-and-drop, filters, and team collaboration features.')}
                className="text-left p-1.5 rounded-lg border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
              >
                <p className="text-xs text-neutral-300">📋 Task Dashboard</p>
                <p className="text-xs text-neutral-500 mt-1">Drag-and-drop task management with team collaboration</p>
              </button>
              <button
                type="button"
                onClick={() => setPrompt('Create an e-commerce product page with image gallery, reviews, and add to cart functionality.')}
                className="text-left p-1.5 rounded-lg border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
              >
                <p className="text-xs text-neutral-300">🛒 E-commerce Page</p>
                <p className="text-xs text-neutral-500 mt-1">Product page with gallery, reviews, and cart functionality</p>
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-2.5 min-h-[64px]">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="w-full resize-none border-0 bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0 min-h-[48px]"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/50 border border-red-800 p-2">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-0">
            <p className="text-sm text-neutral-400">
              {isConnected
                ? 'When you estimate, we will simulate the best on-chain agent pipeline and required budget.'
                : 'Connect your wallet in the header to run an on-chain cost estimate.'}
            </p>
            <button
              type="button"
              onClick={onEstimate}
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <span className="flex items-center gap-2">
                <span>🎯</span>
                <span>Estimate Cost</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptSection;
export { DEFAULT_PROMPT };
