# Ride Hailing Architecture (Uber / Ola style: live driver location, fast matching, one driver never gets two rides)

> **The one idea to remember: "Keep where the drivers are in memory, lock a driver before you offer him a ride, and let the database decide the match."**
> Picture a taxi stand where the drivers shout their position every few seconds. Nobody writes those shouts in a ledger; you only care where each car is *right now*. So driver positions live in **Redis** (a very fast in-memory store), grouped by **H3 cell** (the city map cut into small hexagons, like tiles on a floor). When Rahul asks for a ride, we look in his tile and the six tiles around it, pick the nearest free drivers, and offer the ride to **one driver at a time** for 10 seconds.
> The hard rule is **one driver never gets two rides**. Think of a "taken" card on a restaurant table. Before we offer Ravi a ride, we put a card on him in Redis (`SET ... NX`: only works if no card is there yet). When Ravi taps "Accept", the **database** checks once more (`UPDATE drivers ... WHERE status = 'FREE'`), so even a lost card cannot cause a double match.
> The trip itself is money and a promise, so it lives in **PostgreSQL** (a database with all-or-nothing transactions) as a **state machine**: REQUESTED → MATCHED → ARRIVED → STARTED → COMPLETED (or CANCELLED). Every change is also told to the rest of the system through **Kafka** (an event pipe), without ever writing to two places at once.
> Deep dive: [Deep Dive](#deep-dive-only-what-the-flows-above-did-not-cover)

## Requirements (minimal)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

### Functional (what the product does)

</td><td valign="top" width="50%" markdown="1">

### Non-functional (how well it must work)

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Drivers go online and share their live location**
  - The driver app sends its position every 4 seconds while online.
    - e.g. Ravi (driver d-42) goes online in Koramangala, Bengaluru at 6 PM.

</td><td valign="top" width="50%" markdown="1">

- **Takes a flood of location pings without slowing down**
  - About 1 million drivers × one ping every 4 seconds ≈ 250,000 writes a second. These never touch the main database.
    - e.g. Ravi's pings only update one Redis hash; PostgreSQL never sees them.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Rider sees a fare estimate before booking**
  - Price and waiting time, including surge (a higher price when many people want rides and few drivers are free).
    - e.g. Rahul (rider u-7) sees "₹530 to the Airport, driver in 3 min, 1.4x busy".

</td><td valign="top" width="50%" markdown="1">

- **The price shown is the price charged**
  - The estimate is a signed quote, valid for 2 minutes, so surge changing a second later doesn't change Rahul's price.
    - e.g. quote q-31 says ₹530 until 18:02:10.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Rider books and is matched to a nearby driver**
  - The nearest free drivers get the offer one at a time; the first to accept gets the ride.
    - e.g. Rahul's ride r-9 is offered to Ravi, 3 minutes away.

</td><td valign="top" width="50%" markdown="1">

- **Matched within about 5 seconds**
  - Finding drivers happens in memory; only the final "yes" touches the database.
    - e.g. Rahul taps "Book" at 18:00:20; Ravi has the offer at 18:00:21.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Driver accepts or declines an offer**
  - The offer shows for 10 seconds. No answer counts as "no", and the next driver gets it.
    - e.g. Ravi taps "Accept" after 6 seconds.

</td><td valign="top" width="50%" markdown="1">

- **One driver never gets two rides, one ride never gets two drivers**
  - A Redis lock stops two offers to the same driver; the database has the final word.
    - e.g. Anita (rider u-8) books a moment after Rahul. Her ride skips Ravi and goes to Sameer (driver d-57).

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Both track the trip live**
  - The rider sees the car move and the trip status (arrived, started, completed).
    - e.g. Rahul watches Ravi's car turn into his street.

</td><td valign="top" width="50%" markdown="1">

- **Live, but only a few seconds old is fine**
  - The car on the map may be a few seconds behind. Trip status must never go backwards.
    - e.g. Rahul's map is at most one ping (4 s) behind.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Trip moves through clear states**
  - REQUESTED → MATCHED → ARRIVED → STARTED → COMPLETED, or CANCELLED.
    - e.g. Ravi can't tap "End trip" before "Start trip".

</td><td valign="top" width="50%" markdown="1">

- **Trip state survives any crash**
  - Trips live in PostgreSQL with all-or-nothing transactions.
    - e.g. Ride Service restarts mid-trip; r-9 is still STARTED.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Rider pays after the trip**
  - Saved card or UPI (India's bank-to-bank payment system) autopay, charged when the trip ends.
    - e.g. ₹530 taken from Rahul's UPI at 18:44.

</td><td valign="top" width="50%" markdown="1">

- **Charged exactly once**
  - An idempotency key (a "this is the same request" id) per ride, and unique rules in the database.
    - e.g. the payment call times out and is sent again; Rahul is still charged once.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

</td><td valign="top" width="50%" markdown="1">

- **Always up**
  - Every part runs as several copies in different buildings (availability zones); a city keeps working if one server dies.
    - e.g. a Redis node dies; its copy takes over and drivers re-send their position within 4 seconds.

</td></tr>
</table>

## APIs

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Fare estimate | `POST /v1/rides/estimate {pickup, drop}` → `{quote_id, quote_token, fare_minor, currency, surge, pickup_eta_min, expires_at}` |
| Book a ride | `POST /v1/rides {quote_token, payment_method}` + `Idempotency-Key` → `201 {ride_id, status: REQUESTED}` |
| Ride status | `GET /v1/rides/{ride_id}` → `{status, driver, car, eta_min, fare_minor}` |
| Cancel | `POST /v1/rides/{ride_id}:cancel {reason}` → `{status: CANCELLED, fee_minor}` |
| Live channel | `WSS /v1/ws` (one WebSocket per phone): offers, car position, trip status |

</td><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Location ping | `{type: "ping", lat, lng, heading, speed, ts}` sent on the WebSocket every 4 s (`PATCH /v1/drivers/me/location` as a fallback) |
| Accept offer | `POST /v1/rides/{ride_id}/accept` → `200 {status: MATCHED}` or `409 OFFER_EXPIRED / DRIVER_BUSY` |
| Decline offer | `POST /v1/rides/{ride_id}/decline` → `204` |
| Trip steps | `POST /v1/rides/{ride_id}/arrived`, `/start`, `/complete` → `{status}` or `409 WRONG_STATE` |
| Payment webhook | `POST /v1/webhooks/razorpay` + `X-Razorpay-Signature` → `200` |

</td></tr></table>

## Diagram

A quick map of all the parts and how they connect. Arrows (`──>`) show which way requests or data move. What each store keeps is in **Schema Overview**; each flow below walks through one piece.

```text
RIDERS AND DRIVERS (outside)                ╔══ THE RIDE SYSTEM: everything inside this box is ours ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗          OUTSIDE COMPANIES
                                            ║                                                                                                                                                                                                                                                                                                                                        ║
┌────────────────────────────────┐          ║                                                   ┌────────────────────────────────┐                                                                                                                                                                                                              ┌────────────────────────────────┐   ║
│ Rahul's app (rider)            │ ─────┐   ║                                           ┌─────> │ Fare Service                   │ ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬─────> │ Redis (in memory)              │   ║
├────────────────────────────────┤      │   ║                                           │       ├────────────────────────────────┤                                                                                                                                                                                                      │       ├────────────────────────────────┤   ║
│ - asks a fare, books, pays     │      │   ║                                           │       │ - price = route x surge        │                                                                                                                                                                                                      │       │ - live driver map by cell      │   ║
│ - watches the car move         │      │   ║                                           │       │ - signed 2-minute quote        │                                                                                                                                                                                                      │       │ - surge, driver locks          │   ║
└────────────────────────────────┘      │   ║                                           │       └────────────────────────────────┘                                                                                                                                                                                                      │       │ - Pub/Sub to gateways          │   ║
                                        │   ║                                           │                                                                                                                                                                                                                                               │       └────────────────────────────────┘   ║
                                        │   ║                                           │                                                                                                                                                                                                                                               │                                            ║
                                        │   ║                                           │                                                                                                                                                                                                                                               │                                            ║
                                        │   ║                                           │                                                                                                                                                                                                                                               │                                            ║
                                        │   ║                                           │                                                                                                                                                                                                                                               │                                            ║
┌────────────────────────────────┐      │   ║   ┌────────────────────────────────┐      │       ┌────────────────────────────────┐              ┌────────────────────────────────┐              ┌────────────────────────────────┐                                                              ┌────────────────────────────────┐      │                                            ║
│ Anita's app (rider)            │ ─────┼───╫─> │ API Gateway                    │ ─────┴─────> │ Ride Service                   │ ───────────> │ Rides DB (PostgreSQL)          │ ───────────> │ Debezium (CDC)                 │ ─────┐                                               ┌─────> │ Location Indexer               │ ─────┤                                            ║
├────────────────────────────────┤      │   ║   ├────────────────────────────────┤              ├────────────────────────────────┤              ├────────────────────────────────┤              ├────────────────────────────────┤      │                                               │       ├────────────────────────────────┤      │                                            ║
│ - books near Rahul             │      │   ║   │ - checks login token           │              │ - creates rides                │              │ - drivers, rides, outbox       │              │ - Change Data Capture          │      │                                               │       │ - pings -> live driver map     │      │                                            ║
│ - wants the same driver        │      │   ║   │ - rate limit per user          │              │ - moves the trip state         │              │ - the real judge               │              │ - outbox rows -> Kafka         │      │                                               │       │ - keeps free / busy copy       │      │                                            ║
└────────────────────────────────┘      │   ║   └────────────────────────────────┘              └────────────────────────────────┘              └────────────────────────────────┘              └────────────────────────────────┘      │                                               │       └────────────────────────────────┘      │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │                                               │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │                                               │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │                                               │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │                                               │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │       ┌────────────────────────────────┐      │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               ├─────> │ Surge Service                  │ ─────┤                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │       ├────────────────────────────────┤      │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │       │ - demand vs supply per cell    │      │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │       │ - new surge every 30 s         │      │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │       └────────────────────────────────┘      │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │                                               │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │                                               │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │                                               │                                            ║
                                        │   ║                                                                                                                                                                                           │                                               │                                               │                                            ║
┌────────────────────────────────┐      │   ║   ┌────────────────────────────────┐              ┌────────────────────────────────┐                                                                                                      │       ┌────────────────────────────────┐      │       ┌────────────────────────────────┐      │                                            ║
│ Ravi's app (driver d-42)       │ ─────┴───╫─> │ WebSocket Gateway              │ ───────────> │ Location Service               │ ─────────────────────────────────────────────────────────────────────────────────────────────────────┴─────> │ Kafka (event pipe)             │ ─────┼─────> │ Matching Service               │ ─────┤                                            ║
├────────────────────────────────┤          ║   ├────────────────────────────────┤              ├────────────────────────────────┤                                                                                                              ├────────────────────────────────┤      │       ├────────────────────────────────┤      │                                            ║
│ - sends location every 4 s     │          ║   │ - keeps phones connected       │              │ - checks each ping             │                                                                                                              │ - location.pings               │      │       │ - nearest free drivers         │      │                                            ║
│ - gets offers, accepts         │          ║   │ - listens on Redis Pub/Sub     │              │ - writes it to Kafka first     │                                                                                                              │ - ride.events                  │      │       │ - offers one at a time         │      │                                            ║
└────────────────────────────────┘          ║   └────────────────────────────────┘              └────────────────────────────────┘                                                                                                              │ - payment.events               │      │       └────────────────────────────────┘      │                                            ║
                                            ║                                                                                                                                                                                                   └────────────────────────────────┘      │                                               │                                            ║
                                            ║                                                                                                                                                                                                                                           │                                               │                                            ║
                                            ║                                                                                                                                                                                                                                           │                                               │                                            ║
                                            ║                                                                                                                                                                                                                                           │                                               │                                            ║
                                            ║                                                                                                                                                                                                                                           │                                               │                                            ║
                                            ║                                                                                                                                                                                                                                           │       ┌────────────────────────────────┐      │                                            ║
                                            ║                                                                                                                                                                                                                                           ├─────> │ Trip Notifier                  │ ─────┘                                            ║
                                            ║                                                                                                                                                                                                                                           │       ├────────────────────────────────┤                                                   ║
                                            ║                                                                                                                                                                                                                                           │       │ - ride.events -> rider screen  │                                                   ║
                                            ║                                                                                                                                                                                                                                           │       │ - phone push if app closed     │                                                   ║
                                            ║                                                                                                                                                                                                                                           │       └────────────────────────────────┘                                                   ║
                                            ║                                                                                                                                                                                                                                           │                                                                                            ║
                                            ║                                                                                                                                                                                                                                           │                                                                                            ║
                                            ║                                                                                                                                                                                                                                           │                                                                                            ║
                                            ║                                                                                                                                                                                                                                           │                                                                                            ║
                                            ║                                                                                                                                                                                                                                           │       ┌────────────────────────────────┐              ┌────────────────────────────────┐   ║
                                            ║                                                                                                                                                                                                                                           └─────> │ Payment Service                │ ─────┬─────> │ Payment DB (PostgreSQL)        │   ║
                                            ║                                                                                                                                                                                                                                                   ├────────────────────────────────┤      │       ├────────────────────────────────┤   ║
                                            ║                                                                                                                                                                                                                                                   │ - charges after the trip       │      │       │ - payments, webhook ids        │   ║
                                            ║                                                                                                                                                                                                                                                   │ - one key per ride             │      │       │ - outbox -> payment.events     │   ║
                                            ║                                                                                                                                                                                                                                                   └────────────────────────────────┘      │       └────────────────────────────────┘   ║
                                            ║                                                                                                                                                                                                                                                                                           │                                            ║
                                            ║                                                                                                                                                                                                                                                                                           │                                            ║
                                            ║                                                                                                                                                                                                                                                                                           │                                            ║
                                            ║                                                                                                                                                                                                                                                                                           │                                            ║
                                            ║                                                                                                                                                                                                                                                                                           │                                            ║          ┌────────────────────────────────┐
                                            ║                                                                                                                                                                                                                                                                                           └────────────────────────────────────────────╫────────> │ Razorpay (payment gateway)     │
                                            ║                                                                                                                                                                                                                                                                                                                                        ║          ├────────────────────────────────┤
                                            ║                                                                                                                                                                                                                                                                                                                                        ║          │ - takes the money              │
                                            ║                                                                                                                                                                                                                                                                                                                                        ║          │ - calls back (webhook)         │
                                            ║                                                                                                                                                                                                                                                                                                                                        ║          └────────────────────────────────┘
                                            ║                                                                                                                                                                                                                                                                                                                                        ║
                                            ╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Schema Overview

What every store keeps, as one real example per box. Where a field can take several values, they are shown as `"A" or "B"`. Each row scrolls sideways.

### PostgreSQL: Rides DB

```text
╔════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════════════════╗
║ drivers (Rides DB) · key driver_id         ║    ║ rides (Rides DB) · UNIQUE rider_id + idempotency_key                     ║    ║ outbox (Rides DB) · type -> Kafka event type                         ║
╟────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────────────────╢
║ {                                          ║    ║ {                                                                        ║    ║ {                                                                    ║
║   "driver_id": "d-42",                     ║    ║   "ride_id": "r-9",                                                      ║    ║   "id": "ob-901",                                                    ║
║   "name": "Ravi",                          ║    ║   "rider_id": "u-7 (Rahul)",                                             ║    ║   "aggregatetype": "ride",                                           ║
║   "city": "blr",                           ║    ║   "driver_id": null or "d-42",                                           ║    ║   "aggregateid": "r-9",                                              ║
║   "vehicle": "KA-01-AB-4242, Swift Dzire", ║    ║   "city": "blr",                                                         ║    ║   "type": "ride.requested" or "ride.matched" or "ride.arrived"       ║
║   "status": "FREE" or "BUSY",              ║    ║   "pickup": {"lat": 12.9352, "lng": 77.6245, "cell": "8961892a5bfffff"}, ║    ║           or "ride.started" or "ride.completed" or "ride.cancelled", ║
║   "ride_id": null or "r-9",                ║    ║   "drop": {"lat": 13.1986, "lng": 77.7066, "name": "Airport"},           ║    ║   "payload": {"rider_id": "u-7", "pickup_cell": "8961892a5bfffff"},  ║
║   "version": 7                             ║    ║   "quote_id": "q-31",                                                    ║    ║   "created_at": "2026-11-22T18:00:20+05:30"                          ║
║ }                                          ║    ║   "fare_minor": 53000,                                                   ║    ║ }                                                                    ║
╚════════════════════════════════════════════╝    ║   "currency": "INR",                                                     ║    ╚══════════════════════════════════════════════════════════════════════╝
                                                  ║   "surge": 1.4,                                                          ║
                                                  ║   "status": "REQUESTED" or "MATCHED" or "ARRIVED" or "STARTED"           ║
                                                  ║             or "COMPLETED" or "CANCELLED",                               ║
                                                  ║   "idempotency_key": "idem-r1",                                          ║
                                                  ║   "requested_at": "2026-11-22T18:00:20+05:30",                           ║
                                                  ║   "version": 1                                                           ║
                                                  ║ }                                                                        ║
                                                  ╚══════════════════════════════════════════════════════════════════════════╝
```

### PostgreSQL: Payment DB

```text
╔═════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════╗
║ payments (Payment DB) · UNIQUE ride_id · UNIQUE idempotency_key ║    ║ webhook_events (Payment DB) · key event_id   ║    ║ outbox (Payment DB) · same transaction as PAID         ║
╟─────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────╢
║ {                                                               ║    ║ {                                            ║    ║ {                                                      ║
║   "payment_id": "pay-77",                                       ║    ║   "event_id": "evt_Rz5521",                  ║    ║   "id": "ob-3001",                                     ║
║   "ride_id": "r-9",                                             ║    ║   "type": "payment.captured",                ║    ║   "aggregateid": "pay-77",                             ║
║   "rider_id": "u-7",                                            ║    ║   "payment_id": "pay-77",                    ║    ║   "type": "payment.succeeded" or "payment.failed",     ║
║   "amount_minor": 53000,                                        ║    ║   "received_at": "2026-11-22T18:44:16+05:30" ║    ║   "payload": {"ride_id": "r-9", "amount_minor": 53000} ║
║   "currency": "INR",                                            ║    ║ }                                            ║    ║ }                                                      ║
║   "idempotency_key": "pay-r-9",                                 ║    ╚══════════════════════════════════════════════╝    ╚════════════════════════════════════════════════════════╝
║   "gateway_payment_id": null or "pay_RzQ81",                    ║
║   "status": "PENDING" or "PAID" or "FAILED"                     ║
║ }                                                               ║
╚═════════════════════════════════════════════════════════════════╝
```

### Redis: live driver map, surge, locks, Pub/Sub

```text
╔══════════════════════════════════════════╗    ╔════════════════════════════════════════════════╗    ╔═════════════════════════════════════════╗    ╔════════════════════════════════════════╗    ╔═════════════════════════════════════════════╗    ╔══════════════════════════════════════════╗
║ Redis hash: one per driver (latest only) ║    ║ Redis set: free drivers per H3 cell            ║    ║ Redis key: driver is alive              ║    ║ Redis key: surge per H3 cell           ║    ║ Redis key: driver lock (one ride at a time) ║    ║ Redis Pub/Sub channels                   ║
╟──────────────────────────────────────────╢    ╟────────────────────────────────────────────────╢    ╟─────────────────────────────────────────╢    ╟────────────────────────────────────────╢    ╟─────────────────────────────────────────────╢    ╟──────────────────────────────────────────╢
║ driver:d-42 = {                          ║    ║ cell:8961892a5bfffff:free = {d-42, d-57, d-61} ║    ║ seen:d-42 = 1   (EX 30: gone after 30 s ║    ║ surge:8961892a5bfffff = 1.4   (EX 120) ║    ║ lock:driver:d-42 = r-9   (SET NX EX 15)     ║    ║ user:d-42  -> offers to Ravi's phone     ║
║   "lat": 12.9349, "lng": 77.6212,        ║    ║ cell:8961892a4ffffff:free = {d-80}             ║    ║                  without a ping)        ║    ╚════════════════════════════════════════╝    ║ lock:driver:d-57 = r-10  (Anita's ride)     ║    ║ user:u-7   -> trip status to Rahul       ║
║   "cell": "8961892a5bfffff",             ║    ║ (a driver sits in exactly one cell set)        ║    ╚═════════════════════════════════════════╝                                                  ╚═════════════════════════════════════════════╝    ║ ride:r-9   -> Ravi's position, every 4 s ║
║   "status": "FREE" or "BUSY",            ║    ╚════════════════════════════════════════════════╝                                                                                                                                                    ╚══════════════════════════════════════════╝
║   "ride_id": null or "r-9",              ║
║   "ts": "18:00:04"                       ║
║ }                                        ║
╚══════════════════════════════════════════╝
```

### Kafka topics, messages and the signed quote

```text
╔══════════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════╗
║ Kafka topics · key -> why                                        ║    ║ Kafka message (location.pings)        ║    ║ Kafka message (ride.events)                                   ║    ║ Signed quote (returned to the app, not stored) ║
╟──────────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────╢
║ location.pings   key driver_id  one driver's pings stay in order ║    ║ {                                     ║    ║ {                                                             ║    ║ {                                              ║
║ ride.events      key ride_id    one ride's states stay in order  ║    ║   "topic": "location.pings",          ║    ║   "topic": "ride.events",                                     ║    ║   "quote_id": "q-31",                          ║
║ payment.events   key ride_id    receipt follows the ride         ║    ║   "key": "d-42",                      ║    ║   "key": "r-9",                                               ║    ║   "pickup_cell": "8961892a5bfffff",            ║
╚══════════════════════════════════════════════════════════════════╝    ║   "value": {                          ║    ║   "headers": {"id": "ob-901", "eventType": "ride.requested"}, ║    ║   "drop": "Airport",                           ║
                                                                        ║     "driver_id": "d-42",              ║    ║   "value": {                                                  ║    ║   "fare_minor": 53000,                         ║
                                                                        ║     "lat": 12.9349, "lng": 77.6212,   ║    ║     "rider_id": "u-7",                                        ║    ║   "surge": 1.4,                                ║
                                                                        ║     "cell": "8961892a5bfffff",        ║    ║     "pickup_cell": "8961892a5bfffff",                         ║    ║   "expires_at": "2026-11-22T18:02:10+05:30",   ║
                                                                        ║     "heading": 270, "speed_kmh": 22,  ║    ║     "city": "blr"                                             ║    ║   "signature": "hmac-sha256(...)"              ║
                                                                        ║     "ts": "2026-11-22T18:00:04+05:30" ║    ║   }                                                           ║    ║ }                                              ║
                                                                        ║   }                                   ║    ║ }                                                             ║    ╚════════════════════════════════════════════════╝
                                                                        ║ }                                     ║    ╚═══════════════════════════════════════════════════════════════╝
                                                                        ╚═══════════════════════════════════════╝
