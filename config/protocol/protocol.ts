import { activeChainConfig } from '../chains';

export const ProtocolMetadata = {
  // Core identity
  name: "Nexa AI",
  version: "1.0.0",
  release: "v1",
  currentNetwork: activeChainConfig.networkName,
  environment: typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
  supportedNetworks: ["Ethereum", "Arbitrum", "Base", "Optimism", "EVM Testnets"],
  website: "https://nexaai.io",
  repository: "https://github.com/0xaje/Nexa-AI",
  futureVersion: "v2.0.0-beta",

  // Extended metadata fields
  protocolName: "Nexa AI",
  protocolVersion: "1.0.0",
  releaseChannel: "Stable",
  buildNumber: "1",
  websiteUrl: "https://nexaai.io",
  documentation: "https://github.com/0xaje/Nexa-AI/tree/main/docs",
  repositoryUrl: "https://github.com/0xaje/Nexa-AI",
  network: activeChainConfig.networkName,
  supportedChains: ["Ethereum", "Arbitrum", "Base", "Optimism", "EVM Testnets"],
  protocolDescription: "Nexa AI is an AI-powered crypto intelligence agent that researches tokens, analyzes market risk, generates insights, and produces verifiable predictions powered by a multi-agent reasoning pipeline.",
  tagline: "Your AI Agent for Crypto Intelligence, Token Research, and Market Insights.",
  mission: "Nexa AI empowers crypto participants with specialized multi-agent AI research, real-time risk scoring, token intelligence, and inspectable market predictions with full reasoning transparency.",
  vision: "An autonomous, verifiable crypto intelligence platform where multi-agent AI networks continuously research tokens, evaluate risks, generate insights, and anchor transparent decisions on-chain."
};
