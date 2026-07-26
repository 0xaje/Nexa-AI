import { Logger } from '../utils/logger';
import type { UnifiedAgentResponse } from '../orchestration/CoordinatorAgent';
import { ProtocolMetadata } from '../../config/protocol/protocol';
import { ASPConfig } from '../okx/asp.config';
import { serviceCatalog } from '../services/serviceCatalog';
import { ASPManifestService, ASPManifest } from '../services/aspManifestService';

export interface OKXAgentRequest {
    query: string;
    sessionId?: string;
    contextParams?: Record<string, any>;
}

export interface OKXAgentResponse {
    success: boolean;
    provider: string;
    aspType: 'A2A';
    version: string;
    sessionId: string;
    data?: UnifiedAgentResponse | null;
    executionTimeMs: number;
    timestamp: number;
    error?: {
        code: string;
        message: string;
    } | null;
}

export class OKXAgentAdapter {
    static readonly PROVIDER_NAME = ASPConfig.provider;
    static readonly ASP_TYPE = ASPConfig.aspType; // Agent-to-Agent (A2A) ASP for complex reasoning agents
    static readonly ADAPTER_VERSION = ASPConfig.version;
    static readonly DEFAULT_TIMEOUT_MS = ASPConfig.sla.timeoutGuardMs;

    /**
     * Agent Metadata Endpoint Handler
     * Directly reflects synchronized ASPConfig properties.
     */
    static getMetadata() {
        return {
            name: ASPConfig.name,
            category: ASPConfig.category,
            aspType: ASPConfig.aspType,
            aspTypeDescription: ASPConfig.aspTypeDescription,
            productStory: ASPConfig.productStory,
            version: ASPConfig.version,
            description: ASPConfig.description,
            provider: ASPConfig.provider,
            author: ASPConfig.author,
            website: ASPConfig.website,
            repository: ASPConfig.repository,
            supportedServices: serviceCatalog.getCatalog().map(s => s.name),
            servicesDetailed: serviceCatalog.getCatalog(),
            capabilities: ASPConfig.capabilities,
            capabilitiesDetailed: ASPConfig.capabilitiesDetailed,
            defaultPricing: ASPConfig.defaultPricing,
            endpoints: ASPConfig.endpoints,
            supportedNetworks: ASPConfig.supportedNetworks,
            sla: ASPConfig.sla
        };
    }

    /**
     * Agent Manifest Endpoint Handler
     * Exposes full A2A ASP manifest with SHA-256 integrity hash for registration crawlers.
     */
    static getManifest(): ASPManifest {
        return ASPManifestService.generateManifest();
    }

    /**
     * Expanded Health Endpoint Handler with Service Diagnostics
     */
    static getHealth() {
        const diagnostics = serviceCatalog.runDiagnostics();
        const allServicesReady = diagnostics.every(d => d.ready);
        const memory = process.memoryUsage();

        return {
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
            serviceCatalogDiagnostics: diagnostics,
            system: {
                rssBytes: memory.rss,
                heapUsedBytes: memory.heapUsed,
                heapTotalBytes: memory.heapTotal
            }
        };
    }

    /**
     * Version Endpoint Handler
     */
    static getVersion() {
        return {
            name: ASPConfig.name,
            aspType: ASPConfig.aspType,
            version: ASPConfig.version,
            apiVersion: "v1",
            build: `${ProtocolMetadata.release}-stable`,
            environment: ProtocolMetadata.environment
        };
    }

    /**
     * Validate incoming OKX request body
     */
    static validateRequest(reqBody: any): { valid: boolean; error?: string; query?: string; sessionId?: string } {
        if (!reqBody || typeof reqBody !== 'object') {
            return { valid: false, error: "Invalid request payload: Must be a JSON object." };
        }

        const query = reqBody.query || reqBody.prompt || reqBody.message;
        if (!query || typeof query !== 'string' || !query.trim()) {
            return { valid: false, error: "Missing required parameter 'query' (non-empty string)." };
        }

        if (query.length > 1000) {
            return { valid: false, error: "Query exceeds maximum length of 1000 characters." };
        }

        const sessionId = reqBody.sessionId || `okx-a2a-session-${Date.now()}`;
        return { valid: true, query: query.trim(), sessionId };
    }

    /**
     * Process Agent Query with 10s Timeout Guard and Error Isolation
     */
    static async processAgentRequest(reqBody: any): Promise<{ statusCode: number; payload: OKXAgentResponse }> {
        const startTime = Date.now();
        const validation = this.validateRequest(reqBody);

        if (!validation.valid || !validation.query) {
            return {
                statusCode: 400,
                payload: {
                    success: false,
                    provider: this.PROVIDER_NAME,
                    aspType: "A2A",
                    version: this.ADAPTER_VERSION,
                    sessionId: validation.sessionId || `err-${Date.now()}`,
                    data: null,
                    executionTimeMs: Date.now() - startTime,
                    timestamp: Date.now(),
                    error: {
                        code: "INVALID_INPUT",
                        message: validation.error || "Invalid request."
                    }
                }
            };
        }

        const sessionId = validation.sessionId!;
        const query = validation.query;

        try {
            Logger.info(`[OKX_A2A_ADAPTER] Processing request session "${sessionId}": "${query}"`);

            // Enforce 10s timeout protection wrapper
            const { CoordinatorAgent } = await import('../orchestration/CoordinatorAgent');
            const agentPromise = CoordinatorAgent.processQuery(query);
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error("Request processing timeout after 10,000ms")), this.DEFAULT_TIMEOUT_MS);
            });

            const agentResult = await Promise.race([agentPromise, timeoutPromise]);

            return {
                statusCode: 200,
                payload: {
                    success: true,
                    provider: this.PROVIDER_NAME,
                    aspType: "A2A",
                    version: this.ADAPTER_VERSION,
                    sessionId,
                    data: agentResult,
                    executionTimeMs: Date.now() - startTime,
                    timestamp: Date.now(),
                    error: null
                }
            };
        } catch (err: any) {
            const isTimeout = err.message && err.message.includes("timeout");
            Logger.error(`[OKX_A2A_ADAPTER] Error processing request for session "${sessionId}":`, err);

            return {
                statusCode: isTimeout ? 504 : 500,
                payload: {
                    success: false,
                    provider: this.PROVIDER_NAME,
                    aspType: "A2A",
                    version: this.ADAPTER_VERSION,
                    sessionId,
                    data: null,
                    executionTimeMs: Date.now() - startTime,
                    timestamp: Date.now(),
                    error: {
                        code: isTimeout ? "REQUEST_TIMEOUT" : "INTERNAL_ERROR",
                        message: err.message || "An unexpected error occurred while processing the agent request."
                    }
                }
            };
        }
    }
}
