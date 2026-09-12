# Repository Pattern (Flat + Interview-Ready)

This folder keeps each module flat and easy to explain in interviews.

## Per-module files (same for `user`, `order`, `payment`)

- `types.ts`: entity types
- `data-source.ts`: datasource contract + provider implementations (inmemory/mongo/postgres/mysql)
- `repository.ts`: repository class
- `service.ts`: use-case service
- `module.ts`: composition/factory wiring (`build*Service`)

## Quick usage

```ts
import { buildUserService } from "./user/module";
import { buildOrderService } from "./order/module";
import { buildPaymentService } from "./payment/module";

const userService = buildUserService("postgres");
const orderService = buildOrderService("mongo");
const paymentService = buildPaymentService("inmemory");

await userService.registerUser({ name: "Alex", age: "28", active: true });
await orderService.getSuccessfulOrders();
await paymentService.getSuccessfulPayments();
```