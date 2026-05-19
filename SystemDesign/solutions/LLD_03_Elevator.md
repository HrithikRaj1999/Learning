# LLD 03: Design an Elevator System

## 💡 Quick Summary

> **What**: A multi-elevator system that efficiently schedules and dispatches elevators to serve floor requests.  
> **Key Insight**: The scheduling algorithm is the core challenge. Use **State Pattern** for elevator states and **Strategy Pattern** for dispatching. SCAN (elevator) algorithm moves in one direction, serving all requests, then reverses.

---

## 🎯 The Problem in Simple Terms

Building with 10 floors, 3 elevators. Person on floor 7 presses "Down":
- Which elevator should respond? (the one closest moving in that direction)
- How to minimize wait time for all passengers?
- How to handle conflicting requests efficiently?

---

## 🔄 Elevator State Machine

```mermaid
stateDiagram-v2
    [*] --> IDLE: System start
    IDLE --> MOVING_UP: Request above current floor
    IDLE --> MOVING_DOWN: Request below current floor
    MOVING_UP --> IDLE: No more up requests
    MOVING_DOWN --> IDLE: No more down requests
    MOVING_UP --> DOOR_OPEN: Arrived at requested floor
    MOVING_DOWN --> DOOR_OPEN: Arrived at requested floor
    DOOR_OPEN --> MOVING_UP: Doors closed, more up requests
    DOOR_OPEN --> MOVING_DOWN: Doors closed, more down requests
    DOOR_OPEN --> IDLE: Doors closed, no requests
```

---

## 🏗️ Class Design

```mermaid
classDiagram
    class ElevatorSystem {
        -elevators: List~Elevator~
        -dispatcher: Dispatcher
        +requestElevator(floor, direction): void
    }
    
    class Elevator {
        -id: int
        -currentFloor: int
        -state: ElevatorState
        -upStops: SortedSet~int~
        -downStops: SortedSet~int~
        -direction: Direction
        +addStop(floor): void
        +move(): void
        +openDoor(): void
        +closeDoor(): void
    }
    
    class ElevatorState {
        <<interface>>
        +handle(elevator): void
    }
    
    class IdleState {
        +handle(elevator): void
    }
    class MovingState {
        +handle(elevator): void
    }
    class DoorOpenState {
        +handle(elevator): void
    }
    
    class Dispatcher {
        <<interface>>
        +selectElevator(floor, direction, elevators): Elevator
    }
    
    class SCANDispatcher {
        +selectElevator(floor, direction, elevators): Elevator
    }

    ElevatorSystem --> Elevator
    ElevatorSystem --> Dispatcher
    Elevator --> ElevatorState
    ElevatorState <|.. IdleState
    ElevatorState <|.. MovingState
    ElevatorState <|.. DoorOpenState
    Dispatcher <|.. SCANDispatcher
```

---

## 🔍 Dispatching: How to Choose Which Elevator

```mermaid
sequenceDiagram
    actor Person as Person (Floor 7, wants Down)
    participant System as Elevator System
    participant Disp as Dispatcher
    participant E1 as Elevator 1 (Floor 9, going Down)
    participant E2 as Elevator 2 (Floor 2, going Up)
    participant E3 as Elevator 3 (Floor 7, Idle)

    Person->>System: External request: Floor 7, DOWN
    System->>Disp: selectElevator(7, DOWN, [E1, E2, E3])
    
    Note over Disp: Score each elevator:
    Note over Disp: E1: Floor 9, going DOWN → will pass floor 7! Score: 2 (distance)
    Note over Disp: E2: Floor 2, going UP → must finish up, then come down. Score: 15
    Note over Disp: E3: Floor 7, IDLE → already there! Score: 0
    
    Disp-->>System: Best: E3 (score 0)
    System->>E3: addStop(7) + direction = DOWN
```

---

## 📋 SCAN Algorithm (Elevator Algorithm)

```mermaid
graph TD
    subgraph "SCAN: Like a disk head — go one direction, serve all, reverse"
        Step1["Elevator at Floor 3, going UP<br/>Pending UP stops: 5, 8, 10<br/>Pending DOWN stops: 7, 2"]
        Step2["Goes UP: stops at 5, 8, 10"]
        Step3["No more UP requests → REVERSE direction"]
        Step4["Goes DOWN: stops at 7, 2"]
        Step5["No more DOWN requests → IDLE"]
    end
    
    Step1 --> Step2 --> Step3 --> Step4 --> Step5
```

---

## 💻 Core Implementation

```python
from enum import Enum
from sortedcontainers import SortedList

class Direction(Enum):
    UP = 1
    DOWN = -1
    IDLE = 0

class Elevator:
    def __init__(self, elevator_id, total_floors):
        self.id = elevator_id
        self.current_floor = 1
        self.direction = Direction.IDLE
        self.up_stops = SortedList()    # Floors to visit going up
        self.down_stops = SortedList()  # Floors to visit going down
    
    def add_stop(self, floor):
        if floor > self.current_floor:
            self.up_stops.add(floor)
        elif floor < self.current_floor:
            self.down_stops.add(floor)
        # If already at floor, open doors
    
    def move(self):
        """Called each time step — moves one floor."""
        if self.direction == Direction.UP:
            if self.up_stops:
                self.current_floor += 1
                if self.current_floor in self.up_stops:
                    self.up_stops.remove(self.current_floor)
                    self.open_doors()
                if not self.up_stops:
                    self.direction = Direction.DOWN if self.down_stops else Direction.IDLE
            
        elif self.direction == Direction.DOWN:
            if self.down_stops:
                self.current_floor -= 1
                if self.current_floor in self.down_stops:
                    self.down_stops.remove(self.current_floor)
                    self.open_doors()
                if not self.down_stops:
                    self.direction = Direction.UP if self.up_stops else Direction.IDLE

class SCANDispatcher:
    def select(self, floor, direction, elevators):
        best = None
        best_score = float('inf')
        for elevator in elevators:
            score = self._score(elevator, floor, direction)
            if score < best_score:
                best_score = score
                best = elevator
        return best
    
    def _score(self, elevator, floor, direction):
        # Already at floor and idle
        if elevator.current_floor == floor and elevator.direction == Direction.IDLE:
            return 0
        # Moving toward the floor in same direction
        if elevator.direction == direction:
            if direction == Direction.UP and elevator.current_floor <= floor:
                return floor - elevator.current_floor
            if direction == Direction.DOWN and elevator.current_floor >= floor:
                return elevator.current_floor - floor
        # Idle elevator — just distance
        if elevator.direction == Direction.IDLE:
            return abs(elevator.current_floor - floor)
        # Moving away — high cost
        return 1000 + abs(elevator.current_floor - floor)
```

---

## 🧩 Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| **State** | Elevator states (Idle, Moving, DoorOpen) | Clean transitions; each state knows what to do next |
| **Strategy** | Dispatcher algorithm | Swap SCAN/LOOK/nearest-first without changing Elevator |
| **Observer** | Floor display panels | Update "Elevator arriving" indicators |
| **Singleton** | ElevatorSystem | One controller manages all elevators |

---

## 📊 Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Scheduling | SCAN (elevator algorithm) | Fair; prevents starvation; efficient direction changes |
| Internal vs External requests | Two queues (upStops, downStops) | Natural fit for SCAN; easy to reason about |
| Multiple elevators | Central dispatcher picks best | Global optimization > per-elevator decisions |
| Door timing | Timer-based auto-close (3-5 seconds) | Safety; don't hold up other passengers |
| Overweight | Elevator doesn't accept new stops when full | Sensor-based; skip floor pickup, still serve internal |
