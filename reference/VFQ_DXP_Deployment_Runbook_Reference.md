# VFQ DXP prototype - deployment run book (Development)

Short operating guide for hosting the prototype as a static site. Items in [brackets] are not known yet and must be filled in by the hosting team.

## 1. What this is

- A front-end-only single-page app (React + Vite + TypeScript). **No backend, API, database or secrets.**
- `npm run build` produces `dist/`: `index.html`, hashed files under `assets/`, and the data the app loads in the browser (`mock-data/*.json`, `config/*.json`, `brand/`).
- All data is synthetic mock JSON. Each user's session state lives in their own browser; nothing is shared or stored server-side.
- The app's sign-in is simulated in the browser (one shared demo password for all roles, visible in the source). **It is not security** - see section 4.

## 2. Build

Requirements: Node 22, npm (the repo uses `package-lock.json`, so use `npm ci`).

```bash
cd vfq-dxp-app
npm ci
npm run build        # runs tsc -b (type check) then vite build
```

- The build fails on a TypeScript error; treat that as a failed pipeline.
- Expected result: `dist/` containing `index.html` and `assets/` (JS about 1 MB, 271 kB gzipped). A "chunk larger than 500 kB" warning is known and harmless.
- Record the git commit hash of the build alongside the artefact.

## 3. Deploy

1. Upload the contents of `dist/` to the web root: [bucket / path / VM directory].
2. Invalidate the CDN cache: [distribution id / command].
3. Keep the previous build's `dist/` (or the previous release folder) for rollback.

Required server settings:

| Setting | Value |
|---|---|
| HTTPS | Required, on [dev hostname] |
| Unknown paths | Serve `/index.html` with status 200 (the app uses browser-style URLs such as `/mobile/new-connection`) |
| `/assets/*` | `Cache-Control: public, max-age=31536000, immutable` (files are content-hashed) |
| `/index.html` | `Cache-Control: no-cache` |
| `/mock-data/*`, `/config/*` | `Cache-Control: no-cache` |
| Indexing | `X-Robots-Tag: noindex, nofollow` on every response |

nginx example:

```nginx
location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
location /mock-data/ { add_header Cache-Control "no-cache"; }
location /config/ { add_header Cache-Control "no-cache"; }
location / {
    try_files $uri /index.html;
    add_header Cache-Control "no-cache";
}
add_header X-Robots-Tag "noindex, nofollow" always;
```

## 4. Access control (do before sharing the link)

- Place the site behind [SSO / VPN / IP allowlist], limited to [stakeholder group]. Do not expose it to the public internet.
- Reason: the demo password and every role's staff ID are in the shipped code and in the role workbook; anyone who can load the site can sign in as any role.
- All customer names, ID numbers and phone numbers are synthetic. Data owner confirmation: [name, date].

## 5. Smoke test after every deploy

1. Open the home URL: the sign-in page loads, no errors in the browser console.
2. Sign in with one role (credentials from the role workbook, supplied separately).
3. Open Customer Search, search "Ahmed", open a result: the Customer 360 page loads.
4. Open a deep link such as `/mobile/new-connection` directly in a new tab, then refresh it: the page loads (not a 404).
5. In the browser network panel, confirm `/mock-data/customers.json` returns 200.
6. Sign out: the sign-in page returns and the saved session is cleared.

## 6. Rollback

1. Re-upload the previous `dist/` to the web root (or repoint the release alias).
2. Invalidate the CDN cache.
3. Re-run the smoke test.

No data migration is involved, since there is no database.

## 7. Common problems

| Symptom | Likely cause | Fix |
|---|---|---|
| 404 on refresh or on a pasted link | `index.html` fallback missing | Add the fallback rule in section 3 |
| Old version still showing | CDN or browser cache | Invalidate the CDN; check `index.html` is `no-cache` |
| Blank page | A JS or data file failed to load | Check the browser console and that `/assets/*` and `/mock-data/*` return 200 |
| Sign-in works but data is empty | `/mock-data/*.json` blocked or 404 | Check the host serves the `mock-data` folder and no firewall rule blocks `.json` |
| "Customer view" pop-up does nothing | Browser pop-up blocker | Allow pop-ups for the site. The pop-up only works within the same browser |
| A user's state looks odd | State is stored in that browser | Sign out (clears it), or clear the site's storage |

## 8. Contacts

- Business owner: [name]
- Prototype / technical owner: [name]
- Hosting / infrastructure: [team or name]
- Information security approver: [name]

## 9. Open items before go-live

- [ ] Hostname, certificate and DNS: [owner]
- [ ] Access control choice and stakeholder list: [owner]
- [ ] Data owner confirms in writing that all data is synthetic
- [ ] Information-security and change-management approvals, if required
- [ ] Branding / legal sign-off for the Vodafone logo, if shown beyond the project team
- [ ] Confirm the final build makes no external requests (fonts, scripts, analytics), if policy blocks them
