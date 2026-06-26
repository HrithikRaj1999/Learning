// ❌ NO INTERPRETER — list filtering driven by a hardcoded predicate. Users can't
// build their own "price < 50 AND inStock" queries.
type Product = { name: string; price: number; inStock: boolean };
export function filter(products: Product[]): Product[] {
  // the query is baked in; any new filter requires a code change
  return products.filter((p) => p.price < 50 && p.inStock);
}
console.log(filter([{ name: "a", price: 10, inStock: true }, { name: "b", price: 99, inStock: true }]));
