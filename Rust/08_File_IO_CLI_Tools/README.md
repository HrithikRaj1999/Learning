# Section 08: File I/O & CLI Tools

> **Prerequisites:** Complete Sections 00-05. You should understand error handling with `?` (Section 03), traits (Section 05, especially `Display`/`From`), and modules (Section 04b). Smart pointers (Section 06) and async (Section 07) are NOT needed for this section.

## 🎯 Learning Objectives
- Master file system operations (read, write, walk directories)
- Build professional CLI tools with clap
- Handle stdin/stdout for Unix-philosophy composable tools
- Use exit codes properly
- Handle paths, environment variables, and process spawning

---

## 📖 Core Concepts

### System Tool Building in Rust

**Scenario:** You need to build tools like `grep`, `find`, `wc`, `jq` — tools that process files, transform data, and compose via pipes. Rust is PERFECT for this: fast as C, safe as garbage-collected languages, great error messages.

### Adding clap to Your Project

```toml
# In Cargo.toml:
[dependencies]
clap = { version = "4", features = ["derive"] }
```

Or use the command line:
```bash
cargo add clap --features derive
```

### Reading from stdin and Writing to stdout

Unix-philosophy tools read from stdin and write to stdout, allowing pipe composition:

```rust
use std::io::{self, BufRead, Write, BufWriter};

fn main() -> io::Result<()> {
    let stdin = io::stdin();
    let stdout = io::stdout();
    let mut out = BufWriter::new(stdout.lock()); // Lock + buffer for performance

    // Read stdin line by line (works with pipes!)
    for line in stdin.lock().lines() {
        let line = line?;
        // Process the line (example: convert to uppercase)
        writeln!(out, "{}", line.to_uppercase())?;
    }

    Ok(())
}

// Usage:
// echo "hello world" | cargo run          → HELLO WORLD
// cat file.txt | cargo run | head -5      → First 5 uppercase lines
// cargo run < input.txt > output.txt      → File-to-file via stdin/stdout
```

### Exit Codes

```rust
use std::process::ExitCode;

// Convention:
// 0 = success
// 1 = general error
// 2 = usage/argument error

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: {} <filename>", args[0]);
        return ExitCode::from(2); // Usage error
    }

    match std::fs::read_to_string(&args[1]) {
        Ok(content) => {
            println!("{}", content);
            ExitCode::SUCCESS // 0
        }
        Err(e) => {
            eprintln!("Error: {}", e);
            ExitCode::FAILURE // 1
        }
    }
}

// Alternative: std::process::exit(code) for immediate termination
// (skips destructors — use ExitCode when possible)
```

---

## 📝 Tasks

### Task 1: File Operations

**What to do:** Build a FileManager with read, write, append, copy with progress, directory walking, and file finding by extension.

<details>
<summary>Click to see answer</summary>

