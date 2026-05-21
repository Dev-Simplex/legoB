# Deployment — Coolify (Static Site, sem Docker)

LegoB é um SPA estático (Vite + React + TS, sem backend). No Coolify usamos o tipo **Static Site** — Coolify cuida do build via Nixpacks e serve o `dist/` direto, sem precisar escrever Dockerfile.

## Build local (sanity check)

```bash
npm ci
npm run build
# saída: dist/
npm run preview   # http://localhost:4173 — confere o build de prod
```

## Coolify — passo a passo

1. **New Resource → Application → Public Repository** (ou Private, conforme seu setup).
2. Repositório: `https://github.com/<seu-usuario>/legob` (faça `git push` antes).
3. Branch: `main`.
4. **Build Pack:** `Static` (ou `Nixpacks` — ambos servem; `Static` é mais explícito).
5. **Build configuration** (na aba *Configuration → Build*):
   - **Install Command:** `npm ci`
   - **Build Command:** `npm run build`
   - **Publish/Output Directory:** `dist`
6. **Port:** Coolify ignora porta em Static Site (serve via proxy interno). Se aparecer campo obrigatório, use `3000` ou `80`.
7. **Domain:** atribua o subdomínio em *Domains* — Coolify provisiona TLS via Traefik/Let's Encrypt.
8. **Build Environment Variables** (não confundir com runtime — não há runtime):
   - `VITE_LDRAW_CDN_BASE` — URL do mirror LDraw (opcional, default no código).
   - `VITE_SENTRY_DSN` — DSN do Sentry (opcional, MVP roda sem).
   > ⚠️ Vars `VITE_*` são **inline no bundle durante `npm run build`**. Mudar exige rebuild — runtime env não existe nesse setup.
9. **Deploy.**

## SPA fallback

Coolify (Static Site) normalmente já faz fallback para `index.html` em rotas não-encontradas. Se você notar 404 ao atualizar uma rota qualquer (o app hoje não tem rotas, mas considere para o futuro), procure *Single Page Application* / *SPA mode* nas settings do site no Coolify e habilite — ou adicione um `public/_redirects` com:

```
/*    /index.html   200
```

## Variáveis de ambiente

Não há runtime env. Tudo é build-time (`VITE_*`). Mudou uma var → dispare um redeploy/rebuild no Coolify.

## Resource hints

- **CPU/RAM:** Static Site é só estático. 0.1 CPU + 64 MB RAM já basta para servir. Build (one-shot) usa ~1 GB.
- **Logs:** Coolify captura logs do servidor estático. Sem storage server-side — o app é stateless; toda persistência (saves, settings) vive no `localStorage`/`IndexedDB` do navegador.

## Troubleshooting

| Sintoma | Causa provável | Fix |
|---|---|---|
| Build falha em `npm ci` | `package-lock.json` divergente | Rode `npm install` local, commite o lock, redeploy |
| Bundle não pega nova env var | `VITE_*` cacheada de build anterior | "Force rebuild without cache" no Coolify |
| 404 em rota direta (futuro) | SPA fallback não ativado | Habilite SPA mode no Coolify ou adicione `public/_redirects` |
| Página carrega branca em prod | Erro JS — abra DevTools Console | Cheque se `VITE_*` estão setadas, ou se o build local também branca |
