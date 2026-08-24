---
tags:
  - gestao-de-ativos
  - decisoes
related:
  - "[[fluxo-04-manutencao-e-reparo]]"
  - "[[contexto-geral]]"
  - "[[lacunas-abertas]]"
---

# Decisões — Revisão dos Fluxos — 2026-06-10

> Tema: simplificação da manutenção (remoção dos laudos) e confirmação do Omie como Fase Futura (off por enquanto).
> Participantes: Amanda
> Impacto: Fluxo 4 (Manutenção), diagrama de estados, contexto geral, divisão de tarefas e trackers de lacunas.

---

## D-36 — Remoção dos laudos de manutenção

**Decisão:** O sistema **não terá mais laudo de manutenção**. Ao olhar os fluxos, concluiu-se que, para o objetivo atual, basta saber **se o dispositivo foi para a manutenção** e **quantas vezes** ele foi — nada além disso precisa ser registrado como documento técnico.

**O que sai:**
- O **documento de laudo** e todos os seus campos: `Peças Trocadas`, `Motivo da Reprovação` (detalhado), `Peças Reaproveitadas`, `O que vai para descarte`.
- As **regras de perfil de acesso ao laudo** (criar/editar/visualizar).

**O que permanece:**
- O status 🔴 **Em Manutenção** (registra que o dispositivo foi à bancada).
- O `Contador de Manutenções` (+1 a cada entrada) e o **limite de 3 manutenções** → desmonte/reaproveitamento (D-16 mantida).
- O **desfecho Aprovado / Reprovado**, que continua decidindo o caminho do dispositivo: aprovado → destino (estoque / cliente — D-35); reprovado / sem conserto → ⚫ Descartado / Baixa.

**Decisões revogadas por esta:**
- ~~D-17~~ (lista de peças trocadas dinâmica) — não há mais laudo onde registrar peças trocadas.
- ~~D-18~~ (peças documentadas antes do descarte) — campo de reaproveitamento removido.
- ~~D-20~~ (acesso ao laudo por perfil) — sem laudo, sem regra de acesso a laudo.

> O campo opcional de **diagnóstico/testes** pode permanecer como apoio operacional da própria manutenção, mas **não** constitui laudo nem é obrigatório.

---

## D-37 — Omie permanece como Fase Futura (integração off por enquanto)

**Decisão:** A integração com o **Omie** é **assunto de futuro (sem data)** e fica **off nesta fase**. Isso já valia para a captura de NF (D-31); agora estende-se explicitamente à **baixa patrimonial no descarte**.

**Efeito:**
- A pendência **L-07** (baixa patrimonial no Omie ao descartar — manual ou via API) deixa de ser uma pergunta ativa desta fase e passa a 🔮 **Fase Futura (Back-end)**. Nesta fase, ao descartar, o sistema apenas registra ⚫ **Descartado / Baixa**; a baixa patrimonial é tratada **fora do sistema**, manualmente, pelo Fiscal.
- Mantém-se a realidade externa de que o **Fiscal emite NF no Omie** (saída e devolução) por fora — registro de número + PDF continua **manual** no sistema (D-31).

**Não muda:** D-31 a D-35 seguem válidas. Esta decisão apenas **consolida** o Omie como fora de escopo de integração nesta fase, sem pendências ativas dependendo dele.

---

## Arquivos atualizados nesta revisão

- `docs/fluxos/fluxo-04-manutencao-e-reparo.md` — remoção de laudo; Omie/L-07 → Fase Futura.
- `docs/fluxos/estados-do-dispositivo.md` — L-07 → Fase Futura.
- `docs/contexto-geral.md` — atores, sidebar, glossário e lista de fluxos sem menção a laudo.
- `docs/divisao-de-tarefas.md` — G-02 ajustada.
- `docs/lacunas/lacunas-abertas.md` e `Lacunas.md` — L-07 diferida; P-02 sem referência a laudo.
