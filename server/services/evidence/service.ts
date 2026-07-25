import crypto from 'crypto';
import { EvidenceSerializer } from './serializer';
import { EvidenceValidator } from './validator';
import { ipfsManager } from '../ipfs/manager';
import { Logger } from '../../utils/logger';

export interface EvidencePackagePayload {
    normalizedSignal: {
        category: string;
        topic: string;
        source: string;
        signal_strength: number;
        sentiment: string;
    };
    originalSource: string;
    signalSources: string[];
    aiInputs: string;
    agentOutputs: Array<{
        agentName: string;
        vote: string;
        confidence: number;
        reasoning: string;
    }>;
    reasoning: string;
    confidence: number;
    consensus: {
        weightedScore: number;
        weightedConfidence: number;
        approvalProbability: number;
        averagedReputation: number;
    };
    metadata: {
        protocol: string;
        protocolVersion: string;
        release: string;
        build: string;
    };
    modelVersion: string;
    timestamp: string;
    promptHash: string;
    agentIds: string[];
    provider: string;
    cid: string;
    sha256Hash: string; // Cryptographic index hash of all other attributes
}

export interface GeneratePackageOptions {
    timestamp?: string;
    cid?: string;
    promptHash?: string;
    provider?: string;
    protocolVersion?: string;
    modelVersion?: string;
    consensus?: {
        weightedScore: number;
        weightedConfidence: number;
        approvalProbability: number;
        averagedReputation: number;
    };
    aiInputs?: string;
    signalSources?: string[];
}

export class EvidenceService {
    /**
     * Compiles, serializes deterministically, hashes, and validates a unified protocol Evidence Package.
     * Guarantees identical inputs yield identical SHA-256 hashes.
     */
    static async generatePackage(
        signal: any,
        evaluations: any[],
        consensusReasoning: string,
        consensusConfidence: number,
        options: GeneratePackageOptions = {}
    ): Promise<{ payload: EvidencePackagePayload; hash: string }> {
        
        // 1. Establish deterministic attributes
        const timestamp = options.timestamp || signal.timestamp || new Date().toISOString();
        const protocolVersion = options.protocolVersion || 'v2.4.0';
        const modelVersion = options.modelVersion || 'gpt-4o / gemini-1.5-flash / llama3-local';
        const provider = options.provider || 'Local IPFS Node';
        const agentIds = (evaluations || []).map(e => e.agentName).sort();

        // Calculate prompt hash from evaluations content if not explicitly supplied
        let promptHash = options.promptHash;
        if (!promptHash) {
            const combinedAgentInputs = (evaluations || []).map(e => `${e.agentName}:${e.reasoning}`).sort().join('|');
            promptHash = crypto.createHash('sha256').update(combinedAgentInputs).digest('hex');
        }

        // Establish consensus details
        const consensus = options.consensus || {
            weightedScore: typeof signal.signal_strength === 'number' ? signal.signal_strength / 100 : 0.5,
            weightedConfidence: consensusConfidence,
            approvalProbability: 0.5,
            averagedReputation: 80
        };
        const aiInputs = options.aiInputs || JSON.stringify(signal);
        const signalSources = options.signalSources || [signal.source || 'Unknown API'];

        // 2. Build preliminary payload WITHOUT the sha256Hash property
        const prelimPayload: Omit<EvidencePackagePayload, 'sha256Hash'> = {
            normalizedSignal: {
                category: signal.category || 'misc',
                topic: signal.topic || '',
                source: signal.source || 'Unknown API',
                signal_strength: typeof signal.signal_strength === 'number' ? signal.signal_strength : 50,
                sentiment: signal.sentiment || 'neutral'
            },
            originalSource: signal.source || 'Unknown API',
            signalSources,
            aiInputs,
            agentOutputs: (evaluations || []).map(e => ({
                agentName: e.agentName,
                vote: e.vote,
                confidence: typeof e.confidence === 'number' ? e.confidence : 0.5,
                reasoning: e.reasoning || ''
            })),
            reasoning: consensusReasoning,
            confidence: consensusConfidence,
            consensus,
            metadata: {
                protocol: 'Nexa AI',
                protocolVersion,
                release: 'v1',
                build: '1'
            },
            modelVersion,
            timestamp,
            promptHash,
            agentIds,
            provider,
            cid: options.cid || 'PENDING_UPLOAD' // Temporary placeholder for pre-upload hashing target
        };

        // 3. Serialize preliminaries and generate deterministic target hash
        let serialized = EvidenceSerializer.serialize(prelimPayload);
        const calculatedHash = EvidenceSerializer.generateHash(serialized);

        // 4. Determine final CID. If not explicitly passed, upload preliminary payload to IPFS
        let finalCid = options.cid;
        if (!finalCid) {
            // Upload to IPFS via manager (records upload latency and provider used)
            finalCid = await ipfsManager.upload(prelimPayload);
        }

        // 5. Construct final complete payload including CID and sha256Hash
        // To keep hash reproduction deterministic, we compute the sha256Hash of the FINAL object containing the CID
        const finalPayloadWithoutHash: Omit<EvidencePackagePayload, 'sha256Hash'> = {
            ...prelimPayload,
            cid: finalCid
        };

        const finalSerialized = EvidenceSerializer.serialize(finalPayloadWithoutHash);
        const finalHash = EvidenceSerializer.generateHash(finalSerialized);

        const finalPayload: EvidencePackagePayload = {
            ...finalPayloadWithoutHash,
            sha256Hash: finalHash
        };

        // 6. Schema Validation
        if (!EvidenceValidator.validate(finalPayload)) {
            throw new Error('[EVIDENCE_SERVICE] Evidence Package payload schema validation failed.');
        }

        Logger.success(`[EVIDENCE_SERVICE] Verifiable Evidence Package upgraded successfully. Hash: ${finalHash}`);

        return {
            payload: finalPayload,
            hash: `ipfs://${finalCid}`
        };
    }
}
