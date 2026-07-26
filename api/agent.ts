import { OKXAgentAdapter } from '../server/adapters/okx_agent_adapter';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end();
        return;
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const { statusCode, payload } = await OKXAgentAdapter.processAgentRequest(body);
        res.status(statusCode).json(payload);
    } catch (err: any) {
        res.status(400).json({
            success: false,
            provider: "Nexa AI",
            error: { code: "INVALID_JSON", message: "Malformed JSON request payload." }
        });
    }
}
