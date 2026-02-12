import React from 'react';
import Header from './header';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PromptSection from './PromptSection';

const Demo: React.FC = () => {
  const { isConnected } = useAccount();

  React.useEffect(() => {
    if (!isConnected) {
      return;
    }

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

        // 4902 = chain not added to MetaMask
        if (switchError?.code === 4902) {
          try {
            await ethereum.request({

              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: skaleChainIdHex,
                  chainName: 'SKALE Base Sepolia',
                  rpcUrls: ['https://base-sepolia-testnet.skalenodes.com/v1/base-testnet'],
                  nativeCurrency: {
                    name: 'sFUEL',
                    symbol: 'sFUEL',
                    decimals: 18,
                  },
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
    <div className="min-h-screen selection:bg-[#00FF94] selection:text-[#0A0A0A] relative">
      <Header />

      <main className="pt-24 pb-16 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto">
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight headline leading-tight text-[#F5F5F5]">
            Spin up an on-chain
            <span className="block text-[#F97316]">agent pipeline</span>
            with a fixed budget.
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base text-[#E5E7EB]/70 font-mono">
            Connect your wallet, describe the task, and we&apos;ll auto-select the best coordinator,
            research, analyst, content, and code agents from the on-chain registry to estimate the
            required AGENT budget.
          </p>
        </div>

        <PromptSection />
      </main>

      {!isConnected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="max-w-md w-full mx-4 rounded-2xl border border-white/10 bg-[#111111] px-8 py-8 text-center shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-white">
              Connect your wallet
            </h2>
            <p className="text-sm text-white/60 mb-6">
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