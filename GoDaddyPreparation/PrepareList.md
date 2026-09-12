# GoDaddy Deep Prep — Last 5 Years (2021 → 2026)

Every item below is from a **real candidate report**. Each has:
**Q** = exact question · **When/Who** = year, level, city · **Expect** = what the interviewer wants from you.

Tags: `[VERIFIED]` real report · `[VENDOR]` prep-site only, treat as practice.

---

# PART 1 — THE LOOP

## 1.1 Round shapes seen (pick the one matching your recruiter's words)

| Shape                             | Rounds                                                                         | Seen at                          |
| --------------------------------- | ------------------------------------------------------------------------------ | -------------------------------- |
| **A. Pune SDE2 (3 rounds)**       | HM behavioural → React/frontend → Backend API design                           | Pune remote, Mar 2025, **offer** |
| **B. Pune Senior (3–4 rounds)**   | All DSA-heavy + resume + HM behavioural                                        | Pune 2025/2026                   |
| **C. India Principal (4 rounds)** | Screener → DSA → HM → Bar raiser (API design)                                  | India, Blind                     |
| **D. Frontend Senior (5 rounds)** | JS DSA → LLD → problem solving → "system design" (drifted to LLD) → managerial | Q1 2025                          |
| **E. US/EU (4 rounds)**           | Experience + coding + system design, sometimes 3 interviewers at once          | 2022–2025                        |
| **F. Campus/Intern (OA + 2–3)**   | HackerRank OA → DSA+DBMS → HLD                                                 | India campus 2024–2025           |

## 1.2 Hard facts

- Gap between rounds: **~1 week**. Full process: **3–5 weeks**.
- Platform: **HackerRank CodePair** (live shared editor). Some CoderPad.
- Time pressure is real: one candidate had to write **clean code + tests in 30–40 min**.
- A "system design" round can turn into LLD. A "behavioural" round can turn into coding. **Be ready for anything, every round.**
- Pune SWE reported pass rate on Taro: **0% of 2 samples**. Small sample, but treat the bar as real.

---

# PART 2 — DSA (exact questions + expectations)

## 2.1 Strings, DP & Backtracking — **the #1 area**

**Q2.1.1 — Permutations of a string, with duplicates**
`permute("aba") → ["aba","aab","baa"]` | LC 46 / 47
When: SDE2 Feb 2022 · Pune SWE Sept 2025 (OA) `[VERIFIED]`
**Expect:** freq-array backtracking, not swap-based. Say the complexity out loud: O(n × n!). Handle duplicates without a Set. Explain _why_ you skip `i>0 && nums[i]==nums[i-1] && !used[i-1]`.

**Q2.1.2 — Count s2 as a subsequence of s1**
Not contiguous. `s1="rabbbit", s2="rabbit" → 3` | LC 115
When: SDE2 Feb 2022 `[VERIFIED]`
**Expect:** 2D DP table. Bottom-up. Recurrence `dp[i][j] = dp[i-1][j] + (match ? dp[i-1][j-1] : 0)`. Mention O(m) space optimisation only if they ask.

**Q2.1.3 — String-based DP + array-based greedy (OA pair)**
When: Pune SWE, HackerRank OA, Sept 2025 `[VERIFIED]`
**Expect:** OA is auto-graded. All test cases must pass. Watch the time limit.

**Q2.1.4 — Letter combinations of a phone number** | LC 17
When: SDE2 onsite 2020–2022 `[VERIFIED]`
**Expect:** clean backtracking, iterative alternative if asked.

**Q2.1.5 — String compression** (`"aabcccc" → "a2b1c4"`, return original if not shorter) | LC 443
When: SDE, Taro-tagged `[VERIFIED]`
**Expect:** in-place two-pointer. They will check the "not shorter" edge case.

**Q2.1.6 — Print palindrome number** | LC 9
When: SDE1 Gurgaon, Nov 2025, L1 round `[VERIFIED]`
**Expect:** no string conversion. Handle negatives.

**Q2.1.7 — Reverse a string, then reverse only alphanumeric chars**
When: 2016, still on their list `[VERIFIED]`
**Expect:** two-pointer, skip non-alphanumeric in place.

**Q2.1.8 — Valid parentheses / balancing brackets** | LC 20
When: SSE India `[VERIFIED]`

