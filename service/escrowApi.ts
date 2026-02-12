export const ESCROW_API_ROUTES = {
  allocate: '/api/escrow/allocate',
  completeRequest: '/api/escrow/complete-request',
  completeTask: '/api/escrow/complete-task',
} as const;

export interface AllocateRequestPayload {
  taskId: string;
  toAgentId: number;
  amount: string;
  input?: string;
}

export interface AllocateResponse {
  success: boolean;
  requestId?: string;
  txHash?: string;
  gasUsed?: string;
  input?: string;
  agentId?: number;
}

export interface CompleteRequestPayload {
  requestId: string;
  success: boolean;
  agentType?: string;
}

export interface CompleteRequestResponse {
  success: boolean;
  txHash?: string;
  gasUsed?: string;
  output?: string;
}

export interface CompleteTaskPayload {
  taskId: string;
  success: boolean;
}

export interface CompleteTaskResponse {
  success: boolean;
  txHash?: string;
  gasUsed?: string;
}

export async function allocateBudget(payload: AllocateRequestPayload): Promise<AllocateResponse> {
  const res = await fetch(ESCROW_API_ROUTES.allocate, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Allocate API failed: ${res.status} ${text}`);
  }

  return (await res.json()) as AllocateResponse;
}

export async function completeAgentRequest(payload: CompleteRequestPayload): Promise<CompleteRequestResponse> {
  const res = await fetch(ESCROW_API_ROUTES.completeRequest, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Complete request API failed: ${res.status} ${text}`);
  }

  return (await res.json()) as CompleteRequestResponse;
}

export async function completeTask(payload: CompleteTaskPayload): Promise<CompleteTaskResponse> {
  const res = await fetch(ESCROW_API_ROUTES.completeTask, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Complete task API failed: ${res.status} ${text}`);
  }

  return (await res.json()) as CompleteTaskResponse;
}

