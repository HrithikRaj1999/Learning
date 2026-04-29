# Final DSA-Only Question Bank  
## 20 Most Important Questions in Each Section  
### For Fortune 500 / Product-Based Coding Interviews  
### Target: 5 Years Experience | Web Developer Background | 4 Months | 1 Hour/Day

---

## Important Note

No company publishes an official universal list of “most asked Fortune 500 DSA questions.”

This list is built from high-frequency public interview-preparation patterns used across large tech/product companies and coding interview roadmaps.

The goal is not to solve every question immediately.

The goal is:

```text
Master the P0 questions first.
Then move to P1.
Keep P2 only for revision or extra time.
```

---

## Priority Meaning

| Priority | Meaning | Action |
|---|---|---|
| P0 | Highest ROI / must-solve | Do first |
| P1 | Important / common | Do after P0 |
| P2 | Lower ROI / advanced | Optional |

---

## Recommended Study Order

1. Arrays & Hashing
2. Strings
3. Two Pointers
4. Sliding Window
5. Prefix Sum & Kadane
6. Binary Search
7. Stack & Queue
8. Linked List
9. Trees & BST
10. Heap / Priority Queue
11. Graphs & Matrix BFS/DFS
12. Intervals
13. Backtracking
14. Dynamic Programming
15. Greedy
16. Trie
17. Bit Manipulation

---

# 1. Arrays & Hashing
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Two Sum | HashMap lookup | P0 |
| 2 | Contains Duplicate | Set duplicate detection | P0 |
| 3 | Valid Anagram | Frequency map | P0 |
| 4 | Group Anagrams | Hash key grouping | P0 |
| 5 | Top K Frequent Elements | Frequency + heap/bucket | P0 |
| 6 | Product of Array Except Self | Prefix/suffix | P0 |
| 7 | Longest Consecutive Sequence | Set sequence expansion | P0 |
| 8 | Encode and Decode Strings | String design/parsing | P0 |
| 9 | Subarray Sum Equals K | Prefix sum + HashMap | P0 |
| 10 | Majority Element | Counting / Boyer-Moore | P1 |
| 11 | Intersection of Two Arrays | Set operations | P1 |
| 12 | Intersection of Two Arrays II | Frequency map | P1 |
| 13 | Find All Numbers Disappeared in an Array | Index marking | P1 |
| 14 | First Missing Positive | Index placement | P1 |
| 15 | Sort Characters By Frequency | Frequency sorting | P1 |
| 16 | Ransom Note | Frequency map | P1 |
| 17 | Isomorphic Strings | Two-way mapping | P1 |
| 18 | Word Pattern | HashMap mapping | P1 |
| 19 | Design HashMap | Hash table design | P2 |
| 20 | Insert Delete GetRandom O(1) | HashMap + array | P0 |

# 2. Strings
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Valid Palindrome | Two pointers | P0 |
| 2 | Longest Common Prefix | String scanning | P1 |
| 3 | Reverse Words in a String | String manipulation | P1 |
| 4 | String to Integer Atoi | Parsing edge cases | P1 |
| 5 | Implement strStr / Find Index of First Occurrence | Substring search | P1 |
| 6 | Longest Palindromic Substring | Expand around center | P0 |
| 7 | Palindromic Substrings | Expand around center | P1 |
| 8 | Valid Parenthesis String | Greedy/string | P1 |
| 9 | Minimum Remove to Make Valid Parentheses | Stack/string cleanup | P1 |
| 10 | Decode String | Stack/string parsing | P0 |
| 11 | Basic Calculator | Stack/parsing | P1 |
| 12 | Basic Calculator II | Stack/parsing | P1 |
| 13 | Compare Version Numbers | String split/two pointers | P1 |
| 14 | Multiply Strings | Simulation | P1 |
| 15 | Zigzag Conversion | Simulation | P2 |
| 16 | Roman to Integer | Map parsing | P1 |
| 17 | Integer to Roman | Greedy mapping | P2 |
| 18 | Add Binary | String addition | P1 |
| 19 | Simplify Path | Stack/string | P1 |
| 20 | Text Justification | Simulation | P2 |

# 3. Two Pointers
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Two Sum II - Input Array Is Sorted | Opposite pointers | P0 |
| 2 | 3Sum | Sort + two pointers | P0 |
| 3 | 4Sum | Sort + two pointers | P1 |
| 4 | Container With Most Water | Opposite pointers | P0 |
| 5 | Trapping Rain Water | Two pointers | P0 |
| 6 | Move Zeroes | Slow/fast pointer | P0 |
| 7 | Remove Duplicates from Sorted Array | Slow/fast pointer | P0 |
| 8 | Remove Element | Slow pointer | P1 |
| 9 | Sort Colors | Dutch National Flag | P0 |
| 10 | Squares of a Sorted Array | Two pointers | P1 |
| 11 | Backspace String Compare | Reverse pointers/stack | P1 |
| 12 | Merge Sorted Array | Reverse merge | P1 |
| 13 | Valid Palindrome II | Two pointers with skip | P1 |
| 14 | Partition Labels | Greedy + last index | P1 |
| 15 | Boats to Save People | Greedy two pointers | P1 |
| 16 | Linked List Cycle | Slow/fast pointer | P0 |
| 17 | Middle of the Linked List | Slow/fast pointer | P1 |
| 18 | Palindrome Linked List | Slow/fast + reverse | P1 |
| 19 | Remove Nth Node From End | Gap pointer | P0 |
| 20 | Find the Duplicate Number | Floyd cycle | P1 |

# 4. Sliding Window
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Best Time to Buy and Sell Stock | Running min/window | P0 |
| 2 | Longest Substring Without Repeating Characters | Dynamic window + set | P0 |
| 3 | Longest Repeating Character Replacement | Dynamic window + frequency | P0 |
| 4 | Permutation in String | Fixed window + frequency | P0 |
| 5 | Minimum Window Substring | Dynamic window + map | P0 |
| 6 | Sliding Window Maximum | Deque | P0 |
| 7 | Find All Anagrams in a String | Fixed window + frequency | P0 |
| 8 | Maximum Average Subarray I | Fixed window | P1 |
| 9 | Minimum Size Subarray Sum | Dynamic window | P1 |
| 10 | Fruit Into Baskets | At most K types | P1 |
| 11 | Longest Substring with At Most K Distinct Characters | Dynamic window | P1 |
| 12 | Max Consecutive Ones III | Dynamic window | P1 |
| 13 | Subarrays with K Different Integers | At most K technique | P1 |
| 14 | Count Number of Nice Subarrays | Prefix/window | P1 |
| 15 | Frequency of the Most Frequent Element | Sort + window | P1 |
| 16 | Minimum Number of Flips to Make Binary String Alternating | Sliding window | P2 |
| 17 | Grumpy Bookstore Owner | Fixed window gain | P1 |
| 18 | Repeated DNA Sequences | Rolling window/hash | P1 |
| 19 | Minimum Window Subsequence | Window/DP | P2 |
| 20 | Longest Turbulent Subarray | Window state | P2 |

# 5. Prefix Sum & Kadane
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Range Sum Query Immutable | Prefix sum | P0 |
| 2 | Subarray Sum Equals K | Prefix + HashMap | P0 |
| 3 | Maximum Subarray | Kadane | P0 |
| 4 | Product of Array Except Self | Prefix/suffix product | P0 |
| 5 | Find Pivot Index | Prefix/suffix sum | P0 |
| 6 | Continuous Subarray Sum | Prefix modulo | P1 |
| 7 | Subarray Sums Divisible by K | Prefix modulo count | P1 |
| 8 | Maximum Product Subarray | Prefix-style DP | P1 |
| 9 | Minimum Size Subarray Sum | Prefix/window | P1 |
| 10 | Corporate Flight Bookings | Difference array | P1 |
| 11 | Car Pooling | Difference array | P1 |
| 12 | Range Addition | Difference array | P1 |
| 13 | Number of Sub-arrays of Size K and Average Greater than Threshold | Fixed window prefix | P1 |
| 14 | Matrix Block Sum | 2D prefix | P1 |
| 15 | Range Sum Query 2D Immutable | 2D prefix | P1 |
| 16 | Count Vowels Permutation | DP prefix-like | P2 |
| 17 | Maximum Sum Circular Subarray | Kadane variant | P1 |
| 18 | Contiguous Array | Prefix balance + HashMap | P1 |
| 19 | Binary Subarrays With Sum | Prefix count/window | P1 |
| 20 | Maximum Size Subarray Sum Equals k | Prefix + HashMap | P1 |

