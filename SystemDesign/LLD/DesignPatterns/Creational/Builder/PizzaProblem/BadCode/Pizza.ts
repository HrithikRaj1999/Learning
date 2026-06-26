// ❌ NO BUILDER — telescoping constructor. Huge positional param list, booleans
// you can't read at call site, many invalid combinations possible.

export class Pizza {
  constructor(
    public size: string,
    public cheese: boolean,
    public pepperoni: boolean,
    public mushrooms: boolean,
    public olives: boolean,
    public extraSauce: boolean,
    public stuffedCrust: boolean,
    public glutenFree: boolean,
  ) {}
}

// What do these booleans mean? Unreadable, error-prone, easy to swap two flags.
const p = new Pizza("large", true, false, true, false, true, false, true);
// Also: no validation -> e.g. stuffedCrust + glutenFree may be illegal but allowed.