**Q2.1.9 — Subsets of an array** | LC 78
When: Sr Frontend 2025 `[VERIFIED]`

**Q2.1.10 — First non-repeating character in a string** | LC 387
When: listed in Interview Query's GoDaddy question bank `[VERIFIED]`

---

## 2.2 Intervals

**Q2.2.1 — Merge Intervals** | LC 56
When: SDE1 New Delhi Nov 2024 · repeated across reports `[VERIFIED]`
**Expect:** sort by start, single pass. Then they add: _"now insert one interval into an already-merged list"_ (LC 57). Prepare both.

---

## 2.3 Matrix

**Q2.3.1 — Print a matrix in zig-zag order, given rows and cols**
When: SDE2 CoderPad 2020 `[VERIFIED]`
**Expect:** direction flag, careful boundary handling. Dry-run a 3×4 out loud.

**Q2.3.2 — Set matrix rows and columns to 1** (variant of LC 73)
When: 2017 `[VERIFIED]`
**Expect:** don't mutate while scanning. Use first row/col as markers for the O(1) space version.

**Q2.3.3 — Zig-zag merge of two sorted arrays** (max, min, 2nd max, 2nd min…)
When: 2016 `[VERIFIED]`

---

## 2.4 Heap / Priority Queue

**Q2.4.1 — Medium max-heap problem (top-K style)** | LC 215 / 347
When: Senior SWE tech-core Apr 2022 · India campus Aug 2025 (medium-hard) `[VERIFIED]`
**Expect:** know when heap beats sorting. State O(n log k).

**Q2.4.2 — Merge sorted lists** | LC 21 / 23
When: Interview Query GoDaddy bank `[VERIFIED]`

---

## 2.5 Sorting / Custom comparator — **asked in two separate years**

**Q2.5.1 — Sort version-number strings**
`["4.5.1","10","0.99","4.5","1.0.0.1"] → ["0.99","1.0.0.1","4.5","4.5.1","10"]`
When: SDE2 2020 **and** SDE2 Feb 2022 `[VERIFIED]`
**Expect:** split on `.`, compare part by part as numbers, pad missing parts with 0. They will feed you `"1.0"` vs `"1.0.0"` as a trap. **Repeat question — highest value per hour of prep.**

---

## 2.6 Linked List / Binary Search / Graph

**Q2.6.1 — Reverse a linked list** | LC 206
When: SDE intern Gurgaon, Sept 2024 `[VERIFIED]`
**Expect:** iterative first, then recursive if asked.

**Q2.6.2 — Easy linked list problem** (solved in 2 min by the candidate)
When: SWE-1 India 2025 `[VERIFIED]`
**Expect:** speed. Then they move straight to theory.

**Q2.6.3 — Search a target: linear → hashing → binary search**
When: SDE intern on-campus Sept 2025, coded in C++ `[VERIFIED]`
**Expect:** they want the _progression_. Say brute force + complexity, then improve, then improve again. Do not jump to the optimal answer silently.

**Q2.6.4 — Graph + binary search + linked list (all three in one loop)**
When: Pune SWE 2026 `[VERIFIED]`

**Q2.6.5 — BFS variation** (OA question 3)
When: campus OA Sept 2025 `[VERIFIED]`

**Q2.6.6 — Arranging Coins** (staircase) | LC 441
When: Taro GoDaddy bank `[VERIFIED]`

---

## 2.7 Arrays / Hashing / Misc

**Q2.7.1 — Find duplicate elements in an array** — brute force then optimal
When: SDE intern Nov 2025 `[VERIFIED]`

**Q2.7.2 — Find common elements in two lists** | LC 349
When: SDE Dec 2023 `[VERIFIED]`

**Q2.7.3 — Count votes** — hashmap, aggregate, sort by count
When: HackerRank screen 2018 `[VERIFIED]`

**Q2.7.4 — Recursion over nested data structure** (flatten)
When: Senior SWE Arizona, Dec 2025 `[VERIFIED]`

**Q2.7.5 — Array problem in Python + "what is the difference between a Python array and a JavaScript array?"**
When: SDE intern Gurgaon Sept 2024 `[VERIFIED]`
**Expect:** they mix coding with language internals. Know list vs array module vs numpy; JS arrays are objects with holes.

