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
