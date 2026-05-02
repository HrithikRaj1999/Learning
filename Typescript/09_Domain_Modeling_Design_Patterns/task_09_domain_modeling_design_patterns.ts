/**
==============================================================================
  TASK 09: Domain Modeling & Design Patterns
==============================================================================

REAL-WORLD CONTEXT:
Most codebases start small and clean. Then they grow. Without proper modeling:
  - "Order" means different things in different files
  - Business rules are scattered across 50 controllers
  - Changing one rule breaks 12 unrelated features
  - Nobody knows which code enforces "orders can't be cancelled after shipping"

Domain-Driven Design (DDD) solves this:
  - Value Objects: Money($10.50) not { amount: 10.5, currency: "USD" }
  - Entities: Order has identity and lifecycle
  - Aggregates: Order + LineItems form one unit of consistency
  - Repositories: Save/load without knowing the database
  - Domain Events: "OrderShipped" notifies subscribers without coupling

Design Patterns give you REUSABLE solutions:
  - Strategy: swap algorithms at runtime (different shipping calculators)
  - Command: represent actions as objects (undo, queue, replay)
  - Observer: react to events without coupling (email service listens to OrderShipped)

WHY THIS MATTERS:
Without these patterns, a 6-month-old codebase becomes unmaintainable.
With them, complex business logic stays organized for years.
*/

import { todo, type ChallengeInput } from "../src/shared/challenge";

// ---------------------------------------------------------------------------
// Challenge 09.01 — Money Value Object (Never Mix Currencies)
// ---------------------------------------------------------------------------
// SCENARIO: E-commerce checkout has a bug: a user adds $10 USD item and €5 EUR item.
// Total shows "15" — but 15 WHAT? The code just added numbers without checking currency.
// Worse: floating point math: 0.1 + 0.2 = 0.30000000000000004 → penny rounding errors.
//
// WHAT'S WRONG: Money represented as plain numbers: `const total = item1.price + item2.price`.
// No currency enforcement. Floating point math loses pennies at scale.
//
// YOUR FIX: Create a Money value object:
//   - Stores amount in cents (integers only — no floating point)
//   - REFUSES to add different currencies (throws at compile time or runtime)
//   - Immutable: operations return new Money instances
//
// EXPECTED BEHAVIOR:
//   Money.usd(1050).add(Money.usd(500)) → Money.usd(1550) ($15.50)
//   Money.usd(1050).add(Money.eur(500)) → ERROR: cannot add USD and EUR
//   Money.usd(1050).multiply(3) → Money.usd(3150) ($31.50)
//   Money.usd(1050).toString() → "$10.50"
// ---------------------------------------------------------------------------
export function challenge09_01(input: ChallengeInput): unknown {
  void input;
  return todo("09.01", "Create a Money value object with currency-safe arithmetic.");
}

// ---------------------------------------------------------------------------
// Challenge 09.02 — Order Aggregate (Enforce State Transitions)
// ---------------------------------------------------------------------------
// SCENARIO: An order goes through states: Draft → Confirmed → Shipped → Delivered.
// A bug allows: Delivered → Draft (nonsensical). Another bug: Shipped → Cancelled
// (but the package is already in the mail!). Business says: "After shipping,
// cancellation requires a return process, not just a status change."
//
// WHAT'S WRONG: `order.status = "cancelled"` — anyone can set any status to anything.
// No validation of allowed transitions. Illegal state changes silently succeed.
//
// YOUR FIX: Model an Order that enforces state machine rules:
//   Draft → Confirmed → Shipped → Delivered (forward only)
//   Draft → Cancelled ✓ (can cancel before shipping)
//   Shipped → Cancelled ✗ (cannot cancel after shipping)
//
// EXPECTED BEHAVIOR:
//   order.confirm() → status changes to "confirmed" ✓
//   order.ship() → status changes to "shipped" ✓
//   order.cancel() → ERROR: "Cannot cancel a shipped order" ✗
//   order.status = "anything" → NOT ALLOWED (private, use methods)
// ---------------------------------------------------------------------------
export function challenge09_02(input: ChallengeInput): unknown {
  void input;
  return todo("09.02", "Model an Order aggregate that enforces valid status transitions.");
}