```

## Flows (the big diagram, one piece at a time)

Each flow is one slice of the big diagram. Every box says what it does in each step (`STEP n: what`, then how, then an example). Under each diagram, **Data in this flow** shows the rows, keys and messages that flow touches, side by side (scroll sideways). The numbered steps below match the `STEP n` in the boxes.

### Flow 1. Ravi goes online and sends his location every 4 seconds (Ravi's app → WebSocket Gateway → Location Service → Kafka location.pings → Location Indexer → Redis)

```text
┌── STEP 1, 2 ─────────────────────────────────────────────┐              ┌── STEP 1, 2 ─────────────────────────────────────────────┐              ┌── STEP 3 ────────────────────────────────────────────────┐              ┌── STEP 4 ────────────────────────────────────────────────┐              ┌── STEP 5 ────────────────────────────────────────────────┐              ┌── STEP 5, 6 ─────────────────────────────────────────────┐
│ Ravi's app (driver d-42)                                 │              │ WebSocket Gateway (node gw-3)                            │              │ Location Service                                         │              │ Kafka (location.pings)                                   │              │ Location Indexer                                         │              │ Redis (live driver map)                                  │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Goes online                                      │ ───────────> │ STEP 1: Keeps the line open                              │ ───────────> │ STEP 3: Checks the ping and finds its cell               │ ───────────> │ STEP 4: Keeps pings in order per driver                  │ ───────────> │ STEP 5: Updates the live driver map                      │ ───────────> │ STEP 5: Holds only the latest position                   │
│   - opens one WebSocket (a phone line that stays open)   │              │   - checks the login token once, at connect              │              │   - drops jumps no car can make                          │              │   - key d-42 -> always the same partition                │              │   - skips a ping older than the stored one               │              │   - one hash per driver, one set per cell                │
│   - e.g. 18:00 in Koramangala, Bengaluru                 │              │   - subscribes to Redis channel user:d-42                │              │   - turns lat/lng into an H3 cell id                     │              │   - kept 1 day, then gone                                │              │   - moves the driver between cell sets                   │              │   - e.g. driver:d-42, cell:...:free                      │
│                                                          │              │   - e.g. Ravi lives on node gw-3                         │              │   - writes to Kafka first, nothing else                  │              │   - e.g. many readers, one copy                          │              │   - e.g. d-42 into cell ...5bfffff free set              │              │                                                          │
│ STEP 2: Sends a ping every 4 seconds                     │              │                                                          │              │   - e.g. cell 8961892a5bfffff                            │              └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              │ STEP 6: Forgets silent drivers                           │
│   - position, heading, speed, time                       │              │ STEP 2: Passes each ping on                              │              └──────────────────────────────────────────────────────────┘                                                                                                                                                                  │   - seen:d-42 expires after 30 s                         │
│   - e.g. 12.9349, 77.6212 at 18:00:04                    │              │   - driver id comes from the token, not the body         │                                                                                                                                                                                                                                            │   - e.g. phone dies -> out of matching                   │
└──────────────────────────────────────────────────────────┘              │   - e.g. ping for d-42                                   │                                                                                                                                                                                                                                            └──────────────────────────────────────────────────────────┘
                                                                          └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Kafka                                      ▼ Redis