```rust
use std::fs;
use std::io::{self, Read, Write, BufRead, BufReader, BufWriter};
use std::path::{Path, PathBuf};

struct FileManager;

impl FileManager {
    /// Read entire file to string
    fn read_text(path: &Path) -> io::Result<String> {
        fs::read_to_string(path)
    }
    
    /// Read file line by line (memory efficient for large files)
    fn read_lines(path: &Path) -> io::Result<Vec<String>> {
        let file = fs::File::open(path)?;
        let reader = BufReader::new(file);
        reader.lines().collect()
    }
    
    /// Write text to file (creates or overwrites)
    fn write_text(path: &Path, content: &str) -> io::Result<()> {
        // Create parent directories if needed
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }
        fs::write(path, content)
    }
    
    /// Append to file
    fn append(path: &Path, content: &str) -> io::Result<()> {
        use std::fs::OpenOptions;
        let mut file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(path)?;
        writeln!(file, "{}", content)
    }
    
    /// Copy file with progress callback
    fn copy_with_progress<F>(src: &Path, dst: &Path, on_progress: F) -> io::Result<u64>
    where
        F: Fn(u64, u64), // (bytes_copied, total_bytes)
    {
        let metadata = fs::metadata(src)?;
        let total = metadata.len();
        
        if let Some(parent) = dst.parent() {
            fs::create_dir_all(parent)?;
        }
        
        let mut reader = BufReader::new(fs::File::open(src)?);
        let mut writer = BufWriter::new(fs::File::create(dst)?);
        
        let mut copied = 0u64;
        let mut buffer = [0u8; 8192]; // 8KB buffer
        
        loop {
            let bytes_read = reader.read(&mut buffer)?;
            if bytes_read == 0 { break; }
            writer.write_all(&buffer[..bytes_read])?;
            copied += bytes_read as u64;
            on_progress(copied, total);
        }
        
        writer.flush()?;
        Ok(copied)
    }
    
    /// Walk directory recursively
    fn walk_dir(path: &Path) -> io::Result<Vec<PathBuf>> {
        let mut entries = Vec::new();
        Self::walk_dir_recursive(path, &mut entries)?;
        Ok(entries)
    }
    
    fn walk_dir_recursive(path: &Path, entries: &mut Vec<PathBuf>) -> io::Result<()> {
        if path.is_dir() {
            for entry in fs::read_dir(path)? {
                let entry = entry?;
                let path = entry.path();
                if path.is_dir() {
                    Self::walk_dir_recursive(&path, entries)?;
                } else {
                    entries.push(path);
                }
            }
        }
        Ok(())
    }
    
    /// Find files matching a pattern
    fn find_files(root: &Path, extension: &str) -> io::Result<Vec<PathBuf>> {
        let all_files = Self::walk_dir(root)?;
        Ok(all_files.into_iter()
            .filter(|p| {
                p.extension()
                    .and_then(|ext| ext.to_str())
                    .map(|ext| ext == extension)
                    .unwrap_or(false)
            })
            .collect())
    }
}

fn main() -> io::Result<()> {
    // Write a file
    let path = Path::new("output/test.txt");
    FileManager::write_text(path, "Hello, Rust!\nSecond line.")?;
    
    // Read it back
    let content = FileManager::read_text(path)?;
    println!("Content: {:?}", content);
    
    // Read lines
    let lines = FileManager::read_lines(path)?;
    println!("Lines: {:?}", lines);
    
    // Append
    FileManager::append(path, "Appended line")?;
    
    // Walk current directory
    let files = FileManager::walk_dir(Path::new("."))?;
    println!("\nFiles in current dir:");
    for f in files.iter().take(10) {
        println!("  {}", f.display());
    }
    
    Ok(())
}
```

**Explanation:**
- `BufReader`/`BufWriter` reduce system calls (huge performance boost)
- `Path`/`PathBuf` handle cross-platform path differences
- Creating parent directories prevents "not found" errors
- Walking directories recursively is a common pattern for CLI tools

**Scenario:** Build tools, file synchronizers, backup utilities, code formatters — all need robust file operations.
</details>

---

### Task 2: CLI Argument Parsing with Clap

**What to do:** Create a CLI tool with subcommands (count, search, organize, stats) using clap's derive API.

Add to your `Cargo.toml`:
```toml
[dependencies]
clap = { version = "4", features = ["derive"] }
```

<details>
<summary>Click to see answer</summary>

