# Proxy — API Cache Problem — Fix Hints
> A caching proxy serves repeat requests without hitting the backend.
## Wrong now
Identical `getForecast("Berlin")` calls all hit the network — wasted latency + cost.
## Hints
- [ ] `Weather` interface: `getForecast(city)`. `WeatherApi` is the real subject.
- [ ] `CachingWeatherProxy implements Weather`, wrapping the real API + a `Map`
      cache (with TTL).
- [ ] First call fetches + stores; repeats return cached value.
- [ ] Client codes to `Weather`; can't tell proxy from real.
## Done-when
- [ ] Repeat calls don't hit the network until TTL expires.