// ---------------------------------------------------------------------------
// Challenge 09.03 — Repository Pattern (Save/Load Without Database Knowledge)
// ---------------------------------------------------------------------------
// SCENARIO: Your service saves orders to PostgreSQL in production. Tests need
// to run without a database (fast, isolated). You want the SAME business logic
// code to work with both real DB and in-memory storage.
//
// WHAT'S WRONG: Business logic does `await db.query("INSERT INTO orders...")` directly.
// To test it, you need a running PostgreSQL. Tests are slow (2 min vs 2 sec).
// Can't run tests offline or in CI without Docker.
//
// YOUR FIX: Define a Repository INTERFACE (contract). Implement it twice:
//   - PostgresOrderRepo (production: real database)
//   - InMemoryOrderRepo (tests: simple array/map)
// Business logic uses the interface — doesn't know which implementation it gets.
//
// EXPECTED BEHAVIOR:
//   interface OrderRepo { save(order): Promise<void>; findById(id): Promise<Order | null>; }
//   // In tests: const repo = new InMemoryOrderRepo();
//   // In prod: const repo = new PostgresOrderRepo(dbPool);
//   // Business logic works identically with both
// ---------------------------------------------------------------------------
export function challenge09_03(input: ChallengeInput): unknown {
  void input;
  return todo("09.03", "Create a repository interface and in-memory implementation for tests.");
}

// ---------------------------------------------------------------------------
// Challenge 09.04 — Service Layer (Coordinate Dependencies)
// ---------------------------------------------------------------------------
// SCENARIO: "Create an order" involves: validate input → check stock → save order →
// send confirmation email → log audit event. These depend on: repo, emailer, logger, clock.
// If these are all global imports, the service is untestable and tightly coupled.
//
// WHAT'S WRONG: A function that imports 5 modules directly:
//   import { db } from './db'; import { sendEmail } from './email'; ...
// Can't test without mocking modules. Can't swap implementations.
//
// YOUR FIX: Service class takes dependencies as constructor params. Tests inject fakes.
//
// EXPECTED BEHAVIOR:
//   class OrderService {
//     constructor(private repo: OrderRepo, private emailer: Emailer, private clock: Clock) {}
//     async createOrder(input) { ... }
//   }
//   // Test: new OrderService(fakeRepo, fakeEmailer, fakeClock)
//   // Prod: new OrderService(pgRepo, sendgridEmailer, systemClock)
// ---------------------------------------------------------------------------
export function challenge09_04(input: ChallengeInput): unknown {
  void input;
  return todo("09.04", "Build a service layer that coordinates repository, clock, and logger dependencies.");
}

// ---------------------------------------------------------------------------
// Challenge 09.05 — Entity Factory (Never Create Invalid Entities)
// ---------------------------------------------------------------------------
// SCENARIO: A Customer entity requires: name (non-empty), email (valid format),
// and createdAt (auto-set). Developers forget to validate email, set createdAt
// to wrong timezone, or create customers with empty names.
//
// WHAT'S WRONG: `new Customer({ name: "", email: "not-an-email" })` succeeds.
// Invalid data enters the system and causes errors downstream (email delivery fails,
// reports show blank names).
//
// YOUR FIX: Factory method that validates ALL fields before creating the entity.
// Invalid data → error returned BEFORE the entity exists.
//
// EXPECTED BEHAVIOR:
//   Customer.create({ name: "Alice", email: "alice@example.com" }) → ok(Customer)
//   Customer.create({ name: "", email: "bad" }) → err(["name is empty", "invalid email"])
//   // Cannot construct invalid Customer — factory is the ONLY entry point
// ---------------------------------------------------------------------------
export function challenge09_05(input: ChallengeInput): unknown {
  void input;
  return todo("09.05", "Implement a factory for creating valid Customer entities.");
}

// ---------------------------------------------------------------------------
// Challenge 09.06 — Strategy Pattern: Swappable Shipping Calculators
// ---------------------------------------------------------------------------
// SCENARIO: Shipping cost depends on the method chosen:
//   - Standard: $5 flat
//   - Express: $15 flat
//   - Weight-based: $2 per kg
//   - Free (orders over $100)
// Adding a new method (e.g., "same-day") shouldn't require changing existing code.
//
// WHAT'S WRONG: Giant if/else chain:
//   if (method === "standard") { ... } else if (method === "express") { ... }
// Adding a new shipping method = modifying existing function (risk of breaking others).
//
// YOUR FIX: Strategy pattern — each shipping method is a separate object implementing
// a common interface. Adding a new method = adding a new class (no existing code touched).
//
// EXPECTED BEHAVIOR:
//   const calculator = getShippingStrategy("express");
//   calculator.calculate(order) → 1500 (cents)
//   // Adding "same-day": create SameDayShipping implements ShippingStrategy
//   // Register it. Done. No if/else modified.
// ---------------------------------------------------------------------------
export function challenge09_06(input: ChallengeInput): unknown {
  void input;
  return todo("09.06", "Use the strategy pattern for choosing shipping cost calculation.");
}