╔═══════════════════════════════════════╗    ╔══════════════════════════════════════════╗    ╔════════════════════════════════════════════════╗    ╔═════════════════════════════════════════╗
║ Kafka message (location.pings)        ║    ║ Redis hash: one per driver (latest only) ║    ║ Redis set: free drivers per H3 cell            ║    ║ Redis key: driver is alive              ║
╟───────────────────────────────────────╢    ╟──────────────────────────────────────────╢    ╟────────────────────────────────────────────────╢    ╟─────────────────────────────────────────╢
║ {                                     ║    ║ driver:d-42 = {                          ║    ║ cell:8961892a5bfffff:free = {d-42, d-57, d-61} ║    ║ seen:d-42 = 1   (EX 30: gone after 30 s ║
║   "topic": "location.pings",          ║    ║   "lat": 12.9349, "lng": 77.6212,        ║    ║ cell:8961892a4ffffff:free = {d-80}             ║    ║                  without a ping)        ║
║   "key": "d-42",                      ║    ║   "cell": "8961892a5bfffff",             ║    ║ (a driver sits in exactly one cell set)        ║    ╚═════════════════════════════════════════╝
║   "value": {                          ║    ║   "status": "FREE" or "BUSY",            ║    ╚════════════════════════════════════════════════╝
║     "driver_id": "d-42",              ║    ║   "ride_id": null or "r-9",              ║
║     "lat": 12.9349, "lng": 77.6212,   ║    ║   "ts": "18:00:04"                       ║
║     "cell": "8961892a5bfffff",        ║    ║ }                                        ║
║     "heading": 270, "speed_kmh": 22,  ║    ╚══════════════════════════════════════════╝
║     "ts": "2026-11-22T18:00:04+05:30" ║
║   }                                   ║
║ }                                     ║
╚═══════════════════════════════════════╝
```

1. **Ravi goes online**
   - **a) One open line:** the app opens a WebSocket (a connection that stays open both ways, like a phone call instead of sending letters)
   - **b) Login once:** the gateway checks the login token when the line opens, not on every ping
   - **c) Ready for offers:** gateway node gw-3 subscribes to the Redis channel `user:d-42`, so anything sent to Ravi finds this node
   - **Data change:** none in a database. Online or offline is only "has Redis heard from him in the last 30 s"
   - **Why a WebSocket:** a new HTTPS call every 4 seconds from a million phones means a million handshakes. One open line is far cheaper, and the server can also *push* offers down it.

2. **Ravi's phone sends a ping every 4 seconds**
   - **a) What:** `{lat: 12.9349, lng: 77.6212, heading: 270, speed: 22, ts: 18:00:04}`
   - **b) Gateway adds the driver id** from the token, so a phone can't send pings for someone else
   - **Data change:** none yet
   - **Why every 4 seconds:** often enough that the map looks live and matching uses a fresh position, rare enough to save Ravi's battery and data.

3. **Location Service checks the ping and writes it to Kafka**
   - **a) Sanity check:** drop a ping that "moves" 5 km in 4 seconds (GPS glitch)
   - **b) Find the cell:** turn lat/lng into an H3 cell id, `8961892a5bfffff` (Koramangala). H3 is a free library from Uber that cuts the world into hexagons of fixed sizes
   - **c) One write only:** send to Kafka topic `location.pings`, key `d-42`
   - **Data change:** Kafka message added (see Data in this flow)
   - **Why Kafka first and not Redis + Kafka:** writing to two places is a dual write: a crash between the two leaves them disagreeing. With no database row to pair with, Kafka acts as the outbox (the single "to-do list"). Every reader (Location Indexer, Surge Service, analytics) reads the same copy.

4. **Kafka keeps the pings in order per driver**
   - **a) Key d-42** always goes to the same partition (lane), so Ravi's pings stay in time order
   - **b) Kept 1 day** for replays and analytics, then dropped; a nightly job copies them to S3 (cheap file storage) for history
   - **Data change:** none beyond the message
   - **Why not PostgreSQL:** 250,000 rows a second that are worthless after 4 seconds would drown a database built for safe, lasting data.

5. **Location Indexer updates the live driver map in Redis**
   - **a) Skip old news:** if the stored `ts` is newer than this ping, drop it (pings can arrive late or twice)
   - **b) Update the hash:** `HSET driver:d-42 lat 12.9349 lng 77.6212 cell 8961892a5bfffff ts 18:00:04`
   - **c) Move between cells:** if the cell changed and Ravi is FREE, `SMOVE` him from the old cell's free set to the new one
   - **d) Mark alive:** `SET seen:d-42 1 EX 30`
   - **Data change:** Redis `driver:d-42`, `cell:8961892a5bfffff:free` now has d-42, `seen:d-42`
   - **Why cell sets:** "who is free near Rahul?" becomes "read 7 small sets", with no scan over all drivers in the city.

6. **Silent drivers disappear by themselves**
   - **a)** If no ping for 30 s, `seen:d-42` expires. Matching skips drivers without a `seen` key; a sweeper removes them from the cell sets
   - **Data change:** `seen:d-42` gone; later `d-42` removed from the cell set
   - **Why:** a driver in a tunnel or with a dead phone must not get offers he can't see.

**Say in the interview:** "Driver pings come in over a WebSocket, go to Kafka keyed by driver id, and a consumer keeps only the latest position in Redis, grouped by H3 cell, with a 30-second alive key. Nothing per-ping goes to PostgreSQL; history is batched from Kafka to S3."

### Flow 2. Rahul sees a fare estimate, with surge for his area (Kafka → Surge Service → Redis; Rahul's app → API Gateway → Fare Service → Redis → signed quote)

```text
┌── STEP 2, 5 ─────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 3, 4 ─────────────────────────────────────────────┐              ┌── STEP 1, 3 ─────────────────────────────────────────────┐
│ Rahul's app (rider u-7)                                  │              │ API Gateway                                              │              │ Fare Service                                             │              │ Redis                                                    │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 2: Types "Airport" as the drop                      │ ───────────> │ STEP 2: Lets the request in                              │ ───────────> │ STEP 3: Works out the fare                               │ ─────┬─────> │ STEP 1: Keeps the surge per cell                         │
│   - POST /v1/rides/estimate {pickup, drop}               │              │   - checks the login token, rate limit                   │              │   - road distance + time from the routing engine         │      │       │   - surge:<cell> with a 2-minute expiry                  │
│   - e.g. pickup Koramangala 5th Block                    │              │   - e.g. u-7 = Rahul                                     │              │   - reads surge and nearby free drivers                  │      │       │   - e.g. surge:8961892a5bfffff = 1.4                     │
│                                                          │              └──────────────────────────────────────────────────────────┘              │   - e.g. 14 km, 38 min, surge 1.4 -> Rs 530              │      │       │                                                          │
│ STEP 5: Sees the price and the wait                      │                                                                                        │                                                          │      │       │ STEP 3: Answers "who is near?"                           │
│   - "Rs 530, driver in 3 min, 1.4x busy"                 │                                                                                        │ STEP 4: Signs a quote                                    │      │       │   - free sets of the cell and its neighbours             │
│   - e.g. quote q-31, valid 2 minutes                     │                                                                                        │   - fare + expiry, signed with a secret key              │      │       │   - e.g. d-42 is 3 min away                              │
└──────────────────────────────────────────────────────────┘                                                                                        │   - e.g. q-31 valid until 18:02:10                       │      │       └──────────────────────────────────────────────────────────┘
                                                                                                                                                    └──────────────────────────────────────────────────────────┘      │
                                                                                                                                                                                                                      │
                                                                                                                                                                                                                      │
                                                                                                                                                                                                                      │
                                                                                                                                                                                                                      │
                                                                          ┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 1 ────────────────────────────────────────────────┐      │
                                                                          │ Kafka (location.pings, ride.events)                      │              │ Surge Service                                            │      │
                                                                          ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤      │
                                                                          │ STEP 1: Feeds the counters                               │ ───────────> │ STEP 1: Counts demand vs supply per cell                 │ ─────┘
                                                                          │   - free-driver pings and new ride requests              │              │   - every 30 s: open requests / free drivers             │
                                                                          │   - e.g. last 5 minutes, per cell                        │              │   - smooths, caps at 3.0, writes Redis                   │
                                                                          └──────────────────────────────────────────────────────────┘              │   - e.g. Koramangala 1.4 at 6 PM                         │
                                                                                                                                                    └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Redis                                                                                             ▼ Fare Service answer
╔════════════════════════════════════════╗    ╔════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════╗
║ Redis key: surge per H3 cell           ║    ║ Redis set: free drivers per H3 cell            ║    ║ Signed quote (returned to the app, not stored) ║
╟────────────────────────────────────────╢    ╟────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────╢
║ surge:8961892a5bfffff = 1.4   (EX 120) ║    ║ cell:8961892a5bfffff:free = {d-42, d-57, d-61} ║    ║ {                                              ║
╚════════════════════════════════════════╝    ║ cell:8961892a4ffffff:free = {d-80}             ║    ║   "quote_id": "q-31",                          ║
                                              ║ (a driver sits in exactly one cell set)        ║    ║   "pickup_cell": "8961892a5bfffff",            ║
                                              ╚════════════════════════════════════════════════╝    ║   "drop": "Airport",                           ║
                                                                                                    ║   "fare_minor": 53000,                         ║
                                                                                                    ║   "surge": 1.4,                                ║
                                                                                                    ║   "expires_at": "2026-11-22T18:02:10+05:30",   ║
                                                                                                    ║   "signature": "hmac-sha256(...)"              ║
                                                                                                    ║ }                                              ║
                                                                                                    ╚════════════════════════════════════════════════╝
