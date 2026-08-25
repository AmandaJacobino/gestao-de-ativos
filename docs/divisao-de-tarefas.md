---
tags:
  - gestao-de-ativos
  - tarefas
created: 2026-06-03
related:
  - "[[contexto-geral]]"
  - "[[fluxo-01-recebimento-e-cadastro]]"
  - "[[fluxo-02-provisionamento-e-saida]]"
  - "[[fluxo-03-logistica-reversa]]"
  - "[[fluxo-04-manutencao-e-reparo]]"
  - "[[lacunas-abertas]]"
---

# Divisão de Tarefas — Documentação dos Fluxos

> Projeto: Sistema de Gestão de Ativos
> Atualizado em: 2026-06-03
> Responsável: Amanda

---

## Como usar este documento

- Cada tarefa tem um **responsável principal** (quem escreve) e um **revisor** (quem lê e valida antes de fechar).
- Ao iniciar uma tarefa, coloque `🔄 Em andamento` na coluna Status.
- Ao concluir, coloque `✅ Feito` e anote a data.
- Dúvidas que surgirem durante o preenchimento vão para [[lacunas-abertas]].

---

## Visão geral da divisão

| Responsável | Foco principal |
|---|---|
| **Amanda** | Todos os fluxos — saída (Fluxo 1 e 2), retorno (Fluxo 3 e 4) e diagrama de estados |
| **Amanda** | Revisar os fluxos e fechar lacunas em aberto |

---

## Tarefas — Amanda

### A-01 · Contexto geral e glossário
- **Arquivo:** [[contexto-geral]]
- **O que fazer:**
  - [x] Confirmar tipos de dispositivos e sistemas (Aurora/Sentinel/FlowTrack) — ✅ Confirmado
  - [x] Esclarecer "Aurora" e "Sentinel" — ✅ São sistemas (Aurora=Prism, Sentinel=Nexus)
  - [ ] Confirmar papéis de acesso de CS e Engenharia (ver P-02 em lacunas) — ❓ Em aberto
- **Status:** ✅ Feito (P-02 permanece em aberto)

---

### A-02 · Fluxo 1 — Recebimento e Cadastro
- **Arquivo:** [[fluxo-01-recebimento-e-cadastro]] *(criado em 2026-06-02)*
- **O que documentar:**
  - [x] Quem realiza o cadastro — apenas Operações
  - [x] Campos obrigatórios e opcionais — documentados na seção 9
  - [x] Duplicata de serial — sistema bloqueia em tempo real
  - [x] Cadastro em lote — .xlsx e .csv com modelo padrão para download
  - [x] NF de compra obrigatória — sistema bloqueia sem ela
  - [x] Diagrama Mermaid — incluído na seção 12
- **Referência no projeto:** Seção "Workflow Etapa 1" do `PROJETO - GESTÃO DE ATIVOS.md`
- **Status:** ✅ Feito

---

### A-03 · Fluxo 2 — Provisionamento e Saída para Campo
- **Arquivo:** [[fluxo-02-provisionamento-e-saida]] *(criado em 2026-06-02)*
- **O que documentar:**
  - [x] Etapa 2A: SalesGrid campo existente, falha editável, aprovação parcial com painel de estoque
  - [x] Etapa 2B: alerta vai para Omie, sem prazo de NF, fallback manual, integração a validar pelo dev
  - [x] Etapa 2C: polling (não webhook), cliente + Operações notificados, FlowTrack vs Prism/Nexus, falha manual
  - [x] 3 diagramas Mermaid (2A, 2B, 2C)
- **Lacunas geradas (status 2026-06-03):** L-08 ✅, L-04 ✅, P-03 ✅, T-01 ✅, T-02 ✅ — todas fechadas. Novas pendências do dev: T-04 (faturamento Omie), T-05 (e-mail/WhatsApp).
- **Referência no projeto:** Seção "Workflow Etapa 2" do `PROJETO - GESTÃO DE ATIVOS.md`
- **Status:** ✅ Feito (lacunas técnicas pendentes com dev)

---

## Tarefas — Amanda (continuação)

