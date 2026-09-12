// =============================================================================
// WHAT IS WRONG — missing Bridge pattern
// =============================================================================
// PATTERN IDEA: Bridge splits two independent axes into an abstraction and an
// implementation that combine by composition instead of one class per pairing.
//
// WHAT'S WRONG HERE: alert URGENCY (Normal/Critical) is fused with CHANNEL
// (Email/Push) by inheritance — NormalEmail, CriticalEmail, NormalPush,
// CriticalPush. The "page on-call" critical behavior is also copy-pasted across the
// critical classes.
//
// REAL SCENARIO: add an SMS or Slack channel and every urgency level needs a new
// class; add a "warning" urgency and every channel doubles. The duplicated
// "(page on-call)" logic drifts between CriticalEmail and CriticalPush.
//
// WHY BAD: combinatorial explosion of urgency×channel classes; shared urgency
// behavior duplicated and drift-prone.
//
// HOW TO FIX (no code): Channel is an interface (Email/Push/Sms); Alert is the
// abstraction (NormalAlert/CriticalAlert) holding a Channel and delegating fire().
// Critical's escalation lives once in CriticalAlert. Urgencies and channels grow
// independently.
// =============================================================================
// ❌ NO BRIDGE — alert URGENCY x CHANNEL fused. {Normal,Critical} x {Email,Push}.
export class NormalEmail { fire(m: string) { return "email: " + m; } }
export class CriticalEmail { fire(m: string) { return "EMAIL!!! " + m + " (page on-call)"; } }
export class NormalPush { fire(m: string) { return "push: " + m; } }
export class CriticalPush { fire(m: string) { return "PUSH!!! " + m + " (page on-call)"; } }
console.log(new CriticalPush().fire("db down"));
