import { BasePlatformAdapter, PlatformMetadata, PlatformHealth, PlatformVersion } from './BasePlatformAdapter';
import { OKXAgentAdapter } from './okx_agent_adapter';
import { ASPManifest } from '../services/aspManifestService';

export class OKXAIAdapter extends BasePlatformAdapter {
    readonly platformName = 'OKX.AI';
    readonly aspType = 'A2A';
    readonly adapterVersion = '1.0.0';

    getMetadata(): PlatformMetadata {
        const raw = OKXAgentAdapter.getMetadata();
        return {
            name: raw.name,
            platform: this.platformName,
            category: raw.category,
            aspType: raw.aspType,
            version: raw.version,
            description: raw.description,
            services: raw.supportedServices,
            capabilities: raw.capabilities,
            endpoints: raw.endpoints,
            supportedNetworks: raw.supportedNetworks
        };
    }

    getManifest(): ASPManifest {
        return OKXAgentAdapter.getManifest();
    }

    getHealth(): PlatformHealth {
        const raw = OKXAgentAdapter.getHealth();
        return {
            status: raw.status,
            service: raw.service,
            platform: this.platformName,
            aspType: raw.aspType,
            uptimeSeconds: raw.uptimeSeconds,
            timestamp: raw.timestamp
        };
    }

    getVersion(): PlatformVersion {
        const raw = OKXAgentAdapter.getVersion();
        return {
            name: raw.name,
            platform: this.platformName,
            aspType: raw.aspType,
            version: raw.version,
            apiVersion: raw.apiVersion,
            build: raw.build,
            environment: raw.environment
        };
    }

    async processRequest(reqBody: any): Promise<{ statusCode: number; payload: any }> {
        return await OKXAgentAdapter.processAgentRequest(reqBody);
    }
}

export const okxAIAdapter = new OKXAIAdapter();
