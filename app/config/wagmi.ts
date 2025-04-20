// import { getDefaultConfig } from '@rainbow-me/rainbowkit';
// import { hardhat } from 'viem/chains';
// import { http } from 'viem';

// export const config = getDefaultConfig({
//   appName: '幸运盒子抽奖',
//   projectId: '0x2284a2f4456925735fdd84c0d4afaef87d33741424e5fe89c0062a20b47bb4b6', // 从 WalletConnect Cloud 获取
//   chains: [hardhat],
//   transports: {
//     [hardhat.id]: http(),
//   },
// });

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  Chain,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

const ganache: Chain = {
  id: 1337,  // Ganache 默认 chainId
  name: 'Ganache Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { 
      http: ['http://127.0.0.1:7545'] // Ganache 默认 RPC URL
    },
    public: {
      http: ['http://127.0.0.1:7545']
    }
  }
}


export const config = getDefaultConfig({
  appName: '幸运盒子抽奖',
  projectId: "a659dc9b36cea23d62ecf3a798a7b510", // 这个网站获取projectId https://cloud.reown.com/
  chains: [
    ganache,
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});