// ---------------------------------------------------------------------------
// Challenge 09.07 — Command Pattern: Operations with Undo
// ---------------------------------------------------------------------------
// SCENARIO: Admin dashboard lets operators: add discount, change shipping address,
// override price. Each action should be undoable (within 5 minutes) and auditable
// (who did what, when).
//
// WHAT'S WRONG: Direct mutations: `order.discount = 20`. No history. No undo.
// No audit trail. Operators make mistakes → no way to revert without DB rollback.
//
// YOUR FIX: Represent each action as a Command object with:
//   - execute(): perform the action
//   - undo(): reverse it
//   - metadata: who, when, reason
//
// EXPECTED BEHAVIOR:
//   const cmd = new ApplyDiscountCommand(order, { percent: 20, reason: "loyalty" });
//   cmd.execute(); // order.discount = 20
//   cmd.undo();    // order.discount = 0 (reverted)
//   cmd.metadata → { actor: "admin@co.com", timestamp: ..., reason: "loyalty" }
// ---------------------------------------------------------------------------
export function challenge09_07(input: ChallengeInput): unknown {
  void input;
  return todo("09.07", "Use the command pattern for checkout operations with undo metadata.");
}

// ---------------------------------------------------------------------------
// Challenge 09.08 — Observer Pattern: Domain Events
// ---------------------------------------------------------------------------
// SCENARIO: When an order ships, MANY things need to happen:
//   - Send shipping notification email
//   - Update inventory counts
//   - Trigger analytics event
//   - Notify warehouse system
// If OrderService directly calls all 4 services: it's coupled to everything.
//
// WHAT'S WRONG: OrderService imports EmailService, InventoryService, Analytics,
// WarehouseService. Adding a new reaction (e.g., SMS notification) requires
// modifying OrderService.
//
// YOUR FIX: OrderService emits a "OrderShipped" event. Subscribers listen and
// react independently. Adding SMS notification = new subscriber (no changes to OrderService).
//
// EXPECTED BEHAVIOR:
//   eventBus.emit("OrderShipped", { orderId: 123, address: "..." });
//   // EmailSubscriber: sends email (independently)
//   // InventorySubscriber: decrements stock (independently)
//   // Adding new subscriber: eventBus.on("OrderShipped", newHandler) — zero coupling
// ---------------------------------------------------------------------------
export function challenge09_08(input: ChallengeInput): unknown {
  void input;
  return todo("09.08", "Use the observer pattern for publishing domain events.");
}

// ---------------------------------------------------------------------------
// Challenge 09.09 — Dependency Injection (Explicit Wiring)
// ---------------------------------------------------------------------------
// SCENARIO: Your app has 20 services, each depending on 3-5 others. Without DI:
//   - OrderService creates its own EmailService which creates its own Logger...
//   - Changing the logger = modifying 15 files
//   - Tests can't control which dependencies get used
//
// WHAT'S WRONG: `class OrderService { private email = new EmailService(); }`
// Hard-coded dependencies. Can't swap. Can't test. Can't configure.
//
// YOUR FIX: Pass dependencies through constructors. A composition root wires
// everything together once at startup.
//
// EXPECTED BEHAVIOR:
//   // Composition root (one place):
//   const logger = new ConsoleLogger();
//   const emailer = new SendGridEmailer(apiKey);
//   const orderService = new OrderService(repo, emailer, logger);
//   // Changing logger: modify ONE line in composition root
// ---------------------------------------------------------------------------
export function challenge09_09(input: ChallengeInput): unknown {
  void input;
  return todo("09.09", "Implement dependency injection with explicit constructor dependencies.");
}

