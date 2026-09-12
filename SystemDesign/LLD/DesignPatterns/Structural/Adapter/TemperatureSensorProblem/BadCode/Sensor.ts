// =============================================================================
// WHAT IS WRONG — missing Adapter pattern
// =============================================================================
// PATTERN IDEA: an Adapter converts a vendor's incompatible output to the shape
// your app expects, in ONE place, behind your own interface.
//
// WHAT'S WRONG HERE: the app works in Celsius but VendorSensor reports Fahrenheit.
// Conversion is expected at each call site — and the demo FORGETS it, comparing
// 212°F directly to a 30°C threshold (always "overheating").
//
// REAL SCENARIO: this is a genuine unit-mismatch bug — any call site that forgets
// to convert silently compares Fahrenheit to a Celsius threshold and makes wrong
// decisions (here, false overheating that could trigger shutdowns). With
// conversion scattered, it's only a matter of time before one is missed.
//
// WHY BAD: unit conversion is duplicated and easy to omit; a forgotten conversion
// is a silent correctness bug.
//
// HOW TO FIX (no code): define a TemperatureSensor interface (readCelsius()). A
// VendorSensorAdapter implements it, calling readFahrenheit() and converting once.
// All app code reads Celsius and can't forget the conversion.
// =============================================================================
// ❌ NO ADAPTER — app expects Celsius, vendor sensor reports Fahrenheit. The
// conversion is sprinkled at call sites (and sometimes forgotten = real bug).
class VendorSensor { readFahrenheit(): number { return 212; } }

export class ClimateControl {
  isOverheating(): boolean {
    const sensor = new VendorSensor();
    // 🐛 some call sites forget to convert -> compares F to a Celsius threshold
    const temp = sensor.readFahrenheit();
    return temp > 30; // 212 > 30 always true; wrong unit
  }
}
console.log(new ClimateControl().isOverheating());
