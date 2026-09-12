# DSA Index — PrepareList Part 2

Every file: `node DSA/<file>.js` runs and prints the expected answers.
Same layout in each one — INTUITION (short bullets) → VISUAL EXAMPLE
(traced by hand) → brute → better → optimal → QUICK CHECK →
SAY OUT LOUD (complexity, traps, follow-ups).

## 2.1 Strings, DP & Backtracking

| Q | Question | File |
|---|----------|------|
| 2.1.1 | Permutations with duplicates (LC 46/47) | [permutations_with_duplicates.js](permutations_with_duplicates.js) |
| 2.1.2 | Count s2 as a subsequence of s1 (LC 115) | [distinct_subsequences.js](distinct_subsequences.js) |
| 2.1.4 | Letter combinations of a phone number (LC 17) | [letter_combination_phone_number.js](letter_combination_phone_number.js) |
| 2.1.5 | String compression (LC 443) | [string_compression.js](string_compression.js) |
| 2.1.6 | Palindrome number (LC 9) | [check_palindrome_number.js](check_palindrome_number.js) |
| 2.1.7 | Reverse string / reverse only alphanumeric | [reverse_string_alphanumeric.js](reverse_string_alphanumeric.js) |
| 2.1.8 | Valid parentheses (LC 20) | [valid_parentheses.js](valid_parentheses.js) |
| 2.1.9 | Subsets / power set (LC 78, +90) | [subset_of_array.js](subset_of_array.js) |
| 2.1.10 | First non-repeating character (LC 387) | [first_unique_character.js](first_unique_character.js) |
| — | Longest common subsequence (LC 1143) | [Longest_commom_Subsquence.js](Longest_commom_Subsquence.js) |

## 2.2 Intervals

| Q | Question | File |
|---|----------|------|
| 2.2.1 | Merge intervals (LC 56) + insert interval (LC 57) | [merge_intervals.js](merge_intervals.js) |

## 2.3 Matrix

| Q | Question | File |
|---|----------|------|
| 2.3.1 | Print a matrix in zig-zag (row snake + diagonal LC 498) | [matrix_zigzag_print.js](matrix_zigzag_print.js) |
| 2.3.2 | Set matrix rows and columns (LC 73 variant, O(1) space) | [set_matrix_rows_cols.js](set_matrix_rows_cols.js) |
| 2.3.3 | Zig-zag merge of two sorted arrays | [zigzag_merge_sorted_arrays.js](zigzag_merge_sorted_arrays.js) |

## 2.4 Heap / Priority Queue

| Q | Question | File |
|---|----------|------|
| 2.4.1 | Kth largest (LC 215) + top k frequent (LC 347), hand-written heap | [top_k_heap.js](top_k_heap.js) |
| 2.4.2 | Merge sorted lists (LC 21 / LC 23) | [merge_sorted_lists.js](merge_sorted_lists.js) |

## 2.5 Sorting / Custom comparator

| Q | Question | File |
|---|----------|------|
| 2.5.1 | **Sort version-number strings** (asked twice — highest value) | [sort_version_numbers.js](sort_version_numbers.js) |

## 2.6 Linked List / Binary Search / Graph

| Q | Question | File |
|---|----------|------|
| 2.6.1 / 2.6.2 | Reverse a linked list (LC 206, +LC 92) | [reverse_linked_list.js](reverse_linked_list.js) |
| 2.6.3 | Search: linear → hashing → binary (+ rotated LC 33) | [search_progression.js](search_progression.js) |
| 2.6.4 / 2.6.5 | BFS on a graph and a grid (islands, rotting oranges) | [bfs_graph_and_grid.js](bfs_graph_and_grid.js) |
| 2.6.6 | Arranging coins (LC 441) | [arranging_coins.js](arranging_coins.js) |

## 2.7 Arrays / Hashing / Misc

| Q | Question | File |
|---|----------|------|
| 2.7.1 | Find duplicates — brute → hash → O(1) marking → Floyd | [find_duplicates.js](find_duplicates.js) |
| 2.7.2 | Common elements in two lists (LC 349 / 350) | [common_elements_two_lists.js](common_elements_two_lists.js) |
| 2.7.3 | Count votes — hashmap, aggregate, sort by count | [count_votes.js](count_votes.js) |
| 2.7.4 | Recursion over nested data (flatten array + object) | [flatten_nested.js](flatten_nested.js) |
| 2.7.6 | Missing number (LC 268) | [missing_number.js](missing_number.js) |
| 2.7.6 | Minimum change / coin change (LC 322 + LC 518) | [coin_change.js](coin_change.js) |
| 2.7.6 | String shift | [string_shift.js](string_shift.js) |

## 2.8 OA-only patterns

| Pattern | File |
|---------|------|
| Greedy on a binary string (LC 926, 1151, 1758, 1422) | [greedy_binary_string.js](greedy_binary_string.js) |
| Line sweep / prefix sum (LC 560, 1094, meeting rooms 2) | [prefix_sum_line_sweep.js](prefix_sum_line_sweep.js) |
| DP + sieve of Eratosthenes (LC 204, smallest prime factor) | [sieve_and_dp.js](sieve_and_dp.js) |
| Recurrence relations + master theorem (DAA) | [master_theorem.js](master_theorem.js) |

## 2.9 Trie / Prefix

| Q | Question | File |
|---|----------|------|
| 2.9.1 | Trie autocomplete for domain names (LC 208 / 1268) | [AutoComplete.js](AutoComplete.js) |

## Not covered here (different part of the list)

- **Q2.1.3** — the OA pair is "a string DP + an array greedy", i.e. the
  patterns in 2.1.2 and 2.8, not a separate question.
- **Q2.7.5** — Python vs JavaScript array internals is a theory answer,
  belongs with Part 6.3.
- **Part 3 (LLD)** — stack, hashmap, LRU, queue-from-stacks, min stack,
  inventory service. Those live in `LLD_BUILD_FROM_SCRATCH/`.