```rust
use clap::{Parser, Subcommand, Args};
use std::path::PathBuf;

/// A fast file utility tool
#[derive(Parser, Debug)]
#[command(name = "fileutil", version, about, long_about = None)]
struct Cli {
    /// Enable verbose output
    #[arg(short, long, global = true)]
    verbose: bool,
    
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Count lines, words, and bytes in files
    Count(CountArgs),
    
    /// Search for patterns in files
    Search(SearchArgs),
    
    /// Organize files by extension
    Organize(OrganizeArgs),
    
    /// Show file/directory statistics
    Stats {
        /// Path to analyze
        #[arg(default_value = ".")]
        path: PathBuf,
        
        /// Include hidden files
        #[arg(short = 'a', long)]
        all: bool,
    },
}

#[derive(Args, Debug)]
struct CountArgs {
    /// Files to count
    #[arg(required = true)]
    files: Vec<PathBuf>,
    
    /// Count only lines
    #[arg(short, long)]
    lines: bool,
    
    /// Count only words
    #[arg(short, long)]
    words: bool,
}

#[derive(Args, Debug)]
struct SearchArgs {
    /// Pattern to search for
    pattern: String,
    
    /// Files or directories to search
    #[arg(default_value = ".")]
    path: PathBuf,
    
    /// Case-insensitive search
    #[arg(short, long)]
    ignore_case: bool,
    
    /// Show line numbers
    #[arg(short = 'n', long)]
    line_numbers: bool,
    
    /// File extensions to include (e.g., rs,txt)
    #[arg(short, long, value_delimiter = ',')]
    extensions: Vec<String>,
}

#[derive(Args, Debug)]
struct OrganizeArgs {
    /// Source directory
    #[arg(default_value = ".")]
    source: PathBuf,
    
    /// Target directory
    #[arg(short, long, default_value = "./organized")]
    target: PathBuf,
    
    /// Dry run (don't actually move files)
    #[arg(long)]
    dry_run: bool,
}

fn handle_count(args: &CountArgs, verbose: bool) {
    for file in &args.files {
        match std::fs::read_to_string(file) {
            Ok(content) => {
                let lines = content.lines().count();
                let words = content.split_whitespace().count();
                let bytes = content.len();
                
                if args.lines {
                    println!("{:>8} {}", lines, file.display());
                } else if args.words {
                    println!("{:>8} {}", words, file.display());
                } else {
                    println!("{:>8} {:>8} {:>8} {}", lines, words, bytes, file.display());
                }
            }
            Err(e) => {
                eprintln!("Error reading {}: {}", file.display(), e);
            }
        }
    }
}

fn handle_search(args: &SearchArgs, verbose: bool) {
    if verbose {
        println!("Searching for '{}' in {}", args.pattern, args.path.display());
    }
    
    // Simplified search implementation
    let pattern = if args.ignore_case {
        args.pattern.to_lowercase()
    } else {
        args.pattern.clone()
    };
    
    println!("Would search for: '{}' in {:?}", pattern, args.path);
    println!("Extensions filter: {:?}", args.extensions);
    println!("Show line numbers: {}", args.line_numbers);
}

fn handle_organize(args: &OrganizeArgs, verbose: bool) {
    println!("Organizing {} → {}", args.source.display(), args.target.display());
    if args.dry_run {
        println!("(DRY RUN - no files will be moved)");
    }
}

fn main() {
    let cli = Cli::parse();
    
    match &cli.command {
        Commands::Count(args) => handle_count(args, cli.verbose),
        Commands::Search(args) => handle_search(args, cli.verbose),
        Commands::Organize(args) => handle_organize(args, cli.verbose),
        Commands::Stats { path, all } => {
            println!("Stats for: {} (all={})", path.display(), all);
        }
    }
}
```

**Usage examples:**
```bash
fileutil count -l src/main.rs src/lib.rs
fileutil search "TODO" ./src -i -n --extensions rs,toml
fileutil organize ./downloads --target ./sorted --dry-run
fileutil stats /home/user --all -v
```

**Explanation:**
- Clap derives CLI structure from Rust types (type-safe arguments!)
- Subcommands are modeled as enums (exhaustive handling)
- Built-in help generation, version flags, and error messages
- Supports default values, validation, value delimiters

**Scenario:** Every Rust CLI tool uses clap (or similar). Examples: ripgrep, bat, fd, exa, tokei — all world-class CLI tools written in Rust.
</details>

---

### Task 3: Building a Real Tool — grep Clone

**What to do:** Build a simplified grep that recursively searches files for a pattern, with case-insensitive mode and line numbers.

<details>
<summary>Click to see answer</summary>

