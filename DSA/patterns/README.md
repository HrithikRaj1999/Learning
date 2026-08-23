# DSA Interview Patterns — Learning Ladder

End-to-end prep. 17 topics, each a folder. Inside each folder, questions are **staged**: foundation → sub-pattern → core technique → hard/design. Solve top-to-bottom.

Every question is a **real, company-asked LeetCode problem** — no vague filler. Each row: `LC# | Difficulty | Question | Pattern | Companies`.

## How to study

1. Go folder by folder in the order below (prerequisite order — earlier unlocks later).
2. Inside a folder, open `README.md` first (the ladder), then work the sub-topic files in numeric order.
3. Within a file, **solve top row first**. Foundation before hard.
4. For every problem, run the **Daily Rule** (below) before writing code.

## Topic order (prerequisite chain)

| # | Topic | Why here |
|---|---|---|
| 01 | [Arrays & Hashing](01-arrays-hashing/) | Base data structures |
| 02 | [Strings](02-strings/) | Parsing + array logic |
| 03 | [Two Pointers](03-two-pointers/) | In-place scanning |
| 04 | [Sliding Window](04-sliding-window/) | Extends two pointers |
| 05 | [Prefix Sum & Kadane](05-prefix-kadane/) | Range/subarray sums |
| 06 | [Binary Search](06-binary-search/) | Search on sorted / answer space |
| 07 | [Stack & Queue](07-stack-queue/) | Monotonic + LIFO/FIFO |
| 08 | [Linked List](08-linked-list/) | Pointer manipulation |
| 09 | [Trees & BST](09-trees-bst/) | Recursion + BFS/DFS |
| 10 | [Heap / Priority Queue](10-heap/) | Top-K, streaming |
| 11 | [Graphs & Matrix](11-graphs/) | BFS/DFS/Union-Find/topo |
| 12 | [Intervals](12-intervals/) | Sort + sweep |
| 13 | [Backtracking](13-backtracking/) | Recursion + pruning |
| 14 | [Dynamic Programming](14-dynamic-programming/) | Hardest, needs all above |
| 15 | [Greedy](15-greedy/) | Optimization proofs |
| 16 | [Trie](16-trie/) | Prefix trees |
| 17 | [Bit Manipulation](17-bit-manipulation/) | Bit tricks |

## Daily Rule — answer before coding every problem

```text
1. Brute force?
2. Optimized approach?
3. Which data structure?
4. Why this data structure?
5. Time complexity?
6. Space complexity?
7. Edge cases?
8. Dry run.
```

## If time is tight — solve these 25 first

Highest-frequency, one per core pattern.

| LC# | Question | Topic |
|---|---|---|
| 1 | Two Sum | Arrays |
| 49 | Group Anagrams | Arrays |
| 238 | Product of Array Except Self | Arrays |
| 128 | Longest Consecutive Sequence | Arrays |
| 560 | Subarray Sum Equals K | Prefix |
| 15 | 3Sum | Two Pointers |
| 11 | Container With Most Water | Two Pointers |
| 3 | Longest Substring Without Repeating Chars | Sliding Window |
| 76 | Minimum Window Substring | Sliding Window |
| 33 | Search in Rotated Sorted Array | Binary Search |
| 875 | Koko Eating Bananas | Binary Search |
| 20 | Valid Parentheses | Stack |
| 739 | Daily Temperatures | Stack |
| 206 | Reverse Linked List | Linked List |
| 141 | Linked List Cycle | Linked List |
| 102 | Binary Tree Level Order Traversal | Trees |
| 98 | Validate Binary Search Tree | Trees |
| 215 | Kth Largest Element in an Array | Heap |
| 56 | Merge Intervals | Intervals |
| 200 | Number of Islands | Graphs |
| 207 | Course Schedule | Graphs |
| 70 | Climbing Stairs | DP |
| 322 | Coin Change | DP |
| 55 | Jump Game | Greedy |
| 208 | Implement Trie | Trie |

## Top 50 most-asked FAANG/Fortune-500 (2025–2026)

See [top-50-companies.md](top-50-companies.md) — cross-referenced from LeetCode company-frequency data, Grind 75, NeetCode 150, Sean Prashad patterns.

## Skip until this list is done

Segment Tree, Fenwick/BIT, Red-Black/AVL implementation, Max Flow/Min Cut, heavy computational geometry, suffix arrays, advanced competitive math, very-hard DP before basic DP is solid.

## Goal (web-dev background)

```text
Recognize the pattern.
Pick the correct data structure.
Write clean TypeScript.
Explain time and space.
Handle edge cases.
Dry run confidently.
```
