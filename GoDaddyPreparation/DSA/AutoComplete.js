/*
Trie / prefix search - autocomplete for domain names [Q2.9.1]

  registered: godaddy.com, godaddy.net, google.com, gopro.com, ...
  user types: "go"      -> godaddy.com, google.com, gopro.com
  user types: "goda"    -> godaddy.com, godaddy.net
  user types: "zzz"     -> []

Plus the GoDaddy flavour: rank the suggestions by popularity and
say which name is still AVAILABLE to buy.

THREE APPROACHES, in the order I say them in the interview:
  BRUTE  - array + startsWith        O(n * p) per keystroke
  BETTER - trie + DFS                O(p + matches)
  BEST   - trie + cached top-k       O(p), matches do not matter
*/

// ============================================================
// 1) INTUITION (the one idea everything below is built on)
// ============================================================
/*

- TRIE = a tree where the EDGES are letters and the PATH from the
  root spells the word. Words sharing a prefix share the same path,
  so "goda" is stored ONCE, not once per domain.

- Each node holds:
      children : Map<letter, node>   <- the map I search the typed letter in
      isEnd    : a word finishes exactly here
      score    : popularity, used for ranking

- Autocomplete = walk the prefix, then collect everything below.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
insert: go, godaddy, google, gopro

            (root)
              |g
             (.)
              |o
             (.)*          <- isEnd, "go" is itself a word
            /  |  \
          d    o    p
         (.)  (.)  (.)
          |a   |g   |r
          ...  ...  ...
       godaddy* google*  gopro*

query "go"   -> walk g,o  -> land on the starred node
                DFS below it -> go, godaddy, google, gopro
query "god"  -> walk g,o,d -> DFS -> godaddy
query "gz"   -> walk g, no child 'z' -> [] immediately, no scan

100k domains, prefix "go":
    filter -> touches all 100k strings              O(n * p)
    trie   -> 2 pointer hops + visits only matches  O(p + matches)
*/

// ============================================================
// 3) BRUTE FORCE - ARRAY + startsWith
// ============================================================
/*
STEPS (say it exactly like this)
  1. we will keep every domain in a plain array
  2. on each keystroke we will iterate over the WHOLE array
  3. for each domain we will check "does it start with what he typed"
  4. if yes we push it into the answer list
  5. return the list

WHY IT IS BAD
  - we touched all 100k domains even though only 3 matched
  - and we redo it on EVERY keystroke, so typing "godaddy" = 7 scans
    Time  : O(n * p)      Space : O(1) extra
  - still say it first: it is correct, and it is the baseline I improve
*/
function autocompleteBruteForce(domains, prefix) {
  const result = [];

  for (const domain of domains) {
    // startsWith itself is a p-character comparison
    if (domain.startsWith(prefix)) result.push(domain);
  }

  return result;
}

