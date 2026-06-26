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