# 6. Binary Search
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Binary Search | Classic binary search | P0 |
| 2 | Search Insert Position | Lower bound | P0 |
| 3 | Search in Rotated Sorted Array | Modified binary search | P0 |
| 4 | Find Minimum in Rotated Sorted Array | Modified binary search | P0 |
| 5 | Search a 2D Matrix | Binary search matrix | P0 |
| 6 | Koko Eating Bananas | Binary search answer | P0 |
| 7 | Find Peak Element | Binary decision | P0 |
| 8 | Median of Two Sorted Arrays | Partition binary search | P1 |
| 9 | Search in Rotated Sorted Array II | Duplicates variant | P1 |
| 10 | Find First and Last Position of Element in Sorted Array | Lower/upper bound | P1 |
| 11 | Sqrt(x) | Binary search answer | P1 |
| 12 | Capacity To Ship Packages Within D Days | Binary search answer | P1 |
| 13 | Split Array Largest Sum | Binary search answer | P1 |
| 14 | Minimize Maximum Distance to Gas Station | Binary search answer | P2 |
| 15 | Time Based Key-Value Store | HashMap + binary search | P0 |
| 16 | Find K Closest Elements | Binary search + window | P1 |
| 17 | Find Smallest Letter Greater Than Target | Binary search | P1 |
| 18 | Peak Index in a Mountain Array | Binary decision | P1 |
| 19 | Single Element in a Sorted Array | Parity binary search | P1 |
| 20 | Find Minimum in Rotated Sorted Array II | Duplicates variant | P2 |

# 7. Stack & Queue
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Valid Parentheses | Stack | P0 |
| 2 | Min Stack | Stack design | P0 |
| 3 | Evaluate Reverse Polish Notation | Stack evaluation | P0 |
| 4 | Generate Parentheses | Stack/backtracking | P0 |
| 5 | Daily Temperatures | Monotonic stack | P0 |
| 6 | Car Fleet | Stack after sorting | P0 |
| 7 | Largest Rectangle in Histogram | Monotonic stack | P0 |
| 8 | Decode String | Stack parsing | P0 |
| 9 | Simplify Path | Stack | P1 |
| 10 | Remove All Adjacent Duplicates in String | Stack | P1 |
| 11 | Asteroid Collision | Stack simulation | P1 |
| 12 | Online Stock Span | Monotonic stack | P1 |
| 13 | Next Greater Element I | Monotonic stack | P1 |
| 14 | Next Greater Element II | Circular monotonic stack | P1 |
| 15 | 132 Pattern | Monotonic stack | P2 |
| 16 | Implement Queue using Stacks | Stack design | P1 |
| 17 | Implement Stack using Queues | Queue design | P1 |
| 18 | Design Circular Queue | Queue design | P1 |
| 19 | Moving Average from Data Stream | Queue | P1 |
| 20 | First Unique Character in a Stream | Queue + map | P2 |

