import { EvidenceSerializer } from '../server/services/evidence/serializer';
import { EvidenceValidator } from '../server/services/evidence/validator';
import { EvidenceService } from '../server/services/evidence/service';
import { Logger } from '../server/utils/logger';

let testPassed = 0;
let testFailed = 0;

function assert(condition: boolean, message: string) {
    if (!condition) {
        testFailed++;
        Logger.error(`[TEST_FAILURE] Assertion failed: ${message}`);
    } else {
        testPassed++;
        Logger.success(`[TEST_SUCCESS] ${message}`);
    }
}

async function runTests() {
    Logger.start("Running Upgraded Evidence Engine Test Suite...");

    // Test Case 1: Deterministic Serialization Sorting
    const objA = { b: 2, a: 1, c: { e: 5, d: 4 } };
    const objB = { c: { d: 4, e: 5 }, a: 1, b: 2 };
    
    const serializedA = EvidenceSerializer.serialize(objA);
    const serializedB = EvidenceSerializer.serialize(objB);
    
    assert(serializedA === serializedB, "Alphabetical key sorting results in identical serialized strings");

    // Test Case 2: Validation of Upgraded Fields
    const validPayload = {
        normalizedSignal: { category: 'crypto', topic: 'Ethereum fees drop', source: 'Etherscan', signal_strength: 95, sentiment: 'bullish' },
        originalSource: 'Etherscan',
        signalSources: ['Etherscan'],
        aiInputs: JSON.stringify({ category: 'crypto', topic: 'Ethereum fees drop', source: 'Etherscan', signal_strength: 95, sentiment: 'bullish' }),
        agentOutputs: [{ agentName: 'AnalystAgent', vote: 'APPROVE', confidence: 0.90, reasoning: 'Strong indicators' }],
        reasoning: 'Consensus approved',
        confidence: 0.90,
        consensus: {
            weightedScore: 0.95,
            weightedConfidence: 0.90,
            approvalProbability: 0.95,
            averagedReputation: 85
        },
        metadata: { protocol: 'Nexa AI', protocolVersion: 'v1.0.0', release: 'v1', build: '1' },
        modelVersion: 'gpt-4o',
        timestamp: new Date().toISOString(),
        promptHash: 'e618b420aef52ad212b7a01996ca224bc56156b0edbc0d0ef9cbcf3ea63a77f0',
        agentIds: ['AnalystAgent'],
        provider: 'Local IPFS Node',
        cid: 'QmRJYvUptYQ723JtXj6dKsz2r11x7c8g9h1m2n3p4q5r6s',
        sha256Hash: '52c737f179fd0b0156b2e4e5a4d816fab525a61440d02bf5d56a702c38579e1b'
    };

    assert(EvidenceValidator.validate(validPayload) === true, "Validator approves schema-compliant upgraded payloads");

    const invalidPayload = { ...validPayload, sha256Hash: undefined };
    assert(EvidenceValidator.validate(invalidPayload) === false, "Validator rejects payloads missing sha256Hash");

    const invalidLengthHash = { ...validPayload, promptHash: 'short-hash' };
    assert(EvidenceValidator.validate(invalidLengthHash) === false, "Validator rejects payloads with invalid hash lengths");

    // Test Case 3: Upgraded Package Compilation
    const signal = {
        category: "tech",
        topic: "Google launches Vertex AI enhancements",
        source: "Google Developer Blog",
        signal_strength: 92,
        sentiment: "bullish",
        timestamp: "2026-07-08T12:00:00Z"
    };

    const evaluations = [
        { agentName: 'AnalystAgent', vote: 'APPROVE', confidence: 0.95, reasoning: 'Strong tech growth' },
        { agentName: 'RiskAgent', vote: 'APPROVE', confidence: 0.90, reasoning: 'Feasible timeline' },
        { agentName: 'ComplianceAgent', vote: 'APPROVE', confidence: 0.95, reasoning: 'Meets safety criteria' }
    ];

    const result = await EvidenceService.generatePackage(signal, evaluations, "Consensus approved by all agents", 0.933, {
        cid: 'QmRJYvUptYQ723JtXj6dKsz2r11x7c8g9h1m2n3p4q5r6s'
    });

    assert(result.payload.sha256Hash !== undefined, "Compiled package contains sha256Hash");
    assert(result.payload.promptHash !== undefined, "Compiled package contains promptHash");
    assert(result.payload.agentIds.length === 3, "Compiled package contains agentIds");

    // Test Case 4: Deterministic Hashing from Identical Inputs
    const result2 = await EvidenceService.generatePackage(signal, evaluations, "Consensus approved by all agents", 0.933, {
        cid: 'QmRJYvUptYQ723JtXj6dKsz2r11x7c8g9h1m2n3p4q5r6s'
    });

    assert(result.payload.sha256Hash === result2.payload.sha256Hash, "Evidence Packages generated twice from identical inputs produce identical hashes");

    Logger.info(`\nTest Summary: ${testPassed} passed, ${testFailed} failed.`);
    if (testFailed > 0) {
        process.exit(1);
    } else {
        Logger.success("All Upgraded Evidence Engine Integration Tests Passed Successfully!");
        process.exit(0);
    }
}

runTests().catch(err => {
    Logger.error("Error running tests", err);
    process.exit(1);
});