// ---------------------------------------------------------------------------
// Challenge 09.10 — Policy Object: Authorization Rules
// ---------------------------------------------------------------------------
// SCENARIO: "Can this user cancel this order?" depends on:
//   - User role (admin can cancel anything)
//   - Order status (can't cancel if shipped)
//   - Ownership (regular users can only cancel their own orders)
//   - Time limit (can only cancel within 30 minutes)
//
// WHAT'S WRONG: Authorization checks scattered in controllers:
//   if (user.role !== "admin" && order.userId !== user.id) { throw 403; }
// Duplicated across endpoints. Easy to forget a check.
//
// YOUR FIX: Encapsulate authorization in a Policy object:
//   CanCancelOrderPolicy.evaluate(user, order) → allowed | denied(reason)
//
// EXPECTED BEHAVIOR:
//   policy.evaluate(admin, shippedOrder) → allowed (admin override)
//   policy.evaluate(user, otherUsersOrder) → denied("not your order")
//   policy.evaluate(user, expiredOrder) → denied("cancellation window expired")
// ---------------------------------------------------------------------------
export function challenge09_10(input: ChallengeInput): unknown {
  void input;
  return todo("09.10", "Create a policy object for authorization checks.");
}

// ---------------------------------------------------------------------------
// Challenge 09.11 — Specification Pattern: Composable Filters
// ---------------------------------------------------------------------------
// SCENARIO: Admin dashboard needs to filter orders by multiple criteria:
//   - Orders over $100 AND shipped today AND to US addresses
//   - Orders that are pending OR have failed payments
// Hard-coding every combination = explosion of filter functions.
//
// WHAT'S WRONG: `filterOrdersOver100ShippedTodayToUS()` — one function per combo.
// 10 criteria × combinations = hundreds of functions.
//
// YOUR FIX: Specification pattern — small reusable predicates combined with AND/OR:
//   overHundred.and(shippedToday).and(toUS).isSatisfiedBy(order) → true/false
//
// EXPECTED BEHAVIOR:
//   const spec = new AmountOver(100).and(new StatusIs("shipped")).or(new FlaggedForReview());
//   orders.filter(o => spec.isSatisfiedBy(o)) → filtered list
// ---------------------------------------------------------------------------
export function challenge09_11(input: ChallengeInput): unknown {
  void input;
  return todo("09.11", "Create a specification pattern for filtering orders.");
}

// ---------------------------------------------------------------------------
// Challenge 09.12 — Unit of Work: Atomic Multi-Repository Saves
// ---------------------------------------------------------------------------
// SCENARIO: Creating an order involves saving to 3 tables: orders, line_items, payments.
// If saving line_items fails, the order is already saved → inconsistent state.
// You need all-or-nothing: either everything saves, or nothing does.
//
// WHAT'S WRONG: Sequential saves without transaction:
//   await orderRepo.save(order);  // succeeds
//   await lineItemRepo.save(items); // FAILS → order exists without items
//
// YOUR FIX: Unit of Work collects all changes, commits them atomically:
//   uow.register(order); uow.register(items); uow.register(payment);
//   await uow.commit(); // all or nothing
//
// EXPECTED BEHAVIOR:
//   uow.markNew(order); uow.markNew(lineItems);
//   await uow.commit(); // saves both in one transaction
//   // If lineItems save fails → order save is rolled back
// ---------------------------------------------------------------------------
export function challenge09_12(input: ChallengeInput): unknown {
  void input;
  return todo("09.12", "Build a unit-of-work abstraction for committing multiple repository changes.");
}

// ---------------------------------------------------------------------------
// Challenge 09.13 — Persistence ↔ Domain Mapper
// ---------------------------------------------------------------------------
// SCENARIO: Your database stores orders as flat rows with snake_case columns.
// Your domain model uses camelCase with nested objects and value objects.
// They're DIFFERENT structures. You need to convert between them.
//
// WHAT'S WRONG: Mixing persistence shape with domain shape:
//   `order.created_at` (DB style) vs `order.createdAt` (domain style)
// Domain logic tied to database column names. Changing DB schema = changing domain.
//
// YOUR FIX: Mapper that converts DB rows → domain objects and domain → DB rows.
// Domain model is independent of database schema.
//
// EXPECTED BEHAVIOR:
//   toDomain({ id: 1, total_cents: 1500, created_at: "2024-01-01" })
//   → Order { id: 1, total: Money(1500), createdAt: Date }
//   toPersistence(order)
//   → { id: 1, total_cents: 1500, created_at: "2024-01-01T00:00:00Z" }
// ---------------------------------------------------------------------------
export function challenge09_13(input: ChallengeInput): unknown {
  void input;
  return todo("09.13", "Create a mapper between persistence models and domain models.");
}

