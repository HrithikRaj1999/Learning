# Naming — API Handler Problem — Fix Hints
> Handlers + payload fields must name the domain.
## Wrong now
`h`, `d`, `u`, `p`, `r`, `check` — none reveal that this is a login handler with
username/password.
## Hints
- [ ] `h` → `handleLogin`; `d` → `body`; `u/p` → `username/password`.
- [ ] `check` → `verifyCredentials`; `r` → `isValid`.
- [ ] Response strings → meaningful status codes + bodies.
## Done-when
- [ ] The function reads as login intent without comments.
