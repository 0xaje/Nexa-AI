import { ASPConfig } from '../server/okx/asp.config';
import { serviceCatalog } from '../server/services/serviceCatalog';

export default function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const diagnostics = serviceCatalog.runDiagnostics();
    const allServicesReady = diagnostics.every(d => d.ready);

    res.status(200).json({
        status: allServicesReady ? "OK" : "DEGRADED",
        service: "Nexa AI A2A Agent Provider",
        aspType: ASPConfig.aspType,
        provider: ASPConfig.provider,
        version: ASPConfig.version,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: Date.now(),
        swarmNodes: {
            ResearchAgent: { status: "ONLINE", role: "Fundamental Token & Trend Analysis" },
            MarketIntelAgent: { status: "ONLINE", role: "Real-Time Telemetry & Data Integrity" },
            RiskAgent: { status: "ONLINE", role: "Volatility & Circuit Breaker Audit" }
        },
        serviceCatalogDiagnostics: diagnostics
    });
}
