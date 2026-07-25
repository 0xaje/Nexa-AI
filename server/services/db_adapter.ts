import { PrismaClient } from '@prisma/client';
import { Logger } from '../utils/logger';

export class DbAdapter {
    private static prisma: PrismaClient;

    static getClient() {
        if (!this.prisma) {
            this.prisma = new PrismaClient();
        }
        return this.prisma;
    }

    static async getPendingMarkets(): Promise<any[]> {
        try {
            const client = this.getClient();
            const records = await client.pendingDecision.findMany({
                include: { evaluations: true, intelligenceReport: true },
                orderBy: { createdAt: 'asc' }
            });
            return records;
        } catch (error) {
            Logger.error('[DB_ADAPTER] Error fetching pending decisions', error);
            return [];
        }
    }

    static async addPendingMarket(proposal: any) {
        try {
            const client = this.getClient();
            await client.pendingDecision.create({
                data: {
                    signalId: proposal.signalId || String(Math.random()),
                    title: proposal.title || '',
                    category: proposal.category || '',
                    expiry: String(proposal.expiry || ''),
                    confidence: Number(proposal.confidence || 0),
                    sentiment: proposal.sentiment || '',
                    status: proposal.status || 'PENDING_APPROVAL',
                    ipfsHash: proposal.ipfsHash || null,
                    evaluations: {
                        create: (proposal.evaluations || []).map((e: any) => ({
                            agentName: e.agentName,
                            vote: e.vote,
                            confidence: Number(e.confidence),
                            reasoning: e.reasoning
                        }))
                    },
                    intelligenceReport: proposal.intelligenceReport ? {
                        create: {
                            signalId: proposal.signalId,
                            summary: proposal.intelligenceReport.summary,
                            supportingEvidence: Array.isArray(proposal.intelligenceReport.supportingEvidence)
                                ? JSON.stringify(proposal.intelligenceReport.supportingEvidence)
                                : String(proposal.intelligenceReport.supportingEvidence || '[]'),
                            contradictingEvidence: Array.isArray(proposal.intelligenceReport.contradictingEvidence)
                                ? JSON.stringify(proposal.intelligenceReport.contradictingEvidence)
                                : String(proposal.intelligenceReport.contradictingEvidence || '[]'),
                            confidence: Number(proposal.intelligenceReport.confidence || 0),
                            riskFactors: Array.isArray(proposal.intelligenceReport.riskFactors)
                                ? JSON.stringify(proposal.intelligenceReport.riskFactors)
                                : String(proposal.intelligenceReport.riskFactors || '[]'),
                            reasoning: proposal.intelligenceReport.reasoning,
                            recommendedDecision: proposal.intelligenceReport.recommendedDecision
                        }
                    } : undefined
                }
            });
            Logger.success(`[DB_ADAPTER] Stored proposal and intelligence report in database successfully: ${proposal.title}`);
        } catch (error: any) {
            const errStr = String(error?.message || error);
            if ((error && error.code === 'P2002') || errStr.includes('Unique constraint failed')) {
                Logger.warn(`[DB_ADAPTER] Skipping duplicate proposal write (signalId: ${proposal.signalId} already exists)`);
            } else {
                Logger.error('[DB_ADAPTER] Error writing to database', error);
            }
        }
    }

    static async saveIntelligenceReport(report: any) {
        try {
            const client = this.getClient();
            await client.intelligenceReport.create({
                data: {
                    pendingMarketId: report.pendingMarketId,
                    signalId: report.signalId,
                    summary: report.summary,
                    supportingEvidence: Array.isArray(report.supportingEvidence)
                        ? JSON.stringify(report.supportingEvidence)
                        : String(report.supportingEvidence || '[]'),
                    contradictingEvidence: Array.isArray(report.contradictingEvidence)
                        ? JSON.stringify(report.contradictingEvidence)
                        : String(report.contradictingEvidence || '[]'),
                    confidence: Number(report.confidence || 0),
                    riskFactors: Array.isArray(report.riskFactors)
                        ? JSON.stringify(report.riskFactors)
                        : String(report.riskFactors || '[]'),
                    reasoning: report.reasoning,
                    recommendedDecision: report.recommendedDecision
                }
            });
            Logger.success(`[DB_ADAPTER] Stored IntelligenceReport in database successfully for signalId: ${report.signalId}`);
        } catch (error) {
            Logger.error('[DB_ADAPTER] Error writing IntelligenceReport to database', error);
        }
    }

    static async saveEvidencePackage(pkg: any) {
        try {
            const client = this.getClient();
            await client.evidencePackage.create({
                data: {
                    signalId: pkg.signalId,
                    normalizedSignal: pkg.normalizedSignal,
                    sourceMetadata: pkg.sourceMetadata,
                    aiReasoningRef: pkg.aiReasoningRef,
                    confidenceInputs: Number(pkg.confidenceInputs || 0)
                }
            });
            Logger.success(`[DB_ADAPTER] Stored EvidencePackage in database successfully for signalId: ${pkg.signalId}`);
        } catch (error: any) {
            const errStr = String(error?.message || error);
            if ((error && error.code === 'P2002') || errStr.includes('Unique constraint failed')) {
                Logger.warn(`[DB_ADAPTER] Skipping duplicate EvidencePackage write (signalId: ${pkg.signalId} already exists)`);
            } else {
                Logger.error('[DB_ADAPTER] Error writing EvidencePackage to database', error);
            }
        }
    }

    static async clearPendingMarkets() {
        try {
            const client = this.getClient();
            await client.pendingDecision.deleteMany({});
            Logger.success('[DB_ADAPTER] Database pending decisions cache cleared.');
        } catch (error) {
            Logger.error('[DB_ADAPTER] Error clearing database cache', error);
        }
    }
}
