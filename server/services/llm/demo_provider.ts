import { LlmProvider, LlmEvaluationResponse } from './types';
import { Logger } from '../../utils/logger';

export class DemoModeProvider implements LlmProvider {
    name = 'Nexa AI Demo Engine';
    model = 'simulated-multi-agent-v1';

    isActive(): boolean {
        return true;
    }

    async analyze(prompt: string): Promise<LlmEvaluationResponse> {
        Logger.info(`[DEMO_MODE_PROVIDER] Generating realistic simulated evaluation for prompt: "${prompt.substring(0, 60)}..."`);

        const isReject = prompt.toLowerCase().includes('scam') || prompt.toLowerCase().includes('exploit');
        const decision = isReject ? 'REJECT' : 'APPROVE';
        const confidence = isReject ? 0.35 : 0.92;

        const standardizedSummary = `### Executive Summary
[SIMULATED DEMO RESPONSE] Multi-agent analysis confirms positive structural momentum for query: "${prompt.substring(0, 50)}...".

### Key Findings
- On-chain active address growth increased by +18.4% week-over-week.
- High developer repository commit velocity with zero outstanding security audit vulnerabilities.

### Market Signals
- Positive institutional net inflow momentum recorded across primary venues.
- 24h DEX trading volume up +12.4% with stable bid/ask liquidity depth.

### Risk Assessment
- Short-term macro volatility commentary may introduce minor price variance.
- Liquidity safeguard matrix maintains a 12.5% downside cushion.

### Confidence Score
92% (High Confidence — Evaluated via simulated multi-agent quorum)

### Suggested Actions
- Monitor 24h settlement volume for breaking momentum shifts.
- Review on-chain staking issuance rate variance prior to position adjustment.

### Evidence Used
- CoinGecko Real-Time Price & Volume Telemetry API
- Multi-Agent Quorum Consensus Logs (AnalystAgent, RiskAgent, ComplianceAgent)
- IPFS Anchored Verifiable Intelligence Ledgers`;

        return {
            decision,
            confidence,
            reasoning: `[SIMULATED DEMO RESPONSE] Multi-agent consensus evaluated signal patterns. AnalystAgent confirmed strong structural indicators, while RiskAgent flagged standard L2 volatility parameters. Compliance audit verified policy alignment.`,
            summary: standardizedSummary,
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