# 8. Linked List
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Reverse Linked List | Pointer reversal | P0 |
| 2 | Merge Two Sorted Lists | Merge pointers | P0 |
| 3 | Linked List Cycle | Slow/fast pointer | P0 |
| 4 | Reorder List | Middle + reverse + merge | P0 |
| 5 | Remove Nth Node From End | Two pointers | P0 |
| 6 | Copy List with Random Pointer | HashMap/deep copy | P0 |
| 7 | Add Two Numbers | Simulation | P0 |
| 8 | Merge K Sorted Lists | Heap/merge | P0 |
| 9 | Palindrome Linked List | Reverse second half | P1 |
| 10 | Intersection of Two Linked Lists | Pointer switching | P1 |
| 11 | Middle of the Linked List | Slow/fast | P1 |
| 12 | Swap Nodes in Pairs | Pointer manipulation | P1 |
| 13 | Reverse Nodes in k-Group | Advanced reversal | P1 |
| 14 | Rotate List | Length + pointer | P1 |
| 15 | Partition List | Two dummy lists | P1 |
| 16 | Sort List | Merge sort linked list | P1 |
| 17 | Remove Duplicates from Sorted List | Pointer cleanup | P1 |
| 18 | Remove Duplicates from Sorted List II | Pointer cleanup | P1 |
| 19 | Flatten a Multilevel Doubly Linked List | DFS/list | P2 |
| 20 | LRU Cache | HashMap + doubly linked list | P0 |

# 9. Trees & BST
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Maximum Depth of Binary Tree | DFS | P0 |
| 2 | Same Tree | DFS compare | P0 |
| 3 | Invert Binary Tree | DFS | P0 |
| 4 | Binary Tree Level Order Traversal | BFS | P0 |
| 5 | Validate Binary Search Tree | Bounds DFS | P0 |
| 6 | Kth Smallest Element in BST | Inorder traversal | P0 |
| 7 | Lowest Common Ancestor of BST | BST traversal | P0 |
| 8 | Construct Binary Tree from Preorder and Inorder Traversal | Recursion + map | P0 |
| 9 | Binary Tree Maximum Path Sum | DFS gain | P0 |
| 10 | Serialize and Deserialize Binary Tree | Tree encoding/design | P0 |
| 11 | Subtree of Another Tree | DFS compare | P1 |
| 12 | Diameter of Binary Tree | DFS height | P1 |
| 13 | Balanced Binary Tree | DFS height | P1 |
| 14 | Path Sum | DFS | P1 |
| 15 | Path Sum II | DFS backtracking | P1 |
| 16 | Right Side View | BFS/DFS | P1 |
| 17 | Count Good Nodes in Binary Tree | DFS with max | P1 |
| 18 | Lowest Common Ancestor of Binary Tree | Recursive DFS | P1 |
| 19 | Populating Next Right Pointers in Each Node | BFS/pointer | P1 |
| 20 | Recover Binary Search Tree | Inorder anomaly | P2 |

# 10. Heap / Priority Queue
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Kth Largest Element in an Array | Heap/quickselect | P0 |
| 2 | Top K Frequent Elements | Heap/bucket | P0 |
| 3 | Find Median from Data Stream | Two heaps | P0 |
| 4 | Merge K Sorted Lists | Min heap | P0 |
| 5 | Task Scheduler | Heap + greedy | P0 |
| 6 | K Closest Points to Origin | Heap/quickselect | P0 |
| 7 | Meeting Rooms II | Min heap | P0 |
| 8 | Last Stone Weight | Max heap | P1 |
| 9 | Kth Largest Element in a Stream | Min heap | P1 |
| 10 | Reorganize String | Max heap | P1 |
| 11 | Minimum Cost to Connect Sticks | Min heap | P1 |
| 12 | Ugly Number II | Min heap/DP | P1 |
| 13 | Find K Pairs with Smallest Sums | Min heap | P1 |
| 14 | IPO | Two heaps/greedy | P2 |
| 15 | The Skyline Problem | Heap/sweep line | P2 |
| 16 | Smallest Range Covering Elements from K Lists | Heap + window | P2 |
| 17 | Seat Reservation Manager | Min heap | P1 |
| 18 | Single-Threaded CPU | Heap scheduling | P1 |
| 19 | Process Tasks Using Servers | Two heaps | P2 |
| 20 | Design Twitter | Heap + maps | P1 |