// ============================================================
// 4) BETTER - TRIE + DFS
// ============================================================
/*
WHAT ONE NODE ACTUALLY IS
    node = {
      children : Map { 'o' -> node, 'p' -> node },  // where I can go next
      isEnd    : false,                             // no word stops here
      score    : 0
    }
  The letter is NOT stored inside the node. The letter is the KEY that
  POINTS to the node. So "where do I go after g" = one map lookup, O(1).
  That is the only reason a map is there.

--- BUILD ---------------------------------------------------

INSERT "go" (score 30). Start at root, root.children is empty.
    'g' : root.children.has('g')? NO  -> make node A, root.children = {g:A}
                                          move down, node = A
    'o' : A.children.has('o')?    NO  -> make node B, A.children = {o:B}
                                          move down, node = B
    string finished -> B.isEnd = true, B.score = 30

    root --g--> A --o--> B*

INSERT "gopro" (score 60). Start at the root AGAIN.
    'g' : root.children HAS 'g'  -> create nothing, reuse A   <-- the saving
    'o' : A.children HAS 'o'     -> create nothing, reuse B
    'p' : B.children has 'p'? NO -> make C
    'r' : make D
    'o' : make E, E.isEnd = true, E.score = 60

    root --g--> A --o--> B* --p--> C --r--> D --o--> E*

  "go" is written ONCE and both domains walk through it. n domains with
  the same prefix cost the prefix once, not n times. That is the trie.

--- QUERY, on every keystroke --------------------------------

TYPE "gop"
    node = root
    'g' -> A        'o' -> B        'p' -> C          three map lookups
    Done. I am standing on C, and I never looked at amazon.com at all.
    C means: "every word below me starts with gop".

TYPE "gz"
    'g' -> A, then A.children.has('z') is FALSE
    -> no domain can possibly start with gz -> return [] on the spot.
    The dead end is the cheap case, not the expensive one.

--- COLLECT, DFS below the landing node ----------------------

  A node does NOT know its own word (nobody stored "gopro" anywhere),
  so I carry the string down with me. The stack holds PAIRS:

    stack = [ (C, "gop") ]
    pop (C,"gop")    isEnd? no.  children {r:D} -> push (D, "gop"+"r")
    pop (D,"gopr")   isEnd? no.  children {o:E} -> push (E, "gopr"+"o")
    pop (E,"gopro")  isEnd? YES  -> collect { word:"gopro", score:60 }
    stack empty -> results = ["gopro"]

  If C had two children I would push both and the loop drains them one
  branch at a time - that is all DFS means here.
  Recursion does the exact same thing; I use an explicit stack so a very
  long domain cannot overflow the call stack.

  Last step: sort the collected words by score (popularity first,
  alphabetical to break ties) and slice the top k for the dropdown.

--- WHY IT BEATS THE BRUTE FORCE -----------------------------
  - the walk costs the PREFIX LENGTH, not the registry size:
      brute force "go" -> 100,000 startsWith calls
      trie       "go" -> 2 map lookups
  - the DFS visits ONLY matches; an unrelated domain is never touched
  - a miss ("gz") stops at the first missing letter instead of scanning

    insert / search / startsWith : O(L)          L = word length
    autocomplete                 : O(p + matches)
    space                        : O(total characters stored)
*/
class TrieNode {
  constructor() {
    this.children = new Map(); // letter -> node, this is the "search the letter" map
    this.isEnd = false;
    this.score = 0;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // step 2-4: walk down, creating nodes that do not exist yet
  insert(word, score = 0) {
    let node = this.root;

    for (const letter of word) {
      if (!node.children.has(letter)) {
        node.children.set(letter, new TrieNode()); // first time we see this path
      }
      node = node.children.get(letter); // shared prefix, just move down
    }

    node.isEnd = true;
    node.score = score;
  }

  // step 5-7: the walk, shared by search / startsWith / autocomplete
  findNode(prefix) {
    let node = this.root;

    for (const letter of prefix) {
      if (!node.children.has(letter)) return null; // dead end, stop early
      node = node.children.get(letter);
    }

    return node;
  }

  // exact match: the path exists AND a word ends there
  search(word) {
    const node = this.findNode(word);
    return node !== null && node.isEnd;
  }

  // does any word start with this prefix?
  startsWith(prefix) {
    return this.findNode(prefix) !== null;
  }

  // step 8-9: DFS from the landing node and collect the isEnd words
  autocomplete(prefix, limit = Infinity) {
    const start = this.findNode(prefix);
    if (start === null) return [];

    const results = [];

    // iterative DFS so a very deep trie cannot blow the call stack
    const stack = [[start, prefix]];

    while (stack.length > 0) {
      const [node, word] = stack.pop();

      if (node.isEnd) results.push({ word, score: node.score });

      // push reversed so we pop letters in a-z order
      const letters = [...node.children.keys()].sort().reverse();
      for (const letter of letters) {
        stack.push([node.children.get(letter), word + letter]);
      }
    }

    // most popular first, alphabetical as the tie-break
    results.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));

    return results.slice(0, limit).map((item) => item.word);
  }
}

// ============================================================
// 5) BEST FOR A SEARCH BOX - TRIE + TOP-K CACHED AT EVERY NODE
// ============================================================
/*
THE PROBLEM WITH "BETTER"
  the DFS still costs "number of matches", and prefix "a" matches half
  the registry - but the dropdown only ever shows 5 rows. I am building
  50k strings to throw away 49,995 of them.

STEPS (say it exactly like this)
  1. every node will also carry a small array: top = the k best words
     that pass through this node
  2. when we insert a domain we will walk its letters as before
  3. but at EVERY node on that path we will also push the word into
     node.top, sort by score, and cut the array back to k
  4. so the node for "go" permanently remembers its 5 best children
  5. now a query is just: walk the prefix and RETURN node.top - no DFS,
     no sorting, no collecting

THE TRADE-OFF (the line they want)
  we pay a little on WRITE so we pay nothing on READ.
  Right choice here because keystrokes hugely outnumber registrations.
    query  : O(p)       <- independent of how many domains match
    insert : O(p * k)   <- k is 5 or 10, so still tiny
    space  : O(total characters * k)
*/
class AutocompleteTrie {
  constructor(k = 5) {
    this.root = new TrieNode();
    this.root.top = [];
    this.k = k;
  }

