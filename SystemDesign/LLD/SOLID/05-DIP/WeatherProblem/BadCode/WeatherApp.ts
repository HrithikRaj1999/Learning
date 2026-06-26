// ❌ DIP — app instantiates a concrete HTTP weather client with a baked-in URL +
// key. No way to mock, cache, or switch providers.
class OpenWeatherClient {
  getTemp(city: string): number {
    console.log("GET https://api.openweather.com/" + city + "?key=SECRET");
    return 21; // pretend network
  }
}
export class WeatherApp {
  private client = new OpenWeatherClient(); // ❌ concrete + hidden network + secret
  report(city: string): string {
    return city + " is " + this.client.getTemp(city) + "°C";
  }
}
console.log(new WeatherApp().report("Berlin"));