**Q2.7.6 — Find the missing number** | LC 268 · **Minimum change** (coin change) · **String shift**
When: Interview Query GoDaddy bank `[VERIFIED]`

---

## 2.8 OA-only patterns (HackerRank, campus + lateral)

- Greedy on a binary string `[VERIFIED]` Sept 2025
- DP + sieve of Eratosthenes `[VERIFIED]` Sept 2025
- Line sweep / prefix sum `[VERIFIED]` Aug 2025
- **Solve a recurrence relation and give the time complexity** (Master theorem, DAA) `[VERIFIED]` Pune Sept 2025
- OA also covers **OS, DAA, Computer Networks** MCQs at campus level

**OA format (India, 2025):** 48–60 min. 4 aptitude MCQ (14 min) + 1 SQL (10 min) + 2–3 DSA (36 min).

---

# PART 3 — LLD (build it from scratch)

This is GoDaddy's signature round. They want **working code**, not UML.

**Q3.1 — Implement a Stack from scratch.** Push, pop, unlimited size, **no built-in collection classes**.
When: SDE2 Feb 2022 `[VERIFIED]`
**Expect:** dynamic array resize (double on full) or linked nodes. Handle pop on empty. Say amortised O(1).

**Q3.2 — Implement a HashMap from scratch.** get, put, delete, your own hash function, collision handling.
When: SDE2 Feb 2022 `[VERIFIED]`
**Expect:** bucket array + chaining. Discuss load factor, resize + rehash, and why a bad hash degrades to O(n). This is their favourite deep question.

**Q3.3 — Implement an LRU Cache in JavaScript** on HackerRank. O(1) get and put. | LC 146
When: Senior Frontend Q1 2025 `[VERIFIED]`
**Expect:** `Map` in JS already keeps insertion order — say that, then show you also know the doubly-linked-list + hashmap version.

**Q3.3b — Design an LRU cache with generics** (pair programming with a team member)
When: Sr Developer, 9 YOE, **Ecommerce team**, Feb `[VERIFIED]` — Blind
**Expect:** generic types `<K, V>`, not hardcoded to string/int. Same DLL + map core, but they are watching your API design and type safety.

**Q3.4 — Design a class using a LinkedList** (circular queue style)
When: SDE2 2020 `[VERIFIED]`

**Q3.5 — Design a Decimal class without wrapper classes**
When: SDE2 2020 `[VERIFIED]`
**Expect:** store as scaled integer. Discuss rounding and why floats fail for money.

**Q3.6 — Implement a Queue using two Stacks** | LC 232
When: SDE intern Gurgaon Sept 2024 `[VERIFIED]`
**Expect:** amortised O(1) — only move when the out-stack is empty. They may ask where this appears in a real service.

**Q3.7 — Min Stack** | LC 155
When: Experimentation Platform team `[VERIFIED]`

**Q3.8 — Design DB schema for a quiz product** + write queries
When: campus round 1, Aug 2025 `[VERIFIED]`
**Expect:** tables, keys, indexes, then 2–3 queries on your own schema.

**Q3.9 — Write an Inventory Management Service in pseudo code**, one or two classes plus a function. They watch **how you write DB calls and handle retries on failure.**
When: SDE3→SDE2 candidate, cleared all rounds `[VERIFIED]`
**Expect:** this is a backend-craft test. Show: transaction boundary, optimistic locking or `SELECT ... FOR UPDATE`, idempotency key, retry with exponential backoff + jitter, max retries, dead-letter. The candidate called it the best round of four. **Very likely for your level.**

---

# PART 4 — HLD / System Design

**Q4.1 — Transaction event bus** ⭐ best-documented one

> Receive and re-distribute transaction events. ~3000 messages/min, ~2 KB each. Must not lose data. Audit retention **7 years**. Multiple consumers, both push and pull. Producers and consumers must be authorised.
> When: SDE2/Senior Feb 2022, interviewed by a **Director of Engineering** `[VERIFIED]`
> **Expect:**

- Do the math out loud: 50 msg/sec, 100 KB/sec — say clearly that this is **small**, so the design is about _durability and retention_, not scale.
- Kafka (or Kinesis/SNS+SQS) with replication factor 3, acks=all.
- Push = webhook with retry + DLQ. Pull = consumer groups with offsets.
- 7-year audit: tier to S3 / Glacier, partitioned by date, with a catalog for replay.
- Auth: mTLS or OAuth per producer, ACLs per topic per consumer.
- Exactly-once vs at-least-once + idempotent consumers.

