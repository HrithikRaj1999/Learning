type Entry<K, V> = HashNode<K, V> | null

class HashNode<K, V> {
    constructor(
        public key: K,
        public Value: V,
        public Next: HashNode<K, V> | null = null
    ) { }
}

class HashMap<K, V> {
    private size = 0
    private buckets: Entry<K, V>[];
    constructor(private capacity = 16) {
        this.buckets = Array.from({ length: capacity }, () => null);
    }
}
