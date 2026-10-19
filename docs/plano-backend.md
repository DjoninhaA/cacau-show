# Plano — Backend (BFF) do Health Score de Revendedores

Backend para o frontend em `frontend/`, cobrindo **apenas o que a tela já faz hoje** (listar, cadastrar, editar, excluir e desfazer exclusão), mais **login com 2 usuários** e **registro de autoria** de cada cadastro.

Especificação do produto: [`../especificacao-health-score-revendedores.md`](../especificacao-health-score-revendedores.md)

---

## Decisões

| Tema | Decisão |
|---|---|
| Hospedagem | Tudo na **Vercel**: front estático + API como Vercel Function, no mesmo domínio |
| Framework | **Hono**, com o cliente tipado `hc` no front |
| Banco | **Postgres no Neon** (via Vercel Marketplace) |
| Acesso ao banco | **Drizzle** (schema em TS, migrations geradas) |
| Validação | **Zod**, com schema compartilhado entre front e back |
| Login | E-mail + senha, **2 usuários** criados por script (sem tela de cadastro) |
| Sessão | Token aleatório em cookie `httpOnly`; hash do token na tabela `sessions` |
| Autoria | `created_by`, `updated_by`, `deleted_by` gravados desde o início (ainda não exibidos) |
| Critérios | Continuam em **arquivo** (`shared/criteria.ts`), não no banco |
| Idioma | Backend, banco, rotas, JSON e `shared/` em **inglês**. Textos exibidos à usuária e o código de `src/` em **português** |

### Idioma na fronteira front ↔ API

- A API usa campos em inglês (`companyName`, `contactName`, `phone`...). O `src/services/` traduz para o modelo do front (`nomeEmpresa`, `responsavel`, `contato`...), então os componentes não mudam.
- Os **valores de status** (`"red" | "yellow" | "green"`) e os **ids dos critérios** são identificadores internos compartilhados, iguais nos dois lados.
- Erros da API são **códigos** (`{ "error": "INVALID_CREDENTIALS" }`); o front converte em mensagens em português.

---

## Estrutura

```
frontend/                      ← Root Directory na Vercel
├── api/index.ts               ← Vercel Function (entrada do Hono)
├── server/
│   ├── app.ts                 ← monta rotas, csrf, onError; exporta AppType
│   ├── db/
│   │   ├── client.ts
│   │   └── schema.ts
│   ├── auth/
│   │   ├── password.ts        ← hashPassword / verifyPassword (scrypt)
│   │   ├── session.ts         ← createSession / getSession / deleteSession
│   │   └── middleware.ts      ← requireAuth
│   ├── routes/
│   │   ├── auth.ts
│   │   └── resellers.ts
│   └── repositories/
│       └── resellers.ts
├── shared/                    ← regras usadas pelo front e pelo back
│   ├── criteria.ts
│   ├── bands.ts
│   ├── healthScore.ts
│   ├── validation.ts
│   ├── resellerSchema.ts
│   └── types.ts
├── scripts/user.ts            ← criar usuário / trocar senha
├── src/                       ← front
├── drizzle.config.ts
└── vercel.json                ← rewrite /api/* → /api
```

Regras de importação:

```
src/     → pode importar de shared/  e  "import type" de server/
server/  → pode importar de shared/
shared/  → não importa de nenhum dos dois
```

---

## Fase 0 — Preparação

Objetivo: separar as regras de negócio em `shared/`, sem mudar o comportamento do front.

- [ ] Criar `shared/` em inglês:
  - `criteria.ts` — `CRITERIA` (`{ id, label, type: "positive" | "negative" }`), ids em inglês, rótulos em português
  - `bands.ts` — `BANDS` e `bandForStatus()`, status `"red" | "yellow" | "green"`
  - `healthScore.ts` — `calculateHealthScore()` e `knownCriteria()`
  - `validation.ts` — `onlyDigits()`, `isValidCnpj()`
  - `resellerSchema.ts` — Zod do payload da API (somente dígitos)
  - `types.ts` — `HealthStatus`, `Reseller`, `ResellerInput`
