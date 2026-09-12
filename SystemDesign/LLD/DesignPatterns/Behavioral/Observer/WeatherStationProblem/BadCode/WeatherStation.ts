// =============================================================================
// WHAT IS WRONG — missing Observer pattern
// =============================================================================
// PATTERN IDEA: a subject notifies a list of observers on change; observers
// implement a common update() contract; the subject never names them concretely.
//
// WHAT'S WRONG HERE: WeatherStation owns a concrete PhoneDisplay and WebDisplay
// and manually calls update() on each in setTemp().
//
// REAL SCENARIO: add a SmartwatchDisplay or a severe-weather alerter. You edit
// WeatherStation and add another manual notify call — and must do so in every
// method that changes the reading. Forget one and a display goes stale.
//
// WHY BAD: subject coupled to concrete observers; each new display edits the
// subject (OCP violation); manual notification is error-prone.
//
// HOW TO FIX (no code): WeatherStation = subject with registerObserver()/
// notifyObservers(). Displays = observers with update(temp). On a new reading the
// station notifies all. New display = register it; the station never changes.
// =============================================================================
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
