# Deployment

## Platform

**Cloudflare Pages** (production + preview) · **GitHub Actions** (CI) · **jsDelivr** (parts CDN, runtime only).

## Environments

| Env | URL | Trigger |
|-----|-----|---------|
| Development | http://localhost:5173 | `npm run dev` |
| Preview | https://{pr-slug}.legob.pages.dev | PR opened / updated |
| Production | https://legob.pages.dev (+ custom domain TBD) | merge to `main` |

## CI pipeline (`.github/workflows/ci.yml`)

On push to `main` and every PR to `main`:
1. Checkout.
2. Node 20, cache npm.
3. `npm ci`.
4. `npm run lint`.
5. `npm run typecheck`.
6. `npm run test:ci`.
7. `npm run build`.
8. Upload `dist/` artifact.

E2E job (PO Should-Fix #S2 — either main CI gate or nightly):

```yaml
  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

## Deploy pipeline (`.github/workflows/deploy.yml`)

On merge to `main`:
1. `npm ci`.
2. `npm run build`.
3. `cloudflare/pages-action@v1` with `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
4. Project: `legob`. Directory: `dist`. Branch: `main`.

## Secrets required (GitHub repo secrets)

| Secret | Used by | Source |
|--------|---------|--------|
| `CLOUDFLARE_API_TOKEN` | deploy workflow | Cloudflare dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | deploy workflow | Cloudflare dashboard → Workers & Pages sidebar |

User owns secret creation (USER/AGENT Responsibility section of PO validation).

## Caching headers (Cloudflare `_headers`)

```
/*
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; connect-src 'self' https://cdn.jsdelivr.net; worker-src 'self' blob:;

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

## Rollback

- `main` is the source of truth for deploys. To rollback, revert the offending commit and merge — CI redeploys.
- Cloudflare Pages keeps previous deploys accessible at immutable URLs if manual rollback is preferred.

→ Full context: [../fullstack-architecture.md#deployment-architecture](../fullstack-architecture.md#deployment-architecture)