**Q4.2 — Design a ticketing system** | When: SDE2 2020 `[VERIFIED]`
**Expect:** seat locking, double-booking prevention, payment timeout release.

**Q4.3 — Design an Amazon-like system**, plus AWS-specific follow-ups | When: Senior SWE `[VERIFIED]`
**Expect:** name the actual AWS services (ALB, ECS/EKS, DynamoDB, SQS, CloudFront). Your SAA/DVA certs are directly useful here.

**Q4.4 — Design YouTube** | When: campus intern Sept 2025 `[VERIFIED]`

**Q4.5 — Design WhatsApp / Design Flipkart** | When: campus peers, same drive `[VERIFIED]`

**Q4.6 — "How would you scale the project on your resume?"**
When: SDE Pune Sept 2025 · repeated in India loops `[VERIFIED]`
**Expect:** pick one project, state current load, then walk: cache → read replica → shard → queue → CDN. Give numbers. **Rejection reason on record: "your resume lacked cloud-based projects."** Lead with AWS.

**Q4.7 — HLD round, "web-related, very technical, interviewer asked about implementations in detail"**
When: campus round 2, Aug 2025 `[VERIFIED]`
**Expect:** they push past boxes-and-arrows into actual implementation. Be ready to name the data store, the index, the API shape.

**Q4.8 — Design a domain search + suggestion service** `[VENDOR]`
**Expect (if it comes up):** Elasticsearch/OpenSearch index, TLD suggestion service, Redis cache for availability, rate-limit calls to registry/WHOIS, multi-region + Anycast, handle registry outage, eventual consistency between reg-DB and index.

**Q4.9 — URL shortener with custom alias + click analytics** `[VENDOR]`

---

# PART 5 — Machine Coding (React + API) — **your strongest zone**

**Q5.1 — Build a Movie Search Page in React** ⭐ closest to your profile

> Fetch paginated results from an API. Implement search, pagination, and IMDB links.
> When: SDE2 Pune (Remote), Mar 2025 — **got the offer** `[VERIFIED]`
> Topics they graded: API calls & pagination, `useState`/`useEffect` state management, performance.
> **Follow-ups asked:**

1. How would you handle large datasets efficiently?
2. How would you improve the UX?
3. How would you structure this for production?
   **Expect:** debounced search, abort in-flight requests, loading + error + empty states, key on stable id, virtualisation or infinite scroll for the large-data answer, and for production: folder structure, custom hook for fetch, env config, error boundary, tests.

**Q5.2 — Find the fastest marathon runner (backend / API)** ⭐

> The API is paginated. Find an efficient way to fetch the data. Consider rate limits and failure handling.
> When: SDE2 Pune (Remote), Mar 2025 — **same offer loop** `[VERIFIED]`
> **Follow-ups asked:**

1. How would you optimise API calls for large data?
2. How do you handle API failures in production?
3. What if the API had strict rate limits?
   **Expect:** bounded parallelism (worker pool, not `Promise.all` on everything), streaming instead of collecting all in memory, retry with exponential backoff + jitter, respect `Retry-After` / 429, circuit breaker, token bucket on your side, checkpoint so you can resume.

**Q5.3 — Build a Kanban board in React** | Q1 2025 `[VERIFIED]`
**Expect:** column + card state model, drag between columns, immutable updates.

**Q5.4 — Build a start/stop timer in React** | Q1 2025 `[VERIFIED]`
**Expect:** `setInterval` inside `useEffect`, cleanup on unmount, `useRef` for the interval id, no stale closure.

**Q5.5 — Build a calculator in React** | Q1 2025 `[VERIFIED]`

**Q5.6 — React table with pagination filled from a fetch call** | Experimentation team `[VERIFIED]`

**Q5.7 — Todo list with conditions** | Experimentation team `[VERIFIED]`

**Q5.8 — Nested checkbox component** (parent/child tri-state) | Sr Frontend 2025 `[VERIFIED]`
**Expect:** recursive tree, indeterminate state, propagate up and down.

**Q5.9 — Color swatch in plain JavaScript** | Sr Frontend 2025 `[VERIFIED]`

