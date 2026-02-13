import React from 'react';
import { Card } from '../demo/components/ui/card';

const Prerequisites: React.FC = () => {
  return (
    <Card className="border-zinc-800 bg-black/60 p-6 md:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#00FF94]">
        Getting Started
      </p>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Getting Started
      </h2>

      <h3 className="mb-2 text-lg font-semibold text-zinc-100">
        Wallet Setup
      </h3>
      <ol className="mb-4 list-decimal space-y-1 pl-5 text-sm text-zinc-300">
        <li>
          <span className="font-semibold text-zinc-100">
            MetaMask or Compatible Wallet
          </span>{' '}
          - For connecting to the platform
        </li>
        <li>
          <span className="font-semibold text-zinc-100">
            SKALE Base Testnet
          </span>{' '}
          - Add network with these details:
        </li>
      </ol>
      <div className="mb-4 rounded-md border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300">
        <ul className="space-y-1">
          <li>
            <span className="font-semibold text-zinc-100">Network Name:</span> SKALE on Base
            Testnet
          </li>
          <li>
            <span className="font-semibold text-zinc-100">RPC URL:</span>{' '}
            https://base-sepolia-testnet.skalenodes.com/v1/base-testnet
          </li>
          <li>
            <span className="font-semibold text-zinc-100">Chain ID:</span> 324705682 (0x135a9d92)
          </li>
          <li>
            <span className="font-semibold text-zinc-100">Symbol:</span> CREDIT
          </li>
          <li>
            <span className="font-semibold text-zinc-100">Explorer:</span>{' '}
            https://base-sepolia-testnet-explorer.skalenodes.com/
          </li>
        </ul>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-zinc-100">
        Getting Test Tokens
      </h3>
      <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-zinc-300">
        <li>
          <span className="font-semibold text-zinc-100">First Time Users</span>: Claim 500 free
          AGT tokens (one-time only)
        </li>
        <li>
          <span className="font-semibold text-zinc-100">Additional Tokens</span>: Bridge USDC from
          Base (1 USDC = 500 AGT)
        </li>
        <li>
          <span className="font-semibold text-zinc-100">Minimum Balance</span>: ~100 AGT recommended
          for testing multiple tasks
        </li>
      </ul>

      {/* <h3 className="mb-2 text-lg font-semibold text-zinc-100">
        Technical Requirements
      </h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
        <li>Modern web browser with Web3 support</li>
        <li>Stable internet connection for real-time agent communication</li>
        <li>Basic understanding of blockchain transactions</li>
      </ul> */}
    </Card>
  );
};

export default Prerequisites;

