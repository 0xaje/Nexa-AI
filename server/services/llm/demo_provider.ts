import { LlmProvider, LlmEvaluationResponse } from './types';
import { Logger } from '../../utils/logger';

export class DemoModeProvider implements LlmProvider {
    name = 'Nexa AI Demo Engine';
    model = 'simulated-multi-agent-v1';

    isActive(): boolean {
        // DemoModeProvider is always active as a fail-safe fallback or when DEMO_MODE=true
        return true;
    }

    async analyze(prompt: string): Promise<LlmEvaluationResponse> {
        Logger.info(`[DEMO_MODE_PROVIDER] Generating realistic simulated evaluation for prompt: "${prompt.substring(0, 60)}..."`);

        const isReject = prompt.toLowerCase().includes('scam') || prompt.toLowerCase().includes('exploit');
        const decision = isReject ? 'REJECT' : 'APPROVE';
        const confidence = isReject ? 0.35 : 0.92;

        return {
            decision,
            confidence,
            reasoning: `[SIMULATED DEMO RESPONSE] Multi-agent consensus evaluated signal patterns. AnalystAgent confirmed strong structural indicators, while RiskAgent flagged standard L2 volatility parameters. Compliance audit verified policy alignment.`,
            summary: `[SIMULATED DEMO RESPONSE] Comprehensive multi-agent analysis for signal: ${prompt.substring(0, 50)}...`,
            risks: 'Short-term market volatility | Staking pool reward rate variance | Network throughput spikes',
            supportingEvidence: 'On-chain active address growth (+18.4%) | Positive institutional inflow momentum | High GitHub commit velocity',
            recommendedQuestion: `Will signal target parameters be satisfied within the 24h settlement window?`,
            supportingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] On-chain active address growth increased by +18.4% week-over-week.',
                '[SIMULATED DEMO RESPONSE] Positive institutional net inflow momentum recorded across primary venues.',
                '[SIMULATED DEMO RESPONSE] High developer repository activity with zero outstanding security audit vulnerabilities.'
            ],
            contradictingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] Macro interest rate volatility could impact short-term liquidity depth.'
            ],
            riskFactorsList: [
                '[SIMULATED DEMO RESPONSE] Short-term market volatility.',
                '[SIMULATED DEMO RESPONSE] Staking pool reward rate variance.',
                '[SIMULATED DEMO RESPONSE] Network throughput spikes during peak gas periods.'
            ]
        };
    }
}
