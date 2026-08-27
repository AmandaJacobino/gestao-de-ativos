---
tags:
  - gestao-de-ativos
  - contexto
created: 2026-06-02
status: em-construcao
related:
  - "[[fluxo-01-recebimento-e-cadastro]]"
  - "[[fluxo-02-provisionamento-e-saida]]"
  - "[[fluxo-03-logistica-reversa]]"
  - "[[fluxo-04-manutencao-e-reparo]]"
  - "[[divisao-de-tarefas]]"
  - "[[lacunas-abertas]]"
---

# Contexto Geral — Sistema de Gestão de Ativos

> Criado em: 2026-06-02
> Status: Em construção — baseado na leitura inicial do documento `PROJETO - GESTÃO DE ATIVOS.md`

---

## O que é o sistema

Um sistema interno para **rastrear e controlar o ciclo de vida completo de dispositivos IoT** — desde a chegada do fornecedor até o descarte, passando por instalação em campo, retorno e manutenção.

O sistema busca máxima **rastreabilidade fiscal** (Nota Fiscal) e visibilidade do status de cada dispositivo em tempo real. Nesta fase, porém, o foco é a **eficiência operacional**: na **saída**, a NF é incentivada mas não bloqueia (flag `Pendente de NF` / `Baixa Definitiva`); na **devolução**, o bloqueio sem NF é mantido. Ver a seção abaixo.

---

## Direcionamento Estoque × Fiscal (2026-06-09)


**Problema central — desconexão de nomenclaturas:** o mesmo dispositivo é identificado de formas distintas no **Estoque** (nome operacional, ex: `NVT-45205`) e no **Fiscal** (nome técnico/contábil, ex: `Prism-v2-R3`). Unificar as bases hoje exigiria recolher todos os dispositivos em campo — inviável. Por isso o projeto **nasce isolado do ERP Omie**, focado nas Operações; qualquer automação com o Omie é **Fase Futura (Back-end)**.

**Auroraptações desta fase (rédeas afrouxadas):**
- **Reserva 100% manual**, restrita ao Estoque (Omie não suporta reserva).
- **NF (saída e devolução) registrada manualmente + upload do PDF**.
- **Saída sem bloqueio rígido:** permite sair marcando `Pendente de Nota Fiscal`; com NF, `Baixa Definitiva`. **Devolução mantém o bloqueio**.
- **Retorno roteado por modelo / destino flexível** — Aurora/Sentinel → terceira; FlowTrack → estoque próprio; pode voltar ao cliente atual ou a um novo cliente.

**Estratégia de transição (visão de futuro):**
- **Curto/médio prazo (comodato/locação):** dispositivos são da Novus Tech, em poder do cliente. Sistema controla quantidade, quem tem o quê, emissões de NF de manutenção e ciclo de vida.
- **Longo prazo (venda definitiva):** dispositivos vendidos ao cliente; controle passa a ser apenas transacional (quantos/quais foram vendidos).

**Meta de saneamento:** atingir **> 90% de confiabilidade** do estoque físico antes de qualquer integração sistêmica com o Omie.

---

## Atores (quem usa o sistema)

| Ator | Papel principal |
|---|---|
| **Operações** | Recebe dispositivos, gerencia estoque, aprova reservas, separa equipamentos para envio |
| **Comercial** | Visualiza quantidade disponível; a integração com SalesGrid cria solicitações automáticas |
| **Financeiro / Fiscal** | Emite NF de saída e NF de retorno; desbloqueia etapas do fluxo |
| **Suporte Técnico** | Abre chamados de recolhimento quando dispositivo falha em campo |
| **Laboratório / AT** | Realiza triagem e reparo dos dispositivos em manutenção e registra o desfecho (Aprovado / Reprovado) |
| **CEO** | Acesso de visualização / gestão |
| **Engenharia** | Acesso técnico |
| **CS (Customer Success)** | Acompanhamento de dispositivos no cliente |
| **Devs** | Acesso técnico ao sistema |

---

## Sistemas e seus dispositivos

A empresa possui três sistemas de monitoramento, cada um com dispositivos específicos:

| Sistema | Dispositivo | Comportamento ao entregar |
|---|---|---|
| **Aurora** | Prism | "Em Operação" somente após instalação e comunicação em campo |
| **Sentinel** | Nexus | "Em Operação" somente após instalação e comunicação em campo |
| **FlowTrack** | DataHub (kit) | "Em Operação" automaticamente ao ser entregue (não requer instalação) |
| — | **Fusion** (Prism + Nexus) | Em desenvolvimento; já em uso em Portugal. Mesmo comportamento de Prism/Nexus. |

### Composição do kit FlowTrack

Um contrato FlowTrack inclui o seguinte kit por unidade contratada:

| Item | Qtd |
|---|---|
| DataHub (dispositivo principal) | 1× |
| Hastes | 3× |
| Celular | 1× |
| Fone | 1× |
| Carregadores | 2× (um para o celular, um para o coletor) |
| Cabos | 2× (um para o carregador do celular, um para o coletor) |

> Todos os itens têm número de série com etiquetas próprias da empresa. O sistema rastreia cada item individualmente como um ativo separado.

---

## Estados possíveis de um dispositivo

