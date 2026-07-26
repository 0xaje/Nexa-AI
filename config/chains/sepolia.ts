import { ChainConfig } from './types';

export const sepolia: ChainConfig = {
  chainId: 11155111,
  networkName: 'Sepolia Testnet',
  rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
  blockExplorer: 'https://sepolia.etherscan.io',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  contracts: {
    marketProtocol: '0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846',
  },
  confirmations: 1,
  isTestnet: true,
  icon: 'ethereum',
};
