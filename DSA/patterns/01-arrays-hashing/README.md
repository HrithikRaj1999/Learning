# 01. Arrays & Hashing

Base layer. HashMap/Set give O(1) lookup — the foundation for almost every later pattern.

## Ladder

1. [HashMap & Set basics](01-hashmap-set-basics.md) — O(1) lookup, dedupe, frequency
2. [Frequency & grouping](02-frequency-grouping.md) — bucket sort, hash-key grouping
3. [Prefix & mapping tricks](03-prefix-and-mapping.md) — prefix products, index marking, bijection maps
4. [Design & hard](04-design-and-hard.md) — O(1) structures, index-as-hash

## Core idea

Trade space for time. If you see "seen before?", "count of", "pair that sums", "group by" → reach for a `Map`/`Set`.
