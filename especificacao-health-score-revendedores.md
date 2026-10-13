# Especificação — Sistema de Health Score de Revendedores

## 1. Contexto

Empresa de chocolates que trabalha com uma rede de revendedores. Hoje o acompanhamento da saúde de cada revendedor é feito de forma manual e pouco estruturada. O objetivo é ter um sistema simples onde a equipe interna consiga:

1. Cadastrar a empresa revendedora com dados básicos.
2. Marcar critérios de relacionamento (checklist).
3. Ver automaticamente a nota de **Health Score** e sua classificação por cor.

**Usuária principal:** colaboradora da equipe comercial/atendimento, sem perfil técnico. A interface precisa ser amigável, direta, rápida de preencher e sem jargões.

---

## 2. Princípios de interface

- **Uma única tela.** Todo o sistema acontece em uma página só. Nada de navegação entre páginas.
- **Cadastro e edição em painel lateral (drawer)** que abre por cima da lista e fecha ao salvar. Em celular, o painel ocupa a tela inteira.
- **Poucos cliques:** cadastrar um revendedor deve levar menos de 1 minuto.
- **Linguagem simples e acolhedora**, sem termos técnicos.
- **A cor fala primeiro:** o status do revendedor é visível de longe na lista.
- **Visual limpo:** fundo claro, bastante espaço em branco, cantos arredondados, uma fonte só (ex.: Inter), um tom de chocolate como cor de destaque (`#6B3E26`) para botões e títulos.

---

## 3. Escopo do MVP

### Incluído
- Tela única com resumo, lista de revendedores e painel de cadastro/edição.
- Checklist de critérios de Health Score dentro do painel, abaixo dos dados cadastrais.
- Cálculo automático e em tempo real da nota.
- Indicador visual de cor (vermelho / amarelo / verde).
- Edição e exclusão de revendedor.

### Fora do escopo (versões futuras)
- Login / múltiplos usuários e permissões.
- Histórico da nota ao longo do tempo.
- Integrações (CRM, WhatsApp, e-mail).
- Relatórios e exportação.

---

## 4. A tela única

```
┌───────────────────────────────────────────────────────────┐
│  🍫 Revendedores                     [ + Novo revendedor ] │
│                                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                      │
│  │ 🔴  3   │ │ 🟡  5   │ │ 🟢  12  │   ← resumo clicável  │
│  │Atenção  │ │Observar │ │Saudável │     (filtra a lista) │
│  └─────────┘ └─────────┘ └─────────┘                      │
│                                                           │
│  [ 🔍 Buscar por empresa ou responsável...            ]   │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Doce Sabor Ltda        Maria Souza        ● 3 /10   │  │
│  │ (11) 98765-4321 · maria@docesabor.com     Atenção   │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │ Cacau & Cia            João Lima          ● 9 /10   │  │
│  │ (41) 99876-5432 · joao@cacauecia.com      Saudável  │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### 4.1 Cabeçalho
- Título "Revendedores".
- Botão principal **"+ Novo revendedor"**, sempre visível, abre o painel vazio.

### 4.2 Resumo por status
- Três cartões: **Atenção** (vermelho), **Observar** (amarelo), **Saudável** (verde), cada um com a quantidade de revendedores.
- Clicar em um cartão filtra a lista; clicar de novo remove o filtro. O cartão ativo fica destacado.

### 4.3 Busca
- Um campo só, que filtra por nome da empresa ou responsável enquanto digita.

### 4.4 Lista de revendedores
- Cada revendedor é uma linha/cartão com: empresa, responsável, contato, e-mail, nota (`X /10`) e badge colorido com o texto do status.
- **Clicar na linha abre o painel de edição** daquele revendedor (não há botão "Editar" separado).
- Ordenação padrão: menor nota primeiro, para destacar quem precisa de atenção.
- **Estado vazio:** ilustração simples + "Nenhum revendedor cadastrado ainda" + botão "Cadastrar o primeiro".

---

## 5. Painel de cadastro / edição (drawer)

Abre pela direita, por cima da lista. Título: "Novo revendedor" ou o nome da empresa, quando for edição.

```
┌──────────────────────────────────┐
│  Novo revendedor            [ ✕ ]│
│                                  │
│  Dados da empresa                │
│  Nome da empresa  [............] │
│  Responsável      [............] │
│  Contato          [(__) _____-___]│
│  E-mail           [............] │
│                                  │
│  Como está o relacionamento?     │
│  ☑ Cliente responde as mensagens │
│  ☐ Cliente participa das reuniões│
│    de ciclo                      │
│  ☑ Cliente está ativo na base    │
│                                  │
│  ┌────────────────────────────┐  │
│  │  Health Score   7 /10      │  │
│  │  ● Observar  (amarelo)     │  │
│  └────────────────────────────┘  │
│                                  │
│  Excluir          [ Salvar ]     │
└──────────────────────────────────┘
```

### 5.1 Dados da empresa

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Nome da empresa | texto | Sim | mín. 2 caracteres |
| Responsável | texto | Sim | mín. 2 caracteres |
| Contato (telefone/WhatsApp) | texto com máscara `(00) 00000-0000` | Sim | 10 ou 11 dígitos |
| E-mail | e-mail | Sim | formato de e-mail válido |

### 5.2 Checklist de relacionamento
- Título da seção: **"Como está o relacionamento?"**
- Cada critério é um checkbox; **a linha inteira é clicável**.
- Critérios iniciais (1 ponto cada):
  - Cliente responde as mensagens
  - Cliente participa das reuniões de ciclo
  - Cliente está ativo na base
  - *(demais critérios a definir — ver seção 6.3)*

### 5.3 Card de resultado
- Fixo no rodapé do painel, sempre visível, mesmo rolando.
- Mostra a nota (`7 /10`) e o status com cor + texto.
- Atualiza a cada clique no checklist, com uma transição suave de cor.

### 5.4 Ações
- **Salvar** (botão principal): valida, salva, fecha o painel e mostra o aviso "Revendedor salvo".
- **✕ / clicar fora / tecla Esc:** fecha o painel. Se houver alterações não salvas, pergunta "Descartar alterações?".
- **Excluir** (link discreto, só na edição): pede confirmação simples ("Excluir Doce Sabor Ltda?") e mostra o aviso "Revendedor excluído" com opção **Desfazer** por alguns segundos.

---

## 6. Regra de cálculo do Health Score

### 6.1 Pontuação
- Cada critério marcado = **1 ponto**.
- Critério desmarcado = 0 ponto.

### 6.2 Nota final (escala 0–10)
A nota é normalizada para que as faixas de cor funcionem com qualquer quantidade de critérios:

```
nota = arredondar( (pontos_marcados / total_de_criterios) × 10 )
```

Se a lista tiver exatamente 10 critérios, a nota é igual à soma direta dos pontos.

### 6.3 Critérios
Os critérios ficam em **um único arquivo de configuração** (`src/config/criterios.ts`), para que seja fácil adicionar, remover ou renomear itens sem mexer no restante do código.

```ts
export const CRITERIOS = [
  { id: "responde_mensagens", label: "Cliente responde as mensagens" },
  { id: "participa_reunioes", label: "Cliente participa das reuniões de ciclo" },
  { id: "ativo_na_base",      label: "Cliente está ativo na base" },
  // adicionar os demais critérios aqui
];
```

### 6.4 Classificação por cor

| Nota | Status exibido | Cor |
|---|---|---|
| 0 – 4 | Atenção | Vermelho `#DC2626` |
| 5 – 7 | Observar | Amarelo `#F59E0B` |
| 8 – 10 | Saudável | Verde `#16A34A` |

