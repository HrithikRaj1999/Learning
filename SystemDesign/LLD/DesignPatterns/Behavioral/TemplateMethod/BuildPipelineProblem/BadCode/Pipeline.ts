// =============================================================================
// WHAT IS WRONG — missing Template Method pattern
// =============================================================================
// PATTERN IDEA: the base class owns the fixed algorithm skeleton; subclasses
// override only the varying steps.
//
// WHAT'S WRONG HERE: NodePipeline and GoPipeline both hardcode the full sequence
// (git checkout ... notify slack) and differ only in install/build/test commands.
// The pipeline skeleton is duplicated per language.
//
// REAL SCENARIO: you add a "security scan" stage or change the notify step. You
// must edit every language pipeline identically; a Python pipeline added later
// copies the skeleton again. One forgotten edit and CI behaves differently per
// language — a confusing, drift-prone bug.
//
// WHY BAD: the shared CI flow is copy-pasted; cross-cutting stage changes touch N
// classes and drift; no single definition of the pipeline.
//
// HOW TO FIX (no code): a Pipeline base defines run() with the fixed stages
// (checkout, install, build, test, notify), calling abstract install()/build()/
// test() hooks. NodePipeline/GoPipeline override only those commands. Skeleton
// changes once.
// =============================================================================
// ❌ NO TEMPLATE METHOD — Node and Go CI pipelines duplicate the checkout/notify
// skeleton; only install/build/test commands differ.
export class NodePipeline {
  run(): string[] {
    return ["git checkout", "npm install", "npm run build", "npm test", "notify slack"]; // 2-4 vary
  }
}
export class GoPipeline {
  run(): string[] {
    return ["git checkout", "go mod download", "go build", "go test", "notify slack"]; // 2-4 vary
  }
}
console.log(new NodePipeline().run());
