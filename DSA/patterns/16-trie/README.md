# 16. Trie (Prefix Tree)

Tree of characters. O(L) insert/search by word length, independent of dictionary size. The tool for prefix queries and word-grid search.

## Ladder

1. [Basics](01-basics.md) — insert / search / startsWith
2. [Prefix applications](02-prefix-apps.md) — autocomplete, replace, XOR trie
3. [Backtracking & design](03-backtracking-design.md) — word search II, file system
4. [String hard](04-string-hard.md) — concatenated words, palindrome pairs

## Node shape

```text
TrieNode { children: Map<char, TrieNode>; isWord: boolean }
```

## Cue

"Prefix", "autocomplete", "search words with wildcards", "many words vs a grid", "max XOR pair" → Trie.