# 11. Graphs & Matrix BFS/DFS
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Number of Islands | Grid DFS/BFS | P0 |
| 2 | Clone Graph | Graph copy + map | P0 |
| 3 | Max Area of Island | Grid DFS | P0 |
| 4 | Pacific Atlantic Water Flow | Reverse DFS/BFS | P0 |
| 5 | Rotting Oranges | Multi-source BFS | P0 |
| 6 | Course Schedule | Directed cycle | P0 |
| 7 | Course Schedule II | Topological sort | P0 |
| 8 | Graph Valid Tree | DFS/Union Find | P0 |
| 9 | Number of Connected Components in an Undirected Graph | DFS/Union Find | P0 |
| 10 | Word Ladder | BFS shortest path | P0 |
| 11 | Walls and Gates | Multi-source BFS | P1 |
| 12 | Surrounded Regions | Boundary DFS | P1 |
| 13 | Shortest Path in Binary Matrix | BFS | P1 |
| 14 | 01 Matrix | Multi-source BFS | P1 |
| 15 | Redundant Connection | Union Find | P1 |
| 16 | Accounts Merge | Union Find/DFS | P1 |
| 17 | Alien Dictionary | Topological sort | P1 |
| 18 | Network Delay Time | Dijkstra | P1 |
| 19 | Cheapest Flights Within K Stops | Graph shortest path variant | P1 |
| 20 | Reconstruct Itinerary | DFS/Euler path | P2 |

# 12. Intervals
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Merge Intervals | Sort + merge | P0 |
| 2 | Insert Interval | Linear merge | P0 |
| 3 | Non-overlapping Intervals | Greedy | P0 |
| 4 | Meeting Rooms | Sort intervals | P0 |
| 5 | Meeting Rooms II | Min heap/sweep line | P0 |
| 6 | Employee Free Time | Merge intervals | P1 |
| 7 | Minimum Number of Arrows to Burst Balloons | Greedy intervals | P1 |
| 8 | Interval List Intersections | Two pointers | P1 |
| 9 | Remove Covered Intervals | Sort + scan | P1 |
| 10 | My Calendar I | Interval conflict | P1 |
| 11 | My Calendar II | Sweep line | P2 |
| 12 | My Calendar III | Sweep line/tree map | P2 |
| 13 | Car Pooling | Difference array | P1 |
| 14 | Corporate Flight Bookings | Difference array | P1 |
| 15 | Summary Ranges | Interval construction | P1 |
| 16 | Data Stream as Disjoint Intervals | Ordered intervals | P2 |
| 17 | Partition Labels | Greedy intervals | P1 |
| 18 | Queue Reconstruction by Height | Sorting/greedy | P1 |
| 19 | Maximum Number of Events That Can Be Attended | Greedy + heap | P1 |
| 20 | Range Module | Ordered intervals | P2 |

# 13. Backtracking
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Subsets | Include/exclude | P0 |
| 2 | Permutations | Swap/used array | P0 |
| 3 | Combination Sum | Backtracking | P0 |
| 4 | Letter Combinations of a Phone Number | Backtracking | P0 |
| 5 | Word Search | Grid backtracking | P0 |
| 6 | Generate Parentheses | Backtracking | P0 |
| 7 | Combination Sum II | Backtracking with duplicates | P1 |
| 8 | Combinations | Backtracking | P1 |
| 9 | Subsets II | Duplicates handling | P1 |
| 10 | Permutations II | Duplicates handling | P1 |
| 11 | Palindrome Partitioning | Backtracking | P1 |
| 12 | N-Queens | Backtracking | P1 |
| 13 | Sudoku Solver | Constraint backtracking | P2 |
| 14 | Restore IP Addresses | Backtracking | P1 |
| 15 | Expression Add Operators | Backtracking | P2 |
| 16 | Partition to K Equal Sum Subsets | Backtracking | P1 |
| 17 | Matchsticks to Square | Backtracking | P1 |
| 18 | Beautiful Arrangement | Backtracking | P2 |
| 19 | Letter Case Permutation | Backtracking | P1 |
| 20 | Word Search II | Trie + backtracking | P1 |

