// ❌ NO BRIDGE — alert URGENCY x CHANNEL fused. {Normal,Critical} x {Email,Push}.
export class NormalEmail { fire(m: string) { return "email: " + m; } }
export class CriticalEmail { fire(m: string) { return "EMAIL!!! " + m + " (page on-call)"; } }
export class NormalPush { fire(m: string) { return "push: " + m; } }
export class CriticalPush { fire(m: string) { return "PUSH!!! " + m + " (page on-call)"; } }
console.log(new CriticalPush().fire("db down"));
