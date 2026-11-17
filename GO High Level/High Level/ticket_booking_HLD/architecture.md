# Ticket Booking Architecture (Ticketmaster / BookMyShow style: time zones, no double booking, reminders)

> **The one idea to remember: "Save the time the way a person said it (local time + the place's zone name), work out UTC from it, and let the database, not the app, decide who gets a seat."**
> Picture a concert poster in London that says "Sunday 29 March, 19:30". Everyone in London knows what that means. A fan in Pune, India, needs to hear "that is 00:00 on Monday for you". A server needs one single clock that never jumps, so it can sort shows and fire reminders. That single clock is **UTC (Coordinated Universal Time)**, the world's reference clock. So we keep three things for every show: the **local time** the organiser typed (19:30), the **IANA zone name** of the venue (`Europe/London`, a name from the world's official time zone list), and the **UTC time** worked out from those two (18:30 UTC). We never save a fixed offset like `+00:00`, because London's offset changes twice a year when the clocks go forward and back (DST, Daylight Saving Time, also called summer time).
> The second hard problem is **double booking**: 50,000 fans tap "Book" in the same second, and two of them pick seat F12. Think of a cinema seat with a "reserved" card on it. Whoever puts the card down first wins; everyone else must see the card. We use a fast first check in **Redis** (a very fast in-memory store) so most losers are turned away cheaply, and then the **database** locks the seat row (`SELECT ... FOR UPDATE`) and decides for real. A **unique rule** on tickets (one ticket per show and seat) is the last wall: even a bug cannot print two tickets for F12.
> The third is **reminders**: "Your show is tomorrow" must arrive once, at the right moment, even though servers crash and clocks change. We save each reminder as a row with a UTC fire time, and a small scheduler picks up the due ones every few seconds.
> Deep dive: [Deep Dive](#deep-dive-only-what-the-flows-above-did-not-cover)

## Requirements (minimal)

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

### Functional (what the product does)

</td><td valign="top" width="50%" markdown="1">

### Non-functional (how well it must work)

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Organisers create shows in their own local time**
  - The organiser types the time as it is printed on the poster. The system finds the venue's zone and works out UTC.
    - e.g. Priya types "29 Mar 2026, 19:30" for Coldplay at Wembley. The system saves `Europe/London` and 18:30 UTC.

</td><td valign="top" width="50%" markdown="1">

- **Show times are always right, in every zone and on clock-change days**
  - A show must never move by an hour because the clocks changed, or because the viewer lives in another country.
    - e.g. London's clocks jump forward on the morning of 29 Mar. The 19:30 show still starts at 19:30 London time, and Rahul in Pune sees "00:00 Monday".

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Fans search shows and see the time in two zones**
  - Search by city, artist and date. Each result shows the venue's time and the fan's own time.
    - e.g. Rahul searches "Coldplay London" and sees "Sun 29 Mar, 19:30 London time (00:00 Mon in Pune)".

</td><td valign="top" width="50%" markdown="1">

- **Search is fast and never slows down booking**
  - Search runs on its own copy of the data (a search index), so millions of people browsing never touch the booking database.
    - e.g. a search answers in about a tenth of a second, even during a big on-sale.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Fans see a live seat map**
  - A drawing of the venue with each seat coloured free, held or sold.
    - e.g. Rahul opens sh-101 and sees F12 and F13 in green.

</td><td valign="top" width="50%" markdown="1">

- **The seat map holds up under a huge crowd**
  - The drawing comes from a CDN (Content Delivery Network, servers close to the user). The live colours come from a cache that is at most 2 seconds old.
    - e.g. 1 million fans open the map at 10:00. The database sees about one read every 2 seconds per show, not 1 million.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Hold seats for 5 minutes while paying**
  - Picking seats puts a short hold on them, so nobody else can take them while you pay.
    - e.g. Rahul holds F12 + F13 as booking bk-555 until 10:05 UTC.

</td><td valign="top" width="50%" markdown="1">

- **A seat is never sold twice (correctness beats speed)**
  - If two people try for the same seat at the same moment, exactly one wins, and the other is told right away.
    - e.g. Anita taps F12 a few milliseconds after Rahul and gets "F12 was just taken".

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Pay and get tickets**
  - Pay through a payment gateway (a company that talks to the banks for us). The booking is confirmed only after the money is really taken.
    - e.g. Rahul pays £190 on Razorpay and gets tickets t-1 and t-2.

</td><td valign="top" width="50%" markdown="1">

- **Money is handled exactly once**
  - A double tap, a repeated message from the gateway or a crash in the middle must never charge twice or lose a payment.
    - e.g. Razorpay sends the same "payment captured" message 3 times. Rahul is charged once and gets one set of tickets.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Unpaid holds free themselves**
  - If the 5 minutes run out, the seats go back on sale. If money arrives too late, it is refunded automatically.
    - e.g. Anita's hold on G7 ends at 10:06. Another fan buys G7 at 10:07. Anita's late payment is refunded.

</td><td valign="top" width="50%" markdown="1">

- **Always up, and nothing is lost in a crash**
  - Any server can die at any moment. Holds, payments and reminders are saved in databases, so a restart picks up where it left off.
    - e.g. the Payment Service crashes after Razorpay took the money. The reconciliation job finds the payment 10 minutes later and finishes it.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Reminders before the show**
  - "Your show is tomorrow" and "Your show is today" messages, by push notification and email.
    - e.g. Rahul gets a reminder 24 hours before, and one at 09:00 London time on the show day.

</td><td valign="top" width="50%" markdown="1">

- **Reminders arrive once, on time**
  - Sent within about a minute of the planned time, never twice, and never an hour off on clock-change days.
    - e.g. three scheduler copies run together, yet Rahul's reminder r-1 is sent exactly once.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

- **Organisers can move or cancel a show**
  - A new time, or a cancellation, with everyone who bought a ticket told.
    - e.g. Priya moves sh-101 from 19:30 to 20:00 London time.

</td><td valign="top" width="50%" markdown="1">

- **Everything follows a change within about a minute**
  - Search results, reminders and ticket holders all learn about the new time, in the right order.
    - e.g. Rahul's 24-hour reminder moves by 30 minutes by itself.

</td></tr>
<tr markdown="1"><td valign="top" width="50%" markdown="1">

</td><td valign="top" width="50%" markdown="1">

- **Fair on big on-sale days**
  - A virtual waiting room lets people in a few at a time, so the system is not crushed and early arrivals go first.
    - e.g. 1 million fans wait for 90,000 seats. They enter in batches, not all at once.

</td></tr>
</table>

## APIs

<table class="cols"><tr><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Create show | `POST /v1/shows {event_id, venue_id, local_start: "2026-03-29T19:30"}` → `{show_id, time_zone, starts_at_utc, version}` |
| Move show | `PATCH /v1/shows/{show_id} {local_start}` + `If-Match: "1"` → `{starts_at_utc, version: 2}` or `412` |
| Cancel show | `POST /v1/shows/{show_id}:cancel {reason}` |
| Search | `GET /v1/search?q=coldplay&city=london&from=2026-03-28&to=2026-03-29` + `X-Time-Zone: Asia/Kolkata` → `{shows[{show_id, local_start, time_zone, starts_at_utc}]}` |
| Seat map | `GET /v1/shows/{show_id}/seats` → `{layout_url, seats{F12: AVAILABLE, ...}}` |

</td><td valign="top" width="50%" markdown="1">

| Feature | API |
|---|---|
| Hold seats | `POST /v1/bookings {show_id, seat_ids}` + `Idempotency-Key` → `201 {booking_id, status: PENDING, expires_at}` or `409 SEATS_TAKEN` |
| Start payment | `POST /v1/bookings/{booking_id}/payments` + `Idempotency-Key` → `{payment_id, gateway_order_id, amount_minor, currency}` |
| Payment webhook | `POST /v1/webhooks/razorpay` + `X-Razorpay-Signature` → `200` |
| Booking status | `GET /v1/bookings/{booking_id}` → `{status, expires_at, tickets[]}` |
| Give up a hold | `DELETE /v1/bookings/{booking_id}` (frees the seats at once) |

</td></tr></table>

## Diagram

A quick map of all the parts and how they connect. Arrows (`──>`) show which way requests or data move. What each store keeps is in **Schema Overview**; each flow below walks through one piece.

```text
USERS (outside)                           ╔══ THE TICKET SYSTEM: everything inside this box is ours ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗          OUTSIDE COMPANIES
                                          ║                                                                                                                                                                                                                                                                            ║
┌──────────────────────────────┐          ║   ┌──────────────────────────────┐              ┌──────────────────────────────┐                                                                                                                                                                                           ║
│ Rahul's app (Pune)           │ ─────┬───╫─> │ CDN (Content Delivery        │ ───────────> │ S3 (file storage)            │                                                                                                                                                                                           ║
├──────────────────────────────┤      │   ║   │ Network)                     │              ├──────────────────────────────┤                                                                                                                                                                                           ║
│ - searches, books, pays      │      │   ║   ├──────────────────────────────┤              │ - the original files         │                                                                                                                                                                                           ║
│ - phone zone Asia/Kolkata    │      │   ║   │ - posters, seat drawings     │              └──────────────────────────────┘                                                                                                                                                                                           ║
└──────────────────────────────┘      │   ║   │ - copies near the user       │                                                                                                                                                                                                                                         ║
                                      │   ║   └──────────────────────────────┘                                                                                                                                                                                                                                         ║
                                      │   ║                                                                                                                                                                                                                                                                            ║
                                      │   ║                                                                                                                                                                                                                                                                            ║
                                      │   ║                                                                                                                                                                                                                                                                            ║
┌──────────────────────────────┐      │   ║   ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐                                                            ┌──────────────────────────────┐                                                 ║
│ Anita's app (London)         │ ─────┼───╫─> │ API Gateway                  │ ─────┬─────> │ Search Service               │ ───────────> │ Elasticsearch                │                                                    ┌─────> │ Search Indexer               │                                                 ║
├──────────────────────────────┤      │   ║   ├──────────────────────────────┤      │       ├──────────────────────────────┤              ├──────────────────────────────┤                                                    │       ├──────────────────────────────┤                                                 ║
│ - wants the same seat        │      │   ║   │ - checks login               │      │       │ - reads only, no writes      │              │ - show search index          │                                                    │       │ - Kafka -> Elasticsearch     │                                                 ║
└──────────────────────────────┘      │   ║   │ - rate limit per user        │      │       └──────────────────────────────┘              │ - filled by Search Indexer   │                                                    │       └──────────────────────────────┘                                                 ║
                                      │   ║   └──────────────────────────────┘      │                                                     └──────────────────────────────┘                                                    │                                                                                        ║
                                      │   ║                                         │                                                                                                                                         │                                                                                        ║
                                      │   ║                                         │                                                                                                                                         │                                                                                        ║
                                      │   ║                                         │                                                                                                                                         │                                                                                        ║
┌──────────────────────────────┐      │   ║                                         │       ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐      │       ┌──────────────────────────────┐              ┌──────────────────────────────┐   ║
│ Priya (event organiser)      │ ─────┘   ║                                         ├─────> │ Event Service                │ ───────────> │ Catalog DB (PostgreSQL)      │ ─────┬─────> │ Kafka (event pipe)           │ ─────┴─────> │ Reminder Service             │ ─────┬─────> │ Reminder DB (PostgreSQL)     │   ║
├──────────────────────────────┤          ║                                         │       ├──────────────────────────────┤              ├──────────────────────────────┤      │       ├──────────────────────────────┤              ├──────────────────────────────┤      │       ├──────────────────────────────┤   ║
│ - creates + moves shows      │          ║                                         │       │ - creates + moves shows      │              │ - venues, shows, outbox      │      │       │ - show / booking / payment   │              │ - planner: when to remind    │      │       │ - reminders, fire_at UTC     │   ║
└──────────────────────────────┘          ║                                         │       │ - local time + zone -> UTC   │              │ - time zone per venue        │      │       │ -   .events topics           │              │ - scheduler: send when due   │      │       └──────────────────────────────┘   ║
                                          ║                                         │       └──────────────────────────────┘              └──────────────────────────────┘      │       │ - fed by outbox + CDC        │              └──────────────────────────────┘      │                                          ║
                                          ║                                         │                                                                                           │       └──────────────────────────────┘                                                    │                                          ║
                                          ║                                         │                                                                                           │                                                                                           │                                          ║
                                          ║                                         │                                                                                           │                                                                                           │                                          ║
                                          ║                                         │                                                                                           │                                                                                           │                                          ║
                                          ║                                         │                                                     ┌──────────────────────────────┐      │                                                                                           │       ┌──────────────────────────────┐   ║          ┌──────────────────────────────┐
                                          ║                                         │                                             ┌─────> │ Booking DB (PostgreSQL)      │ ─────┘                                                                                           └─────> │ Notification Service         │ ──╫────────> │ Push / SMS / Email           │
                                          ║                                         │                                             │       ├──────────────────────────────┤                                                                                                          ├──────────────────────────────┤   ║          ├──────────────────────────────┤
                                          ║                                         │                                             │       │ - show_seats, bookings       │                                                                                                          │ - queue -> push/SMS/email    │   ║          │ - reaches Rahul's phone      │
                                          ║                                         │                                             │       │ - tickets UNIQUE seat        │                                                                                                          │ - text in user's zone        │   ║          └──────────────────────────────┘
                                          ║                                         │                                             │       │ - the real judge             │                                                                                                          └──────────────────────────────┘   ║
                                          ║                                         │                                             │       └──────────────────────────────┘                                                                                                                                             ║
                                          ║                                         │                                             │                                                                                                                                                                                    ║
                                          ║                                         │                                             │                                                                                                                                                                                    ║
                                          ║                                         │                                             │                                                                                                                                                                                    ║
                                          ║                                         │       ┌──────────────────────────────┐      │                                                                                                   ┌──────────────────────────────┐              ┌──────────────────────────────┐   ║
                                          ║                                         └─────> │ Booking Service              │ ─────┼─────────────────────────────────────────────────────────────────────────────────────────────────> │ Payment Service              │ ─────┬─────> │ Payment DB (PostgreSQL)      │   ║
                                          ║                                                 ├──────────────────────────────┤      │                                                                                                   ├──────────────────────────────┤      │       ├──────────────────────────────┤   ║
                                          ║                                                 │ - holds + confirms seats     │      │                                                                                                   │ - payments, webhooks         │      │       │ - payments, webhook ids      │   ║
                                          ║                                                 │ - hold sweeper inside        │      │                                                                                                   │ - reconciliation job         │      │       │ - outbox -> payment.events   │   ║
                                          ║                                                 └──────────────────────────────┘      │                                                                                                   └──────────────────────────────┘      │       └──────────────────────────────┘   ║
                                          ║                                                                                       │                                                                                                                                         │                                          ║
                                          ║                                                                                       │                                                                                                                                         │                                          ║
                                          ║                                                                                       │                                                                                                                                         │                                          ║
                                          ║                                                                                       │       ┌──────────────────────────────┐                                                                                                  │                                          ║          ┌──────────────────────────────┐
                                          ║                                                                                       └─────> │ Redis (seat holds)           │                                                                                                  └──────────────────────────────────────────╫────────> │ Razorpay (payment gateway)   │
                                          ║                                                                                               ├──────────────────────────────┤                                                                                                                                             ║          ├──────────────────────────────┤
                                          ║                                                                                               │ - hold key per seat, 5 min   │                                                                                                                                             ║          │ - takes the money            │
                                          ║                                                                                               │ - fast filter, safe to lose  │                                                                                                                                             ║          │ - calls back (webhook)       │
                                          ║                                                                                               └──────────────────────────────┘                                                                                                                                             ║          └──────────────────────────────┘
                                          ║                                                                                                                                                                                                                                                                            ║
                                          ╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Schema Overview

What every store keeps, as one real example per box. Where a field can take several values, they are shown as `"A" or "B"`. Each row scrolls sideways.

### PostgreSQL: Catalog DB

```text
╔══════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════════════════════════╗
║ venues (Catalog DB) · key venue_id               ║    ║ shows (Catalog DB) · key show_id                         ║    ║ outbox (Catalog DB) · type -> Kafka eventType                       ║
╟──────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────────────────────────╢
║ {                                                ║    ║ {                                                        ║    ║ {                                                                   ║
║   "venue_id": "v-9",                             ║    ║   "show_id": "sh-101",                                   ║    ║   "id": "ob-701",                                                   ║
║   "name": "Wembley Stadium",                     ║    ║   "event_id": "e-77 (Coldplay)",                         ║    ║   "aggregatetype": "show",                                          ║
║   "city": "London",                              ║    ║   "venue_id": "v-9",                                     ║    ║   "aggregateid": "sh-101",                                          ║
║   "time_zone": "Europe/London",                  ║    ║   "local_start": "2026-03-29 19:30",                     ║    ║   "type": "show.created" or "show.rescheduled" or "show.cancelled", ║
║   "layout_file": "layouts/wembley-v9-2026.json", ║    ║   "time_zone": "Europe/London",                          ║    ║   "payload": {                                                      ║
║   "capacity": 90000                              ║    ║   "starts_at_utc": "2026-03-29T18:30:00Z",               ║    ║     "starts_at_utc": "2026-03-29T18:30:00Z",                        ║
║ }                                                ║    ║   "tzdata_version": "2026a",                             ║    ║     "time_zone": "Europe/London",                                   ║
╚══════════════════════════════════════════════════╝    ║   "status": "SCHEDULED" or "RESCHEDULED" or "CANCELLED", ║    ║     "version": 1                                                    ║
                                                        ║   "version": 1                                           ║    ║   },                                                                ║
                                                        ║ }                                                        ║    ║   "created_at": "2026-01-15T11:00:00Z"                              ║
                                                        ╚══════════════════════════════════════════════════════════╝    ║ }                                                                   ║
                                                                                                                        ╚═════════════════════════════════════════════════════════════════════╝
```

### PostgreSQL: Booking DB

```text
╔══════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗
║ show_seats (Booking DB) · key show_id + seat_id      ║    ║ bookings (Booking DB) · UNIQUE user_id + idempotency_key          ║    ║ tickets (Booking DB) · UNIQUE show_id + seat_id ║    ║ outbox (Booking DB)                                                    ║
╟──────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢
║ {                                                    ║    ║ {                                                                 ║    ║ [                                               ║    ║ {                                                                      ║
║   "show_id": "sh-101",                               ║    ║   "booking_id": "bk-555",                                         ║    ║   {                                             ║    ║   "id": "ob-9001",                                                     ║
║   "seat_id": "F12",                                  ║    ║   "user_id": "u-42 (Rahul)",                                      ║    ║     "ticket_id": "t-1",                         ║    ║   "aggregatetype": "booking",                                          ║
║   "status": "AVAILABLE" or "HELD" or "BOOKED",       ║    ║   "show_id": "sh-101",                                            ║    ║     "booking_id": "bk-555",                     ║    ║   "aggregateid": "bk-555",                                             ║
║   "booking_id": null or "bk-555",                    ║    ║   "seat_ids": ["F12", "F13"],                                     ║    ║     "show_id": "sh-101",                        ║    ║   "type": "booking.confirmed" or "booking.confirm_failed" or           ║
║   "hold_expires_at": null or "2026-03-01T10:05:00Z", ║    ║   "status": "PENDING" or "CONFIRMED" or "EXPIRED" or "CANCELLED", ║    ║     "seat_id": "F12",                           ║    ║       "booking.cancelled",                                             ║
║   "price_minor": 9500,                               ║    ║   "amount_minor": 19000,                                          ║    ║     "qr_code": "QR.sig.9f2"                     ║    ║   "payload": {                                                         ║
║   "version": 1                                       ║    ║   "currency": "GBP",                                              ║    ║   }                                             ║    ║     "user_id": "u-42",                                                 ║
║ }                                                    ║    ║   "idempotency_key": "idem-7f3a",                                 ║    ║ ]                                               ║    ║     "show_id": "sh-101",                                               ║
╚══════════════════════════════════════════════════════╝    ║   "user_time_zone": "Asia/Kolkata",                               ║    ╚═════════════════════════════════════════════════╝    ║     "seats": ["F12", "F13"]                                            ║
                                                            ║   "created_at": "2026-03-01T10:00:00Z",                           ║                                                           ║   },                                                                   ║
                                                            ║   "expires_at": "2026-03-01T10:05:00Z"                            ║                                                           ║   "created_at": "2026-03-01T10:02:31Z"                                 ║
                                                            ║ }                                                                 ║                                                           ║ }                                                                      ║
                                                            ╚═══════════════════════════════════════════════════════════════════╝                                                           ╚════════════════════════════════════════════════════════════════════════╝
```

### PostgreSQL: Payment DB + Reminder DB

```text
╔════════════════════════════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════════════════════════╗
║ payments (Payment DB) · UNIQUE idempotency_key                         ║    ║ webhook_events (Payment DB) · key gateway_event_id ║    ║ outbox (Payment DB)                             ║    ║ reminders (Reminder DB) · UNIQUE booking_id + kind                     ║
╟────────────────────────────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────────────────────────╢
║ {                                                                      ║    ║ {                                                  ║    ║ {                                               ║    ║ {                                                                      ║
║   "payment_id": "pay-901",                                             ║    ║   "gateway_event_id": "evt_RZP_301",               ║    ║   "id": "ob-p-77",                              ║    ║   "reminder_id": "r-1",                                                ║
║   "booking_id": "bk-555",                                              ║    ║   "type": "payment.captured",                      ║    ║   "aggregatetype": "payment",                   ║    ║   "booking_id": "bk-555",                                              ║
║   "gateway_order_id": "order_RZP_44",                                  ║    ║   "received_at": "2026-03-01T10:02:30Z"            ║    ║   "aggregateid": "pay-901",                     ║    ║   "show_id": "sh-101",                                                 ║
║   "gateway_payment_id": null or "pay_RZP_88",                          ║    ║ }                                                  ║    ║   "type": "payment.paid" or "payment.refunded", ║    ║   "kind": "BEFORE_24H" or "SHOW_DAY_9AM",                              ║
║   "amount_minor": 19000,                                               ║    ╚════════════════════════════════════════════════════╝    ║   "payload": {                                  ║    ║   "fire_at_utc": "2026-03-28T18:30:00Z",                               ║
║   "currency": "GBP",                                                   ║                                                              ║     "booking_id": "bk-555",                     ║    ║   "status": "PENDING" or "QUEUED" or "SENT" or "CANCELLED" or          ║
║   "status": "CREATED" or "PAID" or "COMPLETED" or "FAILED" or          ║                                                              ║     "amount_minor": 19000,                      ║    ║       "SKIPPED",                                                       ║
║       "REFUND_PENDING" or "REFUNDED",                                  ║                                                              ║     "currency": "GBP"                           ║    ║   "show_version": 1                                                    ║
║   "idempotency_key": "idem-pay-3b2",                                   ║                                                              ║   },                                            ║    ║ }                                                                      ║
║   "created_at": "2026-03-01T10:01:00Z"                                 ║                                                              ║   "created_at": "2026-03-01T10:02:30Z"          ║    ╚════════════════════════════════════════════════════════════════════════╝
║ }                                                                      ║                                                              ║ }                                               ║
╚════════════════════════════════════════════════════════════════════════╝                                                              ╚═════════════════════════════════════════════════╝
```

### Redis, Elasticsearch, Kafka

```text
╔═══════════════════════════════════╗    ╔═════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════════════════════════╗
║ Redis keys: seat holds            ║    ║ Redis key: seat status cache                ║    ║ Elasticsearch document (index shows)                     ║    ║ Kafka message                                                     ║
╟───────────────────────────────────╢    ╟─────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢    ╟───────────────────────────────────────────────────────────────────╢
║ hold:sh-101:F12 = bk-555          ║    ║ seatmap:sh-101 = {                          ║    ║ {                                                        ║    ║ {                                                                 ║
║ hold:sh-101:F13 = bk-555          ║    ║   "F12": "AVAILABLE" or "HELD" or "BOOKED", ║    ║   "show_id": "sh-101",                                   ║    ║   "topic": "show.events" or "booking.events" or "payment.events", ║
║ (SET NX EX 300: gone after 300 s) ║    ║   "G7": "AVAILABLE",                        ║    ║   "title": "Coldplay: Music of the Spheres",             ║    ║   "key": "bk-555",                                                ║
╚═══════════════════════════════════╝    ║   ...                                       ║    ║   "venue": "Wembley Stadium",                            ║    ║   "headers": {                                                    ║
                                         ║ }   (kept 2 s)                              ║    ║   "city": "London",                                      ║    ║     "id": "ob-9001",                                              ║
                                         ╚═════════════════════════════════════════════╝    ║   "time_zone": "Europe/London",                          ║    ║     "eventType": "booking.confirmed"                              ║
                                                                                            ║   "local_start": "2026-03-29 19:30",                     ║    ║   },                                                              ║
                                                                                            ║   "starts_at_utc": "2026-03-29T18:30:00Z",               ║    ║   "value": {                                                      ║
                                                                                            ║   "min_price_minor": 9500,                               ║    ║     "user_id": "u-42",                                            ║
                                                                                            ║   "status": "SCHEDULED" or "RESCHEDULED" or "CANCELLED", ║    ║     "show_id": "sh-101",                                          ║
                                                                                            ║   "version": 1                                           ║    ║     "seats": ["F12", "F13"]                                       ║
                                                                                            ║ }                                                        ║    ║   }                                                               ║
                                                                                            ╚══════════════════════════════════════════════════════════╝    ║ }                                                                 ║
                                                                                                                                                            ╚═══════════════════════════════════════════════════════════════════╝
```

### Files and messages: S3, CDN, notification queue, Razorpay

```text
╔══════════════════════════════════════════╗    ╔═════════════════════════════════════════╗    ╔═════════════════════════════════╗    ╔═════════════════════════════════════════╗
║ seat drawing in S3                       ║    ║ CDN rules                               ║    ║ queue message (SQS)             ║    ║ Razorpay webhook (signed)               ║
╟──────────────────────────────────────────╢    ╟─────────────────────────────────────────╢    ╟─────────────────────────────────╢    ╟─────────────────────────────────────────╢
║ {                                        ║    ║ /layouts/*  -> S3 bucket, cache 1 day   ║    ║ {                               ║    ║ {                                       ║
║   "key": "layouts/wembley-v9-2026.json", ║    ║ /posters/*  -> S3 bucket, cache 7 days  ║    ║   "reminder_id": "r-1",         ║    ║   "headers": {                          ║
║   "seats": [                             ║    ║ /v1/*       -> never cached (live data) ║    ║   "booking_id": "bk-555",       ║    ║     "X-Razorpay-Signature": "9f1c...e2" ║
║     {                                    ║    ╚═════════════════════════════════════════╝    ║   "user_id": "u-42",            ║    ║   },                                    ║
║       "id": "F12",                       ║                                                   ║   "template": "show_tomorrow",  ║    ║   "event_id": "evt_RZP_301",            ║
║       "x": 412,                          ║                                                   ║   "channels": ["push", "email"] ║    ║   "event": "payment.captured",          ║
║       "y": 220,                          ║                                                   ║ }                               ║    ║   "payload": {                          ║
║       "block": "112",                    ║                                                   ╚═════════════════════════════════╝    ║     "order_id": "order_RZP_44",         ║
║       "band": "A"                        ║                                                                                          ║     "payment_id": "pay_RZP_88",         ║
║     },                                   ║                                                                                          ║     "amount": 19000,                    ║
║     "... 90,000 seats"                   ║                                                                                          ║     "currency": "GBP"                   ║
║   ]                                      ║                                                                                          ║   }                                     ║
║ }                                        ║                                                                                          ║ }                                       ║
╚══════════════════════════════════════════╝                                                                                          ╚═════════════════════════════════════════╝
```

## Flows (the big diagram, one piece at a time)

Each flow is one slice of the big diagram. Every box says what it does in each step (`STEP n: what`, then how, then an example). Arrows go straight from box to box. Under each diagram, **Data in this flow** shows the rows, keys and messages that flow writes, side by side (scroll sideways). The numbered steps below match the `STEP n` in the boxes.

### Flow 1. Priya creates a show in London time → UTC is worked out once (Event Service → Catalog DB + outbox → Debezium → Kafka → Elasticsearch + seat rows)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2, 3 ─────────────────────────────────────────────┐            ┌── STEP 3 ────────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 4, 5, 6 ──────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
│ Priya  (event organiser, admin screen)                   │            │ Event Service  (the only writer of shows)                │            │ Catalog DB  (PostgreSQL)                                 │            │ Debezium  (Change Data Capture)                          │            │ Kafka  (event pipe)                                      │            │ Search Indexer                                           │            │ Elasticsearch  (search index)                            │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Types the show time in London time               │ ─────────> │ STEP 2: Finds the venue's zone                           │ ─────────> │ STEP 3: Stores the show and the news about it            │ ─────────> │ STEP 4: Copies the new outbox row into Kafka             │ ─────────> │ STEP 4: Keeps every show change in order                 │ ────┬────> │ STEP 5: Copies the show into search                      │ ─────────> │ STEP 5: Makes the show searchable                        │
│   - HTTPS POST /v1/shows through the API Gateway, no     │            │   - reads the venues row for v-9                         │            │   - shows row + outbox row in the same commit            │            │   - reads PostgreSQL's change log (WAL), not the tables  │            │   - same key = same partition = one ordered lane         │     │      │   - writes only if the show's version is newer           │            │   - document shows/sh-101: city, artist, UTC time        │
│     zone, no offset                                      │            │   - e.g. Wembley = Europe/London (a zone name)           │            │   - e.g. sh-101: 19:30 Europe/London = 18:30 UTC         │            │   - e.g. ob-701 -> topic show.events, key sh-101         │            │   - e.g. show.created for sh-101                         │     │      │   - e.g. sh-101 version 1                                │            │   - e.g. Coldplay, London, 2026-03-29T18:30Z             │
│   - e.g. local_start 2026-03-29T19:30, venue v-9         │            │                                                          │            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            │                                                          │     │      └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────┘            │ STEP 2: Checks the time really exists                    │                                                                                                                                                            │ STEP 5, 6: Hands it to two reader groups                 │     │
                                                                        │   - refuses the missing hour, asks on the double hour    │                                                                                                                                                            │   - search-indexer and seat-maker, each at its own pace  │     │
                                                                        │   - e.g. 01:30 on 29 Mar never happens in London         │                                                                                                                                                            └──────────────────────────────────────────────────────────┘     │
                                                                        │                                                          │                                                                                                                                                                                                                             │
                                                                        │ STEP 2: Works out UTC for the show day                   │                                                                                                                                                                                                                             │
                                                                        │   - uses London's rules for 29 Mar, not for today        │                                                                                                                                                                                                                             │
                                                                        │   - e.g. 19:30 London (summer time) = 18:30 UTC          │                                                                                                                                                                                                                             │
                                                                        │                                                          │                                                                                                                                                                                                                             │
                                                                        │ STEP 3: Saves show + outbox together                     │                                                                                                                                                                                                                             │
                                                                        │   - one transaction: INSERT shows, INSERT outbox, COMMIT │                                                                                                                                                                                                                             │
                                                                        │   - e.g. both rows exist, or neither does                │                                                                                                                                                                                                                             │
                                                                        └──────────────────────────────────────────────────────────┘                                                                                                                                                                                                                             │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │      ┌── STEP 6 ────────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                 │      │ Booking Service  (seat-maker)                            │            │ Booking DB  (PostgreSQL)                                 │
                                                                                                                                                                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                 └────> │ STEP 6: Creates one row per seat                         │ ─────────> │ STEP 6: Stores every seat as its own row                 │
                                                                                                                                                                                                                                                                                                                                                                        │   - bulk insert, 5,000 at a time, ON CONFLICT DO NOTHING │            │   - show_seats, key (show_id, seat_id)                   │
                                                                                                                                                                                                                                                                                                                                                                        │   - e.g. ≈90,000 rows for sh-101, all AVAILABLE          │            │   - e.g. sh-101 / F12: AVAILABLE, £95                    │
                                                                                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Catalog DB                                                                                                                                                   ▼ Kafka                                             ▼ Elasticsearch                                     ▼ Booking DB
╔══════════════════════════════════════════════════╗    ╔════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗
║ venues (Catalog DB) · key venue_id               ║    ║ shows (Catalog DB) · key show_id           ║    ║ outbox (Catalog DB) · type -> Kafka eventType ║    ║ Kafka message                                ║    ║ Elasticsearch document (index shows)         ║    ║ show_seats (Booking DB) · key show_id + seat_id ║
╟──────────────────────────────────────────────────╢    ╟────────────────────────────────────────────╢    ╟───────────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢
║ {                                                ║    ║ {                                          ║    ║ {                                             ║    ║ {                                            ║    ║ {                                            ║    ║ {                                               ║
║   "venue_id": "v-9",                             ║    ║   "show_id": "sh-101",                     ║    ║   "id": "ob-701",                             ║    ║   "topic": "show.events",                    ║    ║   "show_id": "sh-101",                       ║    ║   "show_id": "sh-101",                          ║
║   "name": "Wembley Stadium",                     ║    ║   "event_id": "e-77 (Coldplay)",           ║    ║   "aggregatetype": "show",                    ║    ║   "key": "sh-101",                           ║    ║   "title": "Coldplay: Music of the Spheres", ║    ║   "seat_id": "F12",                             ║
║   "city": "London",                              ║    ║   "venue_id": "v-9",                       ║    ║   "aggregateid": "sh-101",                    ║    ║   "headers": {                               ║    ║   "venue": "Wembley Stadium",                ║    ║   "status": "AVAILABLE",                        ║
║   "time_zone": "Europe/London",                  ║    ║   "local_start": "2026-03-29 19:30",       ║    ║   "type": "show.created",                     ║    ║     "id": "ob-701",                          ║    ║   "city": "London",                          ║    ║   "booking_id": null,                           ║
║   "layout_file": "layouts/wembley-v9-2026.json", ║    ║   "time_zone": "Europe/London",            ║    ║   "payload": {                                ║    ║     "eventType": "show.created"              ║    ║   "time_zone": "Europe/London",              ║    ║   "hold_expires_at": null,                      ║
║   "capacity": 90000                              ║    ║   "starts_at_utc": "2026-03-29T18:30:00Z", ║    ║     "starts_at_utc": "2026-03-29T18:30:00Z",  ║    ║   },                                         ║    ║   "local_start": "2026-03-29 19:30",         ║    ║   "price_minor": 9500,                          ║
║ }                                                ║    ║   "tzdata_version": "2026a",               ║    ║     "time_zone": "Europe/London",             ║    ║   "value": {                                 ║    ║   "starts_at_utc": "2026-03-29T18:30:00Z",   ║    ║   "version": 0                                  ║
╚══════════════════════════════════════════════════╝    ║   "status": "SCHEDULED",                   ║    ║     "version": 1                              ║    ║     "starts_at_utc": "2026-03-29T18:30:00Z", ║    ║   "min_price_minor": 9500,                   ║    ║ }                                               ║
                                                        ║   "version": 1                             ║    ║   },                                          ║    ║     "time_zone": "Europe/London",            ║    ║   "status": "SCHEDULED",                     ║    ╚═════════════════════════════════════════════════╝
                                                        ║ }                                          ║    ║   "created_at": "2026-01-15T11:00:00Z"        ║    ║     "version": 1                             ║    ║   "version": 1                               ║
                                                        ╚════════════════════════════════════════════╝    ║ }                                             ║    ║   }                                          ║    ║ }                                            ║
                                                                                                          ╚═══════════════════════════════════════════════╝    ║ }                                            ║    ╚══════════════════════════════════════════════╝
                                                                                                                                                               ╚══════════════════════════════════════════════╝
```

1. **Priya types the show time, in London time**
   - **a) What she sends**
     - `POST /v1/shows {event_id: e-77, venue_id: v-9, local_start: "2026-03-29T19:30"}` through the API Gateway
     - no zone and no offset: the venue already knows where it is
   - **Data change:** none yet
   - **Why:** organisers and posters think in local time. The computer, not a busy person, should do the clock-change maths.

2. **The Event Service finds the zone, checks the time, works out UTC**
   - **a) Find the zone**
     - reads venue v-9 from `venues`: `time_zone = Europe/London`
     - this is an IANA zone name (from the world's shared list of time zone rules): it stands for *all* of London's rules, winter and summer
   - **b) Check the time really exists** (29 Mar is a clock-change day)
     - missing hour: clocks jump 00:59 → 02:00, so 01:30 does not exist → refuse it
     - double hour (25 Oct): 01:30 happens twice → ask "the first or the second?"
   - **c) Convert with the show day's rules**
     - London is UTC+1 on 29 Mar, so 19:30 - 1 h = 18:30 UTC
     - one library call, e.g. Java `ZonedDateTime.of(localStart, ZoneId.of("Europe/London"))`
   - **Data change:** none yet (worked out in memory)
   - **Why not save "+00:00":** in January (when Priya types) London is +00:00. Saving `19:30+00:00` means 20:30 London on show day, so 90,000 people arrive an hour early. A zone name is the rulebook; an offset is just today's page.

3. **One transaction saves the show and an outbox row together**
   - **a) The transaction**
     - `BEGIN; INSERT INTO shows ...; INSERT INTO outbox ...; COMMIT;`
   - **Data change:**
     - `shows` row added `{show_id: sh-101, local_start: "2026-03-29 19:30", time_zone: Europe/London, starts_at_utc: 2026-03-29T18:30:00Z, tzdata_version: "2026a", status: SCHEDULED, version: 1}`
     - `outbox` row added `{id: ob-701, aggregateid: sh-101, type: show.created}`
   - **Why the outbox:** saving the show and then sending to Kafka is a dual write. A crash in between means search never hears about sh-101. Same transaction = both rows exist, or neither.
   - **Why keep both local time and UTC:** local time + zone is what was promised ("19:30 in London"). UTC is a worked-out copy for sorting and reminders. If zone rules change, UTC is worked out again from the truth.

4. **Debezium copies the outbox row into Kafka**
   - **a) How**
     - Debezium is a CDC (Change Data Capture) tool: it reads PostgreSQL's change log (WAL, Write-Ahead Log), not the tables
     - it sees the new outbox row and publishes it
   - **Data change:** Kafka topic `show.events`, key `sh-101`, header `eventType: show.created`
   - **Why key = sh-101:** same key = same partition = one ordered lane. "created" is always read before "rescheduled" (Flow 7).

5. **The Search Indexer puts the show into Elasticsearch**
   - **a) How**
     - consumer group `search-indexer` reads the message
     - writes document `shows/sh-101` only if its version is newer
   - **Data change:** Elasticsearch document `shows/sh-101` added `{city: London, local_start: "2026-03-29 19:30", starts_at_utc: 2026-03-29T18:30:00Z, version: 1}`
   - **Why the version check:** Kafka can deliver a message twice. An old repeat must never overwrite a newer change.

6. **The seat-maker creates one row per seat**
   - **a) How**
     - a second consumer group, `seat-maker` (in the Booking Service), reads the same message
     - opens Wembley's layout and bulk-inserts 5,000 rows at a time, `ON CONFLICT DO NOTHING`
   - **Data change:** `show_seats` ≈90,000 rows added, e.g. `{show_id: sh-101, seat_id: F12, status: AVAILABLE, price_minor: 9500}`
   - **Why one row per seat, made now:** a database can only lock a row that exists. Rahul locking F12 then never blocks Anita picking G7.
   - **Why two consumer groups:** each group has its own bookmark in the topic, so a slow seat-maker never holds up search.

**Say in the interview:** "Organisers enter wall-clock time; the Event Service attaches the venue's IANA zone, rejects DST-gap times, asks about overlaps, and stores local time, zone and derived UTC with an outbox event in one transaction. Debezium publishes it keyed by show id, so search and seat creation follow in order."

### Flow 2. Rahul in Pune finds the show and opens the seat map (Search Service → Elasticsearch; CDN → S3; Redis seat map cache → Booking DB)

```text
┌── STEP 1, 3, 4, 5 ───────────────────────────────────────┐            ┌── STEP 1, 5 ─────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐
│ Rahul's app  (Pune, phone zone Asia/Kolkata)             │            │ API Gateway  (front door)                                │            │ Search Service                                           │            │ Elasticsearch  (search index)                            │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Searches 'Coldplay London'                       │ ────┬────> │ STEP 1, 5: Checks login + rate limit, then routes        │ ────┬────> │ STEP 2: Turns London dates into a UTC range              │ ─────────> │ STEP 2: Finds the shows in the range                     │
│   - GET /v1/search + header X-Time-Zone: Asia/Kolkata    │     │      │   - /v1/search -> Search, /seats -> Booking              │     │      │   - dates in a city search mean that city's dates        │            │   - filter city + starts_at_utc, sort by time            │
│   - e.g. from 2026-03-28 to 2026-03-29                   │     │      │   - e.g. too many calls from u-42 -> 429                 │     │      │   - e.g. 28-29 Mar London = 28T00:00Z to 29T23:00Z       │            │   - e.g. sh-100 (Sat) and sh-101 (Sun)                   │
│                                                          │     │      └──────────────────────────────────────────────────────────┘     │      │                                                          │            └──────────────────────────────────────────────────────────┘
│ STEP 3: Shows each time in two zones                     │     │                                                                       │      │ STEP 2: Returns UTC + zone, not ready text               │
│   - formats UTC + zone itself, London time first         │     │                                                                       │      │   - each app formats it for its own user                 │
│   - e.g. Sun 29 Mar, 19:30 London (00:00 Mon in Pune)    │     │                                                                       │      │   - e.g. 18:30Z + Europe/London                          │
│                                                          │     │                                                                       │      └──────────────────────────────────────────────────────────┘
│ STEP 4: Downloads the seat drawing                       │     │                                                                       │
│   - from the CDN, never from our servers                 │     │                                                                       │
│   - e.g. /layouts/wembley-v9-2026.json                   │     │                                                                       │
│                                                          │     │                                                                       │
│ STEP 5: Paints the live seat colours                     │     │                                                                       │
│   - GET /v1/shows/sh-101/seats                           │     │                                                                       │
│   - e.g. green = free, grey = held or sold               │     │                                                                       │
└──────────────────────────────────────────────────────────┘     │                                                                       │
                                                                 │                                                                       │
                                                                 │                                                                       │
                                                                 │                                                                       │
                                                                 │                                                                       │      ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                 │                                                                       │      │ Booking Service  (seat map)                              │            │ Redis  (seat status cache)                               │
                                                                 │                                                                       │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                 │                                                                       └────> │ STEP 5: Returns the status of every seat                 │ ────┬────> │ STEP 5: Answers the seat map in a millisecond            │
                                                                 │                                                                              │   - Redis first, database only if Redis is empty         │     │      │   - GET seatmap:sh-101, kept 2 seconds                   │
                                                                 │                                                                              │   - e.g. one request rebuilds, the others wait           │     │      │   - e.g. {F12: AVAILABLE, F13: AVAILABLE, ...}           │
                                                                 │                                                                              └──────────────────────────────────────────────────────────┘     │      └──────────────────────────────────────────────────────────┘
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
                                                                 │      ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐     │      ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                 │      │ CDN  (Content Delivery Network)                          │            │ S3  (file storage)                                       │     │      │ Booking DB  (PostgreSQL)                                 │
                                                                 │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤     │      ├──────────────────────────────────────────────────────────┤
                                                                 └────> │ STEP 4: Serves the drawing from near Pune                │ ─────────> │ STEP 4: Holds the original drawing                       │     └────> │ STEP 5: Rebuilds the map on a cache miss                 │
                                                                        │   - cache hit: answers by itself, keeps it 1 day         │            │   - one file per venue layout, same for every show       │            │   - SELECT seat_id, status FROM show_seats               │
                                                                        │   - e.g. Mumbai server answers in a few ms               │            │   - e.g. layouts/wembley-v9-2026.json                    │            │   - e.g. ≈90,000 rows for sh-101                         │
                                                                        │                                                          │            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘
                                                                        │ STEP 4: On a miss, fetches from S3 once                  │
                                                                        │   - only the first fan in the area waits                 │
                                                                        │   - e.g. everyone after gets the copy                    │
                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ CDN                                          ▼ S3                                            ▼ Elasticsearch                                     ▼ Redis                                            ▼ Booking DB
╔═════════════════════════════════════════╗    ╔══════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔═════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗
║ CDN rules                               ║    ║ seat drawing in S3                       ║    ║ Elasticsearch document (index shows)         ║    ║ Redis key: seat status cache                ║    ║ show_seats (Booking DB) · key show_id + seat_id ║
╟─────────────────────────────────────────╢    ╟──────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟─────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢
║ /layouts/*  -> S3 bucket, cache 1 day   ║    ║ {                                        ║    ║ {                                            ║    ║ seatmap:sh-101 = {                          ║    ║ {                                               ║
║ /posters/*  -> S3 bucket, cache 7 days  ║    ║   "key": "layouts/wembley-v9-2026.json", ║    ║   "show_id": "sh-101",                       ║    ║   "F12": "AVAILABLE" or "HELD" or "BOOKED", ║    ║   "show_id": "sh-101",                          ║
║ /v1/*       -> never cached (live data) ║    ║   "seats": [                             ║    ║   "title": "Coldplay: Music of the Spheres", ║    ║   "G7": "AVAILABLE",                        ║    ║   "seat_id": "F12",                             ║
╚═════════════════════════════════════════╝    ║     {                                    ║    ║   "venue": "Wembley Stadium",                ║    ║   ...                                       ║    ║   "status": "AVAILABLE",                        ║
                                               ║       "id": "F12",                       ║    ║   "city": "London",                          ║    ║ }   (kept 2 s)                              ║    ║   "booking_id": null,                           ║
                                               ║       "x": 412,                          ║    ║   "time_zone": "Europe/London",              ║    ╚═════════════════════════════════════════════╝    ║   "hold_expires_at": null,                      ║
                                               ║       "y": 220,                          ║    ║   "local_start": "2026-03-29 19:30",         ║                                                       ║   "price_minor": 9500,                          ║
                                               ║       "block": "112",                    ║    ║   "starts_at_utc": "2026-03-29T18:30:00Z",   ║                                                       ║   "version": 0                                  ║
                                               ║       "band": "A"                        ║    ║   "min_price_minor": 9500,                   ║                                                       ║ }                                               ║
                                               ║     },                                   ║    ║   "status": "SCHEDULED",                     ║                                                       ╚═════════════════════════════════════════════════╝
                                               ║     "... 90,000 seats"                   ║    ║   "version": 1                               ║
                                               ║   ]                                      ║    ║ }                                            ║
                                               ║ }                                        ║    ╚══════════════════════════════════════════════╝
                                               ╚══════════════════════════════════════════╝
```

1. **Rahul searches, and his app says which zone it is in**
   - **a) The request**
     - `GET /v1/search?q=coldplay&city=london&from=2026-03-28&to=2026-03-29`
     - header `X-Time-Zone: Asia/Kolkata`, taken from the phone, so it is right even when he travels
   - **Data change:** none (search only reads)
   - **Why send the zone:** to show "your time" and understand "today" or "this weekend". It never changes the stored show time.

2. **The Search Service turns London dates into a UTC range**
   - **a) Rule:** dates in a city search mean that city's dates
   - **b) Work out the range**
     - start = 28 Mar 00:00 London (winter time) = `2026-03-28T00:00:00Z`
     - end = 30 Mar 00:00 London (summer time) = `2026-03-29T23:00:00Z`
     - the "two days" are only 47 hours: one hour vanished on Sunday night
   - **c) Ask Elasticsearch**
     - filter `city = London AND starts_at_utc` in the range, sorted by time
     - finds sh-100 (Sat) and sh-101 (Sun)
   - **Data change:** none
   - **Why search on UTC:** UTC sorts and compares correctly across all cities. Adding "2 × 24 hours" would wrongly include an hour of Monday.

3. **The app shows each time in two zones**
   - **a) The result carries** `starts_at_utc`, `local_start` and `time_zone`; the app formats them itself
     - sh-100: "Sat 28 Mar, 19:30 London time (01:00 Sun in Pune)"
     - sh-101: "Sun 29 Mar, 19:30 London time (00:00 Mon in Pune)"
   - **Data change:** none
   - **Why:** Pune is 5½ hours ahead on Saturday but only 4½ on Sunday. The gap between two cities is not fixed, so we never store "London = Pune minus 5:30".

4. **The seat drawing comes from the CDN**
   - **a) The app downloads** `https://cdn.example.com/layouts/wembley-v9-2026.json` (all 90,000 seat positions)
   - **b) Cache hit:** the CDN (Content Delivery Network) server in Mumbai already has it and answers alone
   - **c) Cache miss:** the first fan nearby makes the CDN fetch it from S3 (the origin, where the original lives) and keep it for 1 day
   - **Data change:** the Mumbai CDN server keeps a copy for 1 day
   - **Why split drawing from colours:** the drawing never changes, so it caches for long. The colours change every second.

5. **Live seat colours come from a 2-second Redis cache**
   - **a) The request:** `GET /v1/shows/sh-101/seats` → Booking Service → Redis `GET seatmap:sh-101`
   - **b) On a miss**
     - reads `show_seats` for sh-101, saves it as `seatmap:sh-101` for 2 seconds
     - only one request rebuilds it; the others wait for that result
   - **Data change:** Redis key `seatmap:sh-101 = {F12: AVAILABLE, F13: AVAILABLE, G7: AVAILABLE, ...}`, expires in 2 seconds
   - **Why 2 seconds old is fine:** the map is only a hint. The real decision is in Flow 3, in the database.

**Say in the interview:** "Search runs on Elasticsearch fed from Kafka. Date filters become a UTC range using the venue city's zone, which handles 23- and 25-hour days, and results carry UTC plus the IANA zone. Seat layouts come from the CDN; live availability is a short-lived Redis snapshot that's only a hint."

### Flow 3. Rahul and Anita tap seat F12 at the same moment → exactly one wins (Redis SET NX → SELECT ... FOR UPDATE → booking PENDING)

```text
┌── STEP 1, 4 ─────────────────────────────────────────────┐            ┌── STEP 1, 4, 5 ──────────────────────────────────────────┐            ┌── STEP 2, 3, 4, 5 ───────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐
│ Rahul's app                                              │            │ API Gateway  (front door)                                │            │ Booking Service                                          │            │ Redis  (seat holds)                                      │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps 'Book F12, F13'                             │ ────┬────> │ STEP 1, 4, 5: Takes the user id from the login token     │ ─────────> │ STEP 2: Grabs one Redis key per seat                     │ ────┬────> │ STEP 2: Lets only the first caller in                    │
│   - POST /v1/bookings + Idempotency-Key                  │     │      │   - never from the request body                          │            │   - SET NX EX 300, seats in sorted order                 │     │      │   - SET NX creates the key only if it is missing         │
│   - e.g. idem-7f3a at 10:00:00 UTC                       │     │      │   - e.g. u-42 = Rahul, u-77 = Anita                      │            │   - e.g. Rahul wins F12; Anita's SET NX fails            │     │      │   - e.g. hold:sh-101:F12 = bk-555, gone after 300 s      │
│                                                          │     │      └──────────────────────────────────────────────────────────┘            │                                                          │     │      └──────────────────────────────────────────────────────────┘
│ STEP 4: Gets a 5-minute hold                             │     │                                                                              │ STEP 3: Locks the seat rows and decides                  │     │
│   - countdown from the server's time, not the phone's    │     │                                                                              │   - one transaction: FOR UPDATE, check free, mark HELD   │     │
│   - e.g. bk-555 PENDING until 10:05 UTC                  │     │                                                                              │   - e.g. F12, F13 -> HELD by bk-555                      │     │
└──────────────────────────────────────────────────────────┘     │                                                                              │                                                          │     │
                                                                 │                                                                              │ STEP 4: Answers the winner                               │     │
                                                                 │                                                                              │   - 201 PENDING with expires_at                          │     │
                                                                 │                                                                              │   - e.g. bk-555 until 10:05:00 UTC                       │     │
                                                                 │                                                                              │                                                          │     │
                                                                 │                                                                              │ STEP 5: Turns the loser away at once                     │     │
                                                                 │                                                                              │   - 409 without touching the database                    │     │
                                                                 │                                                                              │   - e.g. Anita: SEATS_TAKEN                              │     │
                                                                 │                                                                              └──────────────────────────────────────────────────────────┘     │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
                                                                 │                                                                                                                                               │
┌── STEP 1, 5 ─────────────────────────────────────────────┐     │                                                                                                                                               │      ┌── STEP 3 ────────────────────────────────────────────────┐
│ Anita's app                                              │     │                                                                                                                                               │      │ Booking DB  (PostgreSQL, the real judge)                 │
├──────────────────────────────────────────────────────────┤     │                                                                                                                                               │      ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps 'Book F12' a moment later                   │ ────┘                                                                                                                                               └────> │ STEP 3: Locks, checks and saves                          │
│   - POST /v1/bookings with her own key                   │                                                                                                                                                            │   - FOR UPDATE in seat order, UPDATE seats, INSERT       │
│   - e.g. a few milliseconds after Rahul                  │                                                                                                                                                            │     booking                                              │
│                                                          │                                                                                                                                                            │   - e.g. F12, F13 HELD; bk-555 PENDING £190              │
│ STEP 5: Told 'F12 was just taken'                        │                                                                                                                                                            └──────────────────────────────────────────────────────────┘
│   - 409 SEATS_TAKEN, the map stays open                  │
│   - e.g. she picks G7 instead: bk-556                    │
└──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Redis                                  ▼ Booking DB
╔═══════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗
║ Redis keys: seat holds            ║    ║ show_seats (Booking DB) · key show_id + seat_id ║    ║ bookings (Booking DB) · UNIQUE user_id + idempotency_key ║
╟───────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢
║ hold:sh-101:F12 = bk-555          ║    ║ {                                               ║    ║ {                                                        ║
║ hold:sh-101:F13 = bk-555          ║    ║   "show_id": "sh-101",                          ║    ║   "booking_id": "bk-555",                                ║
║ (SET NX EX 300: gone after 300 s) ║    ║   "seat_id": "F12",                             ║    ║   "user_id": "u-42 (Rahul)",                             ║
╚═══════════════════════════════════╝    ║   "status": "HELD",                             ║    ║   "show_id": "sh-101",                                   ║
                                         ║   "booking_id": "bk-555",                       ║    ║   "seat_ids": ["F12", "F13"],                            ║
                                         ║   "hold_expires_at": "2026-03-01T10:05:00Z",    ║    ║   "status": "PENDING",                                   ║
                                         ║   "price_minor": 9500,                          ║    ║   "amount_minor": 19000,                                 ║
                                         ║   "version": 1                                  ║    ║   "currency": "GBP",                                     ║
                                         ║ }                                               ║    ║   "idempotency_key": "idem-7f3a",                        ║
                                         ╚═════════════════════════════════════════════════╝    ║   "user_time_zone": "Asia/Kolkata",                      ║
                                                                                                ║   "created_at": "2026-03-01T10:00:00Z",                  ║
                                                                                                ║   "expires_at": "2026-03-01T10:05:00Z"                   ║
                                                                                                ║ }                                                        ║
                                                                                                ╚══════════════════════════════════════════════════════════╝
```

1. **Both tap "Book"**
   - **a) Rahul:** `POST /v1/bookings {show_id: sh-101, seat_ids: [F12, F13]}` + `Idempotency-Key: idem-7f3a`
   - **b) Anita:** `POST /v1/bookings {show_id: sh-101, seat_ids: [F12]}` + her own key, a few milliseconds later
   - **c) API Gateway** takes the user id from the login token (u-42, u-77), never from the body
   - **Data change:** none yet
   - **Why the idempotency key:** if Rahul's app sends the request again, the server finds `idem-7f3a` and returns the same bk-555 instead of holding more seats.

2. **The Booking Service grabs one Redis key per seat (the fast first check)**
   - **a) How**
     - sorts the seats, then `SET hold:sh-101:F12 bk-555 NX EX 300` for each
     - `NX` = only if the key does not exist yet; `EX 300` = delete itself after 5 minutes
   - **b) Result**
     - Rahul is first: both keys are created
     - Anita's `SET ... NX` for F12 fails → `409 SEATS_TAKEN` without touching the database
     - if Rahul had won F12 but lost F13, he deletes only his own keys and gets 409
   - **Data change:** Redis `hold:sh-101:F12 = bk-555`, `hold:sh-101:F13 = bk-555`, each for 300 s
   - **Why Redis first:** in an on-sale most taps lose. Redis turns them away in under a millisecond, so the database only sees winners.

3. **The database locks the seat rows and decides for real**
   - **a) One transaction**

            BEGIN;
            SELECT seat_id, status, booking_id, hold_expires_at FROM show_seats
             WHERE show_id = 'sh-101' AND seat_id IN ('F12', 'F13')
             ORDER BY seat_id FOR UPDATE;
            -- each seat must be AVAILABLE, or HELD with hold_expires_at in the past
            UPDATE show_seats SET status = 'HELD', booking_id = 'bk-555',
                   hold_expires_at = '2026-03-01T10:05:00Z', version = version + 1
             WHERE show_id = 'sh-101' AND seat_id IN ('F12', 'F13');
            INSERT INTO bookings (...) VALUES ('bk-555', 'u-42', 'sh-101', '{F12,F13}', 'PENDING', 19000, 'GBP', ...);
            COMMIT;

   - **b) If any seat is not free:** roll back, delete Rahul's Redis keys, answer 409
   - **Data change:**
     - `show_seats` F12, F13 → `{status: HELD, booking_id: bk-555, hold_expires_at: 2026-03-01T10:05:00Z}`
     - `bookings` row added `{booking_id: bk-555, status: PENDING, amount_minor: 19000, expires_at: 2026-03-01T10:05:00Z}`
   - **Why the database too:** Redis can lose a key on restart or failover. The database, with locks and data on disk, is the real judge.
   - **What `FOR UPDATE` does:** like taking the F12 folder out of a filing cabinet. Anyone else asking for F12 waits until you put it back (`COMMIT`), then reads "HELD" and gives up. G7's folder is untouched.
   - **Why `ORDER BY seat_id`:** if one person locks F12 then F13 and another F13 then F12, both wait forever (a deadlock). Same order for everyone avoids it.

4. **Rahul gets his hold**
   - **a) Answer:** `201 {booking_id: bk-555, status: PENDING, expires_at: "2026-03-01T10:05:00Z"}`
   - **b) Countdown** uses the server's time sent in the response, not the phone's clock
   - **Data change:** none
   - **Why:** phone clocks are often minutes off; the hold could already be gone.

5. **Anita picks another seat**
   - **a) Her app** greys out F12 and keeps the map open; she taps G7
   - **b) Steps 2-4 run again:** bk-556, held until 10:06 UTC (G7 comes back in Flow 5)
   - **Data change:** Redis `hold:sh-101:G7 = bk-556`; `show_seats` G7 HELD by bk-556; `bookings` bk-556 PENDING
   - **Why answer fast:** a loser should know at once, while other seats are still free.

**Say in the interview:** "Holds are two-layered. A Redis SET NX EX per seat is a cheap filter that rejects most contenders. The truth is a short Postgres transaction that locks the seat rows FOR UPDATE in a fixed order, checks they're free or their hold expired, and marks them HELD with an expiry, plus a PENDING booking. An idempotency key makes retries safe."

### Flow 4. Rahul pays → the booking is confirmed exactly once (Payment Service → Razorpay → signed webhook → PAID + outbox → Debezium → Kafka → Booking confirms → tickets + outbox)

```text
┌── STEP 1, 3, 7 ──────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 6, 7 ─────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
│ Rahul's app                                              │            │ Payment Service                                          │            │ Razorpay  (payment gateway, outside)                     │            │ Payment Service  (webhook handler, same service)         │            │ Payment DB  (same database, drawn again)                 │            │ Debezium  (Change Data Capture)                          │            │ Kafka  (event pipe)                                      │            │ Booking Service  (booking-confirmer)                     │            │ Booking DB  (PostgreSQL)                                 │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Taps 'Pay £190'                                  │ ─────────> │ STEP 2: Saves the payment before calling out             │ ────┬────> │ STEP 3: Takes the money from Rahul's bank                │ ─────────> │ STEP 4: Checks the signature                             │ ─────────> │ STEP 4: Drops repeats, stores PAID and the news          │ ─────────> │ STEP 5: Copies the outbox row into Kafka                 │ ─────────> │ STEP 5: Keeps payment.paid until it is read              │ ─────────> │ STEP 6: Confirms bk-555 in one transaction               │ ─────────> │ STEP 6: Seats booked, tickets made, news saved           │
│   - POST /v1/bookings/bk-555/payments + Idempotency-Key  │            │   - INSERT payments, status CREATED                      │     │      │   - the bank asks Rahul for the OTP                      │            │   - HMAC SHA-256 with the secret we share with Razorpay  │            │   - webhook_events key, payments update, outbox insert   │            │   - reads the Payment DB change log (WAL)                │            │   - if Booking is down, the message just waits           │            │   - lock seats, still HELD by bk-555? then BOOKED +      │            │   - tickets UNIQUE (show, seat) = the last wall          │
│   - e.g. idem-pay-3b2: a double tap pays once            │            │   - e.g. pay-901 CREATED                                 │     │      │   - e.g. payment pay_RZP_88                              │            │   - e.g. a fake 'payment captured' is refused            │            │   - e.g. evt_RZP_301; pay-901 PAID; ob-p-77              │            │   - e.g. ob-p-77 -> payment.events, key pay-901          │            │   - e.g. group booking-confirmer, key pay-901            │            │     tickets + outbox                                     │            │   - e.g. F12, F13 BOOKED; t-1, t-2; ob-9001              │
│                                                          │            │                                                          │     │      │                                                          │            │                                                          │            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            │   - e.g. a repeated message finds CONFIRMED: no change   │            └──────────────────────────────────────────────────────────┘
│ STEP 3: Pays on Razorpay's own screen                    │            │ STEP 2: Creates a Razorpay order                         │     │      │ STEP 4: Calls us back with a webhook                     │            │ STEP 4: Saves PAID + outbox in one transaction           │                                                                                                                                                                                                                                    │                                                          │
│   - card and bank code never touch our servers           │            │   - Razorpay Orders API: amount, currency, receipt       │     │      │   - signed, sent again until we answer 200               │            │   - event id, PAID, outbox row; then 200 to Razorpay     │                                                                                                                                                                                                                                    │ STEP 7: Answers the app's status check                   │
│   - e.g. order_RZP_44                                    │            │   - e.g. 19000 GBP for bk-555 -> order_RZP_44            │     │      │   - e.g. payment.captured, evt_RZP_301                   │            │   - e.g. never calls Booking directly                    │                                                                                                                                                                                                                                    │   - status + tickets                                     │
│                                                          │            └──────────────────────────────────────────────────────────┘     │      └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘                                                                                                                                                                                                                                    │   - e.g. bk-555 CONFIRMED, t-1, t-2                      │
│ STEP 7: Sees CONFIRMED + tickets                         │                                                                             │                                                                                                                                                                                                                                                                                                                                                                              └──────────────────────────────────────────────────────────┘
│   - asks GET /v1/bookings/bk-555 every 2 seconds         │                                                                             │
│   - e.g. t-1 F12, t-2 F13 with QR codes                  │                                                                             │
└──────────────────────────────────────────────────────────┘                                                                             │
                                                                                                                                         │
                                                                                                                                         │
                                                                                                                                         │
                                                                                                                                         │      ┌── STEP 2 ────────────────────────────────────────────────┐
                                                                                                                                         │      │ Payment DB  (PostgreSQL)                                 │
                                                                                                                                         │      ├──────────────────────────────────────────────────────────┤
                                                                                                                                         └────> │ STEP 2: Knows the payment from the start                 │
                                                                                                                                                │   - the row exists before Razorpay does                  │
                                                                                                                                                │   - e.g. pay-901 CREATED, order_RZP_44                   │
                                                                                                                                                └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Razorpay                                     ▼ Payment DB                                                                                                                                                                                                        ▼ Kafka                                ▼ Booking DB
╔═════════════════════════════════════════╗    ╔════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════╗    ╔════════════════════════════════════════╗    ╔═════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔════════════════════════════════════════╗
║ Razorpay webhook (signed)               ║    ║ payments (Payment DB) · UNIQUE idempotency_key ║    ║ payments (Payment DB) · UNIQUE idempotency_key ║    ║ webhook_events (Payment DB) · key gateway_event_id ║    ║ outbox (Payment DB)                    ║    ║ Kafka message                   ║    ║ show_seats (Booking DB) · key show_id + seat_id ║    ║ bookings (Booking DB) · UNIQUE user_id + idempotency_key ║    ║ tickets (Booking DB) · UNIQUE show_id + seat_id ║    ║ outbox (Booking DB)                    ║
╟─────────────────────────────────────────╢    ╟────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────╢    ╟────────────────────────────────────────╢    ╟─────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟────────────────────────────────────────╢
║ {                                       ║    ║ {                                              ║    ║ {                                              ║    ║ {                                                  ║    ║ {                                      ║    ║ {                               ║    ║ {                                               ║    ║ {                                                        ║    ║ [                                               ║    ║ {                                      ║
║   "headers": {                          ║    ║   "payment_id": "pay-901",                     ║    ║   "payment_id": "pay-901",                     ║    ║   "gateway_event_id": "evt_RZP_301",               ║    ║   "id": "ob-p-77",                     ║    ║   "topic": "payment.events",    ║    ║   "show_id": "sh-101",                          ║    ║   "booking_id": "bk-555",                                ║    ║   {                                             ║    ║   "id": "ob-9001",                     ║
║     "X-Razorpay-Signature": "9f1c...e2" ║    ║   "booking_id": "bk-555",                      ║    ║   "booking_id": "bk-555",                      ║    ║   "type": "payment.captured",                      ║    ║   "aggregatetype": "payment",          ║    ║   "key": "pay-901",             ║    ║   "seat_id": "F12",                             ║    ║   "user_id": "u-42 (Rahul)",                             ║    ║     "ticket_id": "t-1",                         ║    ║   "aggregatetype": "booking",          ║
║   },                                    ║    ║   "gateway_order_id": "order_RZP_44",          ║    ║   "gateway_order_id": "order_RZP_44",          ║    ║   "received_at": "2026-03-01T10:02:30Z"            ║    ║   "aggregateid": "pay-901",            ║    ║   "headers": {                  ║    ║   "status": "BOOKED",                           ║    ║   "show_id": "sh-101",                                   ║    ║     "booking_id": "bk-555",                     ║    ║   "aggregateid": "bk-555",             ║
║   "event_id": "evt_RZP_301",            ║    ║   "gateway_payment_id": null,                  ║    ║   "gateway_payment_id": "pay_RZP_88",          ║    ║ }                                                  ║    ║   "type": "payment.paid",              ║    ║     "id": "ob-p-77",            ║    ║   "booking_id": "bk-555",                       ║    ║   "seat_ids": ["F12", "F13"],                            ║    ║     "show_id": "sh-101",                        ║    ║   "type": "booking.confirmed",         ║
║   "event": "payment.captured",          ║    ║   "amount_minor": 19000,                       ║    ║   "amount_minor": 19000,                       ║    ╚════════════════════════════════════════════════════╝    ║   "payload": {                         ║    ║     "eventType": "payment.paid" ║    ║   "hold_expires_at": null,                      ║    ║   "status": "CONFIRMED",                                 ║    ║     "seat_id": "F12",                           ║    ║   "payload": {                         ║
║   "payload": {                          ║    ║   "currency": "GBP",                           ║    ║   "currency": "GBP",                           ║                                                              ║     "booking_id": "bk-555",            ║    ║   },                            ║    ║   "price_minor": 9500,                          ║    ║   "amount_minor": 19000,                                 ║    ║     "qr_code": "QR.sig.9f2"                     ║    ║     "user_id": "u-42",                 ║
║     "order_id": "order_RZP_44",         ║    ║   "status": "CREATED",                         ║    ║   "status": "PAID",                            ║                                                              ║     "amount_minor": 19000,             ║    ║   "value": {                    ║    ║   "version": 2                                  ║    ║   "currency": "GBP",                                     ║    ║   },                                            ║    ║     "show_id": "sh-101",               ║
║     "payment_id": "pay_RZP_88",         ║    ║   "idempotency_key": "idem-pay-3b2",           ║    ║   "idempotency_key": "idem-pay-3b2",           ║                                                              ║     "currency": "GBP"                  ║    ║     "booking_id": "bk-555",     ║    ║ }                                               ║    ║   "idempotency_key": "idem-7f3a",                        ║    ║   {                                             ║    ║     "seats": ["F12", "F13"]            ║
║     "amount": 19000,                    ║    ║   "created_at": "2026-03-01T10:01:00Z"         ║    ║   "created_at": "2026-03-01T10:01:00Z"         ║                                                              ║   },                                   ║    ║     "amount_minor": 19000,      ║    ╚═════════════════════════════════════════════════╝    ║   "user_time_zone": "Asia/Kolkata",                      ║    ║     "ticket_id": "t-2",                         ║    ║   },                                   ║
║     "currency": "GBP"                   ║    ║ }                                              ║    ║ }                                              ║                                                              ║   "created_at": "2026-03-01T10:02:30Z" ║    ║     "currency": "GBP"           ║                                                           ║   "created_at": "2026-03-01T10:00:00Z",                  ║    ║     "booking_id": "bk-555",                     ║    ║   "created_at": "2026-03-01T10:02:31Z" ║
║   }                                     ║    ╚════════════════════════════════════════════════╝    ╚════════════════════════════════════════════════╝                                                              ║ }                                      ║    ║   }                             ║                                                           ║   "expires_at": "2026-03-01T10:05:00Z"                   ║    ║     "show_id": "sh-101",                        ║    ║ }                                      ║
║ }                                       ║                                                                                                                                                                          ╚════════════════════════════════════════╝    ║ }                               ║                                                           ║ }                                                        ║    ║     "seat_id": "F13",                           ║    ╚════════════════════════════════════════╝
╚═════════════════════════════════════════╝                                                                                                                                                                                                                        ╚═════════════════════════════════╝                                                           ╚══════════════════════════════════════════════════════════╝    ║     "qr_code": "QR.sig.c71"                     ║
                                                                                                                                                                                                                                                                                                                                                                                                                                 ║   }                                             ║
                                                                                                                                                                                                                                                                                                                                                                                                                                 ║ ]                                               ║
                                                                                                                                                                                                                                                                                                                                                                                                                                 ╚═════════════════════════════════════════════════╝
```

1. **Rahul taps "Pay £190"**
   - **a) The request:** `POST /v1/bookings/bk-555/payments` + `Idempotency-Key: idem-pay-3b2`
   - **Data change:** none yet
   - **Why a key:** a double tap must create one payment, not two.

2. **The Payment Service saves the payment, then asks Razorpay for an order**
   - **a) Check** with the Booking Service that bk-555 is still PENDING
   - **b) Save first:** `payments` row with status CREATED
   - **c) Then call** Razorpay's Orders API `{amount: 19000, currency: GBP, receipt: bk-555}` → `order_RZP_44`
   - **Data change:** `payments` row added `{payment_id: pay-901, booking_id: bk-555, gateway_order_id: order_RZP_44, amount_minor: 19000, status: CREATED, idempotency_key: idem-pay-3b2}`
   - **Why save before calling:** if we called first and crashed, a real Razorpay order would exist that we know nothing about. A CREATED row lets the Reconciliation Job (Flow 5) always find it.

3. **Rahul pays on Razorpay's own screen**
   - **a) The app** opens Razorpay checkout with `order_RZP_44`
   - **b) Rahul** enters his card; his bank asks for the OTP (One-Time Password)
   - **Data change:** none on our side; Razorpay records `pay_RZP_88`
   - **Why their screen:** card numbers never touch our servers, so a break-in at our company cannot leak them (and we avoid the strict PCI DSS card rules).

4. **Razorpay calls us back (webhook); we save PAID + outbox in one transaction**
   - **a) The webhook:** `POST /v1/webhooks/razorpay` with `{event_id: evt_RZP_301, event: payment.captured, order_id: order_RZP_44, amount: 19000}` and header `X-Razorpay-Signature`
   - **b) Check the signature**
     - we and Razorpay share a secret; Razorpay mixes body + secret into a code (HMAC SHA-256)
     - we do the same; a match means the message is real and unchanged
   - **c) One transaction**
     - insert `evt_RZP_301` into `webhook_events` (a repeat fails here → answer 200 and stop)
     - check amount and currency match
     - `UPDATE payments SET status = 'PAID' ... WHERE payment_id = 'pay-901' AND status = 'CREATED'`
     - insert outbox row `payment.paid`
   - **d) Answer** Razorpay `200 OK`; do **not** call Booking directly
   - **Data change:**
     - `webhook_events` row added `{gateway_event_id: evt_RZP_301}`
     - `payments` pay-901 → `{status: PAID, gateway_payment_id: pay_RZP_88}`
     - `outbox` row added `{id: ob-p-77, aggregateid: pay-901, type: payment.paid, payload: {booking_id: bk-555}}`
   - **Why a webhook, not the phone:** the phone could lie or lose signal. The webhook comes from Razorpay, signed.
   - **Why `webhook_events`:** Razorpay resends until we answer 200. Remembering the event id makes "at least once" become "handled once".
   - **Why an outbox, not a call to Booking:** "save PAID, then call Booking" is a dual write. A crash in between = money taken, no tickets, and Razorpay won't retry.

5. **Debezium carries the note to Kafka**
   - **a) How:** reads the Payment DB change log, sees the outbox row, publishes it (like Flow 1)
   - **Data change:** Kafka topic `payment.events`, key `pay-901`, header `eventType: payment.paid`, value `{booking_id: bk-555, amount_minor: 19000}`
   - **Why Kafka in the middle:** if Booking is down for a minute, the message just waits. It usually arrives in under a second, so Rahul doesn't notice.

6. **Booking confirms bk-555: seats BOOKED, tickets made, news written**
   - **a) Consumer group** `booking-confirmer` reads the message
   - **b) One transaction**

            BEGIN;
            SELECT ... FROM show_seats WHERE show_id = 'sh-101' AND seat_id IN ('F12', 'F13')
             ORDER BY seat_id FOR UPDATE;            -- both must still be HELD by bk-555
            UPDATE show_seats SET status = 'BOOKED', hold_expires_at = NULL WHERE ...;
            UPDATE bookings SET status = 'CONFIRMED' WHERE booking_id = 'bk-555' AND status = 'PENDING';
            INSERT INTO tickets ... ('t-1', 'bk-555', 'sh-101', 'F12', ...), ('t-2', 'bk-555', 'sh-101', 'F13', ...);
            INSERT INTO outbox ... ('ob-9001', 'booking', 'bk-555', 'booking.confirmed', ...);
            COMMIT;

   - **c) After the commit**
     - save the Kafka position (offset); a crash before this means the message is read again
     - delete the two Redis hold keys (if that fails, they expire alone)
   - **Data change:**
     - `show_seats` F12, F13 → BOOKED; `bookings` bk-555 → CONFIRMED
     - `tickets` t-1 (F12), t-2 (F13) added
     - `outbox` ob-9001 `booking.confirmed` added (becomes Kafka `booking.events`, key bk-555, starts Flow 6)
   - **Why "still HELD by bk-555", not "before 10:05":** money at 10:05:10, seats not given away yet → confirming is fairer than refunding.
   - **Why reading twice is safe:** `status = 'PENDING'` and the unique (show, seat) rule on tickets make a second confirm do nothing. The unique rule is also the last wall against any future bug.
   - **How Payment closes it:** its `payment-closer` group reads `booking.confirmed` and sets pay-901 PAID → COMPLETED, so PAID only means "money taken, seats not settled yet".

7. **Rahul's app sees CONFIRMED**
   - **a) The app** calls `GET /v1/bookings/bk-555` every 2 seconds
   - **b) About a second later:** `{status: CONFIRMED, tickets: [t-1 F12, t-2 F13]}` and the QR codes
   - **Data change:** none
   - **Why ask:** the webhook goes to our server, not to the phone. Polling for a minute is simpler than a WebSocket and good enough.

**Say in the interview:** "Payments are written CREATED before calling the gateway. The signed webhook is deduplicated by event id and, in one transaction, moves the payment to PAID and writes a payment.paid outbox row, so there is no dual write. Debezium publishes it; the Booking consumer re-locks the seats, checks they're still held by this booking, marks them BOOKED, issues tickets under a unique (show, seat) constraint and writes an outbox event, all in one transaction."

### Flow 5. The hold runs out, or the money arrives too late (Hold Sweeper → seat sold again → late webhook → outbox → LOCK_EXPIRED outbox → refund; Reconciliation Job)

```text
┌── STEP 3 ────────────────────────────────────────────────┐            ┌── STEP 3 ────────────────────────────────────────────────┐            ┌── STEP 3, 6 ─────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 1, 2, 4 ──────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
│ Razorpay  (payment gateway, outside)                     │            │ Payment Service                                          │            │ Payment DB  (PostgreSQL)                                 │            │ Debezium  (Change Data Capture)                          │            │ Kafka  (event pipe)                                      │            │ Booking Service  (booking-confirmer)                     │            │ Booking DB  (PostgreSQL)                                 │            │ Debezium  (Change Data Capture)                          │            │ Kafka  (event pipe)                                      │            │ Payment Service  (refunder)                              │            │ Razorpay  (refund API)                                   │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 3: Sends a late webhook                             │ ─────────> │ STEP 3: Saves PAID + outbox in one transaction           │ ────┬────> │ STEP 3, 6: Stores PAID and the news                      │ ─────────> │ STEP 4: Copies payment.paid into Kafka                   │ ─────────> │ STEP 4: Delivers it to booking-confirmer                 │ ─────────> │ STEP 4: Tries to confirm bk-556, and can't               │ ────┬────> │ STEP 1: Hold freed                                       │ ─────────> │ STEP 5: Copies confirm_failed into Kafka                 │ ─────────> │ STEP 5: Delivers it to the refunder group                │ ─────────> │ STEP 5: Saves REFUND_PENDING first                       │ ────┬────> │ STEP 5: Refunds Anita exactly once                       │
│   - Anita's bank took 7 minutes                          │            │   - same as Flow 4 step 4                                │     │      │   - payments update + outbox row                         │            │   - reads the Payment DB change log                      │            │   - topic payment.events                                 │            │   - locks G7: it belongs to bk-560 now                   │     │      │   - booking + seat updated in one transaction            │            │   - reads the Booking DB change log                      │            │   - other readers skip this event type                   │            │   - a to-do note that survives a crash                   │     │      │   - same key twice = one refund                          │
│   - e.g. payment.captured for bk-556 at 10:08            │            │   - e.g. pay-902 PAID, ob-p-78                           │     │      │   - e.g. pay-902 PAID; ob-p-78 payment.paid              │            │   - e.g. ob-p-78 -> payment.events                       │            │   - e.g. key pay-902                                     │            │   - e.g. writes booking.confirm_failed, LOCK_EXPIRED     │     │      │   - e.g. bk-556 EXPIRED; G7 AVAILABLE                    │            │   - e.g. ob-9002 -> booking.events                       │            │   - e.g. key bk-556                                      │            │   - e.g. pay-902 PAID -> REFUND_PENDING                  │     │      │   - e.g. pay_RZP_93, 9500 pence                          │
└──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘     │      └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘     │      │                                                          │            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            │                                                          │     │      └──────────────────────────────────────────────────────────┘
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │      │ STEP 2: G7 sold to another fan                           │                                                                                                                                                            │ STEP 5: Asks Razorpay to refund                          │     │
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │      │   - normal Flows 3 + 4                                   │                                                                                                                                                            │   - idempotency key: asking twice refunds once           │     │
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │      │   - e.g. G7 BOOKED by bk-560 at 10:07                    │                                                                                                                                                            │   - e.g. refund-pay-902, £95                             │     │
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │      │                                                          │                                                                                                                                                            │                                                          │     │
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │      │ STEP 4: Stores the 'too late' news                       │                                                                                                                                                            │ STEP 5: Saves REFUNDED + outbox                          │     │
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │      │   - outbox row, nothing else changes                     │                                                                                                                                                            │   - payment.refunded -> Anita gets an email              │     │
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │      │   - e.g. ob-9002 booking.confirm_failed                  │                                                                                                                                                            │   - e.g. ob-p-79                                         │     │
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │      └──────────────────────────────────────────────────────────┘                                                                                                                                                            └──────────────────────────────────────────────────────────┘     │
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │                                                                                                                                                                                                                                                                                               │
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │                                                                                                                                                                                                                                                                                               │
                                                                                                                                         │                                                                                                                                                                                                                                                                                               │                                                                                                                                                                                                                                                                                               │
                                                                        ┌── STEP 6 ────────────────────────────────────────────────┐     │                                                                                                                                                                                                                              ┌── STEP 1 ────────────────────────────────────────────────┐     │                                                                                                                                                                                                                                                                                               │      ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                        │ Reconciliation Job  (inside Payment Service)             │     │                                                                                                                                                                                                                              │ Hold Sweeper  (inside Booking Service)                   │     │                                                                                                                                                                                                                                                                                               │      │ Payment DB  (same database, drawn again)                 │
                                                                        ├──────────────────────────────────────────────────────────┤     │                                                                                                                                                                                                                              ├──────────────────────────────────────────────────────────┤     │                                                                                                                                                                                                                                                                                               │      ├──────────────────────────────────────────────────────────┤
                                                                        │ STEP 6: Finds stuck payments every 10 minutes            │ ────┘                                                                                                                                                                                                                              │ STEP 1: Frees holds past their end time                  │ ────┘                                                                                                                                                                                                                                                                                               └────> │ STEP 5: Records the refund                               │
                                                                        │   - CREATED, PAID or REFUND_PENDING for over 10 minutes  │                                                                                                                                                                                                                                    │   - every 30 s: PENDING and expires_at < now(), SKIP     │                                                                                                                                                                                                                                                                                                            │   - status update + outbox row in one commit             │
                                                                        │   - e.g. asks Razorpay or Booking, then finishes the job │                                                                                                                                                                                                                                    │     LOCKED                                               │                                                                                                                                                                                                                                                                                                            │   - e.g. pay-902 REFUNDED; ob-p-79                       │
                                                                        └──────────────────────────────────────────────────────────┘                                                                                                                                                                                                                                    │   - e.g. bk-556 EXPIRED, G7 AVAILABLE at ≈10:06:30       │                                                                                                                                                                                                                                                                                                            └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Payment DB                                                                                        ▼ Kafka                                ▼ Booking DB                                                                                                                                                         ▼ Kafka                                          ▼ Razorpay                                    ▼ Payment DB
╔════════════════════════════════════════════════╗    ╔════════════════════════════════════════╗    ╔═════════════════════════════════╗    ╔══════════════════════════════════════════════════════════╗    ╔═════════════════════════════════════════════════╗    ╔════════════════════════════════════════╗    ╔═══════════════════════════════════════════╗    ╔════════════════════════════════════════╗    ╔════════════════════════════════════════════════╗    ╔════════════════════════════════════════╗
║ payments (Payment DB) · UNIQUE idempotency_key ║    ║ outbox (Payment DB)                    ║    ║ Kafka message                   ║    ║ bookings (Booking DB) · UNIQUE user_id + idempotency_key ║    ║ show_seats (Booking DB) · key show_id + seat_id ║    ║ outbox (Booking DB)                    ║    ║ Kafka message                             ║    ║ refund request                         ║    ║ payments (Payment DB) · UNIQUE idempotency_key ║    ║ outbox (Payment DB)                    ║
╟────────────────────────────────────────────────╢    ╟────────────────────────────────────────╢    ╟─────────────────────────────────╢    ╟──────────────────────────────────────────────────────────╢    ╟─────────────────────────────────────────────────╢    ╟────────────────────────────────────────╢    ╟───────────────────────────────────────────╢    ╟────────────────────────────────────────╢    ╟────────────────────────────────────────────────╢    ╟────────────────────────────────────────╢
║ {                                              ║    ║ {                                      ║    ║ {                               ║    ║ {                                                        ║    ║ {                                               ║    ║ {                                      ║    ║ {                                         ║    ║ {                                      ║    ║ {                                              ║    ║ {                                      ║
║   "payment_id": "pay-902",                     ║    ║   "id": "ob-p-78",                     ║    ║   "topic": "payment.events",    ║    ║   "booking_id": "bk-556",                                ║    ║   "show_id": "sh-101",                          ║    ║   "id": "ob-9002",                     ║    ║   "topic": "booking.events",              ║    ║   "payment_id": "pay_RZP_93",          ║    ║   "payment_id": "pay-902",                     ║    ║   "id": "ob-p-79",                     ║
║   "booking_id": "bk-556",                      ║    ║   "aggregatetype": "payment",          ║    ║   "key": "pay-902",             ║    ║   "user_id": "u-77 (Anita)",                             ║    ║   "seat_id": "G7",                              ║    ║   "aggregatetype": "booking",          ║    ║   "key": "bk-556",                        ║    ║   "amount": 9500,                      ║    ║   "booking_id": "bk-556",                      ║    ║   "aggregatetype": "payment",          ║
║   "gateway_order_id": "order_RZP_45",          ║    ║   "aggregateid": "pay-902",            ║    ║   "headers": {                  ║    ║   "show_id": "sh-101",                                   ║    ║   "status": "BOOKED",                           ║    ║   "aggregateid": "bk-556",             ║    ║   "headers": {                            ║    ║   "idempotency_key": "refund-pay-902", ║    ║   "gateway_order_id": "order_RZP_45",          ║    ║   "aggregateid": "pay-902",            ║
║   "gateway_payment_id": "pay_RZP_93",          ║    ║   "type": "payment.paid",              ║    ║     "id": "ob-p-78",            ║    ║   "seat_ids": ["G7"],                                    ║    ║   "booking_id": "bk-560",                       ║    ║   "type": "booking.confirm_failed",    ║    ║     "id": "ob-9002",                      ║    ║   "status": "processed"                ║    ║   "gateway_payment_id": "pay_RZP_93",          ║    ║   "type": "payment.refunded",          ║
║   "amount_minor": 9500,                        ║    ║   "payload": {                         ║    ║     "eventType": "payment.paid" ║    ║   "status": "EXPIRED",                                   ║    ║   "hold_expires_at": null,                      ║    ║   "payload": {                         ║    ║     "eventType": "booking.confirm_failed" ║    ║ }                                      ║    ║   "amount_minor": 9500,                        ║    ║   "payload": {                         ║
║   "currency": "GBP",                           ║    ║     "booking_id": "bk-556",            ║    ║   },                            ║    ║   "amount_minor": 9500,                                  ║    ║   "price_minor": 9500,                          ║    ║     "payment_id": "pay-902",           ║    ║   },                                      ║    ╚════════════════════════════════════════╝    ║   "currency": "GBP",                           ║    ║     "booking_id": "bk-556",            ║
║   "status": "PAID",                            ║    ║     "amount_minor": 9500,              ║    ║   "value": {                    ║    ║   "currency": "GBP",                                     ║    ║   "version": 4                                  ║    ║     "reason": "LOCK_EXPIRED"           ║    ║   "value": {                              ║                                                  ║   "status": "REFUNDED",                        ║    ║     "user_id": "u-77",                 ║
║   "idempotency_key": "idem-pay-a77",           ║    ║     "currency": "GBP"                  ║    ║     "booking_id": "bk-556",     ║    ║   "idempotency_key": "idem-a91c",                        ║    ║ }                                               ║    ║   },                                   ║    ║     "payment_id": "pay-902",              ║                                                  ║   "idempotency_key": "idem-pay-a77",           ║    ║     "amount_minor": 9500               ║
║   "created_at": "2026-03-01T10:01:30Z"         ║    ║   },                                   ║    ║     "amount_minor": 9500,       ║    ║   "user_time_zone": "Europe/London",                     ║    ╚═════════════════════════════════════════════════╝    ║   "created_at": "2026-03-01T10:08:01Z" ║    ║     "reason": "LOCK_EXPIRED"              ║                                                  ║   "created_at": "2026-03-01T10:01:30Z"         ║    ║   },                                   ║
║ }                                              ║    ║   "created_at": "2026-03-01T10:08:00Z" ║    ║     "currency": "GBP"           ║    ║   "created_at": "2026-03-01T10:01:00Z",                  ║                                                           ║ }                                      ║    ║   }                                       ║                                                  ║ }                                              ║    ║   "created_at": "2026-03-01T10:08:05Z" ║
╚════════════════════════════════════════════════╝    ║ }                                      ║    ║   }                             ║    ║   "expires_at": "2026-03-01T10:06:00Z"                   ║                                                           ╚════════════════════════════════════════╝    ║ }                                         ║                                                  ╚════════════════════════════════════════════════╝    ║ }                                      ║
                                                      ╚════════════════════════════════════════╝    ║ }                               ║    ║ }                                                        ║                                                                                                         ╚═══════════════════════════════════════════╝                                                                                                        ╚════════════════════════════════════════╝
                                                                                                    ╚═════════════════════════════════╝    ╚══════════════════════════════════════════════════════════╝
```

1. **The Hold Sweeper frees G7**
   - **a) Every 30 seconds** (a loop inside the Booking Service)

            SELECT booking_id FROM bookings
             WHERE status = 'PENDING' AND expires_at < now()
             LIMIT 1000 FOR UPDATE SKIP LOCKED;
            UPDATE show_seats SET status = 'AVAILABLE', booking_id = NULL, hold_expires_at = NULL
             WHERE booking_id = 'bk-556' AND status = 'HELD';
            UPDATE bookings SET status = 'EXPIRED' WHERE booking_id = 'bk-556';

   - **b) Redis** `hold:sh-101:G7` already deleted itself at 10:06
   - **Data change:** at ≈10:06:30, `bookings` bk-556 → EXPIRED; `show_seats` G7 → `{status: AVAILABLE, booking_id: null}`
   - **Why a sweeper:** tidying, not safety. Flow 3 already treats an expired hold as free. The sweeper turns the seat green on the map and gives bk-556 a clear final status.

2. **G7 is sold to another fan**
   - **a) At 10:07** a fan in Manchester holds and pays for G7 (Flows 3 + 4) as bk-560
   - **Data change:** `show_seats` G7 → `{status: BOOKED, booking_id: bk-560}`; a ticket for G7 goes to bk-560
   - **Why this is correct:** a hold is a promise for a fixed time, like a restaurant table kept "until 8:15".
   - **Why not a 15-minute hold:** every held seat is one nobody else can buy. Long holds make a show look sold out while half the seats are only held.

3. **Anita's money arrives late**
   - **a) At 10:08** Razorpay sends `payment.captured` for `order_RZP_45`
   - **b) Same as Flow 4 step 4:** check signature; one transaction records the event id, marks PAID, writes a `payment.paid` outbox row
   - **Data change:** `payments` pay-902 → `{status: PAID, gateway_payment_id: pay_RZP_93}`; `webhook_events` row added; `outbox` ob-p-78 `payment.paid {booking_id: bk-556, amount_minor: 9500}`
   - **Why mark PAID although the seat is gone:** the money really left Anita's bank. Our records must match the real world.

4. **The Booking Service says "too late", as a note**
   - **a) Debezium** puts `payment.paid` for pay-902 on `payment.events`
   - **b) `booking-confirmer`** locks G7, sees `booking_id = bk-560`, not bk-556 → cannot confirm
   - **c) One transaction** writes outbox row `booking.confirm_failed` with reason `LOCK_EXPIRED`; nothing else changes
   - **Data change:** `outbox` row added `{id: ob-9002, aggregateid: bk-556, type: booking.confirm_failed, payload: {payment_id: pay-902, reason: LOCK_EXPIRED}}`
   - **Why a note, not a reply:** nobody waits on a line; the "no" must travel as safely as a "yes" would, through outbox → Kafka.
   - **Why not give her another seat:** she chose G7 for a reason. A refund plus "please book again" is clearer.

5. **The Payment Service refunds Anita automatically**
   - **a) Debezium** puts the note on `booking.events`; the `refunder` group reads it (other readers skip this event type)
   - **b) Save the to-do first:** `UPDATE payments SET status = 'REFUND_PENDING' WHERE payment_id = 'pay-902' AND status = 'PAID'`
   - **c) Call Razorpay** Refunds API `{payment_id: pay_RZP_93, amount: 9500, idempotency_key: refund-pay-902}`
   - **d) On success:** one transaction marks REFUNDED and writes a `payment.refunded` outbox row → the Notification Service emails Anita
   - **Data change:** `payments` pay-902 → REFUND_PENDING → REFUNDED; `outbox` ob-p-79 `payment.refunded {booking_id: bk-556, amount_minor: 9500}`
   - **Why REFUND_PENDING first:** Razorpay is outside our transaction. If we crash after it, the Reconciliation Job finishes the job.
   - **Why the refund key:** asking twice refunds once. Without it Anita could get £190 back for a £95 seat.

6. **The Reconciliation Job catches anything stuck**
   - **a) Every 10 minutes** it looks for payments stuck over 10 minutes
     - `CREATED` → asks Razorpay `GET /orders/{order_id}/payments`; paid → do step 3; expired unpaid → `FAILED`
     - `PAID` → asks Booking: CONFIRMED → `COMPLETED`; still PENDING → new `payment.paid` outbox row; EXPIRED → refund (step 5)
     - `REFUND_PENDING` → calls the refund again with the same key
   - **Data change:** only on the payments it fixes, e.g. `CREATED` → `FAILED`
   - **Why:** webhooks are "probably delivered", not "certainly". The outbox guards everything inside our system; this job is the night watchman for the edges.

**Say in the interview:** "Holds expire by time: the hold check treats an expired hold as free, and a sweeper with SKIP LOCKED tidies them up. If a payment lands after the seat was resold, the booking consumer writes a confirm_failed outbox event and the payment service issues an idempotent refund. A reconciliation job checks payments stuck in CREATED, PAID or REFUND_PENDING, because webhooks can be lost."

### Flow 6. Reminders: "Your show is tomorrow" arrives once, at the right moment (Kafka → Reminder Planner → Reminder DB → Scheduler with SKIP LOCKED → SQS → Notification Service → push)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 2, 4 ─────────────────────────────────────────────┐            ┌── STEP 3, 4 ─────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
│ Kafka  (event pipe)                                      │            │ Reminder Planner                                         │            │ Reminder DB  (PostgreSQL)                                │            │ Reminder Scheduler  (3 copies)                           │            │ Notification Queue  (SQS)                                │            │ Notification Service                                     │            │ Rahul's phone  (Firebase push)                           │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Delivers booking.confirmed                       │ ─────────> │ STEP 2: Works out two fire times                         │ ─────────> │ STEP 2: Holds every reminder as a row                    │ ─────────> │ STEP 3: Claims due reminders every 5 seconds             │ ─────────> │ STEP 4: Holds the message until it is sent               │ ─────────> │ STEP 5: Writes the text in two zones                     │ ─────────> │ STEP 6: Shows 'Coldplay is tomorrow'                     │
│   - topic booking.events, group reminder-planner         │            │   - '24 h before' = UTC maths                            │            │   - index (status, fire_at_utc) finds due rows fast      │            │   - FOR UPDATE SKIP LOCKED LIMIT 500                     │            │   - a crashed worker's message comes back (visibility    │            │   - London time first, Rahul's time in brackets          │            │   - a push notification                                  │
│   - e.g. key bk-555 (from Flow 4's outbox)               │            │   - '09:00 show day' = London zone maths                 │            │   - e.g. r-1, r-2 PENDING                                │            │   - e.g. each copy gets different rows                   │            │     timeout)                                             │            │   - e.g. 19:30 London (00:00 Mon in Pune)                │            │   - e.g. 19:30 London time (00:00 Mon in Pune)           │
└──────────────────────────────────────────────────────────┘            │   - e.g. r-1 28 Mar 18:30Z, r-2 29 Mar 08:00Z            │            │                                                          │            │                                                          │            │   - e.g. message for r-1                                 │            │                                                          │            └──────────────────────────────────────────────────────────┘
                                                                        │                                                          │            │ STEP 4: Marks picked rows                                │            │ STEP 4: Hands each one to the queue                      │            └──────────────────────────────────────────────────────────┘            │ STEP 5: Sends once through Firebase                      │
                                                                        │ STEP 2: Saves them once                                  │            │   - PENDING -> QUEUED, later SENT                        │            │   - one message per reminder, row -> QUEUED              │                                                                                    │   - idempotency key r-1, then marks r-1 SENT             │
                                                                        │   - INSERT ... ON CONFLICT (booking_id, kind) DO NOTHING │            │   - e.g. r-1 is never picked twice                       │            │   - e.g. r-1 at 28 Mar 18:30Z                            │                                                                                    │   - e.g. then deletes the queue message                  │
                                                                        │   - e.g. a repeated event adds nothing                   │            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘                                                                                    └──────────────────────────────────────────────────────────┘
                                                                        └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Kafka                                     ▼ Reminder DB                                             ▼ Notification Queue
╔══════════════════════════════════════╗    ╔════════════════════════════════════════════════════╗    ╔═════════════════════════════════╗
║ Kafka message                        ║    ║ reminders (Reminder DB) · UNIQUE booking_id + kind ║    ║ queue message (SQS)             ║
╟──────────────────────────────────────╢    ╟────────────────────────────────────────────────────╢    ╟─────────────────────────────────╢
║ {                                    ║    ║ [                                                  ║    ║ {                               ║
║   "topic": "booking.events",         ║    ║   {                                                ║    ║   "reminder_id": "r-1",         ║
║   "key": "bk-555",                   ║    ║     "reminder_id": "r-1",                          ║    ║   "booking_id": "bk-555",       ║
║   "headers": {                       ║    ║     "booking_id": "bk-555",                        ║    ║   "user_id": "u-42",            ║
║     "id": "ob-9001",                 ║    ║     "show_id": "sh-101",                           ║    ║   "template": "show_tomorrow",  ║
║     "eventType": "booking.confirmed" ║    ║     "kind": "BEFORE_24H",                          ║    ║   "channels": ["push", "email"] ║
║   },                                 ║    ║     "fire_at_utc": "2026-03-28T18:30:00Z",         ║    ║ }                               ║
║   "value": {                         ║    ║     "status": "PENDING",                           ║    ╚═════════════════════════════════╝
║     "user_id": "u-42",               ║    ║     "show_version": 1                              ║
║     "show_id": "sh-101",             ║    ║   },                                               ║
║     "seats": ["F12", "F13"]          ║    ║   {                                                ║
║   }                                  ║    ║     "reminder_id": "r-2",                          ║
║ }                                    ║    ║     "booking_id": "bk-555",                        ║
╚══════════════════════════════════════╝    ║     "show_id": "sh-101",                           ║
                                            ║     "kind": "SHOW_DAY_9AM",                        ║
                                            ║     "fire_at_utc": "2026-03-29T08:00:00Z",         ║
                                            ║     "status": "PENDING",                           ║
                                            ║     "show_version": 1                              ║
                                            ║   }                                                ║
                                            ║ ]                                                  ║
                                            ╚════════════════════════════════════════════════════╝
```

1. **The planner hears about the new booking**
   - **a) Consumer group** `reminder-planner` reads `booking.confirmed` from `booking.events`, key bk-555 (from Flow 4's outbox)
   - **Data change:** none yet
   - **Why Kafka, not a call from Booking:** Booking doesn't need to know reminders exist. If the Reminder Service is down, messages wait.

2. **The planner works out two fire times and saves them**
   - **a) Input:** `starts_at_utc 2026-03-29T18:30:00Z`, `time_zone Europe/London`
   - **b) r-1 "24 hours before"** = a length of time → UTC maths: `18:30Z - 24 h = 2026-03-28T18:30:00Z`
   - **c) r-2 "09:00 on show day"** = a clock time in a place → zone maths: 09:00 London (summer time) = `2026-03-29T08:00:00Z`
   - **d) Save:** `INSERT INTO reminders ... ON CONFLICT (booking_id, kind) DO NOTHING`
   - **Data change:** `reminders` rows added
     - `{reminder_id: r-1, booking_id: bk-555, kind: BEFORE_24H, fire_at_utc: 2026-03-28T18:30:00Z, status: PENDING, show_version: 1}`
     - `{reminder_id: r-2, kind: SHOW_DAY_9AM, fire_at_utc: 2026-03-29T08:00:00Z, status: PENDING}`
   - **Why two kinds of maths:** "same clock time the day before" would be only 23 hours here (a night hour vanished). "09:00 on the day" must follow London clocks.
   - **Why `ON CONFLICT DO NOTHING`:** a repeated Kafka message adds nothing.
   - **Why a row, not a timer:** a timer in memory dies with a restart; a row survives, can be moved (Flow 7) and checked by support.

3. **The scheduler claims due reminders, sharing the work**
   - **a) Three copies**, each every 5 seconds

            BEGIN;
            SELECT reminder_id, booking_id, kind FROM reminders
             WHERE status = 'PENDING' AND fire_at_utc <= now()
             ORDER BY fire_at_utc LIMIT 500
             FOR UPDATE SKIP LOCKED;
            -- step 4 happens here, then:
            UPDATE reminders SET status = 'QUEUED' WHERE reminder_id IN (...);
            COMMIT;

   - **b) At 28 Mar 18:30 UTC** copy A locks r-1; copies B and C skip it
   - **Data change:** none yet (only a row lock)
   - **Why `SKIP LOCKED`:** "if someone holds this row, take the next one" → the copies split the work, and if one dies the others carry on.
   - **Why index `(status, fire_at_utc)`:** jumps straight to due rows, like opening a diary at today's page.

4. **Each reminder goes to the queue, then the row is marked QUEUED**
   - **a) Send:** SQS `SendMessage {reminder_id: r-1, booking_id: bk-555, user_id: u-42, template: show_tomorrow, channels: [push, email]}`
   - **b) Then** `UPDATE ... QUEUED` and `COMMIT` (step 3)
   - **Data change:** a queue message for r-1; `reminders` r-1 PENDING → QUEUED
   - **Why send first, then commit:** a crash then causes a duplicate (dropped in step 5), never a lost reminder.
   - **Why a queue:** sending is slow and can fail. The queue absorbs bursts and retries. SQS delay is at most 15 minutes, so reminders wait in the database until due.

5. **The Notification Service sends it, once**
   - **a) Checks:** bk-555 still CONFIRMED and r-1 not already SENT
   - **b) Writes the text** with the current show time and Rahul's zone: "Coldplay is tomorrow: 19:30 London time (00:00 Mon in Pune)"
   - **c) Sends** via Firebase Cloud Messaging and email with idempotency key `r-1`
   - **d) Reports** "r-1 sent" to the Reminder Service, then deletes the queue message
   - **Data change:** `reminders` r-1 QUEUED → SENT
   - **Why the checks:** the queue is "at least once"; the SENT check plus the key make the phone buzz once.

6. **Rahul's phone shows the reminder**
   - **a) Push:** "Coldplay is tomorrow: 19:30 London time (00:00 Mon in Pune). Doors open 17:30."
   - **Data change:** none
   - **Why both times:** for Rahul the show is just after midnight on Monday.

**Say in the interview:** "A planner consumes booking events and inserts reminder rows with a UTC fire time, using duration maths for 'N hours before' and zone maths for 'at 9 AM local', unique per booking and kind. Several schedulers poll due rows with FOR UPDATE SKIP LOCKED, enqueue to SQS and mark them QUEUED. Senders are idempotent per reminder id."

### Flow 7. Priya moves the show → search, reminders and ticket holders all follow (If-Match → new UTC + outbox → Kafka → 3 consumer groups)

```text
┌── STEP 1 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 2 ────────────────────────────────────────────────┐            ┌── STEP 3 ────────────────────────────────────────────────┐            ┌── STEP 3, 4, 5, 6 ───────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐            ┌── STEP 4 ────────────────────────────────────────────────┐
│ Priya  (event organiser)                                 │            │ Event Service                                            │            │ Catalog DB  (PostgreSQL)                                 │            │ Debezium  (Change Data Capture)                          │            │ Kafka  (event pipe)                                      │            │ Search Indexer                                           │            │ Elasticsearch  (search index)                            │
├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
│ STEP 1: Moves sh-101 to 20:00 London                     │ ─────────> │ STEP 2: Checks nobody changed it first                   │ ─────────> │ STEP 2: Stores version 2 and the news                    │ ─────────> │ STEP 3: Copies the outbox row into Kafka                 │ ─────────> │ STEP 3: Keeps it after show.created                      │ ────┬────> │ STEP 4: Updates the search copy                          │ ─────────> │ STEP 4: Shows the new time in search                     │
│   - PATCH /v1/shows/sh-101 + If-Match: "1"               │            │   - If-Match version = current version?                  │            │   - shows update + outbox insert                         │            │   - reads the Catalog DB change log                      │            │   - same key sh-101 = same ordered lane                  │     │      │   - only if the version is newer                         │            │   - document sh-101, version 2                           │
│   - e.g. same day, 30 minutes later                      │            │   - e.g. Ravi saved v2 first -> 412, Priya reloads       │            │   - e.g. sh-101 20:00 = 19:00Z, v2; ob-702               │            │   - e.g. ob-702 -> show.events, key sh-101               │            │   - e.g. show.rescheduled, version 2                     │     │      │   - e.g. v2 > v1, so it writes                           │            │   - e.g. starts_at_utc 19:00Z                            │
└──────────────────────────────────────────────────────────┘            │                                                          │            └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘            │                                                          │     │      └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘
                                                                        │ STEP 2: Works out the new UTC                            │                                                                                                                                                            │ STEP 4, 5, 6: Delivers it to three reader groups         │     │
                                                                        │   - London's rules for 29 Mar                            │                                                                                                                                                            │   - search-indexer, reminder-planner, notifier           │     │
                                                                        │   - e.g. 20:00 London = 19:00 UTC                        │                                                                                                                                                            └──────────────────────────────────────────────────────────┘     │
                                                                        │                                                          │                                                                                                                                                                                                                             │
                                                                        │ STEP 2: Saves show + outbox together                     │                                                                                                                                                                                                                             │
                                                                        │   - one transaction, version 2                           │                                                                                                                                                                                                                             │
                                                                        │   - e.g. show.rescheduled                                │                                                                                                                                                                                                                             │
                                                                        └──────────────────────────────────────────────────────────┘                                                                                                                                                                                                                             │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │      ┌── STEP 5 ────────────────────────────────────────────────┐            ┌── STEP 5 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                 │      │ Reminder Planner                                         │            │ Reminder DB  (PostgreSQL)                                │
                                                                                                                                                                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                 ├────> │ STEP 5: Moves the '24 h before' reminder                 │ ─────────> │ STEP 5: Stores the new fire time                         │
                                                                                                                                                                                                                                                                                                                                                                 │      │   - UPDATE PENDING rows of sh-101                        │            │   - fire_at_utc + show_version                           │
                                                                                                                                                                                                                                                                                                                                                                 │      │   - e.g. r-1 -> 28 Mar 19:00Z                            │            │   - e.g. r-1: 28 Mar 19:00Z, version 2                   │
                                                                                                                                                                                                                                                                                                                                                                 │      │                                                          │            └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                 │      │ STEP 5: Leaves the 09:00 reminder alone                  │
                                                                                                                                                                                                                                                                                                                                                                 │      │   - it is tied to the clock, not the start               │
                                                                                                                                                                                                                                                                                                                                                                 │      │   - e.g. r-2 stays 08:00Z                                │
                                                                                                                                                                                                                                                                                                                                                                 │      └──────────────────────────────────────────────────────────┘
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │
                                                                                                                                                                                                                                                                                                                                                                 │      ┌── STEP 6 ────────────────────────────────────────────────┐            ┌── STEP 6 ────────────────────────────────────────────────┐
                                                                                                                                                                                                                                                                                                                                                                 │      │ Notification Service                                     │            │ Rahul's phone                                            │
                                                                                                                                                                                                                                                                                                                                                                 │      ├──────────────────────────────────────────────────────────┤            ├──────────────────────────────────────────────────────────┤
                                                                                                                                                                                                                                                                                                                                                                 └────> │ STEP 6: Tells every ticket holder                        │ ─────────> │ STEP 6: Sees 'New time: 20:00 London'                    │
                                                                                                                                                                                                                                                                                                                                                                        │   - one message per booking, through the queue           │            │   - a push notification                                  │
                                                                                                                                                                                                                                                                                                                                                                        │   - e.g. push + email to Rahul                           │            │   - e.g. that is 00:30 Monday in Pune                    │
                                                                                                                                                                                                                                                                                                                                                                        └──────────────────────────────────────────────────────────┘            └──────────────────────────────────────────────────────────┘
```

**Data in this flow** (scroll sideways)

```text
▼ Catalog DB                                                                                           ▼ Kafka                                             ▼ Elasticsearch                                     ▼ Reminder DB
╔════════════════════════════════════════════╗    ╔═══════════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔══════════════════════════════════════════════╗    ╔════════════════════════════════════════════════════╗
║ shows (Catalog DB) · key show_id           ║    ║ outbox (Catalog DB) · type -> Kafka eventType ║    ║ Kafka message                                ║    ║ Elasticsearch document (index shows)         ║    ║ reminders (Reminder DB) · UNIQUE booking_id + kind ║
╟────────────────────────────────────────────╢    ╟───────────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟──────────────────────────────────────────────╢    ╟────────────────────────────────────────────────────╢
║ {                                          ║    ║ {                                             ║    ║ {                                            ║    ║ {                                            ║    ║ [                                                  ║
║   "show_id": "sh-101",                     ║    ║   "id": "ob-702",                             ║    ║   "topic": "show.events",                    ║    ║   "show_id": "sh-101",                       ║    ║   {                                                ║
║   "event_id": "e-77 (Coldplay)",           ║    ║   "aggregatetype": "show",                    ║    ║   "key": "sh-101",                           ║    ║   "title": "Coldplay: Music of the Spheres", ║    ║     "reminder_id": "r-1",                          ║
║   "venue_id": "v-9",                       ║    ║   "aggregateid": "sh-101",                    ║    ║   "headers": {                               ║    ║   "venue": "Wembley Stadium",                ║    ║     "booking_id": "bk-555",                        ║
║   "local_start": "2026-03-29 20:00",       ║    ║   "type": "show.rescheduled",                 ║    ║     "id": "ob-702",                          ║    ║   "city": "London",                          ║    ║     "show_id": "sh-101",                           ║
║   "time_zone": "Europe/London",            ║    ║   "payload": {                                ║    ║     "eventType": "show.rescheduled"          ║    ║   "time_zone": "Europe/London",              ║    ║     "kind": "BEFORE_24H",                          ║
║   "starts_at_utc": "2026-03-29T19:00:00Z", ║    ║     "starts_at_utc": "2026-03-29T19:00:00Z",  ║    ║   },                                         ║    ║   "local_start": "2026-03-29 20:00",         ║    ║     "fire_at_utc": "2026-03-28T19:00:00Z",         ║
║   "tzdata_version": "2026a",               ║    ║     "local_start": "2026-03-29 20:00",        ║    ║   "value": {                                 ║    ║   "starts_at_utc": "2026-03-29T19:00:00Z",   ║    ║     "status": "PENDING",                           ║
║   "status": "RESCHEDULED",                 ║    ║     "version": 2                              ║    ║     "starts_at_utc": "2026-03-29T19:00:00Z", ║    ║   "min_price_minor": 9500,                   ║    ║     "show_version": 2                              ║
║   "version": 2                             ║    ║   },                                          ║    ║     "local_start": "2026-03-29 20:00",       ║    ║   "status": "RESCHEDULED",                   ║    ║   },                                               ║
║ }                                          ║    ║   "created_at": "2026-03-10T09:00:00Z"        ║    ║     "version": 2                             ║    ║   "version": 2                               ║    ║   {                                                ║
╚════════════════════════════════════════════╝    ║ }                                             ║    ║   }                                          ║    ║ }                                            ║    ║     "reminder_id": "r-2",                          ║
                                                  ╚═══════════════════════════════════════════════╝    ║ }                                            ║    ╚══════════════════════════════════════════════╝    ║     "booking_id": "bk-555",                        ║
                                                                                                       ╚══════════════════════════════════════════════╝                                                        ║     "show_id": "sh-101",                           ║
                                                                                                                                                                                                               ║     "kind": "SHOW_DAY_9AM",                        ║
                                                                                                                                                                                                               ║     "fire_at_utc": "2026-03-29T08:00:00Z",         ║
                                                                                                                                                                                                               ║     "status": "PENDING",                           ║
                                                                                                                                                                                                               ║     "show_version": 2                              ║
                                                                                                                                                                                                               ║   }                                                ║
                                                                                                                                                                                                               ║ ]                                                  ║
                                                                                                                                                                                                               ╚════════════════════════════════════════════════════╝
```

1. **Priya sends the new time and the version she saw**
   - **a) The request:** `PATCH /v1/shows/sh-101 {local_start: "2026-03-29T20:00"}` + `If-Match: "1"`
   - **Data change:** none yet
   - **Why `If-Match`:** if her colleague Ravi saved version 2 meanwhile, Priya's change must not silently wipe his.

2. **The Event Service checks the version, works out UTC, saves show + outbox**
   - **a) Same gap/overlap check** as Flow 1, then 20:00 London (summer time) = 19:00 UTC
   - **b) One transaction**

            UPDATE shows SET local_start = '2026-03-29 20:00', starts_at_utc = '2026-03-29T19:00:00Z',
                             status = 'RESCHEDULED', version = 2
             WHERE show_id = 'sh-101' AND version = 1;     -- 0 rows changed? answer 412
            INSERT INTO outbox ... ('ob-702', 'show', 'sh-101', 'show.rescheduled', ...);

   - **Data change:** `shows` sh-101 → `{local_start: "2026-03-29 20:00", starts_at_utc: 2026-03-29T19:00:00Z, status: RESCHEDULED, version: 2}`; `outbox` ob-702 added
   - **Why `WHERE version = 1`:** optimistic locking: no lock while Priya types; the check happens at save time.

3. **Debezium puts the change into Kafka, behind the old message**
   - **Data change:** Kafka `show.events`, key `sh-101`, header `eventType: show.rescheduled`, value `{starts_at_utc: 2026-03-29T19:00:00Z, version: 2}`
   - **Why the same key:** every reader sees "created (19:30)" before "rescheduled (20:00)".

4. **Search shows the new time**
   - **a) Search Indexer** updates `shows/sh-101` only if version 2 is newer
   - **Data change:** Elasticsearch `shows/sh-101` → `{local_start: "2026-03-29 20:00", starts_at_utc: 2026-03-29T19:00:00Z, version: 2}`
   - **Why the version check:** a re-delivered old `show.created` must not undo the move.

5. **Reminders move by themselves**
   - **a) `reminder-planner`** recomputes PENDING reminders of sh-101

            UPDATE reminders SET fire_at_utc = '2026-03-28T19:00:00Z', show_version = 2
             WHERE show_id = 'sh-101' AND kind = 'BEFORE_24H' AND status = 'PENDING' AND show_version < 2;

   - **b) r-2** (09:00 on show day) is tied to the clock, not the start, so it stays at `2026-03-29T08:00:00Z`
   - **Data change:** `reminders` r-1 → `{fire_at_utc: 2026-03-28T19:00:00Z, show_version: 2}`; r-2 → `{show_version: 2}`
   - **Why `show_version < 2`:** a late or repeated message can't move a reminder back to an old time.

6. **Every ticket holder is told**
   - **a) `notifier` group** pages through CONFIRMED bookings of sh-101 and queues one message per booking (like Flow 6)
   - **b) Rahul's phone:** "New time: Sun 29 Mar, 20:00 London time. That is 00:30 Monday in Pune."
   - **Data change:** one queue message per booking (≈45,000 for a full Wembley)
   - **Why through Kafka:** the Event Service writes one outbox row and doesn't need to know who cares. A new reader is just another consumer group.
   - **When zone rules change, not the show:** a job recomputes `starts_at_utc` for future shows in the affected zone from `local_start` + `time_zone`; any show that changed goes through this same flow.

**Say in the interview:** "Rescheduling uses optimistic concurrency with If-Match on the show version. The new UTC instant is recomputed from local time and zone, and a show.rescheduled event goes through the outbox keyed by show id. Search, the reminder planner and the notifier each react idempotently with version guards. tzdata updates reuse the same path."

## Key design choices

| Area | Choice | Why vs alternative |
|---|---|---|
| Storing show times | `local_start` + IANA `time_zone` (the truth) + `starts_at_utc` (worked out) | UTC alone loses what was promised and breaks when zone rules change; local time alone can't be sorted or compared across cities; a fixed offset (`+00:00`) is wrong for half the year. |
| Who converts times | Only the server, with the venue's zone, on the show date | The browser would use the organiser's zone and *today's* offset, the classic one-hour-off bug. |
| "N hours before" vs "at 09:00" | Duration maths in UTC; wall-clock maths in the venue zone | Mixing them gives 23- or 25-hour "days" on clock-change dates. |
| Clock-change traps | Refuse times in the gap; ask in the overlap | Libraries silently shift or guess; for a 90,000-person event, guessing is not OK. |
| Stopping double booking | Redis `SET NX EX` filter → `SELECT ... FOR UPDATE` in seat order → `UNIQUE (show_id, seat_id)` on tickets | Redis alone can lose keys on failover; the database alone drowns in the on-sale crowd; the unique rule catches any bug that slips past both. |
| Lock style for seats | Pessimistic (`FOR UPDATE`) | Optimistic (version check + retry) wastes work when thousands fight for the same seat; locking makes losers wait a moment and then fail cleanly. |
| Lock style for show edits | Optimistic (`If-Match` + version) | Edits are rare and slow (a human is typing); holding a database lock for minutes would block everything. |
| Hold expiry | `hold_expires_at` checked inside the lock + a sweeper | A sweeper alone would leave seats stuck if it was down; checking time inside the lock is always correct. |
| Payment truth | Signed webhook + `webhook_events` dedup + reconciliation job (stuck CREATED, PAID or REFUND_PENDING) | Trusting the phone is unsafe; trusting only webhooks loses the rare missing one. |
| Late payment | `LOCK_EXPIRED` → automatic idempotent refund | Overbooking the seat or silently keeping the money are both unacceptable. |
| Reminders | Rows with `fire_at_utc` + polling scheduler with `SKIP LOCKED` → SQS | In-memory timers vanish on restart; SQS delay is at most 15 minutes; one cron line per reminder doesn't scale. |
| Telling other services | Outbox table + Debezium + Kafka, keyed by show/booking/payment id, for **every** hand-off: show changes, payment.paid, booking.confirmed, booking.confirm_failed, payment.refunded | Writing to the database and then calling or publishing separately (a dual write) loses the message on a crash; the key keeps each show's events in order. Readers drop repeats by event id. |
| Payment → Booking | `payment.paid` outbox event, read by the Booking consumer; no direct call | A direct call after "PAID" is lost if the Payment Service crashes in between: money taken, no tickets. |
| Seat map | Drawing on CDN, live colours in Redis for 2 s | Rebuilding a 90,000-seat map from the database per viewer would melt it. |
| Big on-sale | Virtual waiting room in front of booking | Letting 1 million people hit "Book" at once only creates timeouts and unfairness. |

## Deep Dive (only what the flows above did not cover)

### 1. Back-of-the-envelope estimates (say these early)

Keep it rough. The point is to show where the pressure is, not to be exact.

| What | Rough size | What it tells us |
|---|---|---|
| Normal bookings | ≈10 million a month ≈ 4 a second on average, ≈100 a second at the evening peak | One PostgreSQL database handles normal days easily. |
| Big on-sale (one stadium show) | ≈1 million fans waiting for 90,000 seats | The problem is **one show, one minute**, not total traffic. Hence the waiting room and the Redis filter. |
| Seat rows | Cinemas: ≈5,000 screens × 5 shows a day × 250 seats ≈ 6 million new `show_seats` rows a day | Split the table by show date (partitioning) and drop old shows; keep only ≈30 days ahead "hot". |
| Seat map reads | Every fan refreshes the map every few seconds | Must come from cache (2-second Redis snapshot), never straight from the database. |
| Reminders | 2 per booking ≈ 20 million a month; ≈100,000 can fall in the same minute (09:00 London on a big Saturday) | The scheduler must not sleep when a batch comes back full: it runs again at once. |
| Search | ≈10× more searches than bookings | Separate Elasticsearch copy, fed from Kafka. |

### 2. Data model (the tables, with the time-related types)

```sql
-- Catalog DB
CREATE TABLE venues (
  venue_id     text PRIMARY KEY,
  name         text NOT NULL,
  city         text NOT NULL,
  time_zone    text NOT NULL,               -- IANA name, e.g. 'Europe/London'
  layout_file  text NOT NULL,
  capacity     int  NOT NULL
);
CREATE TABLE shows (
  show_id        text PRIMARY KEY,
  event_id       text NOT NULL,
  venue_id       text NOT NULL REFERENCES venues,
  local_start    timestamp   NOT NULL,      -- WITHOUT time zone: the wall-clock time Priya typed
  time_zone      text        NOT NULL,      -- copied from the venue at creation
  starts_at_utc  timestamptz NOT NULL,      -- worked out; used for sort / search / reminders
  tzdata_version text        NOT NULL,      -- e.g. '2026a'
  status         text        NOT NULL,      -- SCHEDULED / RESCHEDULED / CANCELLED
  version        int         NOT NULL DEFAULT 1
);

-- Booking DB
CREATE TABLE show_seats (
  show_id         text NOT NULL,
  seat_id         text NOT NULL,
  status          text NOT NULL,            -- AVAILABLE / HELD / BOOKED
  booking_id      text,
  hold_expires_at timestamptz,
  price_minor     int  NOT NULL,
  version         int  NOT NULL DEFAULT 0,
  PRIMARY KEY (show_id, seat_id)
);
CREATE TABLE bookings (
  booking_id      text PRIMARY KEY,
  user_id         text NOT NULL,
  show_id         text NOT NULL,
  seat_ids        text[] NOT NULL,
  status          text NOT NULL,            -- PENDING / CONFIRMED / EXPIRED / CANCELLED
  amount_minor    int  NOT NULL,
  currency        char(3) NOT NULL,
  idempotency_key text NOT NULL,
  user_time_zone  text NOT NULL,            -- for messages, e.g. 'Asia/Kolkata'
  created_at      timestamptz NOT NULL,
  expires_at      timestamptz NOT NULL,
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX ON bookings (expires_at) WHERE status = 'PENDING';   -- for the Hold Sweeper
CREATE TABLE tickets (
  ticket_id  text PRIMARY KEY,
  booking_id text NOT NULL,
  show_id    text NOT NULL,
  seat_id    text NOT NULL,
  qr_code    text NOT NULL,
  UNIQUE (show_id, seat_id)                 -- the last wall against double booking
);

-- Payment DB
CREATE TABLE payments (
  payment_id         text PRIMARY KEY,
  booking_id         text NOT NULL,
  gateway_order_id   text UNIQUE,
  gateway_payment_id text,
  amount_minor       int  NOT NULL,
  currency           char(3) NOT NULL,
  status             text NOT NULL,         -- CREATED / PAID / COMPLETED / FAILED / REFUND_PENDING / REFUNDED
  idempotency_key    text NOT NULL UNIQUE,
  created_at         timestamptz NOT NULL
);
CREATE INDEX ON payments (status, created_at);   -- for the Reconciliation Job
CREATE TABLE webhook_events (
  gateway_event_id text PRIMARY KEY,         -- a repeat insert fails: the repeat is ignored
  type             text NOT NULL,
  received_at      timestamptz NOT NULL
);

-- outbox: the same table in the Catalog DB, the Booking DB and the Payment DB.
-- Written in the SAME transaction as the change; Debezium turns each row into a Kafka message.
CREATE TABLE outbox (
  id            text PRIMARY KEY,            -- becomes the Kafka header "id": readers drop repeats by it
  aggregatetype text NOT NULL,               -- show / booking / payment -> topic show.events, booking.events, payment.events
  aggregateid   text NOT NULL,               -- sh-101, bk-555, pay-901 -> the Kafka message key
  type          text NOT NULL,               -- e.g. payment.paid, booking.confirm_failed
  payload       jsonb NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Reminder DB
CREATE TABLE reminders (
  reminder_id  text PRIMARY KEY,
  booking_id   text NOT NULL,
  show_id      text NOT NULL,
  kind         text NOT NULL,               -- BEFORE_24H / SHOW_DAY_9AM
  fire_at_utc  timestamptz NOT NULL,
  status       text NOT NULL,               -- PENDING / QUEUED / SENT / CANCELLED / SKIPPED
  show_version int  NOT NULL,
  UNIQUE (booking_id, kind)
);
CREATE INDEX ON reminders (status, fire_at_utc);
```

**A trap in PostgreSQL's names:** `timestamptz` ("timestamp with time zone") does **not** save a zone. It turns whatever you give it into UTC and saves only that instant. `timestamp` ("without time zone") saves the wall-clock numbers and nothing else. So to keep "19:30 in London" you need **both** a `timestamp` and a separate `time_zone` text column, exactly as above. Many teams find this out the hard way.

### 3. The time zone bug catalogue (and the fix for each)

| Bug | What it looks like with our show | Fix |
|---|---|---|
| Local time saved with no zone | Database says `2026-03-29 19:30`. 19:30 where? A server in Mumbai reads it as India time: 5½ hours wrong. | Always save the zone name next to a local time. |
| Fixed offset saved instead of a zone | Priya created the show in January, `+00:00` was saved. On show day London is `+01:00`, so the show "starts" at 20:30. | Save `Europe/London`, not `+00:00`. An offset is only correct for one date. |
| Converting with *today's* offset | The admin page converts using `new Date()` on Priya's laptop in January. Same one-hour error. | Convert on the server, using the show's own date. |
| "Same time yesterday" used as "24 hours before" | Reminder at Sat 19:30 London = 23 hours before the show (a night hour vanished). In October it would be 25 hours. | Durations in UTC; clock times in the zone (Flow 6). |
| Time in the missing hour | A late-night show at 01:30 on 29 Mar doesn't exist. Some libraries silently move it to 02:30; others crash. | Detect the gap and refuse it with a clear message. |
| Time in the double hour | 01:30 on 25 Oct happens twice, an hour apart. A library picks one for you, maybe the wrong one. | Detect the overlap; ask "first or second"; save the answer (as the UTC instant). |
| Repeating shows saved in UTC | A musical plays "daily at 19:30". Saved as "daily at 18:30 UTC" in summer, it shows at 18:30 London in winter. | Save the rule in local time + zone; work out each night's UTC separately. |
| "Today" taken from the server's zone | A server in Virginia decides what "today's shows" are for a fan in Pune. | "Today" always means today in a named zone (the user's or the venue's). |
| Zone rules change | A country drops summer time. Shows already saved in UTC are now an hour off. | Keep local time + zone as the truth; recompute future shows when tzdata updates (Flow 7 explainer). |
| Different servers, different tzdata | Two servers convert the same show to two different UTC times. | Ship tzdata with the build; save `tzdata_version`; alert if servers disagree. |
| Phone clock is wrong | A hold countdown or "show starts in 2 h" uses the phone's own clock. | Send server time with responses; count down from that. |
| Daily "midnight" jobs | A job at "00:00 local" runs twice or never on clock-change nights. | Schedule jobs in UTC, or use a scheduler that understands zones. |

**How does the computer know London's rules?** Every operating system and language (Java, Go, Python) ships the **tz database** (also called tzdata or the IANA time zone database), maintained by volunteers. For each zone name it lists every offset change in history and the rule for the future, e.g. "Europe/London: +01:00 from the last Sunday of March at 01:00 UTC until the last Sunday of October at 01:00 UTC". Converting "19:30 London on 29 Mar 2026" means: look up which rule applies on that date (+01:00), subtract it. A new edition comes out several times a year when governments change their rules.

### 4. Same ideas for appointment booking across time zones (Dr. Mehta in London, Rahul in Pune)

The same three ideas fit a doctor's appointment system perfectly:
- **Working hours are a rule in local time:** Dr. Mehta works "Mon-Fri, 09:00-17:00, Europe/London". Each day's slots are worked out from that rule with the zone, so in summer her 09:00 slot is 08:00 UTC, in winter 09:00 UTC. Saving "08:00 UTC every day" would shift her whole day by an hour in October.
- **Each slot is stored as a UTC start + the doctor's zone.** Rahul in Pune sees "09:00 London (13:30 your time)", or in summer "(14:30 your time)".
- **Double booking is stopped with a "unique slot":** `CREATE UNIQUE INDEX ON appointments (doctor_id, slot_start_utc) WHERE status IN ('HELD', 'BOOKED');`. Two patients inserting the same slot at the same moment: the database lets exactly one `INSERT` succeed, and the other gets a "duplicate" error, which we turn into "slot just taken". No `SELECT ... FOR UPDATE` needed, because a slot is a single row being *created*, not an existing row being changed.
- **Reminders** are the same Flow 6: "24 hours before" in UTC; "08:00 on the appointment day" in the patient's or clinic's zone (a product choice).

### 5. Stopping double booking: all the ways, side by side

| Way | How it works | Good at | Weak at |
|---|---|---|---|
| **Unique slot** (unique index) | `INSERT` a row for (show, seat) or (doctor, slot). The second `INSERT` fails. | Simplest; impossible to get wrong; perfect for appointments. | Expired holds must be deleted before the slot can be taken again; rules like "max 6 seats per fan" need extra checks. |
| **Conditional update** | `UPDATE show_seats SET status='HELD' ... WHERE seat_id='F12' AND status='AVAILABLE'`; check that 1 row changed. | One statement, no explicit lock. | For several seats you must check every row changed, and roll back if not. |
| **`SELECT ... FOR UPDATE`** (our choice) | Lock the rows, read them, decide with any rules (expired hold? limit per fan?), write, commit. | Clear, flexible rules; losers wait a moment then fail cleanly. | Keep the transaction tiny, and always lock in the same order, or you get deadlocks. |
| **Optimistic (version number)** | Read version 3, write "only if still version 3"; on failure, retry. | No locks; great when conflicts are rare (show edits). | In an on-sale, almost everyone fails and retries: lots of wasted work. |
| **SERIALIZABLE isolation** | The database itself detects any conflicting transactions and aborts one. | No hand-written locks. | Many aborts under load; every caller must retry. |
| **Redis lock** (`SET NX EX`) | First caller creates the key. | Very fast; turns away the crowd. | Not the final word: keys can be lost on failover; a slow request can outlive its key. Use it as a filter only. |
| **One writer per show** | All requests for sh-101 go through one queue partition, handled one by one. | No locks at all; strict order. | Adds a hop and latency; one hot show = one busy worker. |

Our answer uses three layers, each catching what the one before can miss: **Redis filter → row lock → unique rule on tickets.**

**Pick-your-seat vs "best available".** When the fan picks the seat, thousands fight over the same "best" seats. When the server picks ("2 seats in block 112, best available"), it can hand different free seats to different people at the same moment: `SELECT ... WHERE status = 'AVAILABLE' ... LIMIT 2 FOR UPDATE SKIP LOCKED`. Big on-sales often start in "best available" mode for exactly this reason.

### 6. Inside the reminder scheduler: options and details

| Option | How | Verdict |
|---|---|---|
| A cron line per reminder | The operating system's scheduler, one entry each | Doesn't scale to millions; lost if the machine dies. |
| A timer in memory | `time.AfterFunc` / `setTimeout` | Gone after every restart. |
| **Database rows + polling with `SKIP LOCKED`** (ours) | Rows with `fire_at_utc`; several pollers claim due rows | Simple, survives crashes, easy to move/cancel/inspect. Good up to thousands a second. |
| Redis sorted set | `ZADD reminders <fire time> r-1`; poll `ZRANGEBYSCORE reminders 0 <now>` | Very fast; but Redis must be made durable, and claiming needs a small script. |
| Timing wheel | A ring of time slots in memory (used inside Kafka for its own timeouts) | Great for millions of *short* timers; not for months ahead. |
| Queue delay | SQS `DelaySeconds` | At most 15 minutes. Fine for "retry in 5 minutes", not for "tomorrow". |
| Managed scheduler | e.g. Amazon EventBridge Scheduler, Quartz with a database store | Less code to own; less control and visibility. |

**Details that matter:**
- **Catch-up after downtime:** if the scheduler was down for 2 hours, the due rows are still there, PENDING. On restart it sends them, *if still useful*: a "tomorrow" reminder that is now after the show start is marked `SKIPPED`, not sent.
- **Full batch = run again now:** if a poll returns 500 rows, there are probably more. Don't sleep 5 seconds; poll again straight away.
- **Quiet hours in the fan's zone:** r-1 fires at 00:00 in Pune. The Notification Service can send the email right away but make the push silent, or hold the push until 08:00 in `Asia/Kolkata`. It uses the zone saved on the booking.
- **Cancelled bookings:** a `booking.cancelled` event marks its reminders `CANCELLED`; the sender also re-checks the booking before sending, in case the event is late.
- **Keeping the table small:** split `reminders` by month of `fire_at_utc` (partitioning) and drop old months, so the "what is due now?" index stays small and fast.
- **Using the database's clock:** `fire_at_utc <= now()` uses the database's own clock, so three scheduler machines with slightly different clocks still agree on what is due.

### 7. The on-sale hot spot: a virtual waiting room

At 10:00 on sale day, a million people press refresh at once. Without control, every layer drowns, and whoever has the fastest internet wins. A **virtual waiting room** is the queue outside a shop on launch day, but online:
1. Before 10:00, fans land on a waiting page (static, served by the CDN, so it costs almost nothing).
2. At 10:00 each fan in the room gets a **random place in line** (fair: early arrivals before 10:00 all have the same chance; refreshing doesn't help).
3. The waiting room lets people through in batches, at the speed the booking side can handle (e.g. watch how fast holds are completing and adjust). Each admitted fan gets a **signed pass** (a token with "admitted at" and an expiry).
4. The API Gateway refuses `POST /v1/bookings` without a valid pass.
5. Add limits that protect real fans: max 6 seats per account, CAPTCHA (a test that bots fail), and "verified fan" pre-registration for the biggest shows.

Inside, keep the hot show's work light: tiny lock transactions, a separate connection pool for booking, and if needed put a very big show's seats in their own database shard (a separate database server) so it can't slow down every cinema in the country.

### 8. Caching (what, where, how long)

| What | Where | How long | Why it's safe |
|---|---|---|---|
| Seat drawing, posters | CDN (files from S3) | 1-7 days | They don't change; a new layout gets a new file name. |
| Live seat colours | Redis `seatmap:{show}` | 2 seconds | Only a hint; the database decides in Flow 3. |
| Search results | Elasticsearch (a copy) | Until the next Kafka update | Versions stop old updates from winning. |
| Show details page | CDN, short | ≈30 seconds | A moved show (Flow 7) shows up within half a minute. |
| Hold keys | Redis `hold:{show}:{seat}` | 300 seconds | A filter; losing them is safe. |
| Never cached | Booking status, payment status | — | Must always be the truth. |

### 9. Failure scenarios

| What breaks | What happens | Why nothing goes wrong |
|---|---|---|
| Redis is down | Booking skips the filter and goes straight to the database, with a tighter rate limit; seat maps come from a database read copy with a longer cache. | The database was always the judge. |
| Redis loses a hold key | A second fan passes the Redis check for F12. | The `FOR UPDATE` check finds F12 HELD and says 409. |
| Booking DB main server dies | A standby copy takes over in seconds; in-flight requests fail and the app retries. | Idempotency keys turn retries into the same booking. |
| Payment Service crashes after Razorpay took the money | The webhook is retried by Razorpay; if that fails too, the reconciliation job finds the CREATED payment. | Payment row was saved *before* calling Razorpay. |
| The same webhook arrives 3 times | Second and third inserts into `webhook_events` fail; we answer 200. | Event id dedup. |
| Payment Service crashes right after saving PAID | The `payment.paid` outbox row was saved in the same transaction; Debezium still sends it and Booking confirms. | Outbox: no dual write. |
| Booking consumer crashes after confirming, before saving its Kafka position | It reads `payment.paid` again; bk-555 is already CONFIRMED, so nothing changes. | Confirm is idempotent. |
| Booking Service is down when the money arrives | `payment.paid` waits in Kafka; seats are confirmed when Booking is back, as long as the hold is still bk-555's. | Kafka keeps the message; Flow 5 handles a resold seat. |
| Payment Service crashes after REFUND_PENDING, before Razorpay answers | The Reconciliation Job retries the refund with the same key. | Idempotency key `refund-pay-902`. |
| Debezium / Kafka is down | Outbox rows pile up in the database; search, seat-making and reminders are late. | Nothing is lost; they catch up. Alert on the lag. |
| Scheduler copies all down | Reminders are late. | Rows stay PENDING; catch-up rules on restart. |
| Push provider down | SQS keeps retrying the message; after 5 failures it goes to the dead-letter queue. | The SQS document's rules; an engineer re-sends later. |
| Server clocks drift | Hold expiry and "due" checks could disagree. | They all use the database's `now()`; servers sync with NTP (Network Time Protocol). |
| A server has old tzdata | It converts a show differently. | One tzdata version per build; `tzdata_version` saved and checked. |

### 10. Real-world anchors

- **Ticketmaster, 2022:** the presale for Taylor Swift's Eras Tour drew far more traffic (fans plus bots) than planned, and the site broke down for many. It is the standard example of why a waiting room, bot defences and seat-level locking are the core of this design, not extras.
- **BookMyShow and most cinema apps** show a countdown while you pay; when it ends, the seats are released. That is our `expires_at` + Hold Sweeper.
- **PostgreSQL `SKIP LOCKED`** (since version 9.5) is what many job-queue libraries are built on, such as River (Go) and Oban (Elixir). Our reminder scheduler is the same idea.
- **Payment gateways** like Razorpay and Stripe send signed webhooks, retry them for hours, and support idempotency keys or receipt ids, exactly because duplicates and lost messages are normal on the internet.
- **Time zone rules really change:** Mexico stopped most summer time in 2022 and Egypt restarted it in 2023, each time with short notice. Systems that stored only UTC for future events had to fix them by hand.
- **DST bugs hit big companies:** in 2010, repeating iPhone alarms went off an hour wrong in parts of Europe after the clocks changed.

### 11. End-to-end walk-through: Priya, Rahul and Anita

1. **15 Jan:** Priya creates sh-101 for "29 Mar, 19:30" at Wembley. The Event Service saves `Europe/London` + `18:30 UTC` (not the January offset). Search and 90,000 seat rows follow through Kafka. *(Flow 1)*
2. **1 Mar, 09:59:** Rahul in Pune searches; London's "28-29 March" becomes a 47-hour UTC range. He sees "19:30 London (00:00 Mon in Pune)" and opens the seat map from the CDN + Redis. *(Flow 2)*
3. **10:00:00:** Rahul and Anita both tap F12. Redis lets Rahul through; Anita gets 409. The database locks F12 + F13 and saves bk-555 as PENDING until 10:05. Anita takes G7 instead (bk-556, until 10:06). *(Flow 3)*
4. **10:01-10:02:30:** Rahul pays £190 on Razorpay. The signed webhook marks pay-901 PAID and writes `payment.paid` in the same transaction; Kafka carries it to Booking, which confirms bk-555, makes tickets t-1 and t-2, and writes `booking.confirmed`. *(Flow 4)*
5. **10:06-10:08:** Anita's hold ends, G7 is sold to someone else at 10:07, her money arrives at 10:08 → Booking writes `booking.confirm_failed` (LOCK_EXPIRED) → £95 refunded automatically, and `payment.refunded` emails her. *(Flow 5)*
6. **Reminders planned:** r-1 at 28 Mar 18:30 UTC (24 h before), r-2 at 29 Mar 08:00 UTC (09:00 London). *(Flow 6)*
7. **10 Mar:** Priya moves the show to 20:00 London. Version check passes; new UTC 19:00. Search updates; r-1 moves to 28 Mar 19:00 UTC; r-2 stays; Rahul is told "00:30 Monday in Pune". *(Flow 7)*
8. **28 Mar, 19:00 UTC:** one of three scheduler copies claims r-1 with `SKIP LOCKED`; Rahul's phone buzzes once. **29 Mar, 08:00 UTC:** r-2 arrives, at 09:00 London time, on the very morning the clocks jumped, and it is still right. *(Flow 6)*
9. **29 Mar, 20:00 London:** Rahul scans t-1 at the gate. The QR signature is checked; F12 is his, and only his.

### 12. Rapid-fire interview Q&A

- **Q: Why not store everything in UTC and be done?** For past events (a payment at 10:02 UTC), UTC alone is perfect. For *future* local events, UTC alone breaks when zone rules change, and loses what was promised ("19:30 in London"). Store local + zone, and derive UTC.
- **Q: Why an IANA zone name, not an offset?** An offset is correct for one date; the zone name carries all the rules for every date.
- **Q: What happens to a show at 01:30 on the spring-forward night?** That time doesn't exist; we reject it and ask for another. On the fall-back night we ask which of the two 01:30s.
- **Q: How do you stop double booking?** Redis `SET NX EX` as a filter, then a short database transaction with `SELECT ... FOR UPDATE` in seat order, and a unique (show, seat) rule on tickets as the last wall.
- **Q: Why is Redis not enough?** It can lose keys on failover and a key can expire while a slow request is still working. It is fast, not final.
- **Q: How do you avoid deadlocks with multi-seat bookings?** Always lock seats in the same order (sorted by seat id).
- **Q: How do holds expire?** `hold_expires_at` is checked inside the lock, so an expired hold counts as free; a sweeper tidies up for display and reports.
- **Q: Payment arrives after the seat was resold?** Booking writes a `booking.confirm_failed` (LOCK_EXPIRED) outbox event → the Payment Service refunds with an idempotency key.
- **Q: Webhook never arrives?** A reconciliation job asks the gateway about payments stuck in CREATED (and retries stuck PAID and REFUND_PENDING ones).
- **Q: Any dual writes left?** No. Every "save, then tell someone" goes through an outbox row in the same transaction: show changes, payment.paid, booking.confirmed, booking.confirm_failed, payment.refunded. Calls to Razorpay save a CREATED / REFUND_PENDING row first and use idempotency keys. Reminders are rows ticked off after sending. The worst case is a duplicate, and every reader drops repeats.
- **Q: How do three scheduler copies not send a reminder twice?** `FOR UPDATE SKIP LOCKED` so each claims different rows, plus an idempotency key per reminder at the sender.
- **Q: Why mark QUEUED after sending, not before?** A crash then causes a duplicate (which we drop) instead of a lost reminder (which we can't fix).
- **Q: "24 hours before" vs "9 AM on the day"?** The first is UTC maths, the second is zone maths. Mixing them gives 23- or 25-hour gaps on clock-change days.
- **Q: How do reminders follow a rescheduled show?** `show.rescheduled` through the outbox → Kafka → the planner updates PENDING rows, guarded by `show_version`.
- **Q: How do you survive an on-sale spike?** Waiting room with random order and signed passes, per-user limits, a Redis filter, a 2-second seat map cache, tiny lock transactions, and a separate shard for the hottest show if needed.
