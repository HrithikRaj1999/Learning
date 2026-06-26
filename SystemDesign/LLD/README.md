# LLD in TypeScript — SOLID · Design Patterns · Clean Code

A hands-on, OOP-first low-level-design workbook. **35 topics × 4 problems = 140 demos.**

Each topic holds **4 named problem folders** (classic + production + real-life bugs).
Every problem is built the same way:

```
<Topic>/
└── <SomethingProblem>/
    ├── BadCode/        ← runnable TypeScript with real violations + bugs (READ THIS)
    └── GoodCode/
        └── FIXES.md    ← HINTS ONLY. No solution code. You write the fix.
```

> The point: read the smell, diagnose it, then refactor it yourself using only the
> hints + the "Done-when" checklist. The answer is never handed to you.

## How to use

1. Open a problem's `BadCode/*.ts`. Run it, read it, name every smell out loud.
2. Open its `GoodCode/FIXES.md`. Work the hints + the "Done-when" checklist.
3. Write your fixed version (new files in `GoodCode/`, or a scratch folder).
4. Type-check: `npm i && npm run typecheck`. Run a file: `npx tsx path/to/file.ts`.

> Use **`tsx`** (or compile with `tsc`), not bare `node file.ts`. Several demos use
> TypeScript parameter properties (`constructor(public x: T)`), which Node's native
> type-stripping rejects (not erasable syntax). `tsx` handles them.

## Index

### 1 · SOLID Principles — [`SOLID/`](SOLID/)
| Principle | 4 problems |
|-----------|-----------|
| [SRP](SOLID/01-SRP/) | Employee · Order · Invoice · BlogPost |
| [OCP](SOLID/02-OCP/) | Discount · ShapeArea · NotificationChannel · Tax |
| [LSP](SOLID/03-LSP/) | BirdAndRectangle · BankAccount · ReadOnlyCollection · FileStorage |
| [ISP](SOLID/04-ISP/) | PrinterMachine · Worker · Repository · MediaPlayer |
| [DIP](SOLID/05-DIP/) | NotificationService · OrderService · Report · Weather |

### 2 · Design Patterns (GoF, all 23) — [`DesignPatterns/`](DesignPatterns/)

**Creational** — [`Creational/`](DesignPatterns/Creational/)
| Pattern | 4 problems |
|---------|-----------|
| [Singleton](DesignPatterns/Creational/Singleton/) | Logger · Config · DbPool · Cache |
| [Factory Method](DesignPatterns/Creational/FactoryMethod/) | Transport · Notification · DialogButton · DocumentParser |
| [Abstract Factory](DesignPatterns/Creational/AbstractFactory/) | GuiKit · DbConnector · Theme · CloudProvider |
| [Builder](DesignPatterns/Creational/Builder/) | Pizza · HttpRequest · UserRegistration · SqlQuery |
| [Prototype](DesignPatterns/Creational/Prototype/) | GameUnit · DocumentTemplate · ConfigClone · ShapeClone |

**Structural** — [`Structural/`](DesignPatterns/Structural/)
| Pattern | 4 problems |
|---------|-----------|
| [Adapter](DesignPatterns/Structural/Adapter/) | Payment · Logger · XmlToJson · TemperatureSensor |
| [Bridge](DesignPatterns/Structural/Bridge/) | ShapeColor · RemoteDevice · MessageSender · NotificationUrgency |
| [Composite](DesignPatterns/Structural/Composite/) | FileSystem · OrgChart · Menu · UiComponent |
| [Decorator](DesignPatterns/Structural/Decorator/) | Coffee · TextFormatting · Notifier · DataStream |
| [Facade](DesignPatterns/Structural/Facade/) | HomeTheater · OrderPlacement · VideoConversion · ComputerBoot |
| [Flyweight](DesignPatterns/Structural/Flyweight/) | Forest · TextGlyph · Bullet · MapMarker |
| [Proxy](DesignPatterns/Structural/Proxy/) | Image · ApiCache · AccessControl · RateLimit |

**Behavioral** — [`Behavioral/`](DesignPatterns/Behavioral/)
| Pattern | 4 problems |
|---------|-----------|
| [Chain of Responsibility](DesignPatterns/Behavioral/ChainOfResponsibility/) | SupportTicket · ExpenseApproval · LogLevel · RequestMiddleware |
| [Command](DesignPatterns/Behavioral/Command/) | RemoteControl · TextEditorUndo · OrderQueue · SmartHomeMacro |
| [Interpreter](DesignPatterns/Behavioral/Interpreter/) | Calculator · BooleanRule · RomanNumeral · FilterQuery |
| [Iterator](DesignPatterns/Behavioral/Iterator/) | Playlist · TreeTraversal · Pagination · Matrix |
| [Mediator](DesignPatterns/Behavioral/Mediator/) | ChatRoom · FormField · AirTraffic · UiDialog |
| [Memento](DesignPatterns/Behavioral/Memento/) | Editor · GameSave · FormWizard · CanvasUndo |
| [Observer](DesignPatterns/Behavioral/Observer/) | WeatherStation · StockTicker · CartTotal · EventBus |
| [State](DesignPatterns/Behavioral/State/) | VendingMachine · TrafficLight · OrderStatus · MediaPlayer |
| [Strategy](DesignPatterns/Behavioral/Strategy/) | Payment · Sorting · Compression · ShippingCost |
| [Template Method](DesignPatterns/Behavioral/TemplateMethod/) | DataExporter · Beverage · ReportBuild · BuildPipeline |
| [Visitor](DesignPatterns/Behavioral/Visitor/) | Shapes · AstNode · FileExport · EmployeeReport |

### 3 · Clean Code — [`CleanCode/`](CleanCode/)
| Topic | 4 problems |
|-------|-----------|
| [Naming](CleanCode/01-Naming/) | CalcFilter · Banking · ApiHandler · GameLoop |
| [Functions](CleanCode/02-Functions/) | Checkout · Registration · Report · Validation |
| [Comments](CleanCode/03-Comments/) | Redundant · LyingComment · DeadCode · StaleTodo |
| [Error Handling](CleanCode/04-ErrorHandling/) | Swallow · FileUpload · PaymentNull · ApiClient |
| [DRY](CleanCode/05-DRY/) | Pricing · ValidationDup · ApiResponse · Constants |
| [Immutability](CleanCode/06-Immutability/) | MutateArgs · SharedState · DefaultMutation · SortMutation |
| [Guard Clauses](CleanCode/07-GuardClauses/) | UserAccess · AuthCheck · FormValidation · NullCheck |

## Adding more problems

Each topic uses `<Name>Problem/` folders. Add another with the same
`BadCode/` + `GoodCode/FIXES.md` shape to drill the same idea on a new scenario.

## Pattern relationships worth noticing
- **OCP ↔ Strategy** — same shape, principle vs pattern.
- **State ↔ Strategy** — identical structure, different intent (self-transition vs client-chosen).
- **Decorator ↔ Proxy** — both wrap; add-behavior vs control-access.
- **Adapter ↔ Facade ↔ Bridge** — convert-one vs simplify-subsystem vs designed-in split.
- **Factory Method ↔ Abstract Factory** — one product vs a family.
- **Mediator ↔ Observer** — many-to-many hub vs one-to-many notify.
- **Template Method ↔ Strategy** — vary a step by inheritance vs whole algorithm by composition.
