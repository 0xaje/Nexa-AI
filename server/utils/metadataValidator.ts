import { ProtocolMetadata } from '../../config/protocol/protocol';
import { ASPConfig } from '../okx/asp.config';
import { serviceCatalog } from '../services/serviceCatalog';
import { ASPManifestService } from '../services/aspManifestService';
import { Logger } from './logger';

export interface MetadataValidationResult {
    synchronized: boolean;
    errors: string[];
    timestamp: string;
}

export class MetadataValidator {
    /**
     * Validate that all protocol metadata, ASP configuration, service catalog,
     * and ASP manifest stay strictly synchronized.
     */
    public static validate(): MetadataValidationResult {
        const errors: string[] = [];

        // 1. Verify Name Synchronization
        if (ASPConfig.name !== ProtocolMetadata.name) {
            errors.push(`Name Mismatch: ASPConfig.name ("${ASPConfig.name}") !== ProtocolMetadata.name ("${ProtocolMetadata.name}")`);
        }

        // 2. Verify Version Synchronization
        if (ASPConfig.version !== ProtocolMetadata.version) {
            errors.push(`Version Mismatch: ASPConfig.version ("${ASPConfig.version}") !== ProtocolMetadata.version ("${ProtocolMetadata.version}")`);
        }

        // 3. Verify Description Synchronization
        if (ASPConfig.description !== ProtocolMetadata.protocolDescription) {
            errors.push(`Description Mismatch: ASPConfig.description !== ProtocolMetadata.protocolDescription`);
        }

        // 4. Verify Service Catalog matches ASPConfig supported services
        const catalogServices = serviceCatalog.getCatalog();
        if (catalogServices.length !== ASPConfig.servicesDetailed.length) {
            errors.push(`Catalog Mismatch: Catalog services count (${catalogServices.length}) !== ASPConfig services count (${ASPConfig.servicesDetailed.length})`);
        }

        // 5. Verify Manifest Integrity
        const manifest = ASPManifestService.generateManifest();
        if (!manifest.integrityHash || manifest.integrityHash.length !== 64) {
            errors.push(`Manifest Integrity Error: Invalid SHA-256 integrity hash in ASP Manifest.`);
        }

        if (manifest.agent.name !== ProtocolMetadata.name) {
            errors.push(`Manifest Agent Name Mismatch: "${manifest.agent.name}" !== "${ProtocolMetadata.name}"`);
        }

        const synchronized = errors.length === 0;

        if (synchronized) {
            Logger.success(`[METADATA_VALIDATOR] All ASP metadata fields synchronized successfully (Integrity: ${manifest.integrityHash.substring(0, 12)}...).`);
        } else {
            Logger.error(`[METADATA_VALIDATOR] Metadata synchronization validation failed with ${errors.length} errors:`);
            errors.forEach(err => Logger.error(` - ${err}`));
        }

        return {
            synchronized,
            errors,
            timestamp: new Date().toISOString()
        };
    }
}
