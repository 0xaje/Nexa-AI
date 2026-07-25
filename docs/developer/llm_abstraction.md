# LLM Abstraction Layer Architecture
### Enforcing Structured JSON & Provider-Agnostic AI Swarms

---

## 1. Executive Summary

To prevent unstable free-text parsing or heuristics in agent audits, Nexa AI routes all LLM calls through a shared **LLM Abstraction Layer**. This layer forces all model responses (from OpenAI, Gemini, Anthropic, or local node models) into strict JSON payloads conforming to the platform's reasoning schemas.

```
                          ┌───────────────────────────┐
                          │    LLM Abstraction Layer  │
                          ├───────────────────────────┤
                          │  - Strict JSON Outputs    │
                          │  - Provider-Agnostic      │
                          │  - Retry & Backoff        │
                          │  - Hard Query Timeouts    │
                          │  - In-memory Caching      │
                          └───────────────────────────┘
```

---

## 2. Core Abstraction Interfaces

All cognitive agents in the swarm (Analyst, Risk, Compliance) interact with models through a unified TypeScript interface defined in [types.ts](file:///home/oyeolorun/AiraMarKet/server/services/llm/types.ts):

### I. `LlmEvaluationResponse`
Enforces the properties returned by the models:
```typescript
export interface LlmEvaluationResponse {
    decision: 'APPROVE' | 'REJECT';
    confidence: number;
    reasoning: string;
    risks: string;
    supportingEvidence: string;
    recommendedQuestion?: string;
    summary?: string;
    supportingEvidenceList?: string[];
    contradictingEvidenceList?: string[];
    riskFactorsList?: string[];
}
```

### II. `LlmProvider`
Defines the structure for all integrated model providers:
```typescript
export interface LlmProvider {
    name: string;
    model: string;
    isActive(): boolean;
    analyze(prompt: string): Promise<LlmEvaluationResponse>;
}
```

---

## 3. Resilience & Latency Safeguards

The central orchestrator [manager.ts](file:///home/oyeolorun/AiraMarKet/server/services/llm/manager.ts) implements five key system resiliencies:

### I. Cascading Fallback Chain
If a primary provider fails (due to rate limits, API keys, or downtime), the manager automatically routes the query to the next active provider in the sequence:
`OpenAI` ──► `Gemini` ──► `Anthropic` ──► `Local Llama`

### II. Multi-Attempt Retry with Backoff
Each provider attempt executes up to 3 times (Original + 2 retries). If an attempt fails, the engine applies an exponential delay backoff:
$$\text{Delay} = \text{Attempt} \times 100\text{ ms}$$

### III. Hard Query Timeouts
To prevent thread hangs from lagging APIs, every model call is wrapped in a promise execution gate that throws a timeout error if it exceeds **5,000 milliseconds**.

### IV. In-Memory Caching
To optimize cost and request latencies, prompts are parsed into a hashed map. Identical prompts resolve instantly without calling external APIs:
$$\text{Cache Key} = \text{SHA256}(\text{Prompt String})$$

---

## 4. Supported Providers

The abstraction maps calls to four provider classes in [providers.ts](file:///home/oyeolorun/AiraMarKet/server/services/llm/providers.ts):

1. **OpenAI Provider (`OpenAiProvider`)**: Connects to the standard OpenAI API.
2. **Gemini Provider (`GeminiProvider`)**: Integrates Google Vertex or Gemini AI models.
3. **Anthropic Provider (`AnthropicProvider`)**: Targets Anthropic API endpoints.
4. **Local Provider (`LocalLlamaProvider`)**: Runs a local LLM or simulated sandbox execution engine, used for offline testing and local networks.

---

## 5. Testing & Simulation Strategy

To verify the fallback and routing logic without relying on external API networks or keys, the integration tests deploy a mock/sandbox provider (`LocalLlamaProvider`):

- **Offline Verifiability**: The local provider reads the incoming prompts, matches search parameters (e.g. `compliance`, `invalid category`), and returns pre-formulated mock JSON structures.
- **Failover Tests**: Tests simulate connection timeouts or provider faults and assert that the manager cascades the query down to the fallback provider.
