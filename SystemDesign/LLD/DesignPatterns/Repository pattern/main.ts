import { process } from "../Behavioral/Command/OrderQueueProblem/BadCode/Processor";
import { buildOrderService } from "./order/module";
import { buildPaymentService } from "./payment/module";
import { buildUserService } from "./user/module";

async function demoUserModule(): Promise<void> {
  const userService = buildUserService("mongo");

  const createdUser = await userService.registerUser({
    name: "Alex",
    age: "28",
    active: true,
  });
  const createdUser2 = await userService.registerUser({
    name: "Hrithik",
    age: "28",
    active: false,
  });

  const fetchedUser = await userService.getUserById(createdUser.id);
  const activeUsers = await userService.getActiveUsers();

  console.log("User Module");
  console.log("Created User:", createdUser);
  console.log("Fetched User:", fetchedUser);
  console.log("Active Users:", activeUsers.length);
  console.log();
}

async function demoOrderModule(): Promise<void> {
  const orderService = buildOrderService("mongo");

  const createdOrder = await orderService.createOrder({
    orderDate: "2026-07-13",
    quantity: "3",
    productId: "p10",
    paymentId: "pay10",
    successful: true,
  });

  const successfulOrders = await orderService.getSuccessfulOrders();

  console.log("Order Module");
  console.log("Created Order:", createdOrder);
  console.log("Successful Orders:", successfulOrders.length);
  console.log();
}

async function demoPaymentModule(): Promise<void> {
  const paymentService = buildPaymentService("mongo");

  const createdPayment = await paymentService.createPayment({
    orderId: "o10",
    paymentDate: new Date("2026-07-13T09:30:00.000Z"),
    status: true,
  });

  const successfulPayments = await paymentService.getSuccessfulPayments();

  console.log("Payment Module");
  console.log("Created Payment:", createdPayment);
  console.log("Successful Payments:", successfulPayments.length);
  console.log();
}

function demoProviderWiring(): void {
  const userProviders = ["mongo", "postgres", "mysql"] as const;
  const otherProviders = ["inmemory", "mongo", "postgres", "mysql"] as const;

  console.log("Provider Wiring");
  console.log("User providers:", userProviders.join(", "));
  console.log("Order providers:", otherProviders.join(", "));
  console.log("Payment providers:", otherProviders.join(", "));
  console.log("Use postgres/mysql with running DB instances.");
  console.log();

  userProviders.forEach((provider) => {
    buildUserService(provider);
  });

  otherProviders.forEach((provider) => {
    buildOrderService(provider);
    buildPaymentService(provider);
  });
}

async function main(): Promise<void> {
  console.log("Repository Pattern Demo (SOLID + DI + Provider Swap)");
  console.log("---------------------------------------------------");

  await demoUserModule();
  await demoOrderModule();
  await demoPaymentModule();
  demoProviderWiring();
}

main().catch((error: unknown) => {
  console.error("Demo failed:", error);
  process.exitCode = 1;
});
