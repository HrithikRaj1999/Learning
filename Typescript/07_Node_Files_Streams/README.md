# Task 07: Node.js Files, Streams, and Buffers

Level: Advanced

## Concepts

- fs/promises
- streams
- Buffer
- path
- crypto
- atomic writes
- backpressure
- temp files

## Files

- Task file: `task_07_node_files_streams.ts`
- Sample tests: `__tests__/task_07_node_files_streams.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 07.01 | Read a JSON config file safely and validate the parsed object. |
| 07.02 | Write JSON atomically by writing to a temp file and renaming it. |
| 07.03 | Create a line reader for large files using streams. |
| 07.04 | Parse a CSV stream into typed rows with validation errors collected separately. |
| 07.05 | Compute a SHA-256 hash for a file without loading the whole file into memory. |
| 07.06 | Create a safe path resolver that prevents directory traversal outside a base folder. |
| 07.07 | Implement a rotating file naming strategy for log files. |
| 07.08 | Convert a readable stream into an async iterable of chunks. |
| 07.09 | Create a transform stream that redacts sensitive tokens from text. |
| 07.10 | Build a file upload metadata validator before writing to disk. |
| 07.11 | Implement cleanup for temporary files when a process fails. |
| 07.12 | Read a directory recursively and return typed file descriptors. |
| 07.13 | Create a small binary protocol encoder and decoder using Buffer. |
| 07.14 | Implement backpressure-aware copying between streams. |
| 07.15 | Create a file lock strategy using lock files and stale-lock detection. |
| 07.16 | Watch a folder and debounce change events into one rebuild signal. |
| 07.17 | Create a checksum manifest for generated artifacts. |
| 07.18 | Build a safe delete helper that refuses to delete outside a workspace root. |
| 07.19 | Implement gzip compression and decompression helpers with streams. |
| 07.20 | Create a fixture loader for tests that resolves paths relative to the module. |