# 14. Dynamic Programming
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Climbing Stairs | 1D DP | P0 |
| 2 | House Robber | Pick/skip DP | P0 |
| 3 | Coin Change | Unbounded DP | P0 |
| 4 | Longest Increasing Subsequence | Sequence DP | P0 |
| 5 | Word Break | DP + set | P0 |
| 6 | Decode Ways | 1D DP | P0 |
| 7 | Unique Paths | 2D DP | P1 |
| 8 | Longest Common Subsequence | 2D DP | P1 |
| 9 | Maximum Product Subarray | DP state | P1 |
| 10 | Partition Equal Subset Sum | 0/1 knapsack | P1 |
| 11 | Min Cost Climbing Stairs | 1D DP | P1 |
| 12 | House Robber II | Circular DP | P1 |
| 13 | Palindromic Substrings | DP/center | P1 |
| 14 | Longest Palindromic Substring | DP/center | P1 |
| 15 | Target Sum | DP/counting | P1 |
| 16 | Combination Sum IV | DP counting | P1 |
| 17 | Edit Distance | 2D DP | P2 |
| 18 | Regular Expression Matching | 2D DP | P2 |
| 19 | Burst Balloons | Interval DP | P2 |
| 20 | Best Time to Buy and Sell Stock with Cooldown | State DP | P1 |

# 15. Greedy
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Jump Game | Greedy reach | P0 |
| 2 | Jump Game II | Greedy levels | P1 |
| 3 | Gas Station | Greedy reset | P1 |
| 4 | Hand of Straights | Greedy + map | P1 |
| 5 | Partition Labels | Greedy intervals | P1 |
| 6 | Valid Parenthesis String | Greedy bounds | P1 |
| 7 | Non-overlapping Intervals | Greedy intervals | P0 |
| 8 | Minimum Number of Arrows to Burst Balloons | Greedy intervals | P1 |
| 9 | Task Scheduler | Greedy + heap | P0 |
| 10 | Queue Reconstruction by Height | Sort + greedy | P1 |
| 11 | Candy | Two-pass greedy | P2 |
| 12 | Lemonade Change | Greedy counting | P1 |
| 13 | Assign Cookies | Greedy sort | P1 |
| 14 | Boats to Save People | Greedy two pointers | P1 |
| 15 | Maximum Subarray | Kadane/greedy | P0 |
| 16 | Best Time to Buy and Sell Stock II | Greedy profit | P1 |
| 17 | Merge Triplets to Form Target Triplet | Greedy check | P1 |
| 18 | Valid Palindrome II | Greedy skip | P1 |
| 19 | Minimum Deletions to Make Character Frequencies Unique | Greedy frequency | P1 |
| 20 | Remove K Digits | Greedy stack | P1 |

# 16. Trie
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Implement Trie | Trie basics | P0 |
| 2 | Design Add and Search Words Data Structure | Trie + DFS | P1 |
| 3 | Word Search II | Trie + backtracking | P1 |
| 4 | Search Suggestions System | Trie/sorting | P1 |
| 5 | Replace Words | Trie prefix | P1 |
| 6 | Longest Word in Dictionary | Trie/sort | P1 |
| 7 | Map Sum Pairs | Trie + prefix sum | P1 |
| 8 | Prefix and Suffix Search | Trie/hash design | P2 |
| 9 | Concatenated Words | Trie/DP | P2 |
| 10 | Stream of Characters | Reverse trie | P2 |
| 11 | Palindrome Pairs | Trie/string | P2 |
| 12 | Maximum XOR of Two Numbers in an Array | Bit trie | P1 |
| 13 | Implement Magic Dictionary | Trie + DFS | P2 |
| 14 | Design File System | Trie/tree | P1 |
| 15 | Design Search Autocomplete System | Trie + heap | P1 |
| 16 | Longest Common Prefix | Trie/string | P1 |
| 17 | Word Squares | Trie + backtracking | P2 |
| 18 | Camelcase Matching | Trie/string | P2 |
| 19 | Short Encoding of Words | Trie/suffix | P2 |
| 20 | Count Prefix and Suffix Pairs | Trie/string | P2 |

