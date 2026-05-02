# Advanced TypeScript Production Mastery

This track is for becoming advanced with TypeScript in production codebases: strict typing, runtime boundaries, async systems, Node.js, APIs, testing, observability, performance, security, tooling, frontend integration, and capstone services.

## Setup

From `C:\Learning\Typescript`:

```powershell
npm install
npm run typecheck
npm test
```

From `C:\Learning`, you can also use the helper scripts:

```powershell
Typescript/scripts/verify.ps1
Typescript/scripts/test_task.ps1 Typescript/01_Type_System_Narrowing/__tests__/task_01_type_system_narrowing.test.ts
```

## How to Practice

1. Open a module task file.
2. Read [SCENARIO_GUIDE.md](./SCENARIO_GUIDE.md) for the real-life scenario, what is unsafe or unfinished, expected output, and how to test.
3. Implement one exported challenge function.
4. Open the matching `__tests__` file.
5. Remove `.skip` from that challenge's sample test.
6. Replace the placeholder expected value with the real expected result.
7. Run the single module test, for example:

```powershell
npx vitest --run 01_Type_System_Narrowing/__tests__/task_01_type_system_narrowing.test.ts
```

The default test suite verifies that all challenge functions are exported and keeps the project green until you opt into each sample test.

## Modules

| # | Folder | Topic | Level | Exercises |
|---|--------|-------|-------|-----------|
| 01 | `01_Type_System_Narrowing` | Type System and Narrowing | Advanced | 20 |
| 02 | `02_Generics_Utility_Types` | Generics and Utility Types | Advanced | 20 |
| 03 | `03_Runtime_Validation_Boundaries` | Runtime Validation and Boundaries | Advanced | 20 |
| 04 | `04_Collections_Data_Transformations` | Collections and Data Transformations | Advanced | 20 |
| 05 | `05_Async_Concurrency` | Async, Promises, and Concurrency | Advanced | 20 |
| 06 | `06_Error_Handling_Result_Types` | Error Handling and Result Types | Advanced | 20 |
| 07 | `07_Node_Files_Streams` | Node.js Files, Streams, and Buffers | Advanced | 20 |
| 08 | `08_HTTP_API_Clients` | HTTP Clients and API SDKs | Advanced | 20 |
| 09 | `09_Domain_Modeling_Design_Patterns` | Domain Modeling and Design Patterns | Advanced | 20 |
| 10 | `10_Testing_Mocking_Testability` | Testing, Mocking, and Testability | Advanced | 20 |
| 11 | `11_Config_Logging_Observability` | Config, Logging, and Observability | Advanced | 20 |
| 12 | `12_Performance_Caching_Memory` | Performance, Caching, and Memory | Advanced | 20 |
| 13 | `13_Security_Hardening` | Security and Input Hardening | Advanced | 20 |
| 14 | `14_Modules_Tooling_Packaging` | Modules, Tooling, and Packaging | Advanced | 20 |
| 15 | `15_Fullstack_Frontend_Production` | Fullstack and Frontend Production TypeScript | Advanced | 20 |
| 16 | `16_Capstone_Production_Services` | Capstone Production Services | Expert | 20 |

Total exercises: 320

## Production Standard

A task is complete when the implementation is strict-mode safe, has meaningful sample tests, avoids unnecessary `any`, handles edge cases, and explains the production tradeoffs around errors, data boundaries, performance, or maintainability.