  insert(word, score) {
    let node = this.root;
    this.pushTop(node, word, score);

    for (const letter of word) {
      if (!node.children.has(letter)) {
        const child = new TrieNode();
        child.top = [];
        node.children.set(letter, child);
      }
      node = node.children.get(letter);
      this.pushTop(node, word, score); // every prefix on the path remembers it
    }

    node.isEnd = true;
    node.score = score;
  }

  // keep only the k best suggestions on this node
  pushTop(node, word, score) {
    node.top.push({ word, score });
    node.top.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
    if (node.top.length > this.k) node.top.pop();
  }

  // walk p letters, read the cache, done
  suggest(prefix) {
    let node = this.root;

    for (const letter of prefix) {
      if (!node.children.has(letter)) return [];
      node = node.children.get(letter);
    }

    return node.top.map((item) => item.word);
  }
}

// ============================================================
// 6) THE DOMAIN TWIST - SUGGEST WHAT IS STILL AVAILABLE
// ============================================================
/*
STEPS
  1. the trie holds every domain that is already REGISTERED
  2. the user types a bare name, "godaddy"
  3. we will stick each TLD on the end -> godaddy.com, godaddy.net, ...
  4. for each candidate we will do an EXACT search in the trie
  5. search returns false -> nobody owns it -> it is available to buy
    Time : O(len(name)) per TLD
*/
function suggestAvailable(trie, name, tlds = [".com", ".net", ".org", ".io"]) {
  const free = [];

  for (const tld of tlds) {
    const candidate = name + tld;
    if (!trie.search(candidate)) free.push(candidate);
  }

  return free;
}

// ============================================================
// QUICK CHECK
// ============================================================
const registered = [
  ["godaddy.com", 100],
  ["godaddy.net", 40],
  ["google.com", 95],
  ["gopro.com", 60],
  ["go.com", 30],
  ["amazon.com", 90],
];

const domains = registered.map(([domain]) => domain);

// BRUTE
console.log(autocompleteBruteForce(domains, "go")); // all 5 go* domains
console.log(autocompleteBruteForce(domains, "goo")); // [ 'google.com' ]

// BETTER
const trie = new Trie();
for (const [domain, score] of registered) trie.insert(domain, score);

console.log(trie.autocomplete("go")); // godaddy.com, google.com, gopro.com, godaddy.net, go.com
console.log(trie.autocomplete("goda")); // [ 'godaddy.com', 'godaddy.net' ]
console.log(trie.autocomplete("go", 2)); // [ 'godaddy.com', 'google.com' ]
console.log(trie.autocomplete("zzz")); // []
console.log(trie.search("gopro.com"), trie.search("gopro")); // true false
console.log(trie.startsWith("gopro")); // true

// BEST
const fast = new AutocompleteTrie(3);
for (const [domain, score] of registered) fast.insert(domain, score);

console.log(fast.suggest("go")); // [ 'godaddy.com', 'google.com', 'gopro.com' ]
console.log(fast.suggest("a")); // [ 'amazon.com' ]
console.log(fast.suggest("zzz")); // []

// DOMAIN TWIST
console.log(suggestAvailable(trie, "godaddy")); // [ 'godaddy.org', 'godaddy.io' ]

/*
============================================================
7) SAY OUT LOUD
============================================================
- THE LADDER IN ONE BREATH:
    array + startsWith   O(n * p) per keystroke, scans everything
    trie + DFS           O(p + matches), never touches a non-match
    trie + cached top-k  O(p), the dropdown size stops mattering
- WHY A TRIE AND NOT A HASHMAP:
    A hashmap gives exact lookup in O(1) but hashing destroys the
    prefix. A trie stores each shared prefix once, so a prefix query
    costs the prefix length plus the matches - never the registry.
- WHY A MAP INSIDE THE NODE:
    on every keystroke I have to answer "is there a child for this
    letter" in O(1). A map (or a 26-slot array for a-z) does that.
- WHY isEnd IS SEPARATE FROM children:
    "go" is both a complete word and a prefix of "google". Without
    the flag I cannot tell a real word from a passing letter.
- EDGE CASES: empty prefix (matches everything - cap the output),
  case sensitivity (lowercase on insert AND on query), unicode / IDN
  domains, duplicate inserts (overwrite the score or add - ask).
- SCALE FOLLOW-UPS:
    memory too big  -> compress single-child chains (radix / PATRICIA
                       tree), or 26-slot arrays for a fixed alphabet
    typos           -> fuzzy match with edit distance over the trie,
                       DFS while allowing 1 insert/delete/swap
    distributed     -> shard the trie by the first 1-2 letters
    ranking         -> score = search volume + short-name bonus;
                       the top-k cache is what makes it feel instant
- RELATED LC: 208 implement trie, 211 add and search word ('.' wildcard),
  212 word search II, 642 design search autocomplete,
  1268 search suggestions system.
*/