```

1. **Surge Service keeps a surge number for every busy cell (all the time)**
   - **a) Count:** every 30 seconds, per cell: open ride requests (from `ride.events`) and free drivers (from `location.pings`) in that cell and its neighbours
   - **b) Turn it into a price multiplier:** `demand ÷ supply`, smoothed with the last value so it doesn't jump around, kept between 1.0 and 3.0
   - **c) Save:** `SET surge:8961892a5bfffff 1.4 EX 120`
   - **Data change:** Redis `surge:8961892a5bfffff = 1.4`
   - **Why per cell:** at 6 PM Koramangala is busy and the next area is quiet. One number for the whole city would be wrong for both.
   - **Why it expires:** if Surge Service dies, old surge vanishes after 2 minutes and prices fall back to 1.0, instead of staying high forever.

2. **Rahul types "Airport"**
   - **a) Call:** `POST /v1/rides/estimate {pickup: 12.9352,77.6245, drop: Airport}`
   - **b) API Gateway** checks the login token and the per-user rate limit
   - **Data change:** none

3. **Fare Service works out the fare**
   - **a) Route:** the routing engine (a map service that knows roads and live traffic) says 14 km, 38 minutes
   - **b) Surge:** `GET surge:8961892a5bfffff` → 1.4 (missing = 1.0)
   - **c) Pickup wait:** the free sets of Rahul's cell and its neighbours → nearest is Ravi, 3 minutes
   - **d) Price:** (base ₹50 + ₹18 × 14 km + ₹2 × 38 min) × 1.4 ≈ ₹530
   - **Data change:** none
   - **Why read only:** most people check a price and never book. Estimates must be cheap and must not write anything.

4. **Fare Service signs a quote**
   - **a) What:** `{quote_id: q-31, fare_minor: 53000, surge: 1.4, pickup cell, drop, expires_at: 18:02:10}`
   - **b) Signature:** HMAC (a stamp made with a secret key only our servers know), so the app can't change ₹530 to ₹5
   - **Data change:** none. The quote travels with the app, like a price tag with a shop stamp
   - **Why not store it:** millions of quotes a minute, most thrown away. A signed token needs no storage and no lookup later.

5. **Rahul sees the price and the wait**
   - **a)** "₹530, driver in 3 min, fares are 1.4x due to high demand"
   - **Data change:** none
   - **Why the 2-minute limit:** long enough to decide, short enough that the price still matches the street.

**Say in the interview:** "Surge is computed per H3 cell from a stream of requests and free-driver pings, smoothed and capped, and stored in Redis with a TTL. The estimate reads route, surge and nearby supply and returns a signed, short-lived quote, so the price shown is the price charged without storing quotes."

### Flow 3. Rahul books → the ride is saved once and announced (Rahul's app → API Gateway → Ride Service → Rides DB + outbox → Debezium → Kafka ride.events)

```text
┌── STEP 1, 4 ─────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 3, 4 ─────────────────────────────────────────────┐              ┌── STEP 3 ────────────────────────────────────────────────┐              ┌── STEP 5 ────────────────────────────────────────────────┐              ┌── STEP 5 ────────────────────────────────────────────────┐
│ Rahul's app (rider u-7)                                  │              │ API Gateway                                              │              │ Ride Service                                             │              │ Rides DB (PostgreSQL)                                    │              │ Debezium (Change Data Capture)                           │              │ Kafka (ride.events)                                      │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps "Book"                                      │ ───────────> │ STEP 2: Takes the rider id from the token                │ ───────────> │ STEP 3: Checks the quote, saves the ride                 │ ───────────> │ STEP 3: Stores the ride and the to-do note               │ ───────────> │ STEP 5: Copies outbox rows to Kafka                      │ ───────────> │ STEP 5: Announces the new ride                           │
│   - POST /v1/rides {quote, payment method}               │              │   - never from the request body                          │              │   - signature + expiry checked, no lookup                │              │   - UNIQUE rider_id + idempotency_key                    │              │   - reads the database change log (WAL)                  │              │   - key r-9 keeps this ride in order                     │
│   - header Idempotency-Key                               │              │   - e.g. u-7 = Rahul                                     │              │   - ride + outbox row in one transaction                 │              │   - outbox row ride.requested                            │              │   - e.g. ob-901 -> ride.events                           │              │   - e.g. Matching and Surge read it                      │
│   - e.g. idem-r1 at 18:00:20                             │              └──────────────────────────────────────────────────────────┘              │   - e.g. r-9 REQUESTED, Rs 530                           │              │   - e.g. rides r-9, outbox ob-901                        │              └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘
│                                                          │                                                                                        │                                                          │              └──────────────────────────────────────────────────────────┘
│ STEP 4: Sees "Finding your driver"                       │                                                                                        │ STEP 4: Answers at once                                  │
│   - opens the WebSocket for live news                    │                                                                                        │   - 201 {ride_id, status}                                │
│   - e.g. ride r-9, REQUESTED                             │                                                                                        │   - e.g. a double tap gets the same r-9                  │
└──────────────────────────────────────────────────────────┘                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Rides DB                                                                                                                                                ▼ Kafka
╔══════════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════╗
║ rides (Rides DB) · UNIQUE rider_id + idempotency_key                     ║    ║ outbox (Rides DB) · same transaction as the ride                   ║    ║ Kafka message (ride.events)                                   ║
╟──────────────────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────╢
║ {                                                                        ║    ║ {                                                                  ║    ║ {                                                             ║
║   "ride_id": "r-9",                                                      ║    ║   "id": "ob-901",                                                  ║    ║   "topic": "ride.events",                                     ║
║   "rider_id": "u-7 (Rahul)",                                             ║    ║   "aggregateid": "r-9",                                            ║    ║   "key": "r-9",                                               ║
║   "driver_id": null,                                                     ║    ║   "type": "ride.requested",                                        ║    ║   "headers": {"id": "ob-901", "eventType": "ride.requested"}, ║
║   "pickup": {"lat": 12.9352, "lng": 77.6245, "cell": "8961892a5bfffff"}, ║    ║   "payload": {"rider_id": "u-7", "pickup_cell": "8961892a5bfffff"} ║    ║   "value": {                                                  ║
║   "drop": {"lat": 13.1986, "lng": 77.7066, "name": "Airport"},           ║    ║ }                                                                  ║    ║     "rider_id": "u-7",                                        ║
║   "quote_id": "q-31",                                                    ║    ╚════════════════════════════════════════════════════════════════════╝    ║     "pickup_cell": "8961892a5bfffff",                         ║
║   "fare_minor": 53000,                                                   ║                                                                              ║     "city": "blr"                                             ║
║   "surge": 1.4,                                                          ║                                                                              ║   }                                                           ║
║   "status": "REQUESTED",                                                 ║                                                                              ║ }                                                             ║
║   "idempotency_key": "idem-r1",                                          ║                                                                              ╚═══════════════════════════════════════════════════════════════╝
║   "version": 1                                                           ║
║ }                                                                        ║
╚══════════════════════════════════════════════════════════════════════════╝
```

1. **Rahul taps "Book"**
   - **a) Call:** `POST /v1/rides {quote_token, payment_method: upi_autopay}` + `Idempotency-Key: idem-r1`
   - **Data change:** none yet
   - **Why the key:** on a weak network the app may send the same request twice. The key lets the server spot the repeat.

2. **API Gateway takes the rider id from the token**
   - **a)** u-7 = Rahul, never trusted from the body
   - **Data change:** none

3. **Ride Service checks the quote and saves the ride**
   - **a) Quote:** check the signature and that 18:00:20 is before `expires_at` 18:02:10. Expired → `410 QUOTE_EXPIRED`, app asks for a new estimate
   - **b) One transaction:**

            BEGIN;
            INSERT INTO rides (ride_id, rider_id, pickup, drop, quote_id, fare_minor, surge,
                               status, idempotency_key)
            VALUES ('r-9', 'u-7', ..., 'q-31', 53000, 1.4, 'REQUESTED', 'idem-r1');
            INSERT INTO outbox (id, aggregatetype, aggregateid, type, payload)
            VALUES ('ob-901', 'ride', 'r-9', 'ride.requested', '{"pickup_cell": "8961892a5bfffff"}');
            COMMIT;

   - **c) Repeat tap:** the `UNIQUE (rider_id, idempotency_key)` rule fails → return the existing r-9
   - **d) One open ride per rider:** a partial unique index on `rider_id WHERE status IN (REQUESTED ... STARTED)`
   - **Data change:** `rides` row r-9 `{status: REQUESTED, fare_minor: 53000}`; `outbox` row ob-901 `ride.requested`
   - **Why the outbox:** "save the ride, then send to Kafka" is a dual write. If the server crashes in between, the ride exists but no one tries to match it. The outbox row is saved in the *same* transaction, so either both exist or neither does.

4. **Rahul gets an answer at once**
   - **a)** `201 {ride_id: r-9, status: REQUESTED}`; the app shows "Finding your driver"
   - **Data change:** none
   - **Why not wait for a driver:** matching can take seconds; an HTTP call that hangs that long is fragile. The news comes over the WebSocket instead (Flow 6).

5. **Debezium copies the outbox row into Kafka**
   - **a) How:** Debezium (a Change Data Capture tool) reads PostgreSQL's change log (the WAL, Write-Ahead Log, the diary every database change is written to first)
   - **b) Where:** topic `ride.events`, key `r-9`, header `id: ob-901`
   - **Data change:** Kafka message `ride.requested` added
   - **Why Debezium and not a polling job:** it sees each row once, in commit order, a few milliseconds after the commit. Readers still drop repeats by the event id, because Debezium may send a message twice after a restart.

**Say in the interview:** "Booking is one PostgreSQL transaction that inserts the ride as REQUESTED plus an outbox row; Debezium turns the outbox into a `ride.events` message keyed by ride id. An idempotency key with a unique constraint makes double taps safe, and the quote is a signed token, so no lookup is needed."

### Flow 4. Matching offers Rahul's ride to one driver at a time, and never to a driver who already has an offer (Kafka → Matching Service → Redis free sets + SET NX lock + Pub/Sub → WebSocket Gateway → Ravi)

```text
┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 2, 3, 4 ──────────────────────────────────────────┐              ┌── STEP 2, 3, 4 ──────────────────────────────────────────┐              ┌── STEP 4 ────────────────────────────────────────────────┐              ┌── STEP 5 ────────────────────────────────────────────────┐
│ Kafka (ride.events)                                      │              │ Matching Service                                         │              │ Redis                                                    │              │ WebSocket Gateway (nodes)                                │              │ Ravi's app (driver d-42)                                 │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Hands new rides to Matching                      │ ───────────> │ STEP 2: Finds the nearest free drivers                   │ ───────────> │ STEP 2: Gives the free sets                              │ ───────────> │ STEP 4: Pushes to the right phone                        │ ─────┬─────> │ STEP 5: Shows a 10-second offer                          │
│   - partitioned by ride id                               │              │   - pickup cell + ring of 6 neighbours                   │              │   - SUNION of 7 cell sets                                │              │   - each node subscribed for its own users               │      │       │   - Accept or Decline, countdown                         │
│   - e.g. r-9 (Rahul), r-10 (Anita) a moment later        │              │   - rank by road time, keep the top 10                   │              │   - e.g. {d-42, d-57, d-61, d-80}                        │              │   - e.g. gw-3 -> Ravi, gw-5 -> Sameer                    │      │       │   - e.g. r-9, pickup 3 min away                          │
└──────────────────────────────────────────────────────────┘              │   - e.g. d-42 (3 min), d-57 (5 min)                      │              │                                                          │              └──────────────────────────────────────────────────────────┘      │       └──────────────────────────────────────────────────────────┘
                                                                          │                                                          │              │ STEP 3: Lets only the first lock win                     │                                                                                │
                                                                          │ STEP 3: Locks one driver before offering                 │              │   - NX = only if the key is missing                      │                                                                                │
                                                                          │   - SET lock:driver:<id> <ride> NX EX 15                 │              │   - e.g. Anita's SET on d-42 returns nil                 │                                                                                │
                                                                          │   - e.g. r-9 gets d-42; r-10 skips to d-57               │              │                                                          │                                                                                │
                                                                          │                                                          │              │ STEP 4: Delivers the offer                               │                                                                                │
                                                                          │ STEP 4: Sends the offer                                  │              │   - Pub/Sub to the node that subscribed                  │                                                                                │
                                                                          │   - PUBLISH user:d-42, then waits 10 s                   │              │   - e.g. user:d-42 -> gw-3                               │                                                                                │
                                                                          │   - e.g. no reply -> unlock, try the next                │              └──────────────────────────────────────────────────────────┘                                                                                │
                                                                          └──────────────────────────────────────────────────────────┘                                                                                                                                                          │
                                                                                                                                                                                                                                                                                                │
                                                                                                                                                                                                                                                                                                │
                                                                                                                                                                                                                                                                                                │
                                                                                                                                                                                                                                                                                                │
                                                                                                                                                                                                                                                                                                │       ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                │       │ Sameer's app (driver d-57)                               │
                                                                                                                                                                                                                                                                                                │       ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                └─────> │ STEP 5: Gets Anita's ride instead                        │
                                                                                                                                                                                                                                                                                                        │   - his own lock, his own offer                          │
                                                                                                                                                                                                                                                                                                        │   - e.g. r-10                                            │
                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Redis                                                                                                                                                  ▼ WebSocket
