// =============================================================================
// WHAT IS WRONG — missing Strategy pattern
// =============================================================================
// PATTERN IDEA: each algorithm is a strategy object behind a common interface;
// the context delegates and can swap algorithms at runtime.
//
// WHAT'S WRONG HERE: Sorter.sort() switches on an algo string with each sort
// algorithm inlined in a branch. The algorithms live inside the context.
//
// REAL SCENARIO: add quicksort or a domain-specific sort, or pick the algorithm
// based on input size (insertion for small, native for large). You edit Sorter
// each time, and the inlined algorithms can't be reused, benchmarked, or tested
// independently.
//
// WHY BAD: algorithms are coupled to the context; adding one edits tested code;
// no reuse or runtime selection.
//
// HOW TO FIX (no code): define a SortStrategy interface (sort(data)) with
// BubbleSortStrategy, NativeSortStrategy, etc. Sorter receives a strategy and
// delegates; callers pick (or the context auto-selects by size). New algorithm =
// a new strategy class.
// =============================================================================
// ❌ NO STRATEGY — sort algorithm chosen by a switch inside the context; each
// algorithm inlined, not reusable or swappable at runtime.
export class Sorter {
  sort(data: number[], algo: string): number[] {
    const a = [...data];
    switch (algo) {
      case "bubble": // inlined bubble sort
        for (let i = 0; i < a.length; i++)
          for (let j = 0; j < a.length - 1; j++)
            if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
        return a;
      case "native": return a.sort((x, y) => x - y);
      default: throw new Error("unknown algo");
    }
  }
}
console.log(new Sorter().sort([3, 1, 2], "bubble"));