**Q5.10 — React form with validation on submit** (HackerRank) | Senior AZ Dec 2025 `[VERIFIED]`

**Q5.11 — Write REST APIs on a HackerRank link, make the tests pass**
When: Gurgaon SWE, Feb 2025 (with scenario-based questions) `[VERIFIED]`
**Expect:** correct status codes, validation, and _the given tests passing_. Read the test file first.

**Q5.11b — HackerRank API problem with 12 test cases: consume a JSON payload and run queries on it**
When: Sr Developer, 9 YOE, **Ecommerce team**, Feb `[VERIFIED]` — Blind
**Expect:** parse/normalise the JSON, then answer filter/aggregate/group questions over it. All 12 tests must pass. This is the same family as Q5.2 (marathon runner).

**Q5.12 — Build a Node.js API live** | Senior SWE Apr 2022 `[VERIFIED]`

**Q5.13 — Convert React code given as a string into HTML** following design patterns | intern `[VERIFIED]`

---

# PART 6 — Fundamentals They Actually Asked

## 6.1 SQL (the most common failure point)

- `[VERIFIED]` OA: one SQL query with **subquery + join + filtering + ordering**
- `[VERIFIED]` "generic LeetCode-style SQL questions" in the tech round
- `[VERIFIED]` Two easy queries at intern level
- `[VERIFIED]` Schema design + ER diagram, then query your own schema
- `[VERIFIED]` SQL vs NoSQL — when and why
- Interview Query bank lists: 2nd highest salary, top 3 salaries, largest salary by department, monthly customer report, rolling bank transactions, subscription overlap, top 3 users, customer orders, comments histogram
  **Expect:** window functions (`RANK`, `ROW_NUMBER`, `LAG`), self-joins, `HAVING`. Multiple candidates specifically said **"I couldn't solve the SQL"**.

## 6.2 Networking / OS / DBMS

- `[VERIFIED]` **What happens when you type google.com and press Enter?**
- `[VERIFIED]` **Types of caching and their trade-offs** (browser, CDN, app, DB, CPU)
- `[VERIFIED]` **What happens when a server can't resolve the IP locally?** (recursive DNS)
- `[VERIFIED]` OS concepts, DBMS, computer networks — campus and SWE-1 both
- `[VERIFIED]` Recurrence relation → time complexity (Master theorem)

## 6.3 OOP / Language internals

- `[VERIFIED]` **Inheritance vs polymorphism** (intern)
- `[VERIFIED]` Interface vs abstract class
- `[VERIFIED]` **How do Java ArrayList and Set work internally? How does a Set detect duplicates?** — asked even in non-Java roles, and the candidate found it irrelevant. Skim it anyway.
- `[VERIFIED]` **React vs JavaScript — compare the two** (intern)
- `[VERIFIED]` Python array vs JavaScript array

## 6.4 JavaScript (frontend + fullstack loops)

- Closures, event loop vs call stack, promises under the hood, async/await vs promises `[VENDOR + pattern-confirmed]`
- `[VERIFIED]` 30-minute pure JS knowledge segment after a 20-minute DSA question
- `[VERIFIED]` Feedback theme: they reject on **weak edge-case handling in JS**

## 6.5 Production / operations questions

- `[VERIFIED]` **How would you monitor an application?**
- `[VERIFIED]` **How do you handle exceptions?**
- `[VERIFIED]` **How would you handle application issues in production?**
  **Expect:** metrics/logs/traces, alert thresholds, structured error types, retries vs fail-fast, runbooks. Interview Query flagged this as a recurring GoDaddy theme — they want engineers who connect code to operational reality.

---

# PART 7 — Behavioural / HM / Bar Raiser

## 7.1 Exact questions on record

- `[VERIFIED]` **Do you have any lead experience?** — asked in the _final_ round, Pune Mar 2025. Candidate cleared all rounds and was rejected on this alone.
- `[VERIFIED]` Background, past experience, team culture and collaboration, challenges faced in previous roles (HM round, Pune SDE2 offer)
- `[VERIFIED]` **Show / write the block of code from your project you are most proud of**
- `[VERIFIED]` **What are your expectations from the company?**
- `[VERIFIED]` Work-experience-related questions, past mistakes, biggest accomplishment and how you tackled it
- `[VERIFIED]` "What did you do" not "what would you do" — an interviewer stressed this (Senior AZ 2025)
- `[VENDOR]` Tell me about a time you worked in a team with conflicting opinions on implementation
- `[VENDOR]` Describe a situation where you had to quickly learn a new technology
- `[VENDOR]` How do you handle incomplete or ambiguous requirements?

