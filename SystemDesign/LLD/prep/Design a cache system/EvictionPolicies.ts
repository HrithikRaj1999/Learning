export type Key = string;
export type PolicyType = "FIFO" | "LRU" | "LFU";

export interface EvictionPolicy {
    onGet(key: Key): void;
    onPut(key: Key): void;
    onRemove(key: Key): void;
    evictKey(): Key | null;
    reset?(keysInCache: Key[]): void;
}

type ListNode = {
    key: Key;
    prev: ListNode | null;
    next: ListNode | null;
};

class FIFOPolicy implements EvictionPolicy {
    private head: ListNode | null = null;
    private tail: ListNode | null = null;
    private nodeByKey = new Map<Key, ListNode>();

    onGet(_key: Key): void {
        // FIFO ignores reads.
    }

    onPut(key: Key): void {
        if (this.nodeByKey.has(key)) return;
        const node: ListNode = { key, prev: this.tail, next: null };
        if (this.tail) this.tail.next = node;
        this.tail = node;
        if (!this.head) this.head = node;
        this.nodeByKey.set(key, node);
    }

    onRemove(key: Key): void {
        const node = this.nodeByKey.get(key);
        if (!node) return;

        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (this.head === node) this.head = node.next;
        if (this.tail === node) this.tail = node.prev;
        this.nodeByKey.delete(key);
    }

    evictKey(): Key | null {
        if (!this.head) return null;
        const victim = this.head.key;
        this.onRemove(victim);
        return victim;
    }

    reset(keysInCache: Key[]): void {
        this.head = null;
        this.tail = null;
        this.nodeByKey.clear();
        for (const key of keysInCache) this.onPut(key);
    }
}

class LRUPolicy implements EvictionPolicy {
    private head: ListNode | null = null;
    private tail: ListNode | null = null;
    private nodeByKey = new Map<Key, ListNode>();

    onGet(key: Key): void {
        this.moveToTail(key);
    }

    onPut(key: Key): void {
        if (this.nodeByKey.has(key)) {
            this.moveToTail(key);
            return;
        }

        const node: ListNode = { key, prev: this.tail, next: null };
        if (this.tail) this.tail.next = node;
        this.tail = node;
        if (!this.head) this.head = node;
        this.nodeByKey.set(key, node);
    }

    onRemove(key: Key): void {
        const node = this.nodeByKey.get(key);
        if (!node) return;

        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (this.head === node) this.head = node.next;
        if (this.tail === node) this.tail = node.prev;
        this.nodeByKey.delete(key);
    }

    evictKey(): Key | null {
        if (!this.head) return null;
        const victim = this.head.key;
        this.onRemove(victim);
        return victim;
    }

    reset(keysInCache: Key[]): void {
        this.head = null;
        this.tail = null;
        this.nodeByKey.clear();
        for (const key of keysInCache) this.onPut(key);
    }

    private moveToTail(key: Key): void {
        const node = this.nodeByKey.get(key);
        if (!node || this.tail === node) return;

        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (this.head === node) this.head = node.next;

        node.prev = this.tail;
        node.next = null;
        if (this.tail) this.tail.next = node;
        this.tail = node;
        if (!this.head) this.head = node;
    }
}

class LFUPolicy implements EvictionPolicy {
    private keyToFreq = new Map<Key, number>();
    private freqToKeys = new Map<number, Set<Key>>();
    private minFreq = 0;

    onGet(key: Key): void {
        if (!this.keyToFreq.has(key)) return;
        this.bump(key);
    }

    onPut(key: Key): void {
        if (this.keyToFreq.has(key)) {
            this.bump(key);
            return;
        }

        this.keyToFreq.set(key, 1);
        if (!this.freqToKeys.has(1)) this.freqToKeys.set(1, new Set<Key>());
        this.freqToKeys.get(1)!.add(key);
        this.minFreq = 1;
    }

    onRemove(key: Key): void {
        const freq = this.keyToFreq.get(key);
        if (freq === undefined) return;

        const bucket = this.freqToKeys.get(freq);
        if (bucket) {
            bucket.delete(key);
            if (bucket.size === 0) {
                this.freqToKeys.delete(freq);
                if (this.minFreq === freq) this.minFreq = this.nextMinFreq();
            }
        }

        this.keyToFreq.delete(key);
    }

    evictKey(): Key | null {
        if (this.minFreq === 0) return null;
        const bucket = this.freqToKeys.get(this.minFreq);
        if (!bucket || bucket.size === 0) return null;

        const first = bucket.values().next();
        if (first.done) return null;

        const victim = first.value;
        this.onRemove(victim);
        return victim;
    }

    reset(keysInCache: Key[]): void {
        this.keyToFreq.clear();
        this.freqToKeys.clear();
        this.minFreq = 0;
        for (const key of keysInCache) this.onPut(key);
    }

    private bump(key: Key): void {
        const oldFreq = this.keyToFreq.get(key)!;
        const newFreq = oldFreq + 1;
        const oldBucket = this.freqToKeys.get(oldFreq)!;

        oldBucket.delete(key);
        if (oldBucket.size === 0) {
            this.freqToKeys.delete(oldFreq);
            if (this.minFreq === oldFreq) this.minFreq = newFreq;
        }

        if (!this.freqToKeys.has(newFreq)) this.freqToKeys.set(newFreq, new Set<Key>());
        this.freqToKeys.get(newFreq)!.add(key);
        this.keyToFreq.set(key, newFreq);
    }

    private nextMinFreq(): number {
        if (this.freqToKeys.size === 0) return 0;
        let min = Number.MAX_SAFE_INTEGER;
        for (const freq of this.freqToKeys.keys()) {
            if (freq < min) min = freq;
        }
        return min;
    }
}

export class PolicyFactory {
    static getPolicy(type: PolicyType): EvictionPolicy {
        switch (type) { 
            case "LRU":
                return new LRUPolicy();
            case "LFU":
                return new LFUPolicy();
            default:
            case "FIFO":
                return new FIFOPolicy();;
        }
    }
}
