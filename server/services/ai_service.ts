import { NormalizedSignal } from './signal_ingestion';
import { llmManager } from './llm/manager';
import { Logger } from '../utils/logger';
import { CoordinatorAgent } from '../orchestration/CoordinatorAgent';

/**
 * Nexa AI Intelligence Service
 * Orchestrates multi-agent AI analysis via CoordinatorAgent and LLM providers.
 */
export class AIService {
    static async processUserQuery(query: string) {
        Logger.info(`[AI_SERVICE] Processing user query through CoordinatorAgent: "${query}"`);
        return await CoordinatorAgent.processQuery(query);
    }

    static async generateMarketProposal(signal: NormalizedSignal) {
        Logger.info(`[AI_SERVICE] Generating proposal via LLM & CoordinatorAgent for ${signal.category.toUpperCase()}: ${signal.topic.substring(0, 50)}...`);
        
        const prompt = `
Task: Formulate a binary structured intelligence proposal and an Intelligence Report from the incoming real-world signal.
Signal Topic: "${signal.topic}"
Signal Category: "${signal.category}"
Signal Source: "${signal.source}"
Signal Sentiment: "${signal.sentiment}"
Signal Strength: ${signal.signal_strength}

You MUST evaluate this signal and respond in strict JSON matching this schema:
{
  "decision": "APPROVE" | "REJECT",
  "confidence": <number between 0.0 and 1.0>,
  "reasoning": "<detailed reasoning analysis explaining why the recommended decision is proposed>",
  "summary": "<comprehensive summary of the signal, its context, and the logical rationale>",
  "supportingEvidence": ["<supporting evidence statement 1>", "<supporting evidence statement 2>"],
  "contradictingEvidence": ["<contradicting or dissenting evidence statement 1>", "<contradicting or dissenting evidence statement 2>"],
  "risks": ["<risk factor 1>", "<risk factor 2>"],
  "recommendedQuestion": "<clear YES/NO question representing the outcome of the signal. If decision is REJECT, this can be empty>"
}
Do not wrap in markdown or add extra text. Only raw JSON.
`;

        const evaluation = await llmManager.analyze(prompt);

        return {
            category: signal.category,
            title: evaluation.recommendedQuestion || `Will ${signal.topic.substring(0, 40).trim()}... occur?`,
            description: `Decision proposal formulated from signal: ${signal.topic}. Evidence reasoning: ${evaluation.reasoning}. Risks: ${evaluation.risks}`,
            expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            confidence: evaluation.confidence,
            inputSignals: JSON.stringify({ source: signal.source, topic: signal.topic, strength: signal.signal_strength, sentiment: signal.sentiment }),
            reason: evaluation.reasoning,
            intelligenceReport: {
                summary: evaluation.summary || `Evaluation of signal topic: ${signal.topic}`,
                supportingEvidence: evaluation.supportingEvidenceList || [evaluation.supportingEvidence || 'No supporting evidence logged.'],
                contradictingEvidence: evaluation.contradictingEvidenceList || ['None identified at ingestion.'],
                confidence: evaluation.confidence,
                riskFactors: evaluation.riskFactorsList || [evaluation.risks || 'No risks identified.'],
                reasoning: evaluation.reasoning,
                recommendedDecision: evaluation.decision
            }
        };
    }
}
