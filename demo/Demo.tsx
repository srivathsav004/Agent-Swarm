import React from 'react';
import Header from './header';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PromptSection from './PromptSection';
import TokensCard from './TokensCard';
import CostEstimate from './CostEstimate';
import TaskExecution from './TaskExecution';
import type { AgentPipelineSelection } from '../service/web3';
import { DEFAULT_PROMPT } from './PromptSection';

const Demo: React.FC = () => {
  const { isConnected } = useAccount();
  const [prompt, setPrompt] = React.useState(DEFAULT_PROMPT);
  const [error, setError] = React.useState<string | null>(null);
  const [showEstimate, setShowEstimate] = React.useState(false);
  const [pipeline, setPipeline] = React.useState<AgentPipelineSelection | null>(null);
  const [totalBudget, setTotalBudget] = React.useState<bigint | null>(null);
  const [tokenSymbol, setTokenSymbol] = React.useState<string>('AGENT');
  const [showExecution, setShowExecution] = React.useState(false);

  const handleEstimate = () => {
    if (!isConnected) {
      setError('Connect your wallet to estimate cost.');
      return;
    }
    if (!prompt.trim()) {
      setError('Describe what you want the agents to build.');
      return;
    }
    setError(null);
    setShowEstimate(true);
  };

  React.useEffect(() => {
    if (!isConnected) return;
    const ensureSkaleNetwork = async () => {
      if (typeof window === 'undefined') return;
      const { ethereum } = window as any;
      if (!ethereum?.request) return;
      const skaleChainIdHex = '0x135a9d92';
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: skaleChainIdHex }],
        });
      } catch (switchError: any) {
        if (switchError?.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: skaleChainIdHex,
                  chainName: 'SKALE Base Sepolia',
                  rpcUrls: ['https://base-sepolia-testnet.skalenodes.com/v1/base-testnet'],
                  nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
                },
              ],
            });
          } catch (addError) {
            console.error('Failed to add SKALE Base Sepolia network', addError);
          }
        } else {
          console.error('Failed to switch to SKALE Base Sepolia network', switchError);
        }
      }
    };
    void ensureSkaleNetwork();
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-black selection:bg-white selection:text-black relative">
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 w-full max-w-[1600px] mx-auto">
        {/* Top row: prompt card (left) + TokensCard (right), same height, compact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[320px]">
          <div className="lg:col-span-7 h-full flex">
            <PromptSection
              prompt={prompt}
              setPrompt={setPrompt}
              error={error}
              onEstimate={handleEstimate}
            />
          </div>
          <div className="lg:col-span-5 h-full flex">
            <TokensCard />
          </div>
        </div>

        {/* Cost Estimate: full-width section below the two columns */}
        {showEstimate && !showExecution && (
          <div className="mt-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm p-6 md:p-8">
              <CostEstimate
                prompt={prompt}
                onProceed={(p, budget, symbol) => {
                  setPipeline(p);
                  setTotalBudget(budget);
                  setTokenSymbol(symbol);
                  setShowExecution(true);
                }}
              />
            </div>
          </div>
        )}

        {/* Task Execution: full-width section below cost estimate */}
        {showExecution && pipeline && totalBudget && (
          <div className="mt-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm p-6 md:p-8">
              <TaskExecution
                prompt={prompt}
                pipeline={pipeline}
                totalBudget={totalBudget}
                tokenSymbol={tokenSymbol}
              />
            </div>
          </div>
        )}
      </main>

      {!isConnected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="max-w-md w-full mx-4 rounded-lg border border-neutral-800 bg-neutral-900 px-8 py-8 text-center shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-white">
              Connect your wallet
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Please connect a browser wallet (for example, MetaMask) to continue to the demo.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Demo;