```
— Caminho de saída —

🟡 Em Estoque
   ↓ (reserva MANUAL no Estoque — Operações)
⚪ Reservado
   ↓ (baixa de estoque — saída permitida c/ ou s/ NF)
🔵 Em Separação  ← flag fiscal: 🟡 Pendente de NF (sem NF) | ✅ Baixa Definitiva (NF + PDF)
   ↓ (envio físico realizado)
⚪ Em Trânsito (a caminho do cliente)
   ↓ (Correios confirma entrega)
   ├──► [FlowTrack] ──────────────► 🟢 Em Operação (automático)
   └──► [Prism / Nexus / Fusion] ──► ⚪ Entregue
                                            ↓ (comissionado no Aurora / Sentinel)
                                        🟢 Em Operação
                                            ├──► ✅ Sub-status: Comunicando
                                            └──► ⚠️ Sub-status: Falha na Comunicação

— Caminho de retorno —

🟢 Em Operação
   ├──► [fim de contrato] ──► 🟠 Aguardando NF de Devolução
   └──► [falha em campo] ──► Operações analisa ──► 🟠 Falha em Campo
         • Prism/Nexus/Fusion: Aurora/Sentinel detecta > 7 dias sem comunicar
         • FlowTrack: relato do cliente via CSI
                                          ↓
                                     🟠 Aguardando NF de Devolução  ← BLOQUEIO MANTIDO: lab não recebe sem NF (nº + PDF, manual)
                                          ↓ (NF emitida)
                                     ⚪ Em Trânsito (retornando)
                                          ↓ (chegou — destino por modelo: Aurora/Sentinel → terceira; FlowTrack → estoque próprio)
                                     🔴 Em Manutenção
                                          ├──► (aprovado) ──► destino: 🟡 Em Estoque  OU  cliente atual / novo cliente (re-entra no Fluxo 2)
                                          ├──► (3+ manut. + nova falha) ──► desmonte ──► ⚫ Descartado / Baixa
                                          └──► (sem conserto) ──► ⚫ Descartado / Baixa
```

---

## Integrações previstas

| Sistema | Finalidade | Status |
|---|---|---|
| **SalesGrid** | Leitura de contratos fechados → gera a **solicitação** de reserva (a reserva dos dispositivos é **manual**) | Planejado |
| **Omie** | Criar pedido de venda; puxar NF emitida (saída e devolução) | 🔮 **Fase Futura (Back-end)**. Nesta fase **sem integração nativa**: NF (saída e devolução) registrada **manualmente** + PDF. |
| **Correios** | Rastreamento de envio para cliente (polling) | Máx. duas vezes ao dia, em horários estratégicos (T-02 definida) |
| **Aurora** | Comissionamento, sub-status de comunicação e detecção de falha (>7 dias sem comunicar) — **Prism** | Nova integração — a especificar |
| **Sentinel** | Idem Aurora — **Nexus** e **Fusion** | Nova integração — a especificar |
| **E-mail / WhatsApp** | Notificar o cliente sobre rastreamento, se ele não tiver acesso ao sistema | Provedores a definir (T-05) |
| **Google Chat** | Notificações internas | Em avaliação |

---

## Fluxos identificados

1. [[fluxo-01-recebimento-e-cadastro|Recebimento e Cadastro]] — chegada do lote do fornecedor, registro do dispositivo
2. [[fluxo-02-provisionamento-e-saida|Provisionamento e Saída para Campo]] — reserva, aprovação, emissão de NF, envio
3. [[fluxo-03-logistica-reversa|Logística Reversa (Retorno)]] — recolhimento por fim de contrato ou falha em campo
4. [[fluxo-04-manutencao-e-reparo|Manutenção e Reparo]] — triagem, contador de manutenções e decisão de reuso ou descarte

---

## Estrutura de navegação (sidebar)

A sidebar fica posicionada à esquerda e deve ser **recolhível**. Estrutura de menus:

```
Sidebar
├── Dashboard
├── Inventário
│   ├── Estoque
│   │     (botão "Cadastrar novo dispositivo" + opção de upload em lote)
│   ├── Solicitações
│   │     (reservas de dispositivos originadas do Comercial / SalesGrid)
│   └── Em Campo
│         (dispositivos comissionados — Prism/Nexus/Fusion — e FlowTrack com cliente)
├── Manutenção
│     (histórico de manutenção: se foi à bancada e o contador de manutenções)
└── Em Trânsito
    ├── Enviado
    │     (dispositivos a caminho do cliente)
    └── Logística Reversa
          (dispositivos retornando — troca ou fim de contrato)
```

---

## Glossário mínimo

| Termo | Significado no contexto |
|---|---|
| **NF** | Nota Fiscal |
| **IMEI** | Identificador único de chip SIM do dispositivo |
| **ICCID** | Identificador único do SIM card |
| **Serial** | Número de série do hardware (chave primária do cadastro) |
| **Comodato** | Modalidade contratual: o cliente usa, mas não é proprietário do dispositivo |
| **Comissionado** | Dispositivo instalado e ativo no cliente |
| **Logística reversa** | Processo de devolução do dispositivo ao estoque/laboratório |
| **Contador de Manutenções** | Quantas vezes o dispositivo já foi à manutenção (limite de 3 — depois, desmonte) |
| **Bipeção / bipagem** | Ato de escanear o código do dispositivo para registrar entrada/saída |
