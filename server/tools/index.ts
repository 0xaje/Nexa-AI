import { ToolRegistry } from './ToolRegistry';
import { MarketDataTool } from './MarketDataTool';
import { NewsTool } from './NewsTool';
import { TokenResearchTool } from './TokenResearchTool';
import { SentimentTool } from './SentimentTool';
import { PredictionGeneratorTool } from './PredictionGeneratorTool';

// Auto-register core pluggable tools upon import
ToolRegistry.registerTool(new MarketDataTool());
ToolRegistry.registerTool(new NewsTool());
ToolRegistry.registerTool(new TokenResearchTool());
ToolRegistry.registerTool(new SentimentTool());
ToolRegistry.registerTool(new PredictionGeneratorTool());

export * from './ITool';
export * from './ToolRegistry';
export * from './MarketDataTool';
export * from './NewsTool';
export * from './TokenResearchTool';
export * from './SentimentTool';
export * from './PredictionGeneratorTool';
