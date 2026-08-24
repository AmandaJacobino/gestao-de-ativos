---
tags:
  - gestao-de-ativos
  - decisoes
related:
  - "[[contexto-geral]]"
  - "[[fluxo-02-provisionamento-e-saida]]"
  - "[[fluxo-03-logistica-reversa]]"
  - "[[fluxo-04-manutencao-e-reparo]]"
---

# Decisões — Sessão 2026-06-09 — Estoque × Fiscal

> Origem: documento de conhecimento interno `Estoque_X_Fiscal`
> Tema: desconexão entre Estoque Físico e Fiscal; independência inicial do Omie; afrouxamento das regras fiscais para viabilizar a operação.
> Impacto: Fluxos 2, 3 e 4, diagrama de estados e contexto-geral atualizados.

---

## Contexto

O mesmo dispositivo é identificado de formas distintas no **Estoque** (nome operacional, ex: `NVT-45205`) e no **Fiscal** (nome técnico/contábil, ex: `Prism-v2-R3`). Essa divergência impede a comunicação direta entre as duas bases. Unificá-las hoje exigiria recolher todos os dispositivos em campo — financeiramente inviável e arriscado para a retenção de clientes.

Para viabilizar o projeto a curto/médio prazo, as "rédeas" entre Estoque e Fiscal foram **afrouxadas**, adotando regras manuais e menos rígidas. O projeto de Gestão de Ativos nasce **focado nas Operações** e **isolado do ERP Omie**.

---

## D-31 — Independência inicial do Omie (NF manual + PDF)

**Decisão:** O sistema **nasce sem integração nativa com o Omie**. O número da NF (de saída e de devolução) é **registrado manualmente** no sistema, acompanhado do **upload do PDF da NF**. Qualquer automação futura com o ERP depende do time de **Back-end** e é tratada como **Fase Futura**.

**Impacto:**
- Reabre/posterga **T-04** (faturamento automático vs. consulta) — agora vinculada à Fase Futura.
- A integração já validada (T-01/D-07: NF-e Consultas, Utilitários de NF-e, Pedidos de Venda, Faturamento) permanece documentada como **alvo futuro**, não como escopo desta fase.

**No Front-end:** o foco é desenhar a interface com base no **fluxo operacional isolado**.

---

## D-32 — Reserva de dispositivos 100% manual

**Decisão:** **Não há geração automática de reserva.** A reserva é um processo **100% manual**, restrito ao **ambiente de Estoque**, e **não é refletida no Omie** (o ERP não suporta esse conceito de reserva, agravado pela divergência de nomenclatura).

**Mantido:** o SalesGrid continua criando a **solicitação** ao fechar contrato (D-12). Quem **reserva** os dispositivos é sempre Operações, manualmente.

**Impacto:** Fluxo 2, Etapa 2A; RN-10 (novo).

---

## D-33 — "Em Separação" / baixa exige número da NF + PDF

**Decisão:** Para garantir rastro auditável sem travar a operação, a etapa de **baixa/separação** solicita obrigatoriamente o **número da Nota Fiscal** e o **upload do arquivo PDF da NF**.

**Relação com D-34:** "solicita obrigatoriamente" significa que o sistema **pede** esses dados; se não forem informados, a saída ainda é permitida com a flag `Pendente de Nota Fiscal` (ver D-34). A `Baixa Definitiva` plena exige número **e** PDF.

**Impacto:** Fluxo 2, Etapa 2B/5A; RN-11 (novo).

---

## D-34 — Bloqueio fiscal da SAÍDA afrouxado (Pendente de NF / Baixa Definitiva)

**Decisão (substitui o bloqueio rígido anterior na saída — revisa D-08 e a antiga RN-01 do Fluxo 2):**

Ao solicitar a **Baixa no Estoque Físico**:
1. O sistema **solicita** o número da NF de Saída + PDF.
2. **Se NÃO informado:** o sistema **permite a saída física** e marca o lote com o status fiscal **`Pendente de Nota Fiscal`**.
3. **Se informado (número + PDF):** o sistema valida e define o status fiscal **`Baixa Definitiva`**.
4. Um lote `Pendente de Nota Fiscal` fica **destacado** e pode ser **regularizado a qualquer momento**, passando a `Baixa Definitiva`.

**Status fiscal é uma dimensão paralela** ao status logístico (Em Separação, Em Trânsito, …). Ex.: 🔵 Em Separação + 🟡 Pendente de Nota Fiscal simultaneamente.

**Racional:** nesta fase o foco é a eficiência operacional e o **saneamento gradual** do estoque físico (meta **> 90% de confiabilidade**) antes de qualquer integração sistêmica com o Omie. Travar a expedição engessaria a operação.

**⚠️ Escopo (confirmado com o usuário):** o afrouxamento vale **apenas para a SAÍDA**. O **bloqueio rígido de entrada na devolução** (D-15 — lab não recebe sem NF de devolução) **permanece**.

**Impacto:** Fluxo 2 (Etapa 2B, seção 5A, RN-01/RN-02 revisadas); diagrama de estados (dimensão fiscal paralela).

---

## D-35 — Logística reversa: roteamento por modelo e destino flexível

**Decisão:** A NF de retorno pode determinar destinos distintos conforme o **modelo** do equipamento e a demanda comercial:

**Destino de manutenção por modelo:**
- **Aurora / Sentinel** (Prism/Nexus/Fusion): estoque e manutenção de uma **empresa terceira** (RepairTech externa).
- **FlowTrack:** **estoque próprio** da Novus Tech (Engenharia interna).

**O retorno nem sempre passa pelo estoque.** Nem todo dispositivo que vai para conserto retorna ao estoque original — ele pode:
- voltar ao **estoque** (próprio ou da terceira);
- ser enviado **direto de volta ao cliente atual**;
- ser **remanejado para um novo cliente** (re-entrando no **Fluxo 2**).

**Impacto:** Fluxo 3 (seção 6A, RN-07/RN-08 novos, diagrama); Fluxo 4 (seção 6A, RN-09 novo, diagramas); diagrama de estados (novas transições Em Manutenção / Em Trânsito retorno → Reservado).

---

## Fragilidades do cenário atual (motivação — não são decisões)

Registradas para embasar o roadmap de saneamento (mitigação de longo prazo):

- **Envios sem NF:** já houve dispositivos enviados sem saldo no estoque Fiscal; o Fiscal "se virou nos 30" para emitir notas e dar baixa tardia.
- **Gargalo de atualização de hardware (Bem Ativo):** melhorias físicas alteram o valor do bem e exigem, para o Fiscal, mudança imediata de nomenclatura (evitar desvalorização contábil) — o Estoque não acompanha.
- **Auditoria mascarada:** como o estoque está em poder de terceiros (clientes), a auditoria confere apenas o estoque fiscal e envia cartas de confirmação; se a quantidade total bate, o cliente aprova — mascarando o desalinhamento entre o estoque fiscal "remendado" e o físico real.

---

## Estratégia de transição

- **Curto/médio prazo (comodato/locação):** dispositivos pertencem à Novus Tech, fisicamente com o cliente. Sistema controla quantidade, quem tem o quê, emissões de NF de manutenção e o ciclo de vida útil.
- **Longo prazo (venda definitiva):** dispositivos vendidos ao cliente; controle passa a ser apenas transacional (quantos/quais vendidos/enviados), sem preocupação com manutenção rotineira (exceto garantia/troca pontual).
