// =============================================================================
// WHAT IS WRONG — Dependency Inversion Principle (DIP) violation
// =============================================================================
// DIP rule: high-level policy depends on abstractions, not concretes. WeatherApp
// news up a concrete OpenWeatherClient with a baked-in URL and API key, and that
// client makes a real network call.
//
// REAL SCENARIO: report() can't be unit-tested — calling it hits the network
// (flaky, slow, costs API quota). Want to add caching, switch to a different
// weather provider, or stub a fixed temperature in tests? All require editing
// WeatherApp. The hardcoded "SECRET" key is also a real security leak sitting in
// source.
//
// WHY BAD: policy ("describe a city's weather") is chained to one HTTP provider +
// hidden network + embedded secret; untestable, unswappable, insecure.
//
// HOW TO FIX (no code): define a WeatherProvider interface (getTemp(city)).
// WeatherApp receives it via constructor. The OpenWeather HTTP client is one
// implementation (key from env/config, not source); tests inject a fake that
// returns a fixed value; a caching decorator can wrap the provider. The app
// depends only on the abstraction.
// =============================================================================
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