// ---------------------------------------------------------------------------
// Challenge 09.14 — Constructor Invariants (Born Valid)
// ---------------------------------------------------------------------------
// SCENARIO: An Email value object should NEVER contain an invalid email.
// If it exists, it's valid. No need to re-validate everywhere it's used.
// This is "make illegal states unrepresentable."
//
// WHAT'S WRONG: `class Email { constructor(public value: string) {} }` — accepts anything.
// `new Email("not-an-email")` creates an invalid Email object.
// Every consumer must re-validate: `if (isValidEmail(email.value))` — defeats the purpose.
//
// YOUR FIX: Private constructor + static factory that validates:
//   Email.create("bad") → err("invalid email format")
//   Email.create("a@b.com") → ok(Email) — guaranteed valid
//   // If you have an Email instance, it's ALWAYS valid. No re-checking needed.
//
// EXPECTED BEHAVIOR:
//   const email = Email.create("alice@example.com"); // ok(Email)
//   const bad = Email.create("not-email"); // err("Invalid email format")
//   // email.value → "alice@example.com" (guaranteed valid)
// ---------------------------------------------------------------------------
export function challenge09_14(input: ChallengeInput): unknown {
  void input;
  return todo("09.14", "Enforce invariants inside constructors or static factory methods.");
}

// ---------------------------------------------------------------------------
// Challenge 09.15 — State Machine: Support Ticket Lifecycle
// ---------------------------------------------------------------------------
// SCENARIO: Support tickets go through: Open → InProgress → WaitingOnCustomer →
// Resolved → Closed. Each transition has rules:
//   - Only assigned agents can move to InProgress
//   - WaitingOnCustomer auto-closes after 7 days
//   - Closed tickets can be reopened (but only once)
//
// WHAT'S WRONG: Status is a string field. Any value can be set. No transition
// validation. A ticket goes from "Closed" to "InProgress" — nonsensical.
//
// YOUR FIX: Explicit state machine with:
//   - Defined states and allowed transitions
//   - Guards (conditions for transitions)
//   - Side effects on transition (send notification, start timer)
//
// EXPECTED BEHAVIOR:
//   ticket.transition("in_progress", { agent: "alice" }) → ✓ (if ticket was "open")
//   ticket.transition("closed", {}) → ✗ Error: "Cannot close from in_progress, must resolve first"
//   ticket.allowedTransitions() → ["waiting_on_customer", "resolved"]
// ---------------------------------------------------------------------------
export function challenge09_15(input: ChallengeInput): unknown {
  void input;
  return todo("09.15", "Model a state machine for support ticket lifecycle.");
}

// ---------------------------------------------------------------------------
// Challenge 09.16 — Composition Over Inheritance
// ---------------------------------------------------------------------------
// SCENARIO: You have BaseService with logging, metrics, and error handling.
// OrderService extends BaseService. PaymentService extends BaseService.
// Now you need a service with logging but NOT metrics. Inheritance is too rigid.
//
// WHAT'S WRONG: Deep inheritance: PaymentService → BaseService → AbstractService.
// Adding a variation = new subclass. 10 variations = 10 subclasses.
// "Diamond problem" when you need two base behaviors.
//
// YOUR FIX: Compose behaviors using mixins or wrapper functions:
//   withLogging(withMetrics(withErrorBoundary(coreService)))
// Pick and choose behaviors without inheritance hierarchy.
//
// EXPECTED BEHAVIOR:
//   const service = compose(coreLogic, withLogging(logger), withMetrics(tracker));
//   // service has logging + metrics. No base class.
//   const lightService = compose(coreLogic, withLogging(logger));
//   // lightService has only logging. No forced metrics.
// ---------------------------------------------------------------------------
export function challenge09_16(input: ChallengeInput): unknown {
  void input;
  return todo("09.16", "Use composition over inheritance to share behavior across services.");
}

// ---------------------------------------------------------------------------
// Challenge 09.17 — Plugin Registry: Payment Providers
// ---------------------------------------------------------------------------
// SCENARIO: Your checkout supports Stripe, PayPal, and Braintree. Each has a
// different SDK. Adding a new provider (Square) should NOT require modifying
// existing code — just register a new plugin.
//
// WHAT'S WRONG: `if (provider === "stripe") { ... } else if (provider === "paypal") { ... }`
// Adding Square = modifying the checkout function. Risk of breaking Stripe handling.
//
// YOUR FIX: Plugin registry: providers register themselves. Checkout looks up the
// provider by name and calls its standard interface.
//
// EXPECTED BEHAVIOR:
//   registry.register("stripe", new StripeProvider(stripeKey));
//   registry.register("paypal", new PayPalProvider(ppConfig));
//   // Later:
//   const provider = registry.get("stripe");
//   provider.charge(amount) → Result (common interface, different implementations)
// ---------------------------------------------------------------------------
export function challenge09_17(input: ChallengeInput): unknown {
  void input;
  return todo("09.17", "Create a plugin registry for payment providers.");
}

