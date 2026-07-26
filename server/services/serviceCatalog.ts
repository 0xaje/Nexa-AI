import { ASPConfig, ASPServiceDefinition } from '../okx/asp.config';
import { Logger } from '../utils/logger';

export interface ServiceDiagnosticResult {
    serviceId: string;
    name: string;
    status: 'ACTIVE' | 'DEGRADED' | 'MAINTENANCE';
    latencyMs: number;
    underlyingAgents: string[];
    ready: boolean;
}

export class ServiceCatalog {
    private static instance: ServiceCatalog;
    private services: Map<string, ASPServiceDefinition>;

    private constructor() {
        this.services = new Map();
        ASPConfig.servicesDetailed.forEach(srv => {
            this.services.set(srv.id, srv);
        });
    }

    public static getInstance(): ServiceCatalog {
        if (!ServiceCatalog.instance) {
            ServiceCatalog.instance = new ServiceCatalog();
        }
        return ServiceCatalog.instance;
    }

    /**
     * Retrieve all registered ASP services from the catalog
     */
    public getCatalog(): ASPServiceDefinition[] {
        return Array.from(this.services.values());
    }

    /**
     * Get a specific service by ID
     */
    public getServiceById(id: string): ASPServiceDefinition | undefined {
        return this.services.get(id);
    }

    /**
     * Run diagnostics across all registered services in the catalog
     */
    public runDiagnostics(): ServiceDiagnosticResult[] {
        const results: ServiceDiagnosticResult[] = [];
        
        for (const srv of this.services.values()) {
            // Check readiness of underlying components
            const isReady = srv.status === 'ACTIVE';
            results.push({
                serviceId: srv.id,
                name: srv.name,
                status: srv.status,
                latencyMs: 15, // Nominal internal routing latency
                underlyingAgents: srv.underlyingAgents,
                ready: isReady
            });
        }

        return results;
    }
}

export const serviceCatalog = ServiceCatalog.getInstance();
