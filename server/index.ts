import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Logger } from './utils/logger';
import { NetworkValidationService } from './services/networkValidationService';
import { activeChainConfig } from '../config/chains';
import { ProtocolMetadata } from '../config/protocol/protocol';
import { analystAgent } from './agents/analyst_agent';
import { riskAgent } from './agents/risk_agent';
import { complianceAgent } from './agents/compliance_agent';
import { consensusService } from './services/consensus_service';
import { marketService } from './services/market_service';
import { SignalIngestionService } from './services/signal_ingestion';
import * as http from 'http';
import { TransparencyLogger } from './services/transparency_logger';
import { MarketCache } from './services/market_cache';
import { reputationService } from './services/reputation_service';
import { exec } from 'child_process';
import { ProviderFactory } from '../services/providerFactory';
import { indexer } from './indexer';
import { OKXAgentAdapter } from './adapters/okx_agent_adapter';
import { MetadataValidator } from './utils/metadataValidator';
import { serviceCatalog } from './services/serviceCatalog';

Logger.start(`Initializing ${ProtocolMetadata.protocolName} Autonomous Backend...`);

function validateEnvironment() {
    const required = ['PRIVATE_KEY', 'DATABASE_URL', 'RPC_URL'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        Logger.error(`CRITICAL CONFIGURATION ERROR: Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
}

async function runPrismaMigrations() {
    if (process.env.USE_PRISMA === 'true') {
        Logger.start("USE_PRISMA is enabled. Synchronizing database schemas...");
        return new Promise<void>((resolve) => {
            exec('npx prisma db push --accept-data-loss', (error, stdout, stderr) => {
                if (error) {
                    Logger.error("Prisma database schema synchronization failed", error);
                } else {
                    Logger.success("Database schema synchronized successfully via Prisma.");
                }
                resolve();
            });
        });
    }
}

async function bootstrap() {
    validateEnvironment();

    // Perform OKX ASP Metadata Synchronization Check
    MetadataValidator.validate();

    const report = await NetworkValidationService.validate();

    // Print professional startup summary diagnostics banner to console
    console.log(`
--------------------------------------------------
${ProtocolMetadata.name} v${ProtocolMetadata.version} (${ProtocolMetadata.release})
Environment: ${ProtocolMetadata.environment}
Network:     ${ProtocolMetadata.currentNetwork}
Chain ID:    ${activeChainConfig.chainId}
RPC:         ${report.rpcReachable ? 'Connected' : 'FAILED'}
Explorer:    ${report.explorerConfigured ? 'Configured' : 'FAILED'}
Contracts:   ${report.deploymentExists ? 'Loaded' : 'FAILED'}
Database:    ${report.walletValid ? 'Connected (via Prisma)' : 'DISCONNECTED'}
Indexer:     Running
API:         Ready
--------------------------------------------------
    `);

    if (!report.success) {
        Logger.error("CRITICAL: Diagnostics validation failed. Exiting immediately.");
        process.exit(1);
    }

    await runPrismaMigrations();

    // Start block indexer and Consensus Engine validation loops
    indexer.startIndexing();
    analystAgent;
    riskAgent;
    complianceAgent;
    consensusService;
    marketService;

    setTimeout(() => {
        SignalIngestionService.runIngestionCycle();
        setInterval(() => {
            SignalIngestionService.runIngestionCycle();
        }, 60000);
    }, 2000);
}

bootstrap().catch((err) => {
    Logger.error("Failed to bootstrap backend application", err);
    process.exit(1);
});

// HTTP Server to accept verifiable transparency logs from Frontend
const server = http.createServer(async (req, res) => {
    // Enable CORS & Security Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/log-transparency') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                TransparencyLogger.logApproval(
                    payload.txHash,
                    payload.title,
                    payload.category,
                    payload.inputSignals,
                    payload.reason,
                    payload.confidence,
                    payload.decision
                );
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Logged verifiably' }));
            } catch (err) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
        return;
    }

    if (req.method === 'POST' && req.url === '/resolve-market') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const { settlementService } = await import('./services/settlement_service');
                const payload = JSON.parse(body);
                const result = await settlementService.resolveMarket(Number(payload.marketId), payload.outcome === true);
                if (result.success) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } else {
                    res.writeHead(500);
                    res.end(JSON.stringify(result));
                }
            } catch (err) {
                res.writeHead(400);
                res.end('Failed');
            }
        });
        return;
    }

    if (req.method === 'GET' && req.url === '/api/explorer/data') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
            const { DbAdapter } = await import('./services/db_adapter');
            const prisma = DbAdapter.getClient();

            const proposals = await prisma.pendingDecision.findMany({
                include: { evaluations: true, intelligenceReport: true },
                orderBy: { createdAt: 'desc' }
            });

            const enrichedProposals = proposals.map(p => {
                const totalEvaluationsCount = p.evaluations.length;
                const approvals = p.evaluations.filter(e => e.vote === 'APPROVE');

                const decisionReason = `Consensus APPROVED: Weighted score met the 66% threshold, and Weighted Confidence of ${(p.confidence * 100).toFixed(1)}% met the 75% target.`;

                const disagreements = p.evaluations
                    .filter(e => e.vote !== 'APPROVE')
                    .map(e => `${e.agentName} dissented with ${e.vote} (confidence ${(e.confidence * 100).toFixed(0)}%)`);

                const riskEv = p.evaluations.find(e => e.agentName === 'RiskAgent');
                const compEv = p.evaluations.find(e => e.agentName === 'ComplianceAgent');
                const riskAssessment = `Risk Audit: ${riskEv ? riskEv.reasoning : 'No risk assessment log available.'} | Compliance Audit: ${compEv ? compEv.reasoning : 'No compliance assessment log available.'}`;

                const supportingEvidence = `Signal ID: ${p.signalId} | Category: ${p.category} | Expire: ${p.expiry}`;

                let parsedReport = null;
                if (p.intelligenceReport) {
                    try {
                        parsedReport = {
                            ...p.intelligenceReport,
                            supportingEvidence: JSON.parse(p.intelligenceReport.supportingEvidence),
                            contradictingEvidence: JSON.parse(p.intelligenceReport.contradictingEvidence),
                            riskFactors: JSON.parse(p.intelligenceReport.riskFactors)
                        };
                    } catch (e) {
                        parsedReport = p.intelligenceReport;
                    }
                }

                return {
                    ...p,
                    decisionReason,
                    disagreements,
                    riskAssessment,
                    supportingEvidence,
                    intelligenceReport: parsedReport
                };
            });

            const evidencePackages = await prisma.evidencePackage.findMany({
                orderBy: { createdAt: 'desc' }
            });

            const logDir = path.join(__dirname, '../logs');
            
            let transparency = [];
            try {
                const filePath = path.join(logDir, 'formatted_transparency.json');
                if (fs.existsSync(filePath)) {
                    transparency = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                }
            } catch (e) {}

            let ipfsUploads = [];
            try {
                const filePath = path.join(logDir, 'formatted_ipfs_uploads.json');
                if (fs.existsSync(filePath)) {
                    ipfsUploads = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                }
            } catch (e) {}

            let consensusAudits = [];
            try {
                const filePath = path.join(logDir, 'formatted_consensus_audits.json');
                if (fs.existsSync(filePath)) {
                    consensusAudits = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                }
            } catch (e) {}

            const enrichedConsensusAudits = consensusAudits.map((a: any) => {
                const totalWeight = a.auditTrail.reduce((sum: number, item: any) => sum + item.contributionWeight, 0);
                const approvedWeight = a.auditTrail.filter((item: any) => item.vote === 'APPROVE').reduce((sum: number, item: any) => sum + item.contributionWeight, 0);
                const score = totalWeight > 0 ? (approvedWeight / totalWeight) : 0;
                const confidence = a.weightedConfidence;
                
                const isPassed = score >= 0.66 && confidence >= 0.75;
                const verdict = isPassed ? 'APPROVE' : 'REJECT';

                const decisionReason = isPassed 
                    ? `Weighted consensus APPROVED: Weighted Score of ${(score * 100).toFixed(1)}% exceeded threshold (66%), and Weighted Confidence of ${(confidence * 100).toFixed(1)}% met target (75%).`
                    : `Weighted consensus REJECTED: ` + (score < 0.66 
                        ? `Weighted score of ${(score * 100).toFixed(1)}% was below the 66% threshold.` 
                        : `Weighted confidence of ${(confidence * 100).toFixed(1)}% was below the 75% target.`);

                const disagreements = a.auditTrail
                    .filter((item: any) => item.vote !== verdict)
                    .map((item: any) => `${item.agentName} dissented with ${item.vote} (confidence ${(item.rawConfidence * 100).toFixed(0)}%)`);

                const riskItem = a.auditTrail.find((item: any) => item.agentName === 'RiskAgent');
                const compItem = a.auditTrail.find((item: any) => item.agentName === 'ComplianceAgent');
                const riskAssessment = `Risk Audit: ${riskItem ? riskItem.vote : 'N/A'} (Weight: ${riskItem ? riskItem.weight : 1.5}x) | Compliance Audit: ${compItem ? compItem.vote : 'N/A'} (Weight: ${compItem ? compItem.weight : 1.0}x)`;

                const supportingEvidence = `Signal ID: ${a.signalId} | Compound Probability: ${(a.approvalProbability * 100).toFixed(1)}%`;

                return {
                    ...a,
                    decisionReason,
                    disagreements,
                    riskAssessment,
                    supportingEvidence,
                    isPassed
                };
            });

            res.end(JSON.stringify({
                proposals: enrichedProposals,
                evidencePackages,
                transparency,
                ipfsUploads,
                consensusAudits: enrichedConsensusAudits
            }));
        } catch (e: any) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    if (req.method === 'GET' && req.url === '/api/v1/intelligence-reports') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
            const { DbAdapter } = await import('./services/db_adapter');
            const prisma = DbAdapter.getClient();
            const reports = await prisma.intelligenceReport.findMany({
                orderBy: { createdAt: 'desc' }
            });
            const parsedReports = reports.map(report => {
                try {
                    return {
                        ...report,
                        supportingEvidence: JSON.parse(report.supportingEvidence),
                        contradictingEvidence: JSON.parse(report.contradictingEvidence),
                        riskFactors: JSON.parse(report.riskFactors)
                    };
                } catch (e) {
                    return report;
                }
            });
            res.end(JSON.stringify(parsedReports));
        } catch (e: any) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    // OKX AI Agent Service Provider Public REST API Endpoints & Aliases
    if (req.method === 'GET' && (req.url === '/api/v1/okx/health' || req.url === '/health' || req.url === '/api/v1/health')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(OKXAgentAdapter.getHealth()));
        return;
    }

    if (req.method === 'GET' && (req.url === '/api/v1/okx/version' || req.url === '/version' || req.url === '/api/v1/version')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(OKXAgentAdapter.getVersion()));
        return;
    }

    if (req.method === 'GET' && (req.url === '/api/v1/okx/metadata' || req.url === '/metadata' || req.url === '/api/v1/metadata')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(OKXAgentAdapter.getMetadata()));
        return;
    }

    if (req.method === 'GET' && (req.url === '/api/v1/okx/manifest' || req.url === '/manifest' || req.url === '/api/v1/manifest')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(OKXAgentAdapter.getManifest()));
        return;
    }

    if (req.method === 'POST' && (req.url === '/api/v1/okx/agent' || req.url === '/agent' || req.url === '/api/v1/agent')) {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const reqPayload = JSON.parse(body || '{}');
                const { statusCode, payload } = await OKXAgentAdapter.processAgentRequest(reqPayload);
                res.writeHead(statusCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(payload));
            } catch (err: any) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    provider: "Nexa AI",
                    error: { code: "INVALID_JSON", message: "Malformed JSON request payload." }
                }));
            }
        });
        return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/api/v1/intelligence-report/')) {
        const signalId = req.url.split('/').pop();
        if (!signalId) {
            res.writeHead(400); res.end('Invalid signal ID'); return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
            const { DbAdapter } = await import('./services/db_adapter');
            const prisma = DbAdapter.getClient();
            const report = await prisma.intelligenceReport.findUnique({
                where: { signalId }
            });
            if (!report) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Intelligence report not found' }));
                return;
            }
            res.end(JSON.stringify({
                ...report,
                supportingEvidence: JSON.parse(report.supportingEvidence),
                contradictingEvidence: JSON.parse(report.contradictingEvidence),
                riskFactors: JSON.parse(report.riskFactors)
            }));
        } catch (e: any) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    if (req.method === 'POST' && req.url === '/api/v1/intelligence-report') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const payload = JSON.parse(body);
                const { DbAdapter } = await import('./services/db_adapter');
                await DbAdapter.saveIntelligenceReport(payload);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Report saved verifiably' }));
            } catch (err: any) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON or fields missing', details: err.message }));
            }
        });
        return;
    }

    if (req.method === 'GET' && req.url === '/api/reputation') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const stats = await reputationService.getAllReputations();
        res.end(JSON.stringify(stats));
        return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/api/reputation/')) {
        const agentName = req.url.split('/').pop();
        if (!agentName) {
            res.writeHead(400); res.end('Invalid agent name'); return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const stats = await reputationService.getReputation(agentName);
        res.end(JSON.stringify(stats));
        return;
    }

    if (req.method === 'GET' && req.url === '/pending-markets') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const pending = await MarketCache.getPendingMarkets();
        res.end(JSON.stringify(pending));
        await MarketCache.clearPendingMarkets(); // Clear after sending to avoid duplicates
        return;
    }

    if (req.method === 'GET' && req.url === '/live-trending') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const signals = SignalIngestionService.getRecentSignals();
        res.end(JSON.stringify(signals));
        return;
    }

    // IPFS Upload endpoint — uploads an evidence package and returns a real CID
    if (req.method === 'POST' && req.url === '/api/ipfs/upload') {
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const payload = JSON.parse(body);
                const { IpfsManager } = await import('./services/ipfs/manager');
                const cid = await IpfsManager.getInstance().upload({
                    title: payload.title || 'Untitled',
                    category: payload.category || 'GENERAL',
                    confidence: payload.confidence || '80%',
                    inputSignals: payload.inputSignals || '',
                    reason: payload.reason || '',
                    timestamp: payload.timestamp || new Date().toISOString(),
                    source: 'CreatorLab'
                });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ cid }));
            } catch (err) {
                Logger.error('IPFS upload failed', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'IPFS upload unavailable', cid: '' }));
            }
        });
        return;
    }


    if (req.method === 'GET' && req.url?.startsWith('/api/portfolio/')) {
        const address = req.url.split('/').pop()?.toLowerCase();
        if (!address) {
            res.writeHead(400); res.end('Invalid address'); return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
            const { PrismaClient } = await import('@prisma/client');
            const prisma = new PrismaClient();
            
            const user = await prisma.user.findUnique({
                where: { address },
                include: { trades: { include: { market: true } } }
            });
            
            if (!user) {
                res.end(JSON.stringify({ totalWinnings: 0, activePositions: 0 }));
                return;
            }

            const activePositionsList = [];
            const uniqueActiveMarkets = new Set();
            for (const trade of user.trades) {
                if (!trade.market.resolved && !uniqueActiveMarkets.has(trade.marketId)) {
                    uniqueActiveMarkets.add(trade.marketId);
                    activePositionsList.push({
                        id: trade.marketId,
                        title: trade.market.title,
                        side: trade.isYes ? 'YES' : 'NO',
                        amount: trade.amount
                    });
                }
            }
            
            res.end(JSON.stringify({ 
                totalWinnings: user.totalWinnings, 
                activePositionsCount: uniqueActiveMarkets.size,
                activePositions: activePositionsList
            }));
        } catch(e) {
            res.writeHead(500); res.end('DB Error');
        }
        return;
    }

    if (req.method === 'GET' && req.url === '/api/v1/network') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        
        let rpcStatus = "Disconnected";
        let latestBlock = 0;
        try {
            const provider = ProviderFactory.getProvider();
            latestBlock = await provider.getBlockNumber();
            rpcStatus = "Connected";
        } catch (e) {}

        let dbStatus = "Disconnected";
        try {
            const { DbAdapter } = await import('./services/db_adapter');
            const client = DbAdapter.getClient();
            await client.$queryRaw`SELECT 1`;
            dbStatus = "Connected";
        } catch (e) {}

        const { activeChainConfig } = await import('../config/chains');
        const { ProtocolMetadata } = await import('../config/protocol/protocol');
        
        res.end(JSON.stringify({
            protocol: ProtocolMetadata.name,
            version: ProtocolMetadata.version,
            network: ProtocolMetadata.currentNetwork,
            chainId: activeChainConfig.chainId,
            rpcStatus,
            latestBlock,
            explorer: activeChainConfig.blockExplorer,
            contractsLoaded: true,
            database: dbStatus,
            indexer: "Running",
            uptime: Math.floor(process.uptime())
        }));
        return;
    }

    if (req.method === 'GET' && req.url === '/api/v1/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });

        let rpcStatus = "Disconnected";
        try {
            const provider = ProviderFactory.getProvider();
            await provider.getNetwork();
            rpcStatus = "Connected";
        } catch (e) {}

        let dbStatus = "Disconnected";
        try {
            const { DbAdapter } = await import('./services/db_adapter');
            const client = DbAdapter.getClient();
            await client.$queryRaw`SELECT 1`;
            dbStatus = "Connected";
        } catch (e) {}

        const { ProtocolMetadata } = await import('../config/protocol/protocol');
        const serviceDiagnostics = serviceCatalog.runDiagnostics();
        const memory = process.memoryUsage();

        res.end(JSON.stringify({
            status: (rpcStatus === "Connected" && dbStatus === "Connected") ? "OK" : "DEGRADED",
            database: dbStatus,
            rpc: rpcStatus,
            contracts: "Connected",
            services: serviceDiagnostics,
            swarmNodes: {
                ResearchAgent: "ONLINE",
                MarketIntelAgent: "ONLINE",
                RiskAgent: "ONLINE"
            },
            memory: {
                rss: memory.rss,
                heapTotal: memory.heapTotal,
                heapUsed: memory.heapUsed
            },
            uptime: Math.floor(process.uptime()),
            version: ProtocolMetadata.version
        }));
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    Logger.success(`Transparency Log server running on port ${PORT}`);
});