```rust
use std::fs;
use std::io::{self, BufRead, BufReader};
use std::path::{Path, PathBuf};

#[derive(Debug)]
struct SearchConfig {
    pattern: String,
    ignore_case: bool,
    show_line_numbers: bool,
    max_results: Option<usize>,
}

#[derive(Debug)]
struct SearchMatch {
    file: PathBuf,
    line_number: usize,
    line: String,
    column: usize,
}

fn search_file(path: &Path, config: &SearchConfig) -> io::Result<Vec<SearchMatch>> {
    let file = fs::File::open(path)?;
    let reader = BufReader::new(file);
    let mut matches = Vec::new();
    
    let pattern = if config.ignore_case {
        config.pattern.to_lowercase()
    } else {
        config.pattern.clone()
    };
    
    for (line_num, line_result) in reader.lines().enumerate() {
        let line = line_result?;
        let search_line = if config.ignore_case {
            line.to_lowercase()
        } else {
            line.clone()
        };
        
        if let Some(col) = search_line.find(&pattern) {
            matches.push(SearchMatch {
                file: path.to_path_buf(),
                line_number: line_num + 1,
                line: line.clone(),
                column: col + 1,
            });
            
            if let Some(max) = config.max_results {
                if matches.len() >= max {
                    break;
                }
            }
        }
    }
    
    Ok(matches)
}

fn search_directory(dir: &Path, config: &SearchConfig) -> io::Result<Vec<SearchMatch>> {
    let mut all_matches = Vec::new();
    
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        
        if path.is_dir() {
            // Skip hidden directories
            if path.file_name()
                .and_then(|n| n.to_str())
                .map(|n| n.starts_with('.'))
                .unwrap_or(false) 
            {
                continue;
            }
            let sub_matches = search_directory(&path, config)?;
            all_matches.extend(sub_matches);
        } else if path.is_file() {
            // Only search text files
            let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");
            let text_extensions = ["rs", "txt", "md", "toml", "json", "yaml", "yml", 
                                   "js", "ts", "py", "html", "css", "sql"];
            if text_extensions.contains(&ext) {
                match search_file(&path, config) {
                    Ok(matches) => all_matches.extend(matches),
                    Err(_) => {} // Skip files we can't read
                }
            }
        }
        
        if let Some(max) = config.max_results {
            if all_matches.len() >= max {
                break;
            }
        }
    }
    
    Ok(all_matches)
}

fn format_match(m: &SearchMatch, config: &SearchConfig) -> String {
    let file_str = m.file.display();
    if config.show_line_numbers {
        format!("{}:{}:{}: {}", file_str, m.line_number, m.column, m.line.trim())
    } else {
        format!("{}: {}", file_str, m.line.trim())
    }
}

fn main() -> io::Result<()> {
    let config = SearchConfig {
        pattern: "fn main".to_string(),
        ignore_case: false,
        show_line_numbers: true,
        max_results: Some(20),
    };
    
    let path = Path::new(".");
    let matches = search_directory(path, &config)?;
    
    println!("Found {} matches for '{}':\n", matches.len(), config.pattern);
    for m in &matches {
        println!("  {}", format_match(m, &config));
    }
    
    Ok(())
}
```

**Explanation:** This is a simplified version of `ripgrep` — one of the most popular Rust CLI tools. Key patterns:
- Recursive directory walking with skip rules
- Buffered reading for performance
- Configurable search behavior
- Graceful error handling (skip unreadable files)

**Scenario:** Code search tools, log analyzers, configuration auditors — any tool that searches through many files.
</details>

---

### Task 4: Environment Variables & Process Management

**What to do:** Build a DevEnvironment struct that manages env vars and spawns child processes with full control.

<details>
<summary>Click to see answer</summary>