// ---------------------------------------------------------------------------
// Challenge 09.18 — Anti-Corruption Layer (Legacy API Shield)
// ---------------------------------------------------------------------------
// SCENARIO: You're integrating with a legacy customer API that returns horrible data:
//   { Cust_Nm: "ALICE SMITH", Cust_Addr_Ln1: "123 MAIN ST", Stat_Cd: "A" }
// Your domain model uses: { name: "Alice Smith", address: { line1: "..." }, status: "active" }
//
// WHAT'S WRONG: Using legacy field names throughout your code:
//   `customer.Cust_Nm` — if legacy API changes, ALL your code breaks.
// Legacy data format infects your clean domain model.
//
// YOUR FIX: Anti-corruption layer translates between legacy and your domain:
//   Legacy shape → ACL → Clean domain shape
// Your code NEVER sees legacy field names.
//
// EXPECTED BEHAVIOR:
//   acl.translateCustomer(legacyResponse)
//   → { name: "Alice Smith", address: { line1: "123 Main St" }, status: "active" }
//   // All legacy ugliness contained in ONE translation layer
// ---------------------------------------------------------------------------
export function challenge09_18(input: ChallengeInput): unknown {
  void input;
  return todo("09.18", "Build an anti-corruption layer for a legacy customer API.");
}

// ---------------------------------------------------------------------------
// Challenge 09.19 — Domain Event Serialization (For Message Queues)
// ---------------------------------------------------------------------------
// SCENARIO: Your service emits domain events ("OrderShipped") to a message queue
// (Kafka, RabbitMQ). Events must be serialized to JSON and deserialized on the
// other side. Class instances don't survive JSON.stringify (methods are lost).
//
// WHAT'S WRONG: `JSON.stringify(event)` loses: class type, Date objects (become strings),
// BigInt values (throws), Map/Set (become {}). Deserializing gives you a plain
// object, not a typed domain event.
//
// YOUR FIX: Build serialize/deserialize that preserves:
//   - Event type discriminator ("OrderShipped")
//   - Date objects (ISO string → Date on deserialize)
//   - Type safety (deserialize returns the correct typed event)
//
// EXPECTED BEHAVIOR:
//   serialize(new OrderShipped({ orderId: 5, shippedAt: new Date() }))
//   → '{"type":"OrderShipped","orderId":5,"shippedAt":"2024-01-15T..."}'
//   deserialize(json) → OrderShipped { orderId: 5, shippedAt: Date }
// ---------------------------------------------------------------------------
export function challenge09_19(input: ChallengeInput): unknown {
  void input;
  return todo("09.19", "Create domain event serialization and deserialization.");
}

// ---------------------------------------------------------------------------
// Challenge 09.20 — Refactor a God Function into Services
// ---------------------------------------------------------------------------
// SCENARIO: A 500-line `processCheckout()` function does EVERYTHING: validation,
// inventory check, payment, email, analytics, logging, error handling. Nobody
// understands it. Every change risks breaking something. Tests require mocking 15 things.
//
// WHAT'S WRONG: One function with 15 responsibilities. Violates Single Responsibility.
// Any change to email logic risks breaking payment logic (they share variables).
//
// YOUR FIX: Break it into focused domain services:
//   - ValidationService.validate(cart)
//   - InventoryService.reserve(items)
//   - PaymentService.charge(amount)
//   - NotificationService.sendConfirmation(order)
// Orchestrator coordinates them but each is independently testable.
//
// EXPECTED BEHAVIOR:
//   // Before: 1 function, 500 lines, 15 dependencies, untestable
//   // After: 5 focused services, each 50-100 lines, 2-3 dependencies each
//   // Orchestrator: calls services in order, handles failures, returns result
// ---------------------------------------------------------------------------
export function challenge09_20(input: ChallengeInput): unknown {
  void input;
  return todo("09.20", "Refactor a god function into cohesive domain services.");
}