- [ ] Remover `src/config/` e `src/utils/healthScore.ts`; ajustar imports do front.
- [ ] `tsconfig.app.json` passa a incluir `shared/`; criar `tsconfig.server.json` para `api/`, `server/`, `shared/` e `scripts/`.
- [ ] Instalar `hono`, `@hono/zod-validator`, `drizzle-orm`, `@neondatabase/serverless`; dev: `drizzle-kit`, `vercel`.

**Pronto quando:** `npm run build` passa e o front funciona como antes (ainda com `localStorage`).

> Os ids dos critérios mudam para inglês. Marcações já salvas no `localStorage` de algum navegador deixam de ser reconhecidas — aceitável, pois a importação desses dados está fora do escopo.

---

## Fase 1 — Banco de dados

- [ ] Criar o Neon pela Vercel (Storage → Neon); `vercel link`; `vercel env pull` → `.env.local` com `DATABASE_URL`.
- [ ] `server/db/schema.ts`:

**`users`**

| Coluna | Tipo |
|---|---|
| `id` | uuid |
| `name` | text |
| `email` | text, único, minúsculas |
| `password_hash` | text |
| `created_at` | timestamptz |

**`sessions`**

| Coluna | Tipo |
|---|---|
| `id` | text — hash do token |
| `user_id` | uuid → `users` |
| `expires_at` | timestamptz |
| `created_at` | timestamptz |

**`resellers`**

| Coluna | Tipo | No front |
|---|---|---|
| `id` | uuid | `id` |
| `company_name` | text | `nomeEmpresa` |
| `cnpj` | char(14) | `cnpj` |
| `contact_name` | text | `responsavel` |
| `phone` | varchar(11) | `contato` |
| `email` | text | `email` |
| `checked_criteria` | text[] | `criteriosMarcados` |
| `created_at` / `updated_at` | timestamptz | `criadoEm` / `atualizadoEm` |
| `deleted_at` | timestamptz | — (`null` = ativo) |
| `created_by` / `updated_by` | uuid → `users` | — |
| `deleted_by` | uuid → `users` | — |

- [ ] `server/db/client.ts` (driver serverless do Neon), `drizzle.config.ts`, scripts `db:generate` e `db:migrate`.
- [ ] Gerar e aplicar a migration inicial.

`score` e `status` **não são gravados**: são calculados na leitura com `shared/healthScore.ts`.

**Pronto quando:** as tabelas existem no Neon.

---

## Fase 2 — Usuários e autenticação

- [ ] `scripts/user.ts`:
  - `npm run user:create` — pede nome, e-mail e senha (oculta)
  - `npm run user:password` — troca a senha e apaga as sessões do usuário
- [ ] Criar os 2 acessos.

| Rota | O que faz | Respostas |
|---|---|---|
| `POST /api/auth/login` | `{ email, password }` → cria sessão e define o cookie | `200 { name, email }` · `401 INVALID_CREDENTIALS` |
| `POST /api/auth/logout` | apaga sessão e cookie | `204` |
| `GET /api/auth/me` | quem está logado | `200 { name, email }` · `401 UNAUTHORIZED` |

- Mesmo erro para e-mail inexistente e senha errada.
- Cookie: `httpOnly`, `Secure` (só em produção), `SameSite=Lax`, validade de 30 dias.
- `requireAuth` coloca o usuário em `c.var.user`.

**Pronto quando:** login, `me` e logout funcionam via `curl`.

---

## Fase 3 — API de revendedores

Todas as rotas atrás de `requireAuth`:

| Rota | Autoria gravada | Respostas |
|---|---|---|
| `GET /api/resellers` | — | `200` lista (sem excluídos) com `score` e `status` |
| `POST /api/resellers` | `created_by`, `updated_by` | `201` · `400 VALIDATION_ERROR` |
| `PUT /api/resellers/:id` | `updated_by` | `200` · `400` · `404 NOT_FOUND` |
| `DELETE /api/resellers/:id` | `deleted_at`, `deleted_by` | `204` · `404` |
| `POST /api/resellers/:id/restore` | limpa exclusão; `updated_by` | `200` · `404` |

