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
        const p = prompt.toLowerCase();

        if (p.includes('eth') || p.includes('ethereum')) {
            return this.getEthereumScenario(prompt);
        } else if (p.includes('sol') || p.includes('solana')) {
            return this.getSolanaScenario(prompt);
        } else if (p.includes('btc') || p.includes('bitcoin')) {
            return this.getBitcoinRiskScenario(prompt);
        } else if (p.includes('predict') || p.includes('proposal') || p.includes('idea') || p.includes('opportunity')) {
            return this.getPredictionScenario(prompt);
        } else {
            return this.getMarketOverviewScenario(prompt);
        }
    }

    private getEthereumScenario(prompt: string): LlmEvaluationResponse {
        const summary = `### Executive Summary
[SIMULATED DEMO RESPONSE] Multi-agent analysis confirms strong structural momentum for Ethereum following Layer 2 rollup expansion and post-Dencun blob stabilization.

### Key Findings
- Layer 2 Total Value Locked (TVL) reached a new all-time high of $48.2B across Arbitrum, Base, and Optimism.
- Post-Dencun blob transaction throughput increased by +34% with sub-cent settlement fees.
- Institutional staking pool participation expanded by +18.2% month-over-month.

### Market Signals
- ETH/USD price up +5.2% in 24h with 24h DEX volume exceeding $21.4B.
- Net exchange supply reserves decreased by 142,000 ETH, indicating steady spot accumulation.

### Risk Assessment
- Layer 2 liquidity fragmentation between competing rollup ecosystems.
- Temporary blob-space fee variance during peak network congestion periods.

### Confidence Score
96% (High Confidence — Evaluated via simulated multi-agent quorum)

### Suggested Actions
- Monitor L2 gas fee stability across primary rollup bridges.
- Review institutional staking yield issuance rates prior to rebalancing.

### Evidence Used
- CoinGecko Real-Time Price & Volume Telemetry API
- Multi-Agent Quorum Consensus Logs (AnalystAgent, RiskAgent, ComplianceAgent)
- LayerZero & Dune Analytics L2 Bridge Telemetry
- IPFS Anchored Verifiable Intelligence Ledgers`;

        return {
            decision: 'APPROVE',
            confidence: 0.96,
            reasoning: '[SIMULATED DEMO RESPONSE] Multi-agent consensus evaluated Ethereum L2 scaling parameters. AnalystAgent confirmed strong fundamental adoption, while RiskAgent flagged minor L2 liquidity fragmentation.',
            summary,
            risks: 'L2 liquidity fragmentation | Blob-space fee variance',
            supportingEvidence: 'L2 TVL $48.2B ATH | Blob transaction volume +34% | Exchange reserves -142k ETH',
            recommendedQuestion: 'Will L2 TVL exceed $55B prior to the next protocol upgrade window?',
            supportingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] Layer 2 TVL reached $48.2B ATH across top rollups.',
                '[SIMULATED DEMO RESPONSE] Blob transaction volume grew by +34% post-Dencun stabilization.',
                '[SIMULATED DEMO RESPONSE] Net exchange reserves dropped by 142,000 ETH.'
            ],
            contradictingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] Layer 2 liquidity remains fragmented across 4 primary rollups.'
            ],
            riskFactorsList: [
                '[SIMULATED DEMO RESPONSE] Layer 2 liquidity fragmentation.',
                '[SIMULATED DEMO RESPONSE] Blob-space fee volatility during congestion.'
            ]
        };
    }

    private getSolanaScenario(prompt: string): LlmEvaluationResponse {
        const summary = `### Executive Summary
[SIMULATED DEMO RESPONSE] Multi-agent evaluation indicates high network activity for Solana, supported by record active fee-paying addresses and DEX liquidity depth.

### Key Findings
- Daily active fee-paying addresses stabilized at 4.8M+, representing a +22% month-over-month expansion.
- Ecosystem developer repository commit velocity increased by +28% week-over-week.
- Priority fee capture mechanisms improved validator reward stability.

### Market Signals
- SOL/USD price up +7.4% in 24h with daily DEX trading volume exceeding $3.2B.
- Social volume and positive sentiment ratio increased by +16.5%.

### Risk Assessment
- Validator node hardware concentration in top data center providers.
- Memory pressure risks on RPC nodes during high-throughput minting events.

### Confidence Score
92% (High Confidence — Evaluated via simulated multi-agent quorum)

### Suggested Actions
- Track validator cluster uptime and RPC response latency metrics.
- Monitor priority fee trendlines during peak DEX volume hours.

### Evidence Used
- CoinGecko Real-Time Price & Volume Telemetry API
- Solana RPC Cluster Telemetry & Active Address Metrics
- Multi-Agent Quorum Consensus Logs (AnalystAgent, RiskAgent, ComplianceAgent)
- IPFS Anchored Verifiable Intelligence Ledgers`;

        return {
            decision: 'APPROVE',
            confidence: 0.92,
            reasoning: '[SIMULATED DEMO RESPONSE] Multi-agent consensus evaluated Solana network metrics. AnalystAgent highlighted 4.8M active fee-paying addresses, while RiskAgent audited validator hardware concentration risks.',
            summary,
            risks: 'Validator hardware concentration | RPC memory pressure',
            supportingEvidence: 'Active addresses 4.8M+ | DEX volume $3.2B/day | Developer commits +28%',
            recommendedQuestion: 'Will Solana daily DEX volume maintain leadership over EVM L2s throughout Q3?',
            supportingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] Daily active fee-paying addresses stabilized above 4.8M.',
                '[SIMULATED DEMO RESPONSE] Daily DEX trading volume exceeded $3.2B.',
                '[SIMULATED DEMO RESPONSE] Developer repository activity up +28%.'
            ],
            contradictingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] Validator node hosting remains concentrated across 3 primary data centers.'
            ],
            riskFactorsList: [
                '[SIMULATED DEMO RESPONSE] Validator hardware concentration.',
                '[SIMULATED DEMO RESPONSE] RPC node memory pressure during high-throughput rushes.'
            ]
        };
    }

    private getBitcoinRiskScenario(prompt: string): LlmEvaluationResponse {
        const summary = `### Executive Summary
[SIMULATED DEMO RESPONSE] Multi-agent risk audit confirms strong accumulation metrics for Bitcoin, offset by standard macro interest rate volatility parameters.

### Key Findings
- U.S. Spot Bitcoin ETFs recorded average daily net inflows of $420M.
- Centralized exchange supply reserves reached a 5-year low of 2.1M BTC.
- Network mining hashrate achieved an all-time high of 720 EH/s with stable difficulty adjustments.

### Market Signals
- BTC/USD price up +3.8% in 24h, trading at $104,250 with $42.8B in 24h spot volume.
- Long/Short liquidations ratio remains balanced at 52%/48%, mitigating systemic squeeze risk.

### Risk Assessment
- Federal Reserve interest rate commentary may trigger short-term market volatility.
- Miner profit-taking following post-halving margin compression.

### Confidence Score
98% (High Confidence — Evaluated via simulated multi-agent quorum)

### Suggested Actions
- Maintain disciplined position sizing with a 14.5% downside risk buffer.
- Monitor daily spot ETF net inflow reports at market close.

### Evidence Used
- U.S. Spot Bitcoin ETF Net Inflow Ledger (Farside/Bloomberg Terminal)
- Glassnode Exchange Supply & Miner Hashrate Data
- Multi-Agent Quorum Consensus Logs (AnalystAgent, RiskAgent, ComplianceAgent)
- IPFS Anchored Verifiable Intelligence Ledgers`;

        return {
            decision: 'APPROVE',
            confidence: 0.98,
            reasoning: '[SIMULATED DEMO RESPONSE] Multi-agent risk audit confirmed institutional ETF accumulation. RiskAgent verified liquidations ratio balance while flagging Fed interest rate sensitivity.',
            summary,
            risks: 'Macro interest rate sensitivity | Miner profit-taking',
            supportingEvidence: 'ETF net inflows $420M/day | Exchange reserves 5-year low | Hashrate 720 EH/s ATH',
            recommendedQuestion: 'Will Bitcoin spot ETF net inflows exceed $1B in a single trading session this quarter?',
            supportingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] Spot ETF net inflows averaged $420M daily.',
                '[SIMULATED DEMO RESPONSE] Exchange supply reserves reached a 5-year low.',
                '[SIMULATED DEMO RESPONSE] Hashrate reached an all-time high of 720 EH/s.'
            ],
            contradictingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] Post-halving miner revenue compression may prompt localized selling.'
            ],
            riskFactorsList: [
                '[SIMULATED DEMO RESPONSE] Federal Reserve interest rate commentary.',
                '[SIMULATED DEMO RESPONSE] Post-halving miner profit-taking.'
            ]
        };
    }

    private getMarketOverviewScenario(prompt: string): LlmEvaluationResponse {
        const summary = `### Executive Summary
[SIMULATED DEMO RESPONSE] Multi-agent market overview shows positive crypto market expansion, led by AI infrastructure tokens and L2 scaling protocols.

### Key Findings
- Total crypto market capitalization expanded by +3.4% in 24h to $3.65T.
- AI sector tokens outperformed the market benchmark by +18.2% over 7 days.
- Stablecoin total market cap grew by +$2.8B, signaling fresh capital entry.

### Market Signals
- Crypto Fear & Greed Index at 78 (Greed), reflecting strong accumulation sentiment.
- Altcoin market dominance index increased to 41.2%.

### Risk Assessment
- Elevated perpetual market funding rates warrant stop-loss risk discipline.
- Macro economic data releases could induce localized volatility spikes.

### Confidence Score
94% (High Confidence — Evaluated via simulated multi-agent quorum)

### Suggested Actions
- Rebalance portfolio towards high-conviction AI infrastructure tokens.
- Set conservative trailing stop-losses on leveraged positions.

### Evidence Used
- Global Crypto Market Telemetry API (CoinGecko/CoinMarketCap)
- Crypto Fear & Greed Index Telemetry
- Multi-Agent Quorum Consensus Logs (AnalystAgent, RiskAgent, ComplianceAgent)
- IPFS Anchored Verifiable Intelligence Ledgers`;

        return {
            decision: 'APPROVE',
            confidence: 0.94,
            reasoning: '[SIMULATED DEMO RESPONSE] Multi-agent market overview evaluated global capital flows. AnalystAgent confirmed AI sector outperformance (+18.2%), while RiskAgent cautioned against high perpetual funding rates.',
            summary,
            risks: 'Elevated funding rates | Macro economic data volatility',
            supportingEvidence: 'Market cap $3.65T (+3.4%) | AI sector outperformance +18.2% | Stablecoin inflow +$2.8B',
            recommendedQuestion: 'Which sub-sectors will lead market outperformance over the next 30 days?',
            supportingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] Total crypto market cap grew by +3.4% to $3.65T.',
                '[SIMULATED DEMO RESPONSE] AI sector tokens outperformed benchmarks by +18.2%.',
                '[SIMULATED DEMO RESPONSE] Stablecoin market cap expanded by +$2.8B.'
            ],
            contradictingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] High perpetual funding rates signal potential short-term flush risks.'
            ],
            riskFactorsList: [
                '[SIMULATED DEMO RESPONSE] Elevated perpetual market funding rates.',
                '[SIMULATED DEMO RESPONSE] Macro economic data releases.'
            ]
        };
    }

    private getPredictionScenario(prompt: string): LlmEvaluationResponse {
        const summary = `### Executive Summary
[SIMULATED DEMO RESPONSE] Multi-agent prediction proposal formulation for AI sector token transaction volume scaling.

### Key Findings
- Autonomous AI agent transaction volume expanded by +45% month-over-month across EVM testnets and mainnets.
- Decentralized compute demand token velocity increased by +28%.

### Market Signals
- AI Agent protocol active addresses grew from 120,000 to 450,000 over 30 days.
- Smart contract execution gas usage reached record highs.

### Risk Assessment
- Protocol smart contract upgrade timelocks and dependency updates.
- Temporary compute node supply bottlenecks during peak utilization.

### Confidence Score
94% (High Confidence — Evaluated via simulated multi-agent quorum)

### Suggested Actions
- Review verifiable proposal details on-chain prior to settlement lock.
- Monitor compute node throughput statistics daily.

### Evidence Used
- On-Chain Smart Contract Ledger Events
- Multi-Agent Quorum Consensus Logs (AnalystAgent, RiskAgent, ComplianceAgent)
- IPFS Anchored Verifiable Intelligence Evidence Packages

### Prediction Question
Will daily autonomous AI agent transaction volume exceed 10M transactions before Q4?

### Possible Outcomes
- YES: Daily AI agent transactions exceed 10M before Q4.
- NO: Daily AI agent transactions remain below 10M before Q4.

### Estimated Probability
- YES: 78% | NO: 22%

### Reasoning
[SIMULATED DEMO RESPONSE] Multi-agent consensus derived a 78% YES probability based on historical transaction growth curves, compute demand expansion telemetry, and bounded downside protocol risks.`;

        return {
            decision: 'APPROVE',
            confidence: 0.94,
            reasoning: '[SIMULATED DEMO RESPONSE] PredictionAgent formulated a verifiable binary proposal with 78% YES probability backed by multi-agent consensus and IPFS evidence packaging.',
            summary,
            risks: 'Smart contract upgrade timelocks | Compute node supply bottlenecks',
            supportingEvidence: 'AI agent tx volume +45% MoM | Active addresses 450k | YES probability 78%',
            recommendedQuestion: 'Shall we submit this verifiable prediction proposal directly to the smart contract ledger?',
            supportingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] AI agent transaction volume grew by +45% month-over-month.',
                '[SIMULATED DEMO RESPONSE] AI agent active addresses reached 450,000.',
                '[SIMULATED DEMO RESPONSE] Multi-agent consensus computed 78% YES probability.'
            ],
            contradictingEvidenceList: [
                '[SIMULATED DEMO RESPONSE] Potential compute node hardware supply bottlenecks could cap short-term throughput.'
            ],
            riskFactorsList: [
                '[SIMULATED DEMO RESPONSE] Smart contract upgrade timelock delays.',
                '[SIMULATED DEMO RESPONSE] Compute node hardware supply bottlenecks.'
            ]
        };
    }
}
