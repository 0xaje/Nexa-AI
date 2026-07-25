import { ProtocolMetadata } from '../../config/protocol/protocol';

export interface PlatformMetadata {
    name: string;
    platform: string;
    category: string;
    aspType: string;
    version: string;
    description: string;
    services: string[];
    capabilities: string[];
    endpoints: Record<string, string>;
    supportedNetworks: string[];
}

export interface PlatformHealth {
    status: string;
    service: string;
    platform: string;
    aspType: string;
    uptimeSeconds: number;
    timestamp: number;
}

export interface PlatformVersion {
    name: string;
    platform: string;
    aspType: string;
    version: string;
    apiVersion: string;
    build: string;
    environment: string;
}

export abstract class BasePlatformAdapter {
    abstract readonly platformName: string;
    abstract readonly aspType: string;
    abstract readonly adapterVersion: string;

    /**
     * Get platform-specific metadata
     */
    abstract getMetadata(): PlatformMetadata;

    /**
     * Get platform health status
     */
    abstract getHealth(): PlatformHealth;

    /**
     * Get platform version metrics
     */
    abstract getVersion(): PlatformVersion;

    /**
     * Process platform agent query
     */
    abstract processRequest(reqBody: any): Promise<{ statusCode: number; payload: any }>;
}
