import { AiraMarketProtocolDeployment as marketProtocolDeployment } from './91342/AiraMarketProtocol';

const deployments: Record<number, Record<string, { address: string; abi: any }>> = {
  91342: {
    AiraMarketProtocol: marketProtocolDeployment,
    marketProtocol: marketProtocolDeployment
  }
};

export function getDeployment(chainId: number, contractName: string) {
  const chainDeployments = deployments[chainId];
  if (!chainDeployments) {
    return undefined;
  }
  return chainDeployments[contractName];
}
