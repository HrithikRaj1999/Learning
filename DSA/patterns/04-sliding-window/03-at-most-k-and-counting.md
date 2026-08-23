# Sliding Window — At-Most-K & Counting

Count subarrays: exactly(K) = atMost(K) − atMost(K−1).

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 992 | Hard | Subarrays with K Different Integers | atMost(K) − atMost(K−1) | Amazon, Google |
| 1248 | Medium | Count Number of Nice Subarrays | Odd count as "K", atMost trick | Amazon, Facebook |
| 1838 | Medium | Frequency of the Most Frequent Element | Sort + window on cost budget | Amazon, Google |
| 1052 | Medium | Grumpy Bookstore Owner | Fixed window extra-gain | Amazon |
| 187 | Medium | Repeated DNA Sequences | Rolling hash / set of 10-mers | Amazon, LinkedIn |
| 978 | Medium | Longest Turbulent Subarray | Window with up/down state | Google, Amazon |
| 1888 | Medium | Min Flips to Make Binary String Alternating | Doubled string + window | TikTok, Amazon |

**Key skill**: memorize the atMost decomposition — it turns "exactly K" into two easy windows.