```rust
use std::collections::HashMap;
use std::env;
use std::process::{Command, Stdio};
use std::path::Path;

struct DevEnvironment {
    name: String,
    env_vars: HashMap<String, String>,
    working_dir: String,
}

impl DevEnvironment {
    fn new(name: &str) -> Self {
        DevEnvironment {
            name: name.to_string(),
            env_vars: HashMap::new(),
            working_dir: ".".to_string(),
        }
    }
    
    fn set_var(&mut self, key: &str, value: &str) -> &mut Self {
        self.env_vars.insert(key.to_string(), value.to_string());
        self
    }
    
    fn set_dir(&mut self, dir: &str) -> &mut Self {
        self.working_dir = dir.to_string();
        self
    }
    
    fn run(&self, program: &str, args: &[&str]) -> Result<ProcessResult, String> {
        println!("[{}] Running: {} {}", self.name, program, args.join(" "));
        
        let mut cmd = Command::new(program);
        cmd.args(args)
            .current_dir(&self.working_dir)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());
        
        // Set environment variables
        for (key, value) in &self.env_vars {
            cmd.env(key, value);
        }
        
        let output = cmd.output()
            .map_err(|e| format!("Failed to execute '{}': {}", program, e))?;
        
        Ok(ProcessResult {
            stdout: String::from_utf8_lossy(&output.stdout).to_string(),
            stderr: String::from_utf8_lossy(&output.stderr).to_string(),
            exit_code: output.status.code().unwrap_or(-1),
            success: output.status.success(),
        })
    }
    
    fn run_pipeline(&self, commands: &[(&str, &[&str])]) -> Result<Vec<ProcessResult>, String> {
        let mut results = Vec::new();
        
        for (program, args) in commands {
            let result = self.run(program, args)?;
            
            if !result.success {
                println!("  ✗ Command failed with exit code {}", result.exit_code);
                println!("  stderr: {}", result.stderr.trim());
                results.push(result);
                break; // Stop pipeline on failure
            }
            
            println!("  ✓ Success");
            results.push(result);
        }
        
        Ok(results)
    }
}

#[derive(Debug)]
struct ProcessResult {
    stdout: String,
    stderr: String,
    exit_code: i32,
    success: bool,
}

fn load_env_file(path: &Path) -> HashMap<String, String> {
    let mut vars = HashMap::new();
    
    if let Ok(content) = std::fs::read_to_string(path) {
        for line in content.lines() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            if let Some((key, value)) = line.split_once('=') {
                let value = value.trim_matches('"').trim_matches('\'');
                vars.insert(key.trim().to_string(), value.to_string());
            }
        }
    }
    
    vars
}

fn main() {
    // Load .env file
    let env_vars = load_env_file(Path::new(".env"));
    println!("Loaded {} env vars from .env", env_vars.len());
    
    // Show current environment info
    println!("\nCurrent directory: {:?}", env::current_dir().unwrap());
    println!("HOME: {:?}", env::var("HOME").or(env::var("USERPROFILE")));
    println!("PATH entries: {}", env::var("PATH").unwrap_or_default().split(':').count());
    
    // Create a development environment
    let mut dev = DevEnvironment::new("development");
    dev.set_var("RUST_LOG", "debug")
       .set_var("DATABASE_URL", "postgres://localhost/myapp_dev");
    
    // Run a command
    match dev.run("rustc", &["--version"]) {
        Ok(result) => {
            println!("\nRust version: {}", result.stdout.trim());
        }
        Err(e) => eprintln!("Error: {}", e),
    }
    
    // Run a pipeline
    println!("\nRunning build pipeline:");
    let pipeline_result = dev.run_pipeline(&[
        ("echo", &["Building project..."]),
        ("echo", &["Running tests..."]),
        ("echo", &["Done!"]),
    ]);
    
    match pipeline_result {
        Ok(results) => println!("Pipeline completed: {} commands", results.len()),
        Err(e) => eprintln!("Pipeline failed: {}", e),
    }
}
```

**Explanation:**
- `Command` API spawns child processes with full control
- Environment variables configure behavior without recompilation
- `.env` file loading is essential for development
- Pipelines allow chaining commands (like CI/CD scripts)

**Scenario:** Dev tools (cargo-watch), CI runners, deployment scripts, container managers — all spawn and manage processes.
</details>

---

