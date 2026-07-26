import { ChainConfig } from './types';
import { sepolia } from './sepolia';

const chains: Record<string, ChainConfig> = {
  sepolia,
};

const getEnv = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key];
    if (process.env[`VITE_${key}`]) return process.env[`VITE_${key}`];
  }
  try {
    // @ts-ignore
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv) {
      return metaEnv[`VITE_${key}`] || metaEnv[key];
    }
  } catch {
    // Ignore in environments where import.meta is invalid syntax
  }
  return undefined;
};

export function loadChainConfig(): ChainConfig {
  const defaultChainKey = getEnv('DEFAULT_CHAIN') || 'sepolia';
  
  // Find chain by name or by chainId
  let baseConfig = chains[defaultChainKey];
  if (!baseConfig) {
    // Fallback search by chainId or name
    const found = Object.values(chains).find(
      c => c.chainId.toString() === defaultChainKey || c.networkName.toLowerCase() === defaultChainKey.toLowerCase()
    );
    baseConfig = found || sepolia; // Default to sepolia
  }

  // Deep copy base config
  const config = JSON.parse(JSON.stringify(baseConfig)) as ChainConfig;

  // Apply overrides from env variables if present
  const envRpcUrl = getEnv('RPC_URL');
  if (envRpcUrl) {
    config.rpcUrl = envRpcUrl;
  }

  const envChainId = getEnv('CHAIN_ID');
  if (envChainId) {
    config.chainId = parseInt(envChainId, 10);
  }

  const envBlockExplorer = getEnv('BLOCK_EXPLORER');
  if (envBlockExplorer) {
    config.blockExplorer = envBlockExplorer;
  }

  const envContractAddress = getEnv('CONTRACT_ADDRESS') || getEnv('VITE_CONTRACT_ADDRESS');
  if (envContractAddress) {
    config.contracts.marketProtocol = envContractAddress;
  }

  return config;
}
