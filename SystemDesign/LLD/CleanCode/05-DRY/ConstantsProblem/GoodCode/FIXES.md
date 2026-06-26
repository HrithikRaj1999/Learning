# DRY — Magic Constant Duplication — Fix Hints
> A repeated literal is duplicated knowledge.
## Wrong now
`30` (free-tier file limit) is copy-pasted across four functions + a label.
Changing the plan means hunting every occurrence.
## Hints
- [ ] Define one `FREE_TIER_FILE_LIMIT = 30` constant; reference it everywhere.
- [ ] Derive the label from the constant (template), don't hardcode "30" in text.
- [ ] Group related plan limits in a config object if more appear.
## Done-when
- [ ] The limit lives in exactly one place; changing it is a single edit.