## 7.2 Bar raiser

- India Principal: **bar raiser = an API design question** `[VERIFIED]`
- India EM: bar raiser = tech deep dive + system design + people management `[VERIFIED]`
- US: "Tech Core" round; expect to code in nearly every round `[VERIFIED]`

## 7.3 Your story list (write one page each)

1. Lead experience — you drove a design, unblocked others, owned an outcome
2. Production incident you owned
3. Architecture disagreement
4. Cross-team dependency
5. Legacy migration / monolith → microservices
6. Mentoring someone
7. Decision with incomplete data
8. Something that failed
9. Biggest accomplishment
10. Why GoDaddy + what you expect from them
11. The code you're proud of — pick the actual file, be ready to screen-share

---

# PART 8 — Team Splits

| Team                                  | What they ask                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Domains & Commerce**                | Domain search HLD, LRU, Java/Kotlin + K8s + Kafka + MySQL/Redis                             |
| **Commerce / Payments (incl. Poynt)** | Microservices, payment gateway, transaction event bus. Poynt: four 1-hour rounds            |
| **Experimentation Platform**          | React table + pagination, min stack, todo list, behavioural                                 |
| **Cloud Platform**                    | JD = Java microservices + AWS + REST API design. One report said it felt like a DevOps role |
| **Frontend**                          | React challenge first, then nested checkbox / color swatch / subsets                        |
| **Data Engineer II (Pune)**           | Pipelines, SQL, data modeling, warehouse vs lake, clickstream design                        |
| **GoDaddy Studio**                    | Rejected a candidate for lacking **Golang**                                                 |

---

# PART 9 — Why People Get Rejected

1. **"Looking for someone with prior lead experience"** — told only at the very end, Pune Mar 2025
2. **"Your resume lacked cloud-based projects"** — said directly to a candidate
3. **Stack mismatch surfaced late** — no Golang, no React
4. **SQL** — repeatedly the weakest section
5. **Weak JS edge-case handling**
6. **Downgrade trap** — cleared all rounds, told "not up to the SDE3 bar, we'll hire you as SDE2" at a much lower comp
7. **Generic rejection with no feedback** — very common; don't wait on them

---

# PART 10 — Two-Week Plan

**Week 1 — code**

- Day 1: Q2.1.1, Q2.1.2, Q2.1.4 (permutations, subsequence count, phone letters)
- Day 2: Q2.1.5–Q2.1.10 (strings)
- Day 3: Q2.2.1 intervals + **Q2.5.1 version sort** (the repeat question)
- Day 4: Q2.3.x matrix + Q2.4.x heap
- Day 5: Q2.6.x linked list, binary search, graph
- Day 6: Q2.7.x arrays/hashing + Q2.8 OA patterns
- Day 7: **All of Part 3 (LLD).** Stack, HashMap, LRU in JS, Queue-from-stacks, and **Q3.9 inventory service**

**Week 2 — design, React, stories**

- Day 8: Q4.1 transaction event bus — write the full design with numbers
- Day 9: Q4.2–Q4.7 + rehearse Q4.6 ("scale your project") with your own work
- Day 10: **Q5.1 + Q5.2 timed at 45 min each**, including all three follow-ups
- Day 11: Q5.3–Q5.13 React and API drills
- Day 12: Part 6 — SQL window functions, DNS, caching, JS internals, monitoring
- Day 13: Part 7 — write all 11 stories, especially #1
- Day 14: Full mock loop back-to-back: 1 DSA → 1 LLD → 1 HLD → 3 stories

---

# PART 11 — Verification Verdict on the Pasted List

I checked all ~25 items. Result: **6 have a thin trace, 19 have none.**

## 11.1 Partly traceable — name only `[WEAK]`

These six titles **do appear** on Interview Query's GoDaddy question page:
Scrambled Tickets · Prime to N · Weighted Keys · Subscription Overlap · Rolling Bank Transactions · First Touch Attribution

**Three problems with using them as written:**

