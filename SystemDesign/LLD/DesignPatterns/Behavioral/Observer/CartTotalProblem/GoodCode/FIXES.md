# Observer — Cart Total — Fix Hints
> Views subscribe to the cart and refresh on change.
## Wrong now
`Cart.add` manually re-renders the total label and badge. Data and views are
tightly coupled; new view edits the cart.
## Hints
- [ ] `CartObserver` interface: `update(cart)`.
- [ ] Cart maintains observers; `add/remove` notifies them.
- [ ] `TotalLabel`, `Badge` implement the observer + derive what they need.
- [ ] (This is the reactive/data-binding idea in miniature.)
## Done-when
- [ ] Cart doesn't know about specific views; adding a view doesn't touch it.
