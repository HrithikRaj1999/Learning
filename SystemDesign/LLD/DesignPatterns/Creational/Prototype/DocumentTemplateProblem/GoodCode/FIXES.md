# Prototype — Document Template Problem — Fix Hints
> Prepare one template; clone it for each document.
## Wrong now
Every `new Document()` reloads the template + fonts. Cost scales with #documents.
## Hints
- [ ] Build the template ONCE as a prototype instance.
- [ ] Add `clone(): Document` that copies state without re-running the heavy load.
- [ ] Deep-copy mutable parts (`sections`, `styles`) so edits don't leak between docs.
- [ ] New document = `template.clone()`, then customize.
## Done-when
- [ ] Heavy load runs once; clones are independent.