- [ ] Autoria vem **sempre da sessão**, nunca do corpo da requisição.
- [ ] Erros no formato `{ "error": "CODE" }`: `UNAUTHORIZED`, `INVALID_CREDENTIALS`, `VALIDATION_ERROR`, `NOT_FOUND`, `INTERNAL_ERROR`.
- [ ] `server/app.ts` com `basePath("/api")`, `csrf()`, `onError` e `export type AppType`.
- [ ] `api/index.ts` com o adaptador `hono/vercel`; `vercel.json` com o rewrite.
- [ ] **Validar cedo:** o rewrite preserva o caminho original e o cookie funciona no `vercel dev`.
- [ ] **Validar cedo:** a Vercel Function resolve os imports sem extensão (`./types`) de `server/` e `shared/` em runtime ESM. Se não resolver, trocar o `tsconfig.server.json` para `module`/`moduleResolution: "nodenext"` e usar imports com `.js`.

**Pronto quando:** sem cookie → `401`; com cookie, as 5 rotas funcionam e gravam a autoria.

---

## Fase 4 — Front

- [ ] `src/services/auth.ts`: `entrar`, `sair`, `eu`.
- [ ] `src/services/revendedores.ts` com `hc<AppType>`, mantendo as assinaturas atuais e traduzindo os campos.
- [ ] `src/services/erros.ts`:

  | Código | Mensagem |
  |---|---|
  | `INVALID_CREDENTIALS` | E-mail ou senha incorretos |
  | `UNAUTHORIZED` | Sua sessão expirou. Entre novamente. |
  | `NOT_FOUND` | Este revendedor não existe mais. |
  | `VALIDATION_ERROR` | Confira os dados e tente de novo. |
  | outros / rede | Não foi possível concluir. Tente de novo. |

- [ ] `TelaLogin.tsx`; verificação de `me` ao abrir; "Olá, Nome" + **Sair** no cabeçalho; qualquer `401` volta ao login.
- [ ] Tratamento de erros ao salvar (painel continua aberto), excluir, restaurar e carregar a lista.
- [ ] `npm run dev` passa a usar `vercel dev`.

**Pronto quando:** sem login nada aparece; com login, tudo funciona como hoje.

---

## Fase 5 — Testes e deploy

- [ ] Vitest: `calculateHealthScore`, `isValidCnpj`.
- [ ] Rotas com `app.request()` contra uma branch de teste do Neon:
  - login certo/errado; logout invalida a sessão
  - todas as rotas de revendedores sem cookie → `401`
  - autoria: A cria, B edita → `created_by` = A, `updated_by` = B; quem exclui fica em `deleted_by`
  - fluxo: criar → listar → atualizar → excluir → restaurar
- [ ] Roteiro no navegador, incluindo login e sair.
- [ ] Deploy: Root Directory = `frontend`; `npm run db:migrate` manual antes de deploys que mudem o banco; criar os 2 usuários em produção; testar no endereço publicado.

---

## Segurança — pendente de decisão

Itens de código sugeridos, ainda não incluídos nas fases:

- Senha mínima (12+ caracteres) no `scripts/user.ts`
- `secureHeaders()` do Hono
- Tempo de resposta constante no login (calcular hash mesmo para e-mail inexistente)
- Validade menor da sessão (7 dias) e limpeza de sessões expiradas

Fora do código (lista de verificação):

- 2FA nas contas da Vercel, do Neon e do GitHub
- Conferir backup / restauração para um ponto no tempo do Neon
- Dependabot no GitHub
- LGPD: base legal, exclusão definitiva sob pedido, dados hospedados fora do Brasil

---

## Fora do escopo

- Exibir quem cadastrou/alterou (os dados já ficam gravados)
- Telas de troca e recuperação de senha
- Bloqueio por tentativas de senha
- Cadastro de critérios pela tela
- CNPJ único, importação do `localStorage`, histórico de notas
