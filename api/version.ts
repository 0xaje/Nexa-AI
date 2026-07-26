export default function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(200).json({
        name: "Nexa AI",
        aspType: "A2A",
        version: "1.0.0",
        apiVersion: "v1",
        build: "v1-stable",
        environment: "Production"
    });
}