# 17. Bit Manipulation
| # | Question | Pattern | Priority |
|---:|---|---|---|
| 1 | Single Number | XOR | P1 |
| 2 | Number of 1 Bits | Bit count | P1 |
| 3 | Counting Bits | DP + bits | P1 |
| 4 | Reverse Bits | Bit operations | P1 |
| 5 | Missing Number | XOR/math | P1 |
| 6 | Sum of Two Integers | Bit addition | P1 |
| 7 | Bitwise AND of Numbers Range | Common prefix | P1 |
| 8 | Power of Two | Bit trick | P1 |
| 9 | Power of Four | Bit trick | P2 |
| 10 | Single Number II | Bit counting | P2 |
| 11 | Single Number III | XOR partition | P2 |
| 12 | Subsets | Bitmask/backtracking | P1 |
| 13 | Maximum Product of Word Lengths | Bitmask | P2 |
| 14 | UTF-8 Validation | Bitmask parsing | P2 |
| 15 | Hamming Distance | XOR | P1 |
| 16 | Total Hamming Distance | Bit counting | P2 |
| 17 | Find the Difference | XOR | P1 |
| 18 | Complement of Base 10 Integer | Bitmask | P2 |
| 19 | Gray Code | Bit generation | P2 |
| 20 | Minimum Flips to Make a OR b Equal to c | Bit comparison | P2 |

---

# 18. Absolute Minimum List If Time Becomes Very Tight

If you cannot complete every section, solve these first.

| # | Question | Section |
|---:|---|---|
| 1 | Two Sum | Arrays & Hashing |
| 2 | Group Anagrams | Arrays & Hashing |
| 3 | Product of Array Except Self | Arrays & Hashing |
| 4 | Longest Consecutive Sequence | Arrays & Hashing |
| 5 | Subarray Sum Equals K | Prefix Sum |
| 6 | 3Sum | Two Pointers |
| 7 | Container With Most Water | Two Pointers |
| 8 | Longest Substring Without Repeating Characters | Sliding Window |
| 9 | Minimum Window Substring | Sliding Window |
| 10 | Search in Rotated Sorted Array | Binary Search |
| 11 | Koko Eating Bananas | Binary Search |
| 12 | Valid Parentheses | Stack |
| 13 | Daily Temperatures | Stack |
| 14 | Reverse Linked List | Linked List |
| 15 | Linked List Cycle | Linked List |
| 16 | Binary Tree Level Order Traversal | Trees |
| 17 | Validate Binary Search Tree | Trees |
| 18 | Kth Largest Element in an Array | Heap |
| 19 | Merge Intervals | Intervals |
| 20 | Number of Islands | Graphs |
| 21 | Course Schedule | Graphs |
| 22 | Climbing Stairs | DP |
| 23 | Coin Change | DP |
| 24 | Jump Game | Greedy |
| 25 | Implement Trie | Trie |

---

# 19. Daily Rule

For every problem, write this before moving forward:

```text
1. What is the brute force?
2. What is the optimized approach?
3. Which data structure is used?
4. Why this data structure?
5. Time complexity?
6. Space complexity?
7. Edge cases?
8. Dry run?
```

---

# 20. What to Skip Until This List Is Done

Skip these for now:

- Segment Tree
- Fenwick Tree
- Red-Black Tree implementation
- AVL Tree implementation
- Max Flow / Min Cut
- Heavy computational geometry
- Suffix Array
- Advanced competitive programming math
- Very hard DP before basic DP is strong

---

# 21. Final Advice

For your background as a web developer, your target is not to become a competitive programmer.

Your target is:

```text
Recognize the pattern.
Pick the correct data structure.
Write clean TypeScript.
Explain time and space complexity.
Handle edge cases.
Dry run confidently.
```

