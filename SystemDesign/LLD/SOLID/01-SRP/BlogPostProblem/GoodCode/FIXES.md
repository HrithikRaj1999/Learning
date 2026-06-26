# SRP — BlogPost Problem — Fix Hints
> Content model ≠ rendering ≠ slug ≠ persistence ≠ caching.
## Wrong now
`BlogPost` renders markdown, builds slugs, saves, and busts cache. The slug is
buggy (keeps punctuation → broken URLs) and markdown render is an XSS risk.
## Hints
- [ ] `BlogPost` = title + body model only.
- [ ] `MarkdownRenderer` owns body→HTML and sanitizes output (security).
- [ ] `Slugifier` owns title→slug; fix it to strip punctuation/normalize unicode.
- [ ] `PostRepository` owns persistence; a `CacheInvalidator` (injected) handles
      cache — persistence shouldn't know about Redis directly.
- [ ] Compose in a `PublishPostService`.
## Done-when
- [ ] Slug is correct + unit-tested in isolation.
- [ ] Render is sanitized; swapping markdown libs touches one class.
