import { Logger } from '../utils/logger';
import { CoordinatorAgent, UnifiedAgentResponse } from '../orchestration/CoordinatorAgent';
import { ProtocolMetadata } from '../../config/protocol/protocol';

export interface OKXAgentRequest {
    query: string;
    sessionId?: string;
    contextParams?: Record<string, any>;
}

export interface OKXAgentResponse {
    success: boolean;
    provider: string;
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
    static readonly PROVIDER_NAME = 'Nexa AI';
    static readonly ADAPTER_VERSION = '1.0.0';
    static readonly DEFAULT_TIMEOUT_MS = 10000;

    /**
     * Agent Metadata Endpoint Handler
     */
    static getMetadata() {
        return {
            name: ProtocolMetadata.name,
            version: this.ADAPTER_VERSION,
            description: ProtocolMetadata.protocolDescription,
            provider: "Nexa AI / OKX AI Agent Service Provider",
            capabilities: [
                "Token Research & Fundamental Analysis",
                "Real-Time Market Signals & News Telemetry",
                "Risk Scoring & Volatility Audit",
                "Verifiable Prediction Proposals & IPFS Evidence Packaging"
            ],
            endpoints: {
                agentQuery: "/api/v1/okx/agent",
                health: "/api/v1/okx/health",
                version: "/api/v1/okx/version",
                metadata: "/api/v1/okx/metadata"
            },
            supportedNetworks: ProtocolMetadata.supportedNetworks,
            author: "Nexa AI Architecture Team",
            website: ProtocolMetadata.website
        };
    }

    /**
     * Health Endpoint Handler
     */
    static getHealth() {
        return {
            status: "OK",
            service: "Nexa AI OKX Agent Provider",
            uptimeSeconds: Math.floor(process.uptime()),
            timestamp: Date.now()
        };
    }

    /**
     * Version Endpoint Handler
     */
    static getVersion() {
        return {
            name: ProtocolMetadata.name,
            version: this.ADAPTER_VERSION,
            apiVersion: "v1",
            build: "v1.0.0-stable",
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

        const sessionId = reqBody.sessionId || `okx-session-${Date.now()}`;
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
            Logger.info(`[OKX_AGENT_ADAPTER] Processing request session "${sessionId}": "${query}"`);

            // Enforce 10s timeout protection wrapper
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
            Logger.error(`[OKX_AGENT_ADAPTER] Error processing request for session "${sessionId}":`, err);

            return {
                statusCode: isTimeout ? 504 : 500,
                payload: {
                    success: false,
                    provider: this.PROVIDER_NAME,
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
