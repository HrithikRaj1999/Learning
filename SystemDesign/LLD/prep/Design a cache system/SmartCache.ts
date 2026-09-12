import { EvictionPolicy, Key, PolicyFactory, PolicyType } from "./EvictionPolicies.ts";

export class SmartCache<V> {
    // Cache owns real data.
    private store = new Map<Key, V>();

    constructor(private capacity: number, private policy: EvictionPolicy) {
        if (capacity <= 0) throw new Error("Capacity must be greater than 0");
    }
    setPolicy(nextPolicy: EvictionPolicy): void {
        this.policy = nextPolicy;
        this.policy.reset?.([...this.store.keys()]);
    }

    get(key: Key): V | -1 {
        const value = this.store.get(key);
        if (value === undefined) return -1;

        // Policy tracks usage metadata only.
        this.policy.onGet(key);
        return value;
    }

    put(key: Key, value: V): void {
        if (this.store.has(key)) {
            // Update existing key: no eviction.
            this.store.set(key, value);
            this.policy.onPut(key);
            return;
        }

        // Cache enforces capacity, then asks policy who to evict.
        if (this.store.size >= this.capacity) {
            const victim = this.policy.evictKey();
            if (victim !== null) {
                this.store.delete(victim);
                this.policy.onRemove(victim);
            }
        }

        this.store.set(key, value);
        this.policy.onPut(key);
    }

    delete(key: Key): boolean {
        const existed = this.store.delete(key);
        if (existed) this.policy.onRemove(key);
        return existed;
    }

    size(): number {
        return this.store.size;
    }
}
