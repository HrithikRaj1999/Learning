// ❌ NO PROXY — every call hits the slow remote API; identical requests aren't
// cached, hammering the backend and the user's latency.
export class WeatherApi {
  getForecast(city: string): string {
    console.log("HTTP GET /forecast/" + city + " (slow, costs money per call)");
    return city + ": sunny";
  }
}
const api = new WeatherApi();
api.getForecast("Berlin");
api.getForecast("Berlin"); // identical call -> hits network again, no caching
api.getForecast("Berlin");
