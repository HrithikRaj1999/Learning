// =============================================================================
// WHAT IS WRONG — missing Facade pattern
// =============================================================================
// PATTERN IDEA: a Facade gives a simple, single entry point over a complex
// subsystem, hiding the orchestration and ordering behind one method.
//
// WHAT'S WRONG HERE: startComputer() makes the client drive CPU, Memory, and
// HardDrive in an exact boot order (freeze -> load -> jump -> execute). The
// subsystem details and sequence are exposed.
//
// REAL SCENARIO: any code that wants to "start the computer" must replicate this
// precise sequence. Get the order wrong and boot fails; change the boot procedure
// and you must update every caller that orchestrates it. The subsystem knowledge
// leaks everywhere it's used.
//
// WHY BAD: complex multi-step orchestration is duplicated in clients; ordering
// mistakes are easy; subsystem changes ripple to all callers.
//
// HOW TO FIX (no code): a ComputerFacade exposes start() that encapsulates the CPU/
// Memory/HardDrive sequence internally. Clients call computer.start() and know
// nothing about the boot order. The sequence lives in one place.
// =============================================================================
// ❌ NO FACADE — "start the computer" requires the client to call CPU, memory,
// and disk in the right boot order.
class Cpu { freeze() { return "cpu freeze"; } jump(addr: number) { return "jump " + addr; } execute() { return "cpu exec"; } }
class Memory { load(addr: number, data: string) { return "load " + data + "@" + addr; } }
class HardDrive { read(lba: number) { return "sector " + lba; } }

export function startComputer(): string[] {
  const cpu = new Cpu(), mem = new Memory(), hd = new HardDrive();
  // exact boot sequence the client must not get wrong:
  return [cpu.freeze(), mem.load(0, hd.read(0)), cpu.jump(0), cpu.execute()];
}
console.log(startComputer());