### A-04 · Fluxo 3 — Logística Reversa (Retorno)
- **Arquivo:** [[fluxo-03-logistica-reversa]] *(criado em 2026-06-02)*
- **O que documentar:**
  - [x] Gatilho 1 (SalesGrid): campo a mapear após migração — L-11 aberta
  - [x] Gatilho 2 (falha): formulário CSI dentro do sistema — substitui TaskFlow
  - [x] Informações do chamado: campos do formulário CSI documentados
  - [x] NF de retorno: Fiscal emite no Omie
  - [x] Triagem: análise breve pelo Suporte antes do envio formal ao lab
  - [x] Sem NF: sistema BLOQUEIA entrada física + alerta fiscal
  - [x] Estados separados: Retorno → Aguardando NF → Em Trânsito → Em Manutenção
  - [x] Diagrama Mermaid incluído
- **Lacunas geradas:** L-11, L-13
- **Referência no projeto:** Seção "Workflow Etapa 3" do `PROJETO - GESTÃO DE ATIVOS.md`
- **Status:** ✅ Feito

---

### A-05 · Fluxo 4 — Manutenção e Reparo
- **Arquivo:** [[fluxo-04-manutencao-e-reparo]] *(criado em 2026-06-02)*
- **O que documentar:**
  - [x] ~~Laudo: só Manutenção cria/edita; Suporte/Operações visualizam~~ — **laudo removido desta versão**
  - [x] ~~Lista de peças: dinâmica~~ — **removida com o laudo**
  - [x] Contador com alerta: sim — limite de 3. **Núcleo do fluxo: registrar se foi à manutenção e quantas vezes**
  - [x] ~~Dispositivo reprovado com peças: campo de reaproveitamento~~ — **removido com o laudo**; reprovado/sem conserto → ⚫ Descartado / Baixa
  - [x] Baixa patrimonial Omie: 🔮 **Fase Futura** — fora do sistema nesta fase (L-07 diferida)
  - [x] Antes de voltar ao estoque: passa por "Em Trânsito" + campo de testes/diagnóstico
  - [x] Diagrama Mermaid incluído
- **Lacunas geradas (status 2026-06-03):** L-09 ✅ (limite 3) e L-14 ✅ (Correios) fechadas. Nova: L-21 (desmonte/reaproveitamento de peças).
- **Referência no projeto:** Seção "Workflow Etapa 4" do `PROJETO - GESTÃO DE ATIVOS.md`
- **Status:** ✅ Feito

---

### A-06 · Diagrama geral de estados
- **Arquivo:** [[estados-do-dispositivo]] *(criado em 2026-06-02)*
- **O que fazer:**
  - [x] stateDiagram-v2 com todos os 12 estados e todas as transições (saída + retorno)
  - [x] Tabela de regras de transição para o dev
  - [x] Lacunas que afetam o diagrama listadas explicitamente
  - [ ] **Validar diagrama** antes de passar ao dev
- **Status:** 🔄 Aguardando validação final

---

## Tarefas compartilhadas

| ID | Tarefa | Responsável | Status |
|---|---|---|---|
| C-01 | Revisar `docs/lacunas/lacunas-abertas.md` e responder as lacunas em aberto | Amanda | 🔄 Em andamento — várias fechadas em 2026-06-03 |
| C-02 | Revisar A-04 e A-05 antes de fechar | Amanda | ⬜ Aguardando |
| C-04 | Validar o diagrama geral de estados (A-06) | Amanda | ⬜ Aguardando |
| C-05 | Registrar em `docs/decisoes/` qualquer decisão de negócio tomada durante o preenchimento | Amanda | 🔄 Contínuo |

---

## Ordem sugerida de execução

```
Semana 1
├── A-01 (revisar contexto) + A-02 (Fluxo 1 — mais simples, bom para começar)
└── A-05 (Fluxo 4 — Manutenção, mais simples e independente)

Semana 2
├── A-03 (Fluxo 2 — o mais complexo)
└── A-04 (Fluxo 3 — Logística Reversa)

Semana 3
├── A-06 (Diagrama geral de estados)
└── C-01 a C-04 (revisões e fechamento de lacunas)
```

---

## Arquivos de referência

| Arquivo | Descrição |
|---|---|
| `PROJETO - GESTÃO DE ATIVOS.md` | Documento original do projeto (fonte da verdade) |
| [[contexto-geral]] | Visão geral, atores, glossário, estados |
| [[lacunas-abertas]] | Perguntas em aberto — consultar sempre |