As faixas também ficam em configuração (`src/config/faixas.ts`).

### 6.5 Função de referência

```ts
function calcularHealthScore(marcados: string[], total: number) {
  const nota = total === 0 ? 0 : Math.round((marcados.length / total) * 10);
  const status = nota >= 8 ? "verde" : nota >= 5 ? "amarelo" : "vermelho";
  return { nota, status };
}
```

---

## 7. Modelo de dados

```ts
type StatusHealth = "vermelho" | "amarelo" | "verde";

interface Revendedor {
  id: string;                  // uuid
  nomeEmpresa: string;
  responsavel: string;
  contato: string;             // apenas dígitos
  email: string;
  criteriosMarcados: string[]; // ids dos critérios marcados
  nota: number;                // 0–10, calculada
  status: StatusHealth;        // calculado
  criadoEm: string;            // ISO date
  atualizadoEm: string;        // ISO date
}
```

> `nota` e `status` são sempre recalculados a partir de `criteriosMarcados` ao salvar.

---

## 8. Persistência

**MVP:** `localStorage` do navegador (chave `revendedores`), sem backend.

Encapsular o acesso a dados em `src/services/revendedores.ts` com as funções `listar()`, `criar()`, `atualizar()` e `excluir()`. Assim, a troca futura por uma API ou banco (ex.: Supabase, Firebase) exige mudança apenas nesse arquivo.

---

## 9. Stack sugerida

- **React + TypeScript** com **Vite**
- **Tailwind CSS** para estilos
- **React Hook Form + Zod** para formulário e validação
- Sem roteador (a aplicação tem uma tela só)

---

## 10. Requisitos de UX e acessibilidade

- Interface em português (pt-BR).
- Responsiva: no celular, o painel ocupa a tela inteira e a lista vira cartões empilhados.
- Badge de status sempre com **cor + texto** (não depender só da cor).
- Mensagens de erro curtas e gentis abaixo de cada campo (ex.: "Informe um e-mail válido").
- Foco automático no primeiro campo ao abrir o painel.
- Navegável por teclado (Tab, Espaço para marcar, Esc para fechar).
- Avisos (toasts) breves no canto inferior.

---

## 11. Critérios de aceite

- [ ] Todo o sistema funciona em uma única tela, sem troca de página.
- [ ] "+ Novo revendedor" abre o painel vazio; clicar em um revendedor abre o painel preenchido.
- [ ] Não é possível salvar com campos obrigatórios vazios ou e-mail inválido.
- [ ] Marcar/desmarcar um critério atualiza a nota e a cor imediatamente.
- [ ] Nota 0–4 exibe vermelho, 5–7 amarelo, 8–10 verde.
- [ ] Os cartões de resumo mostram a contagem correta e filtram a lista ao clicar.
- [ ] A busca filtra por empresa ou responsável.
- [ ] É possível excluir um revendedor, com confirmação e opção de desfazer.
- [ ] Os dados continuam lá após recarregar a página.
- [ ] Adicionar um novo critério no arquivo de configuração aparece automaticamente no painel e entra no cálculo.

---

## 12. Estrutura de pastas sugerida

```
src/
├── config/
│   ├── criterios.ts
│   └── faixas.ts
├── services/
│   └── revendedores.ts
├── utils/
│   └── healthScore.ts
├── components/
│   ├── ResumoStatus.tsx
│   ├── BuscaRevendedor.tsx
│   ├── ListaRevendedores.tsx
│   ├── BadgeStatus.tsx
│   ├── PainelRevendedor.tsx
│   ├── ChecklistCriterios.tsx
│   └── CardNota.tsx
└── App.tsx
```
