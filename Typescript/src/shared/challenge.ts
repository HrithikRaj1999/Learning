export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { readonly [key: string]: JsonValue };
export type JsonArray = readonly JsonValue[];

export type ChallengeRecord = Readonly<{
  id: string;
  customerId: string;
  amount: number;
  status: string;
  tags: readonly string[];
}>;

export type ChallengeInput = Readonly<{
  challengeId: string;
  now: string;
  records: readonly ChallengeRecord[];
  options: Readonly<{
    limit: number;
    strict: boolean;
    tenantId: string;
  }>;
}>;

export type Ok<T> = Readonly<{ ok: true; value: T }>;
export type Err<E> = Readonly<{ ok: false; error: E }>;
export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export function todo(id: string, title: string): never {
  throw new Error(`TODO: Challenge ${id} - ${title}`);
}