1. **The problem statements were embellished.** Interview Query's actual "Subscription Overlap" is: _given a table of subscriptions with start and end dates, return whether each user had overlapping subscriptions._ The pasted version adds `plan_tier` and "more than 7 days" — invented detail.
2. **That page pools every GoDaddy role.** The same list contains _Bagging vs Boosting_, _P-value to a Layman_, _Production Model Monitoring_, _Google Maps Improvement_. Those are Data Scientist and PM questions. So the SQL items most likely came from **Data Analyst / Data Scientist** loops, not the SWE loop you're in.
3. Interview Query's SWE guide is built on **2 candidate reports**.

**Verdict:** fine as practice. Do not plan around them.

## 11.2 No source found `[UNVERIFIED]`

Three Sum "asked in early India screening rounds" · Rotated Sorted Array Search · Sequence Products by Neighbor Price · Nested Comment Thread · Autocomplete/Typeahead with debounce · Multi-Step Form Wizard (domain checkout) · Node.js rate-limiting middleware · LLD Rate Limiter Library · **LLD Parking Lot "(Reported in India LLD loops)"** · **HLD Webhook Dispatcher "(Commerce/Poynt Loop)"** · HLD DNS Record Propagation · 502 vs 504 troubleshooting · Secure S3 Ingestion with EventBridge/Lambda · Zero-Downtime DB Migration

**The tell:** the confident parentheticals. I searched GoDaddy + parking lot and GoDaddy + Poynt directly. The Poynt thread says only _"I was told there will be four 1-hour interviews"_ — no questions at all. So "(Commerce/Poynt Loop)" is attribution with nothing behind it. Same for "(Reported in India LLD loops)".

## 11.3 Which ones are still worth your time

Not because GoDaddy asked them — because they overlap with things GoDaddy **did** ask:

- **Rate limiter (token bucket / sliding window)** → directly serves Q5.2's "what if the API had strict rate limits?" ✅ do it
- **Webhook dispatcher with retries, jitter, circuit breaker, DLQ** → this is essentially Q4.1, the transaction event bus ✅ do it
- **Autocomplete with debounce + AbortController + cache** → directly serves Q5.1's movie search ✅ do it
- **Zero-downtime migration (dual write, backfill, verify, cutover)** → good answer material for Q4.6 "scale your project" ✅ worth one hour
- **Parking lot LLD** → generic warm-up, but **Q3.9 inventory service** is the one actually reported. Do Q3.9 first.
- **DNS propagation HLD** → your Q6.2 fundamentals already cover the DNS question they really asked. Skip the full design.
- **502/504, S3/EventBridge pipeline** → skip unless the recruiter says Cloud Platform.

## 11.4 What this search _did_ find (new, real)

From a Blind thread, **Sr Developer, 9 YOE, GoDaddy Ecommerce team**:

- Round 1: talk with manager · Round 2: behavioural · Round 3: **HackerRank API problem, 12 test cases — consume a JSON and make queries** · Round 4: **pair programming — design an LRU with generics**

From a Blind Senior SDE codepair thread:

- _"3 of 4 rounds were coding, LeetCode easy and medium, but you must pass the test cases in HackerRank."_
- _"String processing, brute force, binary search for me."_
- _"One round was diving deep into resume and past experience plus some RESTful API questions."_

Both are now folded in above as **Q3.3b** and **Q5.11b**.

---

# PART 12 — Sources Used

LeetCode Discuss (SDE2 2020, SDE2 Feb 2022, SDE2 Pune Mar 2025, SWE-1 2025) · Glassdoor (SWE, Senior SWE, SDE, SDE Intern, India + US pages) · GeeksforGeeks (on-campus SDE-I intern Sept 2025, SDE intern Nov 2025) · Taro (230 GoDaddy experiences; Pune Sept 2025, Pune Jan 2025, Gurgaon Feb 2025, Romania Aug 2025) · Blind (India Principal, Poynt, Cloud Platform, Experimentation, Pune SDE2 offer thread) · Interview Query (2 verified reports + GoDaddy question bank) · interviewexperiences.in · enginebogie #280 · FrontendLead · Fishbowl · CodingKaro · LockedIn AI `[VENDOR]`

**Coverage honesty:** dense for 2020–2026, thin for 2016–2019, **nothing for 2012–2015**. Vendor-only items are marked `[VENDOR]` — use them as practice, not as evidence.
