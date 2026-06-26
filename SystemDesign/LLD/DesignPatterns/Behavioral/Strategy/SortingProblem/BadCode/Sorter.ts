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
