import { ASPConfig, ASPRegistrationConfig } from '../okx/asp.config';
import { serviceCatalog } from './serviceCatalog';
import * as crypto from 'crypto';

export interface ASPManifest {
    aspId: string;
    schemaVersion: string;
    registrationTimestamp: string;
    provider: {
        name: string;
        organization: string;
        author: string;
        website: string;
        repository: string;
    };
    agent: {
        name: string;
        version: string;
        category: string;
        aspType: 'A2A' | 'DIRECT';
        description: string;
        productStory: string;
    };
    services: ReturnType<typeof serviceCatalog.getCatalog>;
    capabilities: typeof ASPConfig.capabilities;
    endpoints: typeof ASPConfig.endpoints;
    networks: string[];
    sla: typeof ASPConfig.sla;
    integrityHash: string;
}

export class ASPManifestService {
    /**
     * Generate the complete OKX.AI ASP Registration Manifest
     */
    public static generateManifest(): ASPManifest {
        const catalog = serviceCatalog.getCatalog();
        const timestamp = new Date().toISOString();
        const aspId = `asp-okx-a2a-${ASPConfig.name.toLowerCase().replace(/\s+/g, '-')}-v${ASPConfig.version}`;

        const payloadToHash = {
            aspId,
            name: ASPConfig.name,
            version: ASPConfig.version,
            aspType: ASPConfig.aspType,
            servicesCount: catalog.length,
            capabilitiesCount: ASPConfig.capabilities.length,
            endpoints: ASPConfig.endpoints
        };

        const integrityHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(payloadToHash))
            .digest('hex');

        return {
            aspId,
            schemaVersion: "1.0.0",
            registrationTimestamp: timestamp,
            provider: {
                name: ASPConfig.provider,
                organization: "Nexa AI Foundation",
                author: ASPConfig.author,
                website: ASPConfig.website,
                repository: ASPConfig.repository
            },
            agent: {
                name: ASPConfig.name,
                version: ASPConfig.version,
                category: ASPConfig.category,
                aspType: ASPConfig.aspType,
                description: ASPConfig.description,
                productStory: ASPConfig.productStory
            },
            services: catalog,
            capabilities: ASPConfig.capabilities,
            endpoints: ASPConfig.endpoints,
            networks: ASPConfig.supportedNetworks,
            sla: ASPConfig.sla,
            integrityHash
        };
    }
}
