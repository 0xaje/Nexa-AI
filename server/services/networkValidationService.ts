import * as dotenv from 'dotenv';
dotenv.config();

import { ethers } from 'ethers';
import { activeChainConfig } from '../../config/chains';
import { getDeployment } from '../../deployments/loader';
import { ProviderFactory } from '../../services/providerFactory';
import { Logger } from '../utils/logger';

export interface ValidationReport {
  success: boolean;
  rpcReachable: boolean;
  chainIdMatches: boolean;
  explorerConfigured: boolean;
  deploymentExists: boolean;
  abiExists: boolean;
  providerInitialized: boolean;
  walletValid: boolean;
  errors: string[];
  latencyMs?: number;
}

export class NetworkValidationService {
  public static async validate(): Promise<ValidationReport> {
    const report: ValidationReport = {
      success: false,
      rpcReachable: false,
      chainIdMatches: false,
      explorerConfigured: false,
      deploymentExists: false,
      abiExists: false,
      providerInitialized: false,
      walletValid: false,
      errors: [],
    };

    Logger.start('Starting Network and Deployment Validation Audit...');

    // 1. Validate Provider Initialization and RPC Reachability
    let provider: ethers.JsonRpcProvider | ethers.WebSocketProvider | undefined = undefined;
    const startTime = Date.now();
    try {
      provider = ProviderFactory.getProvider();
      report.providerInitialized = true;
      
      if (!provider) {
        throw new Error("ProviderFactory returned undefined or null");
      }
      
      const network = await provider.getNetwork();
      report.rpcReachable = true;
      report.latencyMs = Date.now() - startTime;
      
      // 2. Validate Chain ID matches
      const expectedChainId = BigInt(activeChainConfig.chainId);
      if (network.chainId === expectedChainId) {
        report.chainIdMatches = true;
      } else {
        report.errors.push(`Chain ID Mismatch: Expected ${expectedChainId}, got ${network.chainId}`);
      }
    } catch (e: any) {
      report.errors.push(`RPC Connection Failure: ${e.message}`);
    }

    // 3. Validate Explorer Configured
    if (activeChainConfig.blockExplorer && activeChainConfig.blockExplorer.startsWith('http')) {
      report.explorerConfigured = true;
    } else {
      report.errors.push(`Explorer URL invalid or unconfigured: ${activeChainConfig.blockExplorer}`);
    }

    // 4. Validate Deployment Files & ABI
    try {
      const deployment = getDeployment(activeChainConfig.chainId, 'marketProtocol');
      if (deployment) {
        report.deploymentExists = true;
        if (Array.isArray(deployment.abi) && deployment.abi.length > 0) {
          report.abiExists = true;
        } else {
          report.errors.push(`ABI is missing or empty in deployment for chain ID ${activeChainConfig.chainId}`);
        }
      } else {
        report.errors.push(`No deployment configuration file found for chain ID ${activeChainConfig.chainId}`);
      }
    } catch (e: any) {
      report.errors.push(`Deployment Loading Error: ${e.message}`);
    }

    // 5. Validate Wallet Configuration
    const privateKey = process.env.PRIVATE_KEY;
    if (privateKey) {
      try {
        if (provider) {
          const wallet = new ethers.Wallet(privateKey, provider);
          const address = await wallet.getAddress();
          if (ethers.isAddress(address)) {
            report.walletValid = true;
          } else {
            report.errors.push(`Invalid hot wallet address format parsed from PRIVATE_KEY`);
          }
        } else {
          report.errors.push(`Cannot validate wallet: provider not initialized`);
        }
      } catch (e: any) {
        report.errors.push(`Wallet Initialization Failure: ${e.message}`);
      }
    } else {
      report.errors.push(`Required environment variable PRIVATE_KEY is missing`);
    }

    // Set final success flag
    report.success = report.errors.length === 0;

    if (report.success) {
      Logger.success(`Network Validation Passed! Latency: ${report.latencyMs}ms`);
    } else {
      Logger.error(`Network Validation Audit failed with ${report.errors.length} errors:`, report.errors);
    }

    return report;
  }
}
