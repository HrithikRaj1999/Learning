# Server migration: Rehost + blue-green

An e-commerce app runs on 2 on-prem VMs (Node.js plus Nginx). AWS MGN (Application Migration Service) copies them to EC2, and Route 53 moves the traffic over a bit at a time.

## Big flow (all steps together)

Each box shows which steps it takes part in (`STEP n` on its top edge) and what happens there. The top line is the rollback path, and the bottom line is green getting real traffic. Scroll sideways.

```text
                                                                                                          ┌───────────────────<───────────────────────────────────────<───────────────────────────────────────<───────────────────────────────────────<───────────────────────────────────────<───────────────────────────────────────<───────────────────────────────────────────┐
                                                                                                          │                                                                                                                                                                                                                                                                       │
                                                                                                          │                                                                                                                                                                                                                                                                       │
                                                                                                          v                                                                                                                                                                                                                                                                       │
┌── STEP 3 ──────────────────────────────────────────┐            ┌── STEP 3, 4 ──────────────────────────┴────────────┐            ┌── STEP 1, 3, 5 ────────────────────────────────────┐            ┌── STEP 1 ──────────────────────────────────────────┐            ┌── STEP 1, 2, 3 ────────────────────────────────────┐            ┌── STEP 4 ─────────────────────────────┴────────────┐
│ Shoppers  (outside, e.g. Priya)                    │            │ Route 53  (DNS, Domain Name System)                │            │ On-prem VMs  (BLUE, Node.js + Nginx)               │            │ AWS MGN  (Application Migration Service)           │            │ EC2  (GREEN, same app in AWS)                      │            │ CloudWatch  (alarms)                               │
├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤
│ STEP 3: Use shop.com as usual                      │ ────────>  │ STEP 3: Splits traffic by weight                   │ ────────>  │ STEP 1: Source of the copy                         │ ────────>  │ STEP 1: Copies the VMs into AWS                    │ ────────>  │ STEP 1: Created by MGN                             │ ────────>  │ STEP 4: Watches errors and slowness                │
│   - browser asks DNS where shop.com lives          │            │   - two weighted records: blue + green             │            │   - MGN agent installed on both VMs                │            │   - first a full disk copy                         │            │   - same OS, same Node.js app, same Nginx          │            │   - compares green with blue                       │
│   - goes to blue or green, never knows which       │            │   - short TTL (time to live), changes apply fast   │            │   - streams every disk block to AWS                │            │   - then keeps syncing every new change            │            │                                                    │            │   - e.g. green 5xx errors 3% vs blue 0.2%          │
│   - e.g. Priya places order o-301 mid-move         │            │   - e.g. 90/10, then 50/50, then 0/100             │            │                                                    │            │   - launches EC2 from the copy                     │            │ STEP 2: Tested on a private URL                    │            │   - alarm -> Route 53 green weight = 0             │
└────────────────────────────────────────────────────┘            │                                                    │            │ STEP 3: Still serves its share of users            │            │   - e.g. vm-1, vm-2 -> 2 EC2 instances             │            │   - e.g. green.shop.internal, QA test order        │            │   - no alarm -> go to the next %                   │
                                                                  │ STEP 4: Rolls back when the alarm fires            │            │   - e.g. 90% of shoppers at first                  │            └────────────────────────────────────────────────────┘            │   - no real shopper can reach it yet               │            └────────────────────────────────────────────────────┘
                                                                  │   - green weight set to 0                          │            │                                                    │                                                                              │                                                    │
                                                                  │   - e.g. everyone back on blue in ≈ 1 minute       │            │ STEP 5: Shut down after 1 week                     │                                                                              │ STEP 3: Takes traffic bit by bit                   │
                                                                  └──────────────────────────┬─────────────────────────┘            │   - only once green has been calm all week         │                                                                              │   - 10% -> 50% -> 100%                             │
                                                                                             │                                      └────────────────────────────────────────────────────┘                                                                              │   - sends error + latency numbers onward           │
                                                                                             │                                                                                                                                                                          └──────────────────────────┬─────────────────────────┘
                                                                                             │                                                                                                                                                                                                     ^
                                                                                             │                                                                                                                                                                                                     │
                                                                                             │                                                                                                                                                                                                     │
                                                                                             └───────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>─────────────────┘
```

## Quick view

```text
┌── STEP 1 ──────────────────────┐     ┌── STEP 1, 2 ───────────────────┐     ┌── STEP 3 ──────────────────────┐     ┌── STEP 4 ──────────────────────┐
│ Old VMs  (BLUE, on-prem)       │     │ EC2  (GREEN, AWS)              │     │ Route 53  (DNS)                │     │ Watch errors                   │
├────────────────────────────────┤     ├────────────────────────────────┤     ├────────────────────────────────┤     ├────────────────────────────────┤
│ Node.js + Nginx                │ ──> │ same app, copied by MGN        │ ──> │ weighted traffic split         │ ──> │ errors up?                     │
│ - live, takes 100% traffic     │     │ - test on a private URL        │     │ - 10% -> green                 │     │ - yes: send 100% to blue       │
│ - MGN copies the disks         │     │ - nobody real uses it yet      │     │ - then 50%, then 100%          │     │ - no: keep blue 1 week, stop   │
└────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘
```

**Steps**

1. **Copy:** MGN copies both VMs into EC2. That copy is the "green" setup.

2. **Test:** try green on a private URL before any real user reaches it.

3. **Shift traffic:** Route 53 weighted records send 10% to green, then 50%, then 100%.

4. **Watch errors:** CloudWatch compares green with blue. If errors go up, Route 53 sends all traffic back to the old VMs ("blue").

5. **Shut down blue:** keep blue running for 1 week as a safety net, then shut it down.

**Why it is safe:** blue keeps running the whole time, so rolling back is just a DNS (Domain Name System) change.
