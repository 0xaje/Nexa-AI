import { ASPConfig } from '../server/okx/asp.config';

export default function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(200).json({
        name: ASPConfig.name,
        aspType: ASPConfig.aspType,
        version: ASPConfig.version,
        apiVersion: "v1",
        build: "v1-stable",
        environment: "Production"
    });
}
