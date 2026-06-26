// ❌ BAD NAMING — cryptic names, abbreviations, magic numbers, lies.
export function calc(d: any[], t: number): any[] {
  const r = []; // what is r?
  for (let i = 0; i < d.length; i++) {
    const x = d[i];
    if (x.s > t) {          // s? t?
      if (x.f === 1) {      // 1 = ? magic
        r.push(x);
      }
    }
  }
  return r;
}
// "flag", "data2", "tmp", "manager", "helper", "process()" — all meaningless.
const flag = true;
let data2 = [{ s: 90, f: 1 }, { s: 40, f: 1 }];
console.log(calc(data2, 50));
