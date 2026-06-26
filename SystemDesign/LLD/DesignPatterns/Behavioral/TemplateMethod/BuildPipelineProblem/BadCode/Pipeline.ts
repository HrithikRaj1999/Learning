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