╔════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════╗    ╔══════════════════════════════════════════╗    ╔══════════════════════════════════════╗
║ Redis set: free drivers per H3 cell            ║    ║ Redis key: driver lock (one ride at a time) ║    ║ Redis Pub/Sub channels                   ║    ║ Offer sent on user:d-42              ║
╟────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────╢    ╟──────────────────────────────────────────╢    ╟──────────────────────────────────────╢
║ cell:8961892a5bfffff:free = {d-42, d-57, d-61} ║    ║ lock:driver:d-42 = r-9   (SET NX EX 15)     ║    ║ user:d-42  -> offers to Ravi's phone     ║    ║ {                                    ║
║ cell:8961892a4ffffff:free = {d-80}             ║    ║ lock:driver:d-57 = r-10  (Anita's ride)     ║    ║ user:u-7   -> trip status to Rahul       ║    ║   "type": "ride.offer",              ║
║ (a driver sits in exactly one cell set)        ║    ╚═════════════════════════════════════════════╝    ║ ride:r-9   -> Ravi's position, every 4 s ║    ║   "ride_id": "r-9",                  ║
╚════════════════════════════════════════════════╝                                                       ╚══════════════════════════════════════════╝    ║   "pickup": "Koramangala 5th Block", ║
                                                                                                                                                         ║   "eta_min": 3,                      ║
                                                                                                                                                         ║   "fare_minor": 53000,               ║
                                                                                                                                                         ║   "expires_at": "18:00:33"           ║
                                                                                                                                                         ║ }                                    ║
                                                                                                                                                         ╚══════════════════════════════════════╝
```

1. **Matching Service picks up the new ride**
   - **a)** reads `ride.requested` for r-9 from `ride.events`; a moment later r-10 (Anita, two streets away)
   - **b)** the Matching Service instance that owns the partition handles both rides, each in its own small loop
   - **Data change:** none
   - **Why from Kafka:** if a Matching instance dies, its partition moves to another instance, which reads r-9 again. No ride is forgotten.

2. **Finds the nearest free drivers**
   - **a) Where to look:** Rahul's cell plus the ring of 6 neighbouring hexagons (`k-ring 1`); if fewer than 3 drivers, widen to the next ring
   - **b) Read:** `SUNION` of the 7 free sets → `{d-42, d-57, d-61, d-80}`, then `HGET` each position and skip those with no `seen` key
   - **c) Rank:** by road time to the pickup, not straight distance (a driver across a flyover may be close but 15 minutes away)
   - **Data change:** none
   - **Why hexagons:** every neighbour of a hexagon is the same distance away, so a "ring" is a fair circle. Square tiles have corner neighbours that are further.

3. **Locks the first driver before offering**
   - **a) Rahul's loop:** `SET lock:driver:d-42 r-9 NX EX 15` → `OK`, Ravi is r-9's
   - **b) Anita's loop, a few milliseconds later:** `SET lock:driver:d-42 r-10 NX EX 15` → `nil` (key already there) → skip Ravi, try Sameer: `SET lock:driver:d-57 r-10 NX EX 15` → `OK`
   - **Data change:** Redis `lock:driver:d-42 = r-9`, `lock:driver:d-57 = r-10`, each for 15 s
   - **What `NX` and `EX` do:** `NX` = only set it if it does not exist yet (only one caller can win). `EX 15` = delete it after 15 seconds by itself, so a crashed matcher can't block Ravi forever.
   - **Why 15 s for a 10 s offer:** a little extra time for the "Accept" call to arrive from a slow network.

4. **Sends the offer to Ravi's phone**
   - **a)** `PUBLISH user:d-42 {type: ride.offer, ride_id: r-9, eta_min: 3, expires_at: 18:00:33}`
   - **b)** Redis passes it to gw-3, the node that subscribed to `user:d-42` in Flow 1; gw-3 writes it down Ravi's WebSocket
   - **Data change:** none stored (Pub/Sub just passes messages along)
   - **Why Pub/Sub:** Matching doesn't know which of 20 gateway nodes holds Ravi. Publishing to his channel reaches the right one.

5. **Ravi sees a 10-second offer**
   - **a) Accept** → Flow 5
   - **b) Decline or silence:** Matching deletes its lock only if it still says r-9 (a small Lua script: compare, then delete, in one step), and offers Rahul's ride to the next driver on the list
   - **c) Nobody:** after about 60 seconds, Matching asks Ride Service to cancel r-9 with reason `NO_DRIVERS`; Rahul is told and not charged
   - **Data change:** on decline, `lock:driver:d-42` deleted
   - **Why one driver at a time:** offering to 5 drivers at once means 4 of them tap "Accept" and get "sorry, taken". Annoyed drivers stop accepting. 10 seconds per driver keeps the total match time small.

**Say in the interview:** "Matching reads ride requests from Kafka, looks up free drivers in the pickup cell and its k-ring in Redis, ranks by ETA, and before offering takes `SET lock:driver:<id> <ride> NX EX 15`. Only one ride can hold a driver. The offer goes through Redis Pub/Sub to the gateway holding the driver's socket, with a 10-second timeout."

### Flow 5. Ravi accepts, arrives, starts and ends the trip → every move is one guarded update (Ravi's app → API Gateway → Ride Service → Redis lock check + Rides DB + outbox → Debezium → Kafka)

```text
┌── STEP 1, 5 ─────────────────────────────────────────────┐              ┌── STEP 1, 5 ─────────────────────────────────────────────┐              ┌── STEP 2, 3, 5 ──────────────────────────────────────────┐              ┌── STEP 3, 5 ─────────────────────────────────────────────┐              ┌── STEP 4, 5 ─────────────────────────────────────────────┐              ┌── STEP 4, 5 ─────────────────────────────────────────────┐
│ Ravi's app (driver d-42)                                 │              │ API Gateway                                              │              │ Ride Service                                             │              │ Rides DB (PostgreSQL)                                    │              │ Debezium (Change Data Capture)                           │              │ Kafka (ride.events)                                      │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps "Accept" within 10 s                        │ ───────────> │ STEP 1, 5: Takes the driver id from the token            │ ───────────> │ STEP 2: Checks the offer is still his                    │ ─────┬─────> │ STEP 3, 5: Decides who wins                              │ ───────────> │ STEP 4, 5: Copies each outbox row to Kafka               │ ───────────> │ STEP 4, 5: Tells everyone the new state                  │
│   - POST /v1/rides/r-9/accept                            │              │   - never from the request body                          │              │   - GET lock:driver:d-42 must be r-9                     │      │       │   - row locks + WHERE status checks                      │              │   - in commit order                                      │              │   - Matching stops, Indexer marks BUSY                   │
│   - e.g. 18:00:27                                        │              │   - e.g. d-42 = Ravi                                     │              │   - e.g. expired -> 409 OFFER_EXPIRED                    │      │       │   - e.g. r-9 MATCHED to d-42                             │              │   - e.g. ob-902 ride.matched                             │              │   - e.g. key r-9, in order                               │
│                                                          │              └──────────────────────────────────────────────────────────┘              │                                                          │      │       └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘
│ STEP 5: Taps Arrived, Start, End                         │                                                                                        │ STEP 3: Runs one guarded transaction                     │      │
│   - one call per move                                    │                                                                                        │   - driver FREE -> BUSY, ride REQUESTED -> MATCHED       │      │
│   - e.g. at the gate, in the car, at the Airport         │                                                                                        │   - plus outbox ride.matched                             │      │
└──────────────────────────────────────────────────────────┘                                                                                        │   - e.g. 0 rows changed -> 409, nothing saved            │      │
                                                                                                                                                    │                                                          │      │
                                                                                                                                                    │ STEP 5: Moves the state, one step at a time              │      │
                                                                                                                                                    │   - UPDATE ... WHERE status = <the step before>          │      │
                                                                                                                                                    │   - e.g. COMPLETED also frees Ravi                       │      │
                                                                                                                                                    └──────────────────────────────────────────────────────────┘      │
                                                                                                                                                                                                                      │
                                                                                                                                                                                                                      │
                                                                                                                                                                                                                      │
                                                                                                                                                                                                                      │
                                                                                                                                                                                                                      │       ┌── STEP 2 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                      │       │ Redis (driver locks)                                     │
                                                                                                                                                                                                                      │       ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                      └─────> │ STEP 2: Holds the offer lock                             │
                                                                                                                                                                                                                              │   - lock:driver:d-42 = r-9, 15 s                         │
                                                                                                                                                                                                                              │   - e.g. still there at 18:00:27                         │
                                                                                                                                                                                                                              └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Redis                                            ▼ Rides DB                                                                                                                                                                    ▼ Kafka
