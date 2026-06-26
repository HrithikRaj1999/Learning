// ❌ NO TEMPLATE METHOD — Tea and Coffee duplicate the same brew skeleton; only
// two steps differ. Change the skeleton => edit both.
export class Tea {
  prepare(): string[] {
    return ["boil water", "steep the tea", "pour in cup", "add lemon"]; // 2,4 vary
  }
}
export class Coffee {
  prepare(): string[] {
    return ["boil water", "brew the coffee", "pour in cup", "add sugar and milk"]; // 2,4 vary
  }
}
console.log(new Tea().prepare());
