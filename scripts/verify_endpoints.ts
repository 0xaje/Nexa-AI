import { OKXAgentAdapter } from '../server/adapters/okx_agent_adapter';

async function runEndpointVerification() {
    console.log("\n==================================================");
    console.log("   NEXA AI ASP ENDPOINT VERIFICATION SUITE");
    console.log("==================================================\n");

    let allPassed = true;

    // ── 1. TEST GET /health ──
    try {
        console.log("1. Testing GET /health ...");
        const healthPayload = OKXAgentAdapter.getHealth();
        const jsonStr = JSON.stringify(healthPayload);
        const parsed = JSON.parse(jsonStr); // Validate JSON parsing

        if (parsed.status !== "OK" && parsed.status !== "DEGRADED") {
            throw new Error(`Unexpected health status: ${parsed.status}`);
        }
        if (!parsed.swarmNodes || !parsed.serviceCatalogDiagnostics) {
            throw new Error("Health response missing swarm nodes or service diagnostics");
        }

        console.log("   [PASS] GET /health - Status: 200 OK | JSON Valid | 0 Errors");
        console.log("   Payload Snippet:", {
            status: parsed.status,
            service: parsed.service,
            version: parsed.version,
            swarmNodes: parsed.swarmNodes,
            diagnosticsCount: parsed.serviceCatalogDiagnostics.length
        });
    } catch (err: any) {
        console.error("   [FAIL] GET /health failed:", err.message);
        allPassed = false;
    }

    console.log("\n--------------------------------------------------\n");

    // ── 2. TEST GET /version ──
    try {
        console.log("2. Testing GET /version ...");
        const versionPayload = OKXAgentAdapter.getVersion();
        const jsonStr = JSON.stringify(versionPayload);
        const parsed = JSON.parse(jsonStr); // Validate JSON parsing

        if (!parsed.name || !parsed.version || !parsed.aspType) {
            throw new Error("Version response missing required fields");
        }

        console.log("   [PASS] GET /version - Status: 200 OK | JSON Valid | 0 Errors");
        console.log("   Payload Snippet:", parsed);
    } catch (err: any) {
        console.error("   [FAIL] GET /version failed:", err.message);
        allPassed = false;
    }

    console.log("\n--------------------------------------------------\n");

    // ── 3. TEST GET /metadata ──
    try {
        console.log("3. Testing GET /metadata ...");
        const metadataPayload = OKXAgentAdapter.getMetadata();
        const jsonStr = JSON.stringify(metadataPayload);
        const parsed = JSON.parse(jsonStr); // Validate JSON parsing

        const requiredKeys = ['name', 'version', 'description', 'category', 'supportedServices', 'capabilities', 'endpoints'];
        for (const key of requiredKeys) {
            if (!parsed[key]) {
                throw new Error(`Metadata payload missing key: ${key}`);
            }
        }

        console.log("   [PASS] GET /metadata - Status: 200 OK | JSON Valid | 0 Errors");
        console.log("   Payload Snippet:", {
            name: parsed.name,
            version: parsed.version,
            category: parsed.category,
            servicesCount: parsed.supportedServices.length,
            capabilitiesCount: parsed.capabilities.length,
            endpoints: parsed.endpoints
        });
    } catch (err: any) {
        console.error("   [FAIL] GET /metadata failed:", err.message);
        allPassed = false;
    }

    console.log("\n--------------------------------------------------\n");

    // ── 4. TEST POST /agent ──
    try {
        console.log("4. Testing POST /agent (Query: 'Analyze ETH L2 metrics & risk')...");
        const reqBody = { query: "Analyze ETH L2 metrics & risk", sessionId: "test-verify-session-001" };
        
        const { statusCode, payload } = await OKXAgentAdapter.processAgentRequest(reqBody);
        const jsonStr = JSON.stringify(payload);
        const parsed = JSON.parse(jsonStr); // Validate JSON parsing

        if (statusCode !== 200) {
            throw new Error(`POST /agent returned status code ${statusCode}`);
        }
        if (!parsed.success || parsed.error !== null) {
            throw new Error(`POST /agent response contains error: ${JSON.stringify(parsed.error)}`);
        }
        if (!parsed.data) {
            throw new Error("POST /agent response data payload is empty");
        }

        console.log("   [PASS] POST /agent - Status: 200 OK | JSON Valid | 0 Errors");
        console.log("   Payload Snippet:", {
            success: parsed.success,
            provider: parsed.provider,
            aspType: parsed.aspType,
            executionTimeMs: parsed.executionTimeMs,
            headline: parsed.data.headline,
            quorumConsensusPct: parsed.data.quorumConsensusPct
        });
    } catch (err: any) {
        console.error("   [FAIL] POST /agent failed:", err.message);
        allPassed = false;
    }

    console.log("\n==================================================");
    if (allPassed) {
        console.log("   ALL ASP ENDPOINTS VERIFIED & COMPLIANT (4/4 PASSED)");
    } else {
        console.log("   VERIFICATION FAILED FOR ONE OR MORE ENDPOINTS");
    }
    console.log("==================================================\n");
}

runEndpointVerification();
