// ❌ NO OBSERVER — subject hardcodes each dependent and calls them by hand.
// Adding a new display edits the subject (breaks OCP); tight coupling.

class PhoneDisplay { update(t: number) { return "phone: " + t; } }
class WebDisplay { update(t: number) { return "web: " + t; } }

export class WeatherStation {
  private phone = new PhoneDisplay();  // subject knows every concrete observer
  private web = new WebDisplay();
  setTemp(t: number) {
    // must remember to manually notify each one; forget one => stale UI
    console.log(this.phone.update(t));
    console.log(this.web.update(t));
    // add a SmartwatchDisplay => edit this class
  }
}
new WeatherStation().setTemp(25);