## 🧪 Mini-Project: File Organizer CLI

**What to do:** Build a file organizer that sorts files into folders by extension, with dry-run support and a summary report.

<details>
<summary>Click to see answer</summary>

```rust
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

struct FileOrganizer {
    rules: HashMap<String, String>, // extension -> folder name
}

impl FileOrganizer {
    fn new() -> Self {
        let mut rules = HashMap::new();
        rules.insert("rs".to_string(), "code/rust".to_string());
        rules.insert("py".to_string(), "code/python".to_string());
        rules.insert("js".to_string(), "code/javascript".to_string());
        rules.insert("ts".to_string(), "code/typescript".to_string());
        rules.insert("jpg".to_string(), "images".to_string());
        rules.insert("png".to_string(), "images".to_string());
        rules.insert("gif".to_string(), "images".to_string());
        rules.insert("pdf".to_string(), "documents".to_string());
        rules.insert("doc".to_string(), "documents".to_string());
        rules.insert("docx".to_string(), "documents".to_string());
        rules.insert("mp3".to_string(), "audio".to_string());
        rules.insert("mp4".to_string(), "video".to_string());
        rules.insert("zip".to_string(), "archives".to_string());
        rules.insert("tar".to_string(), "archives".to_string());
        FileOrganizer { rules }
    }
    
    fn categorize(&self, path: &Path) -> &str {
        path.extension()
            .and_then(|ext| ext.to_str())
            .and_then(|ext| self.rules.get(ext))
            .map(|s| s.as_str())
            .unwrap_or("other")
    }
    
    fn organize(&self, source: &Path, target: &Path, dry_run: bool) -> Result<OrganizeReport, std::io::Error> {
        let mut report = OrganizeReport::default();
        
        for entry in fs::read_dir(source)? {
            let entry = entry?;
            let path = entry.path();
            
            if !path.is_file() { continue; }
            
            let category = self.categorize(&path);
            let dest_dir = target.join(category);
            let file_name = path.file_name().unwrap();
            let dest_file = dest_dir.join(file_name);
            
            if dry_run {
                println!("  [DRY] {} → {}", path.display(), dest_file.display());
            } else {
                fs::create_dir_all(&dest_dir)?;
                fs::rename(&path, &dest_file)?;
                println!("  Moved: {} → {}", path.display(), dest_file.display());
            }
            
            *report.by_category.entry(category.to_string()).or_insert(0) += 1;
            report.total_files += 1;
        }
        
        Ok(report)
    }
}

#[derive(Default)]
struct OrganizeReport {
    total_files: usize,
    by_category: HashMap<String, usize>,
}

impl OrganizeReport {
    fn display(&self) {
        println!("\n--- Organization Report ---");
        println!("Total files processed: {}", self.total_files);
        for (category, count) in &self.by_category {
            println!("  {}: {} files", category, count);
        }
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let organizer = FileOrganizer::new();
    
    let source = Path::new("./messy_folder");
    let target = Path::new("./organized");
    
    println!("File Organizer");
    println!("Source: {}", source.display());
    println!("Target: {}", target.display());
    println!();
    
    let report = organizer.organize(source, target, true)?; // dry_run = true
    report.display();
    
    Ok(())
}
```
</details>

---

## 🎯 Key Takeaways

| Tool | Crate | Use Case |
|------|-------|----------|
| File I/O | `std::fs` | Read/write files |
| Buffered I/O | `BufReader`/`BufWriter` | Large file performance |
| CLI parsing | `clap` | Professional arg handling |
| stdin/stdout | `io::stdin().lock()` | Pipe-composable tools |
| Exit codes | `ExitCode`, `process::exit()` | Proper error signaling |
| Path handling | `std::path` | Cross-platform paths |
| Process spawning | `std::process::Command` | Run external programs |
| Env vars | `std::env` | Configuration |
| Dir walking | `walkdir` crate (or manual) | Recursive file discovery |

---

## ⏭️ Next: Section 09 - Networking & HTTP Fundamentals
