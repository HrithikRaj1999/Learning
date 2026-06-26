# Template Method — Build Pipeline — Fix Hints
> Shared CI skeleton; language-specific steps overridden.
## Wrong now
`NodePipeline` and `GoPipeline` duplicate checkout + notify; only install/build/
test differ.
## Hints
- [ ] Abstract `Pipeline` with `run()` = checkout → install → build → test → notify.
- [ ] checkout/notify concrete; install/build/test abstract.
- [ ] `NodePipeline`/`GoPipeline` override the three varying steps.
- [ ] Add a hook (e.g. `shouldDeploy()`) for optional stages.
## Done-when
- [ ] Pipeline order changes in one place; new language overrides three steps.
