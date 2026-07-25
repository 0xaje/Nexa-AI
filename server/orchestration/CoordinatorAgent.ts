import { Logger } from '../utils/logger';
import { ResearchAgent, ResearchReport } from './ResearchAgent';
import { MarketIntelligenceAgent, MarketIntelligenceReport } from './MarketIntelligenceAgent';
import { RiskAgent, RiskAnalysisReport } from './RiskAgent';
import { PredictionAgent, PredictionProposal } from './PredictionAgent';
import { ToolRegistry, ToolResult } from '../tools';

export type UserIntent = 'RESEARCH' | 'MARKET_INTELLIGENCE' | 'RISK_ANALYSIS' | 'PREDICTION_GENERATION' | 'GENERAL_QUERY';

export interface UnifiedAgentResponse {
    query: string;
    primaryIntent: UserIntent;
    research?: ResearchReport;
    marketIntel?: MarketIntelligenceReport;
    riskAnalysis?: RiskAnalysisReport;
    predictionProposal?: PredictionProposal;
    toolExecutions: ToolResult[];
    aggregatedSummary: string;
    confidenceScore: number;
}

export class CoordinatorAgent {
    static readonly AGENT_NAME = 'CoordinatorAgent';
    static readonly ROLE = 'Master Orchestrator & Request Router';

    /**
     * Classified user query intent based on keywords
     */
    static classifyIntent(query: string): UserIntent {
        const q = query.toLowerCase();
        if (q.includes('predict') || q.includes('proposal') || q.includes('idea') || q.includes('target')) {
            return 'PREDICTION_GENERATION';
        }
        if (q.includes('risk') || q.includes('volatility') || q.includes('safety') || q.includes('buy') || q.includes('sell')) {
            return 'RISK_ANALYSIS';
        }
        if (q.includes('research') || q.includes('token') || q.includes('tokenomics') || q.includes('sui') || q.includes('btc') || q.includes('eth')) {
            return 'RESEARCH';
        }
        if (q.includes('market') || q.includes('trend') || q.includes('signal') || q.includes('today')) {
            return 'MARKET_INTELLIGENCE';
        }
        return 'GENERAL_QUERY';
    }

    /**
     * Orchestrate user query across specialized internal agents & modular tool layer
     */
    static async processQuery(query: string): Promise<UnifiedAgentResponse> {
        const intent = this.classifyIntent(query);
        Logger.info(`[${CoordinatorAgent.AGENT_NAME}] User request received. Classified Intent: ${intent}. Query: "${query}"`);

        let research: ResearchReport | undefined;
        let marketIntel: MarketIntelligenceReport | undefined;
        let riskAnalysis: RiskAnalysisReport | undefined;
        let predictionProposal: PredictionProposal | undefined;
        const toolExecutions: ToolResult[] = [];

        // Dynamically invoke tools via ToolRegistry based on intent
        if (intent === 'RESEARCH' || intent === 'GENERAL_QUERY') {
            const mktTool = await ToolRegistry.executeTool('MarketDataTool', { query });
            const tokenTool = await ToolRegistry.executeTool('TokenResearchTool', { query });
            toolExecutions.push(mktTool, tokenTool);

            research = await ResearchAgent.executeResearch(query);
            marketIntel = await MarketIntelligenceAgent.evaluateMarketSignals(query);
            riskAnalysis = await RiskAgent.analyzeRisk(query);
        } else if (intent === 'MARKET_INTELLIGENCE') {
            const newsTool = await ToolRegistry.executeTool('NewsTool', { query });
            const sentimentTool = await ToolRegistry.executeTool('SentimentTool', { query });
            toolExecutions.push(newsTool, sentimentTool);

            marketIntel = await MarketIntelligenceAgent.evaluateMarketSignals(query);
            research = await ResearchAgent.executeResearch(query);
        } else if (intent === 'RISK_ANALYSIS') {
            const mktTool = await ToolRegistry.executeTool('MarketDataTool', { query });
            const sentimentTool = await ToolRegistry.executeTool('SentimentTool', { query });
            toolExecutions.push(mktTool, sentimentTool);

            riskAnalysis = await RiskAgent.analyzeRisk(query);
            marketIntel = await MarketIntelligenceAgent.evaluateMarketSignals(query);
        } else if (intent === 'PREDICTION_GENERATION') {
            const predTool = await ToolRegistry.executeTool('PredictionGeneratorTool', { query });
            toolExecutions.push(predTool);

            predictionProposal = await PredictionAgent.generateProposal(query);
            riskAnalysis = await RiskAgent.analyzeRisk(query);
        }

        const aggregatedSummary = this.synthesizeSummary(intent, query, research, marketIntel, riskAnalysis, predictionProposal, toolExecutions);

        return {
            query,
            primaryIntent: intent,
            research,
            marketIntel,
            riskAnalysis,
            predictionProposal,
            toolExecutions,
            aggregatedSummary,
            confidenceScore: 0.94
        };
    }

    private static synthesizeSummary(
        intent: UserIntent,
        query: string,
        research?: ResearchReport,
        marketIntel?: MarketIntelligenceReport,
        riskAnalysis?: RiskAnalysisReport,
        predictionProposal?: PredictionProposal,
        toolExecutions: ToolResult[] = []
    ): string {
        let summary = `### Nexa AI Intelligence Report for "${query}"\n\n`;

        if (research) {
            summary += `**Token Research**: ${research.summary}\n`;
        }
        if (marketIntel) {
            summary += `**Market Telemetry**: ${marketIntel.summary}\n`;
        }
        if (riskAnalysis) {
            summary += `**Risk Audit**: ${riskAnalysis.summary}\n`;
        }
        if (predictionProposal) {
            summary += `**Verifiable Prediction**: ${predictionProposal.summary}\n`;
        }
        if (toolExecutions.length > 0) {
            summary += `\n*Executed ${toolExecutions.length} tool(s) via ToolRegistry: ${toolExecutions.map(t => t.toolName).join(', ')}*`;
        }

        return summary;
    }
}
