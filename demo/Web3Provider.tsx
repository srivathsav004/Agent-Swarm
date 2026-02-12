import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { injected } from 'wagmi/connectors';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [avalancheFuji],
  multiInjectedProviderDiscovery: true,
  connectors: [injected()],
  transports: {
    [avalancheFuji.id]: http(),
  },
  ssr: false,
});

const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
