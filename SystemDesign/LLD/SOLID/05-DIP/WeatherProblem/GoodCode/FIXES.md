# DIP — Weather Problem — Fix Hints
> Depend on a weather abstraction, not one vendor's HTTP client.
## Wrong now
`WeatherApp` `new`s `OpenWeatherClient` (hidden network call + hardcoded secret).
Can't mock in tests, can't add caching, can't switch provider.
## Hints
- [ ] Define `WeatherProvider { getTemp(city): Promise<number> }`.
- [ ] `OpenWeatherProvider` implements it; move the key to injected config/env.
- [ ] Inject the provider into `WeatherApp`.
- [ ] Add caching by wrapping with a `CachingWeatherProvider` (decorator) — no app change.
- [ ] Tests inject a `FakeWeatherProvider` returning fixed values.
## Done-when
- [ ] No `new` of a concrete client in the app; secret not hardcoded.
- [ ] Provider is swappable + mockable.
