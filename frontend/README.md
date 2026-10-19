# Health Score de Revendedores — Frontend

Tela única para cadastrar revendedores, marcar critérios de relacionamento e ver o Health Score (0–10) com classificação por cor. Os dados ficam num Postgres no Neon, acessado por uma API Hono (`server/`), com login por e-mail e senha.

Especificação: [`../especificacao-health-score-revendedores.md`](../especificacao-health-score-revendedores.md)

## Rodando

```bash
npm install
cp .env.example .env.local   # cole a DATABASE_URL do Neon
npm run db:migrate           # cria as tabelas
npm run user:create          # repita para cada usuário
npm run dev                  # API em :3001 + front em :5173 (proxy /api)
npm run build                # build de produção em dist/
```

Outros: `npm run user:password` (troca a senha e encerra as sessões), `npm run db:generate` (gera migration após mudar `server/db/schema.ts`).

## Deploy (Vercel)

Root Directory = `frontend`. Defina `DATABASE_URL` nas variáveis do projeto. A API roda como Function em `api/index.ts` (`vercel.json` reescreve `/api/*`). Rode `npm run db:migrate` antes de deploys que mudem o banco.

## Onde mexer

- **Critérios do checklist:** `shared/criteria.ts`. Novos itens aparecem no painel e entram no cálculo automaticamente.
- **Faixas de cor:** `shared/bands.ts`.
- **Regras compartilhadas com o backend** (cálculo da nota, validação de CNPJ, schema da API): `shared/`. Plano do backend em [`../docs/plano-backend.md`](../docs/plano-backend.md).
- **API:** rotas em `server/routes/`, acesso ao banco em `server/repositories/`, tabelas em `server/db/schema.ts`.
- **Chamadas do front:** `src/services/` (cliente tipado `hc`, tradução dos campos para português, mensagens de erro em `erros.ts`).
