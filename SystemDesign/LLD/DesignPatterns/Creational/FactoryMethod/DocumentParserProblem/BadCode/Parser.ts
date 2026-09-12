// =============================================================================
// WHAT IS WRONG — missing Factory Method / factory pattern
// =============================================================================
// PATTERN IDEA: centralize object creation behind a factory keyed by type, so the
// rest of the code asks for "a parser for this extension" without switching.
//
// WHAT'S WRONG HERE: parseFile() switches on extension and news up the parser
// inline. Any other place that needs a parser repeats the same switch.
//
// REAL SCENARIO: add XML support — you edit this switch AND every other location
// that selects a parser, and a missed spot silently can't handle XML. The
// creation knowledge is scattered, so the format list drifts across the codebase.
//
// WHY BAD: parser selection is duplicated and tangled with parsing; adding a
// format edits multiple sites; easy to miss one.
//
// HOW TO FIX (no code): a ParserFactory (or registry mapping extension -> parser)
// owns creation. Callers ask the factory for a parser and just call parse(). New
// format = register one parser in the factory; callers don't change.
// =============================================================================
// ❌ NO FACTORY METHOD — parser chosen by a switch on file extension, scattered.
// Each new format edits this and duplicates the selection elsewhere.
class JsonParser { parse(s: string) { return JSON.parse(s); } }
class CsvParser { parse(s: string) { return s.split("\n").map(r => r.split(",")); } }

export function parseFile(ext: string, content: string): unknown {
  switch (ext) {
    case "json": return new JsonParser().parse(content); // new + switch
    case "csv": return new CsvParser().parse(content);
    // add "xml" => edit here AND every other place that picks a parser
    default: throw new Error("unsupported: " + ext);
  }
}
console.log(parseFile("json", '{"a":1}'));
