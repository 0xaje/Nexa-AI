export interface ToolExecuteContext {
    query: string;
    params?: Record<string, any>;
}

export interface ToolResult<T = any> {
    toolName: string;
    success: boolean;
    data: T;
    timestamp: number;
    error?: string;
}

export interface ITool {
    name: string;
    description: string;
    category: string;
    execute(context: ToolExecuteContext): Promise<ToolResult>;
}
