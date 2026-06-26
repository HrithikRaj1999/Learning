// ❌ NO STATE — play/pause/stop behavior decided by flags + switches. Button
// behavior depends on combinations of booleans -> bug-prone.
export class Player {
  private state = "stopped"; // stopped|playing|paused
  playPause(): string {
    if (this.state === "stopped") { this.state = "playing"; return "start"; }
    if (this.state === "playing") { this.state = "paused"; return "pause"; }
    if (this.state === "paused") { this.state = "playing"; return "resume"; }
    return "?";
  }
  stop(): string { this.state = "stopped"; return "stop"; }
}
const p = new Player();
console.log(p.playPause(), p.playPause(), p.stop());
