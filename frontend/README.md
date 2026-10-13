# Health Score de Revendedores — Frontend

Tela única para cadastrar revendedores, marcar critérios de relacionamento e ver o Health Score (0–10) com classificação por cor. Os dados ficam no `localStorage` do navegador (chave `revendedores`).

Especificação: [`../especificacao-health-score-revendedores.md`](../especificacao-health-score-revendedores.md)

## Rodando

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # build de produção em dist/
```

## Onde mexer

- **Critérios do checklist:** `src/config/criterios.ts`. Novos itens aparecem no painel e entram no cálculo automaticamente.
- **Faixas de cor:** `src/config/faixas.ts`.
- **Persistência:** `src/services/revendedores.ts` (`listar`, `criar`, `atualizar`, `excluir`, `restaurar`). Para trocar por uma API, mude apenas esse arquivo.
