# Observer — Stock Ticker — Fix Hints
> Price change notifies all subscribers automatically.
## Wrong now
`Stock` holds concrete `Dashboard`/`MobileApp` and calls each by hand; new
consumer edits the stock.
## Hints
- [ ] `PriceObserver` interface: `update(price)`.
- [ ] `Stock` keeps a subscriber list with subscribe/unsubscribe; `setPrice`
      notifies all.
- [ ] Consumers implement the observer + self-register. Stock untouched on growth.
## Done-when
- [ ] Adding an alerting service needs zero changes to `Stock`.
