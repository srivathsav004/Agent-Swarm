const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const AGENT_API_ROUTES = {
  run: `${BACKEND_URL}/api/agents/run`,
} as const;

export interface RunAgentPayload {
  agentType: string;
  input: string;
  options?: Record<string, any>;
}

export interface RunAgentResponse {
  success: boolean;
  agentType?: string;
  agentId?: number;
  model?: string;
  output?: string;
  raw?: unknown;
  error?: string;
}

export async function runAgent(payload: RunAgentPayload): Promise<RunAgentResponse> {
  const res = await fetch(AGENT_API_ROUTES.run, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Run agent API failed: ${res.status} ${text}`);
  }

  return (await res.json()) as RunAgentResponse;
}

