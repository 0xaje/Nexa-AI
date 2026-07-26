import { ASPConfig } from '../server/okx/asp.config';
import { serviceCatalog } from '../server/services/serviceCatalog';

export default function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(200).json({
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
    });
}
