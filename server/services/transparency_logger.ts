import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Logger } from '../utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TransparencyLogger {
    static logApproval(txHash: string, title: string, category: string, inputSignals: string, reason: string, confidence: number, decision: string) {
        const logDir = path.join(__dirname, '../../logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        
        const logFile = path.join(logDir, 'nexa_transparency.log');
        
        // Structure exact verifiable format as requested
        const logEntry = {
            timestamp: new Date().toISOString(),
            txHash,
            marketTitle: title,
            category: category,
            inputSignals: inputSignals,
            aiReasoning: reason,
            confidenceScore: confidence,
            finalApprovalDecision: decision
        };

        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
        
        // Dynamically update formatted_transparency.json
        const formattedLogFile = path.join(logDir, 'formatted_transparency.json');
        let formattedEntries: any[] = [];
        if (fs.existsSync(formattedLogFile)) {
            try {
                const content = fs.readFileSync(formattedLogFile, 'utf-8');
                formattedEntries = JSON.parse(content);
                if (!Array.isArray(formattedEntries)) {
                    formattedEntries = [];
                }
            } catch (e) {
                formattedEntries = [];
            }
        }
        formattedEntries.push(logEntry);
        fs.writeFileSync(formattedLogFile, JSON.stringify(formattedEntries, null, 2), 'utf-8');

        Logger.success(`[TRANSPARENCY] Verifiable AI log entries written securely for txHash: ${txHash}`);
    }

    static logLlmCall(metrics: any) {
        const logDir = path.join(__dirname, '../../logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        
        const logFile = path.join(logDir, 'llm_calls.log');
        fs.appendFileSync(logFile, JSON.stringify(metrics) + '\n');
        
        const formattedLogFile = path.join(logDir, 'formatted_llm_calls.json');
        let formattedEntries: any[] = [];
        if (fs.existsSync(formattedLogFile)) {
            try {
                const content = fs.readFileSync(formattedLogFile, 'utf-8');
                formattedEntries = JSON.parse(content);
                if (!Array.isArray(formattedEntries)) {
                    formattedEntries = [];
                }
            } catch (e) {
                formattedEntries = [];
            }
        }
        formattedEntries.push(metrics);
        fs.writeFileSync(formattedLogFile, JSON.stringify(formattedEntries, null, 2), 'utf-8');

        if (metrics.error) {
            Logger.warn(`[TELEMETRY] LLM Call Failed | Provider: ${metrics.provider} | Latency: ${metrics.latencyMs}ms | Error: ${metrics.error}`);
        } else {
            Logger.info(`[TELEMETRY] LLM Call Succeeded | Provider: ${metrics.provider} | Model: ${metrics.model} | Latency: ${metrics.latencyMs}ms | Tokens: ${metrics.tokensUsed}`);
        }
    }

    static logIpfsUpload(metrics: any) {
        const logDir = path.join(__dirname, '../../logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        
        const logFile = path.join(logDir, 'ipfs_uploads.log');
        fs.appendFileSync(logFile, JSON.stringify(metrics) + '\n');
        
        const formattedLogFile = path.join(logDir, 'formatted_ipfs_uploads.json');
        let formattedEntries: any[] = [];
        if (fs.existsSync(formattedLogFile)) {
            try {
                const content = fs.readFileSync(formattedLogFile, 'utf-8');
                formattedEntries = JSON.parse(content);
                if (!Array.isArray(formattedEntries)) {
                    formattedEntries = [];
                }
            } catch (e) {
                formattedEntries = [];
            }
        }
        formattedEntries.push(metrics);
        fs.writeFileSync(formattedLogFile, JSON.stringify(formattedEntries, null, 2), 'utf-8');

        if (metrics.error) {
            Logger.warn(`[TELEMETRY] IPFS Upload Failed | Provider: ${metrics.provider} | Latency: ${metrics.latencyMs}ms | Error: ${metrics.error}`);
        } else {
            Logger.info(`[TELEMETRY] IPFS Upload Succeeded | Provider: ${metrics.provider} | CID: ${metrics.cid} | Latency: ${metrics.latencyMs}ms`);
        }
    }

    static logConsensusAudit(metrics: any) {
        const logDir = path.join(__dirname, '../../logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        
        const logFile = path.join(logDir, 'consensus_audits.log');
        fs.appendFileSync(logFile, JSON.stringify(metrics) + '\n');
        
        const formattedLogFile = path.join(logDir, 'formatted_consensus_audits.json');
        let formattedEntries: any[] = [];
        if (fs.existsSync(formattedLogFile)) {
            try {
                const content = fs.readFileSync(formattedLogFile, 'utf-8');
                formattedEntries = JSON.parse(content);
                if (!Array.isArray(formattedEntries)) {
                    formattedEntries = [];
                }
            } catch (e) {
                formattedEntries = [];
            }
        }
        formattedEntries.push(metrics);
        fs.writeFileSync(formattedLogFile, JSON.stringify(formattedEntries, null, 2), 'utf-8');

        Logger.success(`[TELEMETRY] Weighted Consensus Audit Logs written for signal: ${metrics.signalId} | Score: ${metrics.weightedScore.toFixed(4)} | Confidence: ${metrics.weightedConfidence.toFixed(4)} | Probability: ${(metrics.approvalProbability * 100).toFixed(1)}%`);
    }
}
