// ❌ NO STATE — light transitions via a switch on a color string. Adding a state
// (e.g. blinking) edits the switch; transition rules are implicit.
export class TrafficLight {
  private color = "red";
  next(): string {
    switch (this.color) {
      case "red": this.color = "green"; break;
      case "green": this.color = "yellow"; break;
      case "yellow": this.color = "red"; break;
    }
    return this.color;
  }
}
const t = new TrafficLight();
console.log(t.next(), t.next(), t.next());
