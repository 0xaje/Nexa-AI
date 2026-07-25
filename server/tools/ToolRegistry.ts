import { ITool, ToolExecuteContext, ToolResult } from './ITool';
import { Logger } from '../utils/logger';

export class ToolRegistry {
    private static tools: Map<string, ITool> = new Map();

    /**
     * Register a new tool dynamically
     */
    static registerTool(tool: ITool): void {
        if (this.tools.has(tool.name)) {
            Logger.warn(`[TOOL_REGISTRY] Overwriting existing tool registration: "${tool.name}"`);
        } else {
            Logger.info(`[TOOL_REGISTRY] Tool registered: "${tool.name}" (${tool.category})`);
        }
        this.tools.set(tool.name, tool);
    }

    /**
     * Get tool instance by name
     */
    static getTool(name: string): ITool | undefined {
        return this.tools.get(name);
    }

    /**
     * List all registered tools
     */
    static listTools(): Array<{ name: string; description: string; category: string }> {
        return Array.from(this.tools.values()).map(t => ({
            name: t.name,
            description: t.description,
            category: t.category
        }));
    }

    /**
     * Execute a tool by name with safety wrapping
     */
    static async executeTool(name: string, context: ToolExecuteContext): Promise<ToolResult> {
        const tool = this.getTool(name);
        if (!tool) {
            Logger.error(`[TOOL_REGISTRY] Tool not found: "${name}"`);
            return {
                toolName: name,
                success: false,
                data: null,
                timestamp: Date.now(),
                error: `Tool "${name}" is not registered in ToolRegistry.`
            };
        }

        try {
            Logger.info(`[TOOL_REGISTRY] Executing tool "${name}" with query: "${context.query}"`);
            return await tool.execute(context);
        } catch (err: any) {
            Logger.error(`[TOOL_REGISTRY] Error executing tool "${name}":`, err);
            return {
                toolName: name,
                success: false,
                data: null,
                timestamp: Date.now(),
                error: err.message || 'Execution failed'
            };
        }
    }
}
