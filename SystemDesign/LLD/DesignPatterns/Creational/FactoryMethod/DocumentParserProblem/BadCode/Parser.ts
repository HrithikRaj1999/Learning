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
