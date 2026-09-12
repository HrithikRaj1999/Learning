import { PolicyFactory } from "./EvictionPolicies";
import { SmartCache } from "./SmartCache";

// Example
const cache = new SmartCache<number>(2, PolicyFactory.getPolicy("FIFO"));
cache.put("a", 1);
cache.put("b", 2);
cache.get("a");
cache.put("c", 3); 