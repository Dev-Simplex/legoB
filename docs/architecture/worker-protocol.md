# LDraw Worker Protocol

Discriminated unions define the contract. Types live in `src/workers/protocol.ts`.

## Requests (main → worker)

```typescript
export type LdrawRequest =
  | { type: 'load'; requestId: string; source: LdrawSource }
  | { type: 'cancel'; requestId: string };

export type LdrawSource =
  | { kind: 'url'; url: string }
  | { kind: 'text'; text: string };
```

## Responses (worker → main)

```typescript
export type LdrawResponse =
  | { type: 'progress'; requestId: string; phase: 'fetching' | 'parsing' | 'resolving'; fraction: number }
  | { type: 'success'; requestId: string; payload: LdrawParseResult }
  | { type: 'error'; requestId: string; code: LdrawErrorCode; message: string; line?: number };

export type LdrawErrorCode = 'fetch_failed' | 'parse_failed' | 'worker_unavailable' | 'cancelled';
```

## Success payload

```typescript
export interface LdrawParseResult {
  parts: Part[];                                  // resolved, world-space positions
  steps: Step[];                                  // from 0 STEP markers
  usedPartNumbers: string[];                      // for cache warm-up + unknown warnings
  usedColorCodes: number[];
  bounds: { min: [number, number, number]; max: [number, number, number] };
  warnings: Array<{ code: string; message: string }>;
}
```

## Invariants

- `requestId` echoed on every response → UI correlates and cancels.
- `progress` is informational; `success` is authoritative.
- Exactly one terminal response (`success` OR `error`) per `requestId`; worker then idle.
- Cancel must be honored within 1 RAF; worker replies with `error{code:'cancelled'}`.

## Worker client singleton

Use `loadLdraw()` from `src/workers/ldrawClient.ts`. Never instantiate `Worker` directly from components.

→ Full context: [../fullstack-architecture.md#api-specification](../fullstack-architecture.md#api-specification)
