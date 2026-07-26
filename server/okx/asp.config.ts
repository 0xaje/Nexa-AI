export interface ASPServiceDefinition {
    id: string;
    name: string;
    category: string;
    description: string;
    underlyingAgents: string[];
    slaMaxResponseTimeMs: number;
    pricingModel: string;
    status: 'ACTIVE' | 'DEGRADED' | 'MAINTENANCE';
}

export interface ASPCapabilityDefinition {
    id: string;
    name: string;
    description: string;
    type: 'REASONING' | 'TELEMETRY' | 'RISK' | 'PREDICTION' | 'EVIDENCE';
}

export interface ASPRegistrationConfig {
    name: string;
    version: string;
    description: string;
    category: string;
    services: string[];
    servicesDetailed: ASPServiceDefinition[];
    capabilities: string[];
    capabilitiesDetailed: ASPCapabilityDefinition[];
    aspType: 'A2A' | 'DIRECT';
    aspTypeDescription: string;
    productStory: string;
    provider: string;
    author: string;
    website: string;
    repository: string;
    defaultPricing: string;
    supportedNetworks: string[];
    endpoints: {
        agentQuery: string;
        health: string;
        version: string;
        metadata: string;
        manifest: string;
    };
    sla: {
        maxLatencyMs: number;
        targetUptimePct: number;
        timeoutGuardMs: number;
    };
}

const detailedServices: ASPServiceDefinition[] = [
    {
        id: "srv-research",
        name: "Fundamental Token & Market Research",
        category: "Token Research & Analytics",
        description: "Deep fundamental token analysis, protocol metrics evaluation, and market trend synthesis.",
        underlyingAgents: ["Research Agent"],
        slaMaxResponseTimeMs: 10000,
        pricingModel: "Free / On-Chain Query Gas Only",
        status: "ACTIVE"
    },
    {
        id: "srv-market-intel",
        name: "Real-Time Telemetry & Oracle Verification",
        category: "Market Telemetry",
        description: "Real-time cross-chain signal ingestion, news telemetry analysis, and data feed integrity verification.",
        underlyingAgents: ["Market Intelligence Agent"],
        slaMaxResponseTimeMs: 10000,
        pricingModel: "Free / On-Chain Query Gas Only",
        status: "ACTIVE"
    },
    {
        id: "srv-risk-audit",
        name: "Volatility & Smart Contract Risk Assessment",
        category: "Risk Audit",
        description: "Multi-factor volatility indexing, liquidity pool depth auditing, and downside circuit breaker evaluation.",
        underlyingAgents: ["Risk Agent"],
        slaMaxResponseTimeMs: 10000,
        pricingModel: "Free / On-Chain Query Gas Only",
        status: "ACTIVE"
    },
    {
        id: "srv-prediction",
        name: "Verifiable Prediction & IPFS Evidence Packaging",
        category: "Prediction Infrastructure",
        description: "Autonomous creation of inspectable market prediction proposals with SHA-256 IPFS evidence packaging.",
        underlyingAgents: ["Research Agent", "Market Intelligence Agent", "Risk Agent"],
        slaMaxResponseTimeMs: 10000,
        pricingModel: "Free / On-Chain Query Gas Only",
        status: "ACTIVE"
    }
];

const detailedCapabilities: ASPCapabilityDefinition[] = [
    {
        id: "cap-fundamental-analysis",
        name: "Fundamental Token & Protocol Research",
        description: "Ingests on-chain liquidity metrics, active user adoption rates, and historical price action to evaluate token health.",
        type: "REASONING"
    },
    {
        id: "cap-realtime-telemetry",
        name: "Real-Time Market Telemetry & Signals",
        description: "Monitors live feeds (Glassnode, Dune, Nansen) and news signals for high-conviction market shifts.",
        type: "TELEMETRY"
    },
    {
        id: "cap-risk-scoring",
        name: "Multi-Factor Volatility & Risk Scoring",
        description: "Computes weighted risk scores and downside buffers across smart contract and volatility parameters.",
        type: "RISK"
    },
    {
        id: "cap-ipfs-packaging",
        name: "Verifiable IPFS Evidence Packaging",
        description: "Hashes decision rationale, supporting evidence, and data sources into verifiable SHA-256 IPFS content IDs.",
        type: "EVIDENCE"
    },
    {
        id: "cap-a2a-swarm",
        name: "Agent-to-Agent Swarm Consensus",
        description: "Coordinates Research, Market Intelligence, and Risk agent nodes to achieve >= 66% weighted quorum consensus.",
        type: "PREDICTION"
    }
];

export const ASPConfig: ASPRegistrationConfig = {
    // ── Primary Agent Identity Fields ──
    name: "Nexa AI",
    version: "1.0.0",
    description: "Nexa AI is an autonomous crypto intelligence agent that researches tokens, evaluates market risks, analyzes fundamental telemetry, and generates evidence-backed prediction opportunities via a multi-agent reasoning swarm.",
    category: "AI Crypto Intelligence Agent",
    services: detailedServices.map(s => s.name),
    capabilities: detailedCapabilities.map(c => c.name),

    // ── Detailed Registration Metadata ──
    servicesDetailed: detailedServices,
    capabilitiesDetailed: detailedCapabilities,
    aspType: "A2A",
    aspTypeDescription: "Agent-to-Agent (A2A) ASP for complex fundamental research, multi-agent reasoning, volatility risk assessment, and prediction orchestration.",
    productStory: "Nexa AI is an autonomous crypto intelligence agent that enables traders, protocols, and researchers to analyze digital assets, evaluate multi-dimensional risks, inspect news telemetry, and generate verifiable prediction opportunities through natural language.",
    provider: "Nexa AI / OKX A2A Agent Service Provider",
    author: "Nexa AI Architecture Team",
    website: "https://nexaai.io",
    repository: "https://github.com/0xaje/Nexa-AI",
    defaultPricing: "Free / On-Chain Query Gas Only",
    supportedNetworks: ["Ethereum", "Arbitrum", "Base", "Optimism", "EVM Testnets"],

    endpoints: {
        agentQuery: "/api/v1/okx/agent",
        health: "/api/v1/okx/health",
        version: "/api/v1/okx/version",
        metadata: "/api/v1/okx/metadata",
        manifest: "/api/v1/okx/manifest"
    },

    sla: {
        maxLatencyMs: 10000,
        targetUptimePct: 99.9,
        timeoutGuardMs: 10000
    }
};
