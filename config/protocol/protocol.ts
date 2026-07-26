import { activeChainConfig } from '../chains';
import { ASPConfig } from '../../server/okx/asp.config';

export const ProtocolMetadata = {
  // Core identity
  name: ASPConfig.name,
  version: ASPConfig.version,
  release: "v1",
  currentNetwork: activeChainConfig.networkName,
  environment: typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
  supportedNetworks: ASPConfig.supportedNetworks,
  website: ASPConfig.website,
  repository: ASPConfig.repository,
  futureVersion: "v2.0.0-beta",

  // Extended metadata fields
  protocolName: ASPConfig.name,
  protocolVersion: ASPConfig.version,
  releaseChannel: "Stable",
  buildNumber: "1",
  websiteUrl: ASPConfig.website,
  documentation: "https://github.com/0xaje/Nexa-AI/tree/main/docs",
  repositoryUrl: ASPConfig.repository,
  network: activeChainConfig.networkName,
  supportedChains: ASPConfig.supportedNetworks,
  protocolDescription: ASPConfig.description,
  tagline: "Your AI Agent for Crypto Intelligence, Token Research, and Market Insights.",
  mission: "Nexa AI empowers crypto participants with specialized multi-agent AI research, real-time risk scoring, token intelligence, and inspectable market predictions with full reasoning transparency.",
  vision: "An autonomous, verifiable crypto intelligence platform where multi-agent AI networks continuously research tokens, evaluate risks, generate insights, and anchor transparent decisions on-chain."
};
