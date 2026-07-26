export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(200).json({
        name: "Nexa AI",
        category: "AI Crypto Intelligence Agent",
        aspType: "A2A",
        aspTypeDescription: "Agent-to-Agent (A2A) ASP for complex fundamental research, multi-agent reasoning, volatility risk assessment, and prediction orchestration.",
        productStory: "Nexa AI is an autonomous crypto intelligence agent that enables traders, protocols, and researchers to analyze digital assets, evaluate multi-dimensional risks, inspect news telemetry, and generate verifiable prediction opportunities through natural language.",
        version: "1.0.0",
        description: "Nexa AI is an autonomous crypto intelligence agent that researches tokens, evaluates market risks, analyzes fundamental telemetry, and generates evidence-backed prediction opportunities via a multi-agent reasoning swarm.",
        provider: "Nexa AI / OKX A2A Agent Service Provider",
        author: "Nexa AI Architecture Team",
        website: "https://nexaai.io",
        repository: "https://github.com/0xaje/Nexa-AI",
        logoUrl: "https://nexa-ai-sepia.vercel.app/logo.png",
        avatarUrl: "https://nexa-ai-sepia.vercel.app/logo.png",
        supportedServices: [
            "Fundamental Token & Market Research",
            "Real-Time Telemetry & Oracle Verification",
            "Volatility & Smart Contract Risk Assessment",
            "Verifiable Prediction & IPFS Evidence Packaging"
        ],
        servicesDetailed: [
            { id: "srv-research", name: "Fundamental Token & Market Research", category: "Token Research & Analytics", description: "Deep fundamental token analysis, protocol metrics evaluation, and market trend synthesis.", underlyingAgents: ["Research Agent"], slaMaxResponseTimeMs: 10000, pricingModel: "Free / On-Chain Query Gas Only", status: "ACTIVE" },
            { id: "srv-market-intel", name: "Real-Time Telemetry & Oracle Verification", category: "Market Telemetry", description: "Real-time cross-chain signal ingestion, news telemetry analysis, and data feed integrity verification.", underlyingAgents: ["Market Intelligence Agent"], slaMaxResponseTimeMs: 10000, pricingModel: "Free / On-Chain Query Gas Only", status: "ACTIVE" },
            { id: "srv-risk-audit", name: "Volatility & Smart Contract Risk Assessment", category: "Risk Audit", description: "Multi-factor volatility indexing, liquidity pool depth auditing, and downside circuit breaker evaluation.", underlyingAgents: ["Risk Agent"], slaMaxResponseTimeMs: 10000, pricingModel: "Free / On-Chain Query Gas Only", status: "ACTIVE" },
            { id: "srv-prediction", name: "Verifiable Prediction & IPFS Evidence Packaging", category: "Prediction Infrastructure", description: "Autonomous creation of inspectable market prediction proposals with SHA-256 IPFS evidence packaging.", underlyingAgents: ["Research Agent", "Market Intelligence Agent", "Risk Agent"], slaMaxResponseTimeMs: 10000, pricingModel: "Free / On-Chain Query Gas Only", status: "ACTIVE" }
        ],
        capabilities: [
            "Fundamental Token & Protocol Research",
            "Real-Time Market Telemetry & Signals",
            "Multi-Factor Volatility & Risk Scoring",
            "Verifiable IPFS Evidence Packaging",
            "Agent-to-Agent Swarm Consensus"
        ],
        defaultPricing: "Free / On-Chain Query Gas Only",
        endpoints: {
            agentQuery: "/api/v1/okx/agent",
            health: "/api/v1/okx/health",
            version: "/api/v1/okx/version",
            metadata: "/api/v1/okx/metadata",
            manifest: "/api/v1/okx/manifest"
        },
        supportedNetworks: ["Ethereum", "Arbitrum", "Base", "Optimism", "EVM Testnets"],
        sla: { maxLatencyMs: 10000, targetUptimePct: 99.9, timeoutGuardMs: 10000 }
    });
}