╔═════════════════════════════════════════════╗    ╔════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════╗
║ Redis key: driver lock (one ride at a time) ║    ║ drivers (Rides DB) · key driver_id ║    ║ rides (Rides DB) · key ride_id                                  ║    ║ outbox (Rides DB) · same transaction as the update    ║    ║ Kafka message (ride.events)                                 ║
╟─────────────────────────────────────────────╢    ╟────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────╢
║ lock:driver:d-42 = r-9   (SET NX EX 15)     ║    ║ {                                  ║    ║ {                                                               ║    ║ {                                                     ║    ║ {                                                           ║
║ lock:driver:d-57 = r-10  (Anita's ride)     ║    ║   "driver_id": "d-42",             ║    ║   "ride_id": "r-9",                                             ║    ║   "id": "ob-902",                                     ║    ║   "topic": "ride.events",                                   ║
╚═════════════════════════════════════════════╝    ║   "status": "BUSY",                ║    ║   "driver_id": "d-42",                                          ║    ║   "aggregateid": "r-9",                               ║    ║   "key": "r-9",                                             ║
                                                   ║   "ride_id": "r-9",                ║    ║   "status": "MATCHED" -> "ARRIVED" -> "STARTED" -> "COMPLETED", ║    ║   "type": "ride.matched",                             ║    ║   "headers": {"id": "ob-902", "eventType": "ride.matched"}, ║
                                                   ║   "version": 8                     ║    ║   "matched_at": "2026-11-22T18:00:27+05:30",                    ║    ║   "payload": {"driver_id": "d-42", "rider_id": "u-7"} ║    ║   "value": {"driver_id": "d-42", "rider_id": "u-7"}         ║
                                                   ║ }                                  ║    ║   "completed_at": "2026-11-22T18:44:10+05:30",                  ║    ║ }                                                     ║    ║ }                                                           ║
                                                   ╚════════════════════════════════════╝    ║   "version": 2 -> 3 -> 4 -> 5                                   ║    ╚═══════════════════════════════════════════════════════╝    ╚═════════════════════════════════════════════════════════════╝
                                                                                             ║ }                                                               ║
                                                                                             ╚═════════════════════════════════════════════════════════════════╝
```

1. **Ravi taps "Accept"**
   - **a) Call:** `POST /v1/rides/r-9/accept` at 18:00:27
   - **b) API Gateway** takes d-42 from the token
   - **Data change:** none yet

2. **Ride Service checks the offer is still Ravi's**
   - **a)** `GET lock:driver:d-42` → `r-9` ✓. If it is missing or says another ride → `409 OFFER_EXPIRED` (he was too slow, the ride went to someone else)
   - **Data change:** none
   - **Why:** stops Ravi from grabbing a ride whose offer already moved to the next driver.

3. **Ride Service runs one guarded transaction (the real "no double match")**
   - **a) SQL:**

            BEGIN;
            UPDATE drivers SET status = 'BUSY', ride_id = 'r-9', version = version + 1
             WHERE driver_id = 'd-42' AND status = 'FREE';            -- must change 1 row
            UPDATE rides SET status = 'MATCHED', driver_id = 'd-42', matched_at = now(),
                   version = version + 1
             WHERE ride_id = 'r-9' AND status = 'REQUESTED';          -- must change 1 row
            INSERT INTO outbox (id, aggregateid, type, payload)
            VALUES ('ob-902', 'r-9', 'ride.matched', '{"driver_id": "d-42"}');
            COMMIT;   -- if either UPDATE changed 0 rows: ROLLBACK and answer 409

   - **b) Ravi gets** `200 {status: MATCHED, pickup, rider name}`
   - **Data change:** `drivers` d-42 → `{status: BUSY, ride_id: r-9}`; `rides` r-9 → `{status: MATCHED, driver_id: d-42}`; `outbox` ob-902
   - **Why the database too:** Redis can lose a lock key if a node fails over before copying it. `WHERE status = 'FREE'` can't be fooled: PostgreSQL locks the row during the update, so of two transactions for d-42 only one finds FREE.
   - **What the `WHERE status = ...` trick is called:** a conditional update (or compare-and-set): "change it only if it still looks the way I expect".

4. **Debezium and Kafka tell everyone**
   - **a)** `ride.matched` on `ride.events`, key r-9
   - **b) Readers:** Matching stops r-9's loop; Location Indexer sets `driver:d-42 status BUSY, ride_id r-9` and removes him from the free set; Trip Notifier tells Rahul "Ravi is coming" (Flow 6)
   - **Data change:** Kafka message added
   - **Why through Kafka:** Ride Service doesn't call three services (three more dual writes). It writes one outbox row; each reader follows at its own speed and drops repeats by event id.

5. **Every later move is the same kind of guarded update**
   - **a) Arrived:** `UPDATE rides SET status = 'ARRIVED' WHERE ride_id = 'r-9' AND status = 'MATCHED'`
   - **b) Start:** `... SET status = 'STARTED' ... AND status = 'ARRIVED'` (after Rahul tells Ravi the 4-digit PIN)
   - **c) End:** `... SET status = 'COMPLETED', completed_at = now() ... AND status = 'STARTED'`, plus `UPDATE drivers SET status = 'FREE', ride_id = NULL WHERE driver_id = 'd-42' AND ride_id = 'r-9'`, plus outbox `ride.completed`, all in one transaction
   - **d) Wrong order:** "End" before "Start" changes 0 rows → `409 WRONG_STATE`
   - **Data change:** r-9 MATCHED → ARRIVED → STARTED → COMPLETED (version 2 → 5); d-42 back to FREE; outbox rows `ride.arrived`, `ride.started`, `ride.completed`
   - **Why a state machine:** a trip can only move forward along allowed arrows. A double tap or a late retry can't move it twice or backwards.

**Say in the interview:** "Accept checks the Redis offer lock, then runs one transaction: `UPDATE drivers SET status='BUSY' WHERE id=42 AND status='FREE'` and `UPDATE rides SET status='MATCHED' WHERE id=9 AND status='REQUESTED'`, both must hit one row, plus an outbox row. Every trip step is the same conditional update on the previous state, so the trip is a state machine stored in PostgreSQL."

### Flow 6. Rahul watches Ravi's car move and sees each trip step (Ravi's app → gw-3 → Location Service → Kafka → Location Indexer + Trip Notifier → Redis Pub/Sub → gw-7 → Rahul's app)

```text
┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 2 ────────────────────────────────────────────────┐              ┌── STEP 3 ────────────────────────────────────────────────┐              ┌── STEP 5 ────────────────────────────────────────────────┐              ┌── STEP 5 ────────────────────────────────────────────────┐              ┌── STEP 6 ────────────────────────────────────────────────┐
│ Ravi's app (driver d-42)                                 │              │ WebSocket Gateway (node gw-3)                            │              │ Location Service                                         │              │ Kafka (location.pings, ride.events)                      │              │ Location Indexer                                         │              │ Redis (Pub/Sub)                                          │              │ WebSocket Gateway (node gw-7)                            │              │ Rahul's app (rider u-7)                                  │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Keeps pinging while driving                      │ ───────────> │ STEP 1: Passes the ping on                               │ ───────────> │ STEP 2: Writes the ping to Kafka                         │ ───────────> │ STEP 2: Carries pings and trip states                    │ ─────┬─────> │ STEP 3: Forwards the car to the rider                    │ ─────┬─────> │ STEP 5: Delivers to whoever subscribed                   │ ───────────> │ STEP 5: Pushes to Rahul's phone                          │ ───────────> │ STEP 6: Moves the car smoothly on the map                │
│   - every 4 s, same as Flow 1                            │              │   - Ravi's line lives here                               │              │   - same as Flow 1                                       │              │   - two topics, two readers                              │      │       │   - driver hash says ride_id r-9                         │      │       │   - fire and forget, nothing stored                      │              │   - Rahul's line lives on this node                      │              │   - slides between pings, shows ETA                      │
│   - e.g. 12.9361, 77.6230                                │              │   - e.g. d-42                                            │              │   - e.g. key d-42                                        │              │   - e.g. ride.arrived for r-9                            │      │       │   - PUBLISH ride:r-9 {lat, lng, eta}                     │      │       │   - e.g. ride:r-9, user:u-7 -> gw-7                      │              │   - e.g. two channels subscribed                         │              │   - e.g. "2 min away" -> "Arrived"                       │
└──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘      │       │   - e.g. every 4 s while on a trip                       │      │       └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                │       └──────────────────────────────────────────────────────────┘      │
                                                                                                                                                                                                                                                                                                │                                                                         │
                                                                                                                                                                                                                                                                                                │                                                                         │
                                                                                                                                                                                                                                                                                                │                                                                         │
                                                                                                                                                                                                                                                                                                │                                                                         │
                                                                                                                                                                                                                                                                                                │       ┌── STEP 4 ────────────────────────────────────────────────┐      │
                                                                                                                                                                                                                                                                                                │       │ Trip Notifier                                            │      │
                                                                                                                                                                                                                                                                                                │       ├──────────────────────────────────────────────────────────┤      │
                                                                                                                                                                                                                                                                                                └─────> │ STEP 4: Turns trip events into screen news               │ ─────┘
                                                                                                                                                                                                                                                                                                        │   - PUBLISH user:u-7 {status}                            │
                                                                                                                                                                                                                                                                                                        │   - nobody listening -> phone push                       │
                                                                                                                                                                                                                                                                                                        │   - e.g. "Ravi has arrived"                              │
                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Redis                                                                                         ▼ To Rahul
╔══════════════════════════════════════════╗    ╔══════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗
║ Redis hash: one per driver (latest only) ║    ║ Redis Pub/Sub channels                   ║    ║ Messages sent to Rahul                                   ║
╟──────────────────────────────────────────╢    ╟──────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢
║ driver:d-42 = {                          ║    ║ user:d-42  -> offers to Ravi's phone     ║    ║ ride:r-9  {"lat": 12.9361, "lng": 77.6230, "eta_min": 2} ║
║   "lat": 12.9349, "lng": 77.6212,        ║    ║ user:u-7   -> trip status to Rahul       ║    ║ user:u-7  {"type": "ride.arrived", "ride_id": "r-9"}     ║
║   "cell": "8961892a5bfffff",             ║    ║ ride:r-9   -> Ravi's position, every 4 s ║    ╚══════════════════════════════════════════════════════════╝
║   "status": "FREE" or "BUSY",            ║    ╚══════════════════════════════════════════╝
║   "ride_id": null or "r-9",              ║
║   "ts": "18:00:04"                       ║
║ }                                        ║
╚══════════════════════════════════════════╝
```

1. **Ravi keeps pinging while he drives**
   - **a)** same as Flow 1, every 4 seconds, through his gateway node gw-3
   - **Data change:** none here

2. **Location Service writes the ping to Kafka**
   - **a)** same as Flow 1; `ride.events` already carries Ravi's trip states from Flow 5
   - **Data change:** Kafka message on `location.pings`

3. **Location Indexer forwards the car to the rider**
   - **a)** it updates `driver:d-42` as usual and sees `ride_id: r-9` (set when it read `ride.matched`)
   - **b)** `PUBLISH ride:r-9 {lat: 12.9361, lng: 77.6230, eta_min: 2}`
   - **Data change:** Redis `driver:d-42` updated; nothing stored for the published message
   - **Why here and not in Location Service:** Location Service stays a thin "check and write to Kafka" step. The Indexer already knows who is on which trip.

4. **Trip Notifier turns trip events into screen news**
   - **a)** reads `ride.arrived` for r-9 → `PUBLISH user:u-7 {type: ride.arrived, ride_id: r-9}`
   - **b)** `PUBLISH` returns how many listened. 0 means Rahul's app is closed → send a phone push notification instead: "Ravi has arrived"
   - **c)** drops repeats: it remembers the last event id per ride
   - **Data change:** none stored
   - **Why a separate reader:** the screen update, the push, and SMS can fail or be slow without touching the trip itself.

5. **Redis delivers to the node holding Rahul's phone**
   - **a)** when Rahul's app connected, its gateway node gw-7 subscribed to `user:u-7`; after booking, also to `ride:r-9`
   - **b)** gw-7 writes both messages down Rahul's WebSocket
   - **Data change:** none
   - **Why Pub/Sub:** Ravi is on gw-3, Rahul on gw-7. Nobody needs to know which node holds whom; each node listens for its own users.

6. **Rahul's map moves smoothly**
   - **a)** the app slides the car between two pings, so it doesn't jump every 4 seconds
   - **b) Missed a message?** Pub/Sub doesn't store anything. If Rahul's phone reconnects, the app calls `GET /v1/rides/r-9` once for the true state, then listens again
   - **Data change:** none
   - **Why that's fine:** the position is replaced 4 seconds later anyway, and the trip state always comes from PostgreSQL on reconnect.

**Say in the interview:** "Live tracking is fan-out over Redis Pub/Sub: the location consumer publishes to `ride:{id}` while a driver is on a trip, and a notifier turns `ride.events` into `user:{id}` messages or push. Gateways use sticky sessions and subscribe for their own connected users; on reconnect the app fetches state over REST."

### Flow 7. Rahul pays → charged exactly once (Kafka ride.events → Payment Service → Payment DB PENDING → Razorpay → signed webhook → PAID + outbox → Debezium → Kafka payment.events)

```text
┌── STEP 1 ────────────────────────────────────────────────┐              ┌── STEP 2, 3, 4 ──────────────────────────────────────────┐              ┌── STEP 2, 4 ─────────────────────────────────────────────┐              ┌── STEP 5 ────────────────────────────────────────────────┐              ┌── STEP 5 ────────────────────────────────────────────────┐
│ Kafka (ride.events)                                      │              │ Payment Service                                          │              │ Payment DB (PostgreSQL)                                  │              │ Debezium (Change Data Capture)                           │              │ Kafka (payment.events)                                   │
├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤              ├──────────────────────────────────────────────────────────┤
│ STEP 1: Says the trip is over                            │ ───────────> │ STEP 2: Saves a to-do row first                          │ ─────┬─────> │ STEP 2, 4: Keeps money facts exactly once                │ ───────────> │ STEP 5: Copies the outbox row to Kafka                   │ ───────────> │ STEP 5: Announces the payment                            │
│   - ride.completed, key r-9                              │              │   - payments PENDING, key pay-r-9                        │      │       │   - UNIQUE ride_id, UNIQUE event_id                      │              │   - reads the change log                                 │              │   - receipt to Rahul, earnings to Ravi                   │
│   - e.g. Rs 530 at 18:44:10                              │              │   - a repeat event hits UNIQUE -> skip                   │      │       │   - e.g. PENDING -> PAID                                 │              │   - e.g. ob-3001                                         │              │   - e.g. payment.succeeded r-9                           │
└──────────────────────────────────────────────────────────┘              │   - e.g. pay-77 PENDING                                  │      │       └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘              └──────────────────────────────────────────────────────────┘
                                                                          │                                                          │      │
                                                                          │ STEP 3: Charges with the same key                        │      │
                                                                          │   - retries reuse pay-r-9                                │      │
                                                                          │   - e.g. saved UPI autopay of Rahul                      │      │
                                                                          │                                                          │      │
                                                                          │ STEP 4: Trusts only the signed webhook                   │      │
                                                                          │   - checks the signature, then one transaction           │      │
                                                                          │   - e.g. pay-77 PAID + outbox                            │      │
                                                                          └──────────────────────────────────────────────────────────┘      │
                                                                                                                                            │
                                                                                                                                            │
                                                                                                                                            │
                                                                                                                                            │
                                                                                                                                            │       ┌── STEP 3, 4 ─────────────────────────────────────────────┐
                                                                                                                                            │       │ Razorpay (payment gateway)                               │
                                                                                                                                            │       ├──────────────────────────────────────────────────────────┤
                                                                                                                                            └─────> │ STEP 3: Takes the money once per key                     │
                                                                                                                                                    │   - same key again -> same answer                        │
                                                                                                                                                    │   - e.g. pay_RzQ81 captured                              │
                                                                                                                                                    │                                                          │
                                                                                                                                                    │ STEP 4: Calls our webhook                                │
                                                                                                                                                    │   - POST /v1/webhooks/razorpay, signed                   │
                                                                                                                                                    │   - e.g. evt_Rz5521                                      │
                                                                                                                                                    └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Kafka                                                                       ▼ Payment DB                                                                                                                                                                             ▼ Kafka
╔════════════════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════════╗
║ Kafka message (ride.events)                                            ║    ║ payments (Payment DB) · UNIQUE ride_id · UNIQUE idempotency_key ║    ║ webhook_events (Payment DB) · key event_id   ║    ║ outbox (Payment DB) · same transaction as PAID         ║    ║ Kafka message (payment.events)                                    ║
╟────────────────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────────╢
║ {                                                                      ║    ║ {                                                               ║    ║ {                                            ║    ║ {                                                      ║    ║ {                                                                 ║
║   "topic": "ride.events",                                              ║    ║   "payment_id": "pay-77",                                       ║    ║   "event_id": "evt_Rz5521",                  ║    ║   "id": "ob-3001",                                     ║    ║   "topic": "payment.events",                                      ║
║   "key": "r-9",                                                        ║    ║   "ride_id": "r-9",                                             ║    ║   "type": "payment.captured",                ║    ║   "aggregateid": "pay-77",                             ║    ║   "key": "r-9",                                                   ║
║   "headers": {"id": "ob-905", "eventType": "ride.completed"},          ║    ║   "rider_id": "u-7",                                            ║    ║   "payment_id": "pay-77",                    ║    ║   "type": "payment.succeeded" or "payment.failed",     ║    ║   "headers": {"id": "ob-3001", "eventType": "payment.succeeded"}, ║
║   "value": {"rider_id": "u-7", "fare_minor": 53000, "currency": "INR"} ║    ║   "amount_minor": 53000,                                        ║    ║   "received_at": "2026-11-22T18:44:16+05:30" ║    ║   "payload": {"ride_id": "r-9", "amount_minor": 53000} ║    ║   "value": {"payment_id": "pay-77", "amount_minor": 53000}        ║
║ }                                                                      ║    ║   "currency": "INR",                                            ║    ║ }                                            ║    ║ }                                                      ║    ║ }                                                                 ║
╚════════════════════════════════════════════════════════════════════════╝    ║   "idempotency_key": "pay-r-9",                                 ║    ╚══════════════════════════════════════════════╝    ╚════════════════════════════════════════════════════════╝    ╚═══════════════════════════════════════════════════════════════════╝
                                                                              ║   "gateway_payment_id": null or "pay_RzQ81",                    ║
                                                                              ║   "status": "PENDING" or "PAID" or "FAILED"                     ║
                                                                              ║ }                                                               ║
                                                                              ╚═════════════════════════════════════════════════════════════════╝
```

1. **The trip is over**
   - **a)** Payment Service reads `ride.completed` for r-9: ₹530 (`fare_minor: 53000`)
   - **Data change:** none yet

2. **Payment Service saves a to-do row first**
   - **a)** `INSERT INTO payments (payment_id, ride_id, amount_minor, idempotency_key, status) VALUES ('pay-77', 'r-9', 53000, 'pay-r-9', 'PENDING') ON CONFLICT (ride_id) DO NOTHING`
   - **b)** if the row already existed (Kafka sent the event twice), don't charge again; just continue with the existing row
   - **Data change:** `payments` row pay-77 `{status: PENDING, idempotency_key: pay-r-9}`
   - **Why save before calling Razorpay:** if we call first and crash, money is taken and we have no record. Saving "PENDING" first means a crash leaves a to-do we can finish or check.

3. **Payment Service charges with the same key every time**
   - **a)** calls Razorpay with Rahul's saved UPI autopay and header `Idempotency-Key: pay-r-9`
   - **b) Timeout?** call again with the same key; Razorpay returns the first result instead of charging twice
   - **Data change:** none in our database yet
   - **What an idempotency key is:** a label that means "this is the same request as before". Like a cheque number: the bank won't cash cheque 77 twice.

4. **Razorpay calls our webhook; we trust only that**
   - **a)** `POST /v1/webhooks/razorpay` with `X-Razorpay-Signature`; we check the signature with our shared secret
   - **b) One transaction:**

            BEGIN;
            INSERT INTO webhook_events (event_id, type, payment_id) VALUES ('evt_Rz5521', 'payment.captured', 'pay-77');
            UPDATE payments SET status = 'PAID', gateway_payment_id = 'pay_RzQ81'
             WHERE payment_id = 'pay-77' AND status = 'PENDING';
            INSERT INTO outbox (id, aggregateid, type, payload) VALUES ('ob-3001', 'pay-77', 'payment.succeeded', ...);
            COMMIT;

   - **c) Same webhook twice:** the `webhook_events` primary key fails → answer `200` and do nothing
   - **Data change:** `webhook_events` evt_Rz5521; `payments` pay-77 → PAID; `outbox` ob-3001
   - **Why the webhook and not the call's answer:** the call can time out after the money was taken. The signed webhook is Razorpay's final word, and it retries until we answer `200`.

5. **Debezium puts the payment on Kafka**
   - **a)** `payment.succeeded`, key r-9 → Trip Notifier sends Rahul the receipt; the earnings job adds ₹530 minus commission to Ravi's weekly payout
   - **b) Safety net:** a nightly reconciliation job lists our PENDING rows older than an hour and asks Razorpay for their real status
   - **Data change:** Kafka message on `payment.events`
   - **Why:** the payment never blocks the trip. Ravi is FREE for his next ride while the money settles.

**Say in the interview:** "Payment is driven by `ride.completed`. We insert a PENDING payment with a unique ride id first, call Razorpay with an idempotency key, and mark PAID only from the signed webhook, in one transaction with a dedupe row and an outbox row. A reconciliation job catches anything stuck."

## Key design choices

Each row is one decision. Read it as: "For this area, we picked this, because the other way breaks like this."

| Area | Choice | Why (vs alternative) |
|---|---|---|
| Driver location | Latest position only, in Redis, grouped by H3 cell | PostgreSQL would need ≈250,000 writes a second for data that is stale in 4 seconds |
| Ping path | WebSocket → Location Service → Kafka first → Indexer → Redis | Writing Redis and Kafka from the same service is a dual write; Kafka first gives one ordered copy for every reader |
| Nearby search | H3 cell + ring of 6 neighbours, then rank by road time | Scanning every driver in the city is slow; straight-line distance ignores rivers and flyovers |
| Offers | One driver at a time, 10 s each | Broadcasting to many drivers makes most of them lose a race they thought they won |
| No double assignment | Redis `SET lock:driver:<id> <ride> NX EX 15`, then `UPDATE ... WHERE status = 'FREE'` | Redis alone can lose a key on failover; database alone would see every race. Fast filter + real judge |
| Trip state | PostgreSQL row with conditional updates (state machine) | Without the `WHERE status = <previous>` check, a late retry can move a trip backwards or twice |
| Events | Outbox row in the same transaction → Debezium → Kafka | "Save then publish" loses the event if the server crashes in between |
| Price | Signed quote token, valid 2 minutes | Storing every quote costs a lot; recomputing at booking time may show a different price than the rider saw |
| Surge | Per H3 cell, every 30 s, smoothed and capped, with a TTL | One city-wide number is wrong for most areas; no TTL means a dead Surge Service leaves prices stuck high |
| Live updates | Sticky WebSocket + Redis Pub/Sub per user / per ride | Services can't know which of 20 gateway nodes holds a given phone |
| Payment | PENDING row first, idempotency key, trust only the signed webhook | Calling first and crashing loses the record; trusting the call's answer fails on timeouts |
| Sharding | By city, and by H3 cell inside big cities | Rides never cross cities, so a city is a natural, independent slice |

---

## Deep Dive (only what the flows above did not cover)

### 1. Back-of-the-envelope estimates (say these early)

| Item | Math | Result |
|---|---|---|
| Location writes | 1 million online drivers ÷ 4 s | ≈250,000 pings a second |
| Ping bandwidth | 250,000 × ≈100 bytes | ≈25 MB a second |
| Live driver map | 1 million × ≈200 bytes in Redis | ≈200 MB: fits in memory with lots of room |
| Rides | ≈20 million a day ÷ 86,400 s | ≈230 bookings a second on average, a few thousand at peak |
| Trip state writes | each ride ≈6 state changes | ≈1,500 database writes a second: easy for sharded PostgreSQL |
| WebSocket connections | 1 million drivers + ≈1 million riders with the app open | ≈40 gateway nodes at ≈50,000 connections each |

The point: **locations are huge in number but tiny and short-lived**, so they go to memory. **Trips are few but must be right**, so they go to a real database.

---

### 2. Data model (where each thing lives)

```text
-- Rides DB (PostgreSQL), sharded by city
drivers(driver_id PK, name, city, vehicle, status, ride_id, version)        -- status: FREE / BUSY (online-ness lives in Redis)
rides(ride_id PK, rider_id, driver_id, city, pickup, drop, quote_id, fare_minor, currency, surge,
      status, idempotency_key, requested_at, matched_at, completed_at, version)
  UNIQUE (rider_id, idempotency_key)
  UNIQUE (rider_id) WHERE status IN ('REQUESTED','MATCHED','ARRIVED','STARTED')   -- one open ride per rider
  INDEX (driver_id, requested_at)                                                -- driver's trip history
outbox(id PK, aggregatetype, aggregateid, type, payload, created_at)

-- Payment DB (PostgreSQL)
payments(payment_id PK, ride_id UNIQUE, rider_id, amount_minor, currency, idempotency_key UNIQUE, gateway_payment_id, status)
webhook_events(event_id PK, type, payment_id, received_at)
outbox(id PK, aggregatetype, aggregateid, type, payload, created_at)

-- Redis (one cluster per city or region)
driver:<id>              hash  lat, lng, cell, status, ride_id, ts
cell:<h3>:free           set   free drivers in that hexagon
seen:<id>                key   EX 30
surge:<h3>               value EX 120
lock:driver:<id>         value ride id, SET NX EX 15
channels                 user:<id>, ride:<id>   (Pub/Sub)
```

- **Why online-ness is not in PostgreSQL:** it changes every time a phone loses signal. A 30-second expiring key handles it for free.
- **Why `drivers.status` is only FREE / BUSY:** it is the one fact that must never be wrong (a driver has one ride or none), so it lives where transactions are.

---

### 3. Kafka topics and keys

| Topic | Key | Written by | Read by |
|---|---|---|---|
| `location.pings` | driver_id | Location Service | Location Indexer, Surge Service, ETA model training, S3 archive |
| `ride.events` | ride_id | Debezium (Rides DB outbox) | Matching, Location Indexer, Trip Notifier, Surge, Payment Service, analytics |
| `payment.events` | ride_id | Debezium (Payment DB outbox) | Trip Notifier (receipt), driver earnings, analytics |

- **Why these keys:** Kafka keeps order only inside one partition. Keying by driver keeps a driver's pings in order; keying by ride keeps "matched" before "completed" for the same ride.
- **Every reader drops repeats** by the event id in the header, because Kafka and Debezium promise "at least once", not "exactly once".

---

### 4. Finding nearby drivers: H3 vs Redis GEO vs geohash

| Option | How | Good | Bad |
|---|---|---|---|
| **H3 cells (our choice)** | Hexagon id per position; one free set per cell; look in the cell + rings around it | All neighbours equally far; same cells used for surge and sharding | Need the H3 library; pick the right cell size |
| Redis GEO | `GEOADD drivers:blr lng lat d-42`, then `GEOSEARCH ... BYRADIUS 2 km` | Built into Redis, one command | One big key per city gets hot; harder to split; no free/busy filter |
| Geohash (square tiles) | Base-32 string, shared prefix = nearby | Simple, works in any database | Corner tiles are further than side tiles; edges of tiles cause misses |

- **Cell size:** about 0.1 km² hexagons (H3 resolution 9) for matching: a few hundred metres across, so 7 cells cover a short drive. Bigger cells (resolution 7) for surge, so the numbers are not too noisy.
- **Rank by time, not distance:** the top 10 by straight distance go to the ETA model (road graph + live traffic). Ravi 3 minutes away beats a driver 500 m away across a one-way street.

---

### 5. Stopping double assignment: all the ways, side by side

| Way | How | Good | Bad |
|---|---|---|---|
| Redis lock only | `SET lock:driver:42 ride:9 NX EX 15` | Very fast | A failover can lose the key → rare double offer |
| Database only | `UPDATE drivers SET status='BUSY' WHERE id=42 AND status='FREE'` | Always right | Every race hits the database; offers can't be "reserved" while the driver decides |
| `SELECT ... FOR UPDATE` | Lock the driver row, check, update | Always right, easy to read | Holds a row lock across logic; slower under load |
| **Both (our choice)** | Redis lock while the offer is open; conditional update on accept | Fast, and the database has the final word | Two steps to explain |

---

### 6. Sharding by city and geo cell, and the hot cell (airport at 6 PM)

- **By city first:** Bengaluru, Mumbai and Delhi each get their own Redis cluster, Matching instances and Rides DB shard. A ride never crosses cities, so no cross-shard transactions are ever needed. A problem in Mumbai doesn't touch Bengaluru.
- **Inside a big city, by cell:** Kafka partitions for `ride.events` can be keyed by the pickup's resolution-5 cell (a big area) so one Matching instance owns one part of the city and its Redis keys.
- **The hot cell:** at 6 PM, flights land and hundreds of people book from the same airport hexagon at once. Fixes:
  - **Smaller cells there:** use a finer resolution only for the airport, so the free set isn't one giant key.
  - **A queue instead of a race:** airports usually have a driver queue (first-in, first-out lot). Matching takes the head of the queue instead of searching.
  - **Dedicated capacity:** a Matching instance and Redis shard just for that zone at peak hours, added in advance from yesterday's pattern.
  - **Surge** raises the price there, which brings in drivers from nearby and spreads out demand.

---

### 7. Surge pricing per H3 cell (inside)

- **Inputs:** requests in the last 5 minutes and free drivers right now, per resolution-7 cell, plus the ring around it (people walk a block; drivers drive one).
- **Formula (simple version):** `raw = requests ÷ max(free drivers, 1)`; `surge = clamp(0.7 × previous + 0.3 × f(raw), 1.0, 3.0)`. The 0.7/0.3 mix stops the price from jumping every 30 seconds.
- **Fairness rules:** a cap, government limits in some cities, and no surge during declared emergencies.
- **Locked for the rider:** the quote carries the surge, so a change after Rahul saw the price doesn't touch his ride.

---

### 8. WebSocket gateway scaling

- **Sticky sessions:** the load balancer sends a phone's reconnects to the same node when it can (hashing the user id), so subscriptions don't move around.
- **Who holds whom:** nobody keeps a global table. Each node subscribes to `user:<id>` for its own connections; a publish reaches the right node. For very large fleets, a sharded Pub/Sub (Redis 7 `SSUBSCRIBE`) spreads channels over many Redis nodes.
- **Node dies:** ≈50,000 phones reconnect to other nodes (with random back-off so they don't all arrive in the same second), re-subscribe, and call `GET /v1/rides/{id}` once to catch up.
- **Offers lost in transit:** Pub/Sub stores nothing. If the offer never reaches Ravi, the 10-second timeout hands it to the next driver, and the lock expires by itself.

---

### 9. Failure scenarios

| Failure | What happens |
|---|---|
| Driver never answers an offer | 10 s timeout, lock deleted (or expires at 15 s), next driver gets the offer |
| Redis node dies | Its replica takes over in seconds. Drivers re-ping within 4 s, so the live map rebuilds itself. A lost lock can cause a second offer, but the database still allows only one match |
| Matching instance dies mid-offer | Its Kafka partitions move to another instance, which reads r-9 again and restarts the offer loop. The lock still held on Ravi stops a duplicate offer to him |
| Ride Service crashes after commit, before answering | The ride and outbox row are saved; Debezium still publishes. The app retries with the same idempotency key and gets the same r-9 |
| Debezium is down | Outbox rows wait in PostgreSQL; nothing is lost. When it restarts it continues from its saved position in the change log |
| Driver's phone loses signal mid-trip | `seen:d-42` expires but the trip stays STARTED in PostgreSQL. When the phone returns, the app reads the trip state and carries on |
| Two riders' matchers grab the same driver | Only one `SET NX` succeeds; the other moves to the next driver |
| Late "Accept" after the offer moved on | Lock check fails → `409 OFFER_EXPIRED` |
| Payment call times out | Retry with the same idempotency key; the webhook and nightly reconciliation settle the truth |
| A whole availability zone goes down | Every service and store has copies in other zones; the city keeps running with fewer nodes |

---

### 10. End-to-end walk-through: Ravi, Rahul, Anita and Sameer

```text
18:00:00  Ravi goes online (gw-3)            -> pings every 4 s -> Kafka location.pings -> Indexer -> Redis free set of cell ...5bfffff
18:00:10  Rahul asks for a price             -> route 14 km / 38 min, surge 1.4 -> signed quote q-31, Rs 530, valid till 18:02:10
18:00:20  Rahul taps Book                    -> rides r-9 REQUESTED + outbox ob-901 (one transaction) -> Debezium -> ride.events
18:00:21  Matching reads r-9                 -> 7 cells -> d-42 (3 min) first -> SET lock:driver:d-42 r-9 NX -> OK -> offer to Ravi
18:00:21  Anita's r-10 arrives               -> SET lock:driver:d-42 r-10 NX -> nil -> lock d-57 -> offer to Sameer
18:00:27  Ravi accepts                       -> lock says r-9 -> d-42 FREE->BUSY, r-9 REQUESTED->MATCHED + outbox -> "Ravi is coming"
18:03:30  Ravi arrives, 18:04 trip starts    -> MATCHED->ARRIVED->STARTED, each a conditional update; Rahul watches ride:r-9
18:44:10  Trip ends                          -> COMPLETED, d-42 back to FREE, ride.completed
18:44:16  Payment                            -> pay-77 PENDING -> Razorpay (key pay-r-9) -> signed webhook -> PAID -> receipt to Rahul
```

- **The happy path:** Rahul is matched 7 seconds after tapping "Book", watches the car arrive, and pays once.
- **The race:** Anita's ride wanted the same driver at the same moment. The Redis lock sent it straight to Sameer, with no "sorry, taken" for anyone.

---

### 11. Rapid-fire interview Q&A

| Question | Answer |
|---|---|
| Why not store every location ping in a database? | ≈250,000 writes a second of data that is useless after 4 seconds. Keep the latest in Redis, keep history from Kafka in S3 |
| How do you find nearby drivers fast? | H3 cell of the pickup plus its ring of neighbours; read the small free sets in Redis; rank by road time |
| How do you make sure one driver never gets two rides? | `SET lock:driver:<id> <ride> NX EX 15` before the offer, and on accept `UPDATE drivers SET status='BUSY' WHERE id=? AND status='FREE'` in the same transaction as the ride update |
| Why offer to one driver at a time? | No "you lost the race" for drivers; a 10-second timeout keeps the total wait small |
| How is the trip state kept correct? | A state machine in PostgreSQL: each step is `UPDATE ... WHERE status = <previous>`; 0 rows = wrong order → 409 |
| How does the rider see the car move? | Indexer publishes to `ride:<id>` in Redis Pub/Sub; the gateway node holding the rider's WebSocket forwards it |
| How do services know which gateway holds a phone? | They don't. Gateways subscribe per connected user; Redis delivers to whoever subscribed |
| How do you avoid dual writes? | Ride and payment changes go with an outbox row in one transaction → Debezium → Kafka. Pings go to Kafka first. Readers drop repeats |
| How does surge work? | Per H3 cell, demand ÷ supply every 30 s, smoothed and capped, stored in Redis with an expiry; locked into the rider's quote |
| How do you shard? | By city (rides never cross cities), then by cell inside big cities. Hot cells like the airport get finer cells, a driver queue and extra capacity |
| How do you avoid double charging? | PENDING row with UNIQUE ride id first, idempotency key to Razorpay, PAID only from the signed webhook, dedupe by webhook event id |
| What if no driver accepts? | Widen the ring, keep offering for about a minute, then cancel with `NO_DRIVERS` and don't charge |
