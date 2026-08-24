---
tags:
  - gestao-de-ativos
  - lacunas
related:
  - "[[contexto-geral]]"
  - "[[divisao-de-tarefas]]"
---

# Lacunas e Perguntas em Aberto

> Atualizado em: 2026-06-09
> Cada item tem um ID para facilitar referência nas conversas.

---

## 🔴 Em aberto — precisam de definição

### Negócio

| ID   | Pergunta                                                                                                                                                                                           | Fluxo                               | Responsável       |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------- |
| L-13 | O retorno físico ao laboratório / RepairTech usa rastreamento dos Correios ou é entrega direta?                                                                                                            | Logística Reversa                   | Amanda + dev   |
| L-16 | "Falha em Campo" é um estado oficial visível na interface ou apenas um flag que precede "Aguardando NF de Devolução"?                                                                              | Logística Reversa                   | Amanda            |
| L-19 | Após a análise de Operações na falha em campo, a reserva do substituto é automática (com estoque → dispara Fluxo 2) ou disparada manualmente?                                                      | Logística Reversa                   | Amanda            |
| L-20 | O limite de **7 dias** sem comunicação (gatilho de troca para Prism/Nexus/Fusion) é fixo ou configurável por tipo/cliente?                                                                       | Logística Reversa                   | Amanda + dev      |
| L-21 | "Desmonte / reaproveitamento de peças" (após 3 manutenções + nova falha) é um estado próprio e visível? Como as peças reaproveitadas voltam/são registradas no estoque?                            | Manutenção                          | Amanda            |
| L-22 | A regularização de `Pendente de Nota Fiscal` (D-34) é por lote ou item a item? Haverá painel/relatório de pendências fiscais para Operações/Fiscal?                                                | Provisionamento                     | Amanda + dev      |
| L-23 | Na Fase Futura (integração Omie), como será mantido o **mapeamento de-para** entre a nomenclatura de Estoque (ex: `NVT-45205`) e a Fiscal (ex: `Prism-v2-R3`)? Onde fica essa tabela de tradução? | Provisionamento / Logística Reversa | Back-end + Amanda |

### Técnicas / integração

| ID | Pergunta | Fluxo | Responsável |
|---|---|---|---|
| T-04 | Omie: o sistema apenas cria o Pedido de Venda e consulta a NF após o Fiscal emitir, ou dispara o faturamento automaticamente via API? | Provisionamento | 🔮 **Diferida — Fase Futura (Back-end)** (D-31). Nesta fase a NF é manual (nº + PDF). |
| T-05 | Quais serviços de **e-mail transacional** e **WhatsApp** serão usados para notificar o cliente? | Provisionamento | Dev |

### Permissão / acesso

| ID | Pergunta | Fluxo | Responsável |
|---|---|---|---|
| P-01 | Comercial tem "visualização de quantidade" — pode ver outros dados do dispositivo (serial, localização)? | Todos | Amanda |
| P-02 | Níveis de acesso de **CS, Engenharia, CEO e Devs** — o que cada um pode visualizar e executar? | Todos | Amanda |

---

## ⏳ Bloqueadas (dependem de evento externo)

| ID | Pergunta | Fluxo | Bloqueio |
|---|---|---|---|
| L-11 | Campo exato no SalesGrid que sinaliza encerramento de contrato — a mapear | Logística Reversa | Aguarda migração do fluxo de encerramento para o SalesGrid |

---

## ✅ Fechadas (histórico de referência)

| ID | Pergunta | Resolução |
|---|---|---|
| L-07 | Baixa patrimonial no Omie ao descartar — manual ou via API? | 🔮 **Diferida — Fase Futura (Back-end)** (D-37). Nesta fase, baixa manual fora do sistema |
| L-01 | "Aurora" e "Sentinel" são produtos? | Aurora=Prism, Sentinel=Nexus — são **sistemas** (D-01) |
| L-02 | Quem recebe a notificação de NF no financeiro? | Vai para o Omie; não depende de pessoa específica (D-07) |
| L-03 | TaskFlow ou outro sistema para chamados? | Formulário **CSI** dentro do sistema (D-14) |
| L-04 | Complemento de aprovação parcial é automático ou manual? | **Manual**, com seleção em massa (D-29) |
| L-05 | Quais itens do kit FlowTrack rastrear? | Todos, individualmente — seriais próprios (D-23) |
| L-06 | "Aguardando NF" e "Em Trânsito" são distintos? | Sim, estados distintos |
| L-08 | Como detectar instalação/comunicação (Prism/Nexus/Fusion)? | Integração Aurora/Sentinel (D-28) |
| L-09 | Limite do contador de manutenções? | **3 manutenções**; depois, desmonte/reaproveitamento (D-16) |
| L-12 | Há SLA para devolução após fim de contrato? | Não há prazo formal (D-22) |
| L-14 | "Em Trânsito" pós-manutenção (RepairTech→Novus Tech) usa Correios? | Sim, rastreamento dos Correios (D-19) |
| L-15 | Reserva automática de substituto na falha em campo? | **Revogada** — só após análise de Operações (D-27 revisado) |
| L-17 | Falha de um único item do kit FlowTrack? | Manual; só o item afetado; seriais no mesmo contrato (D-23) |
| L-18 | Imagem anexada em obs.md (`Pasted image 20260602144534.png`) | Desconsiderada — obs.md removido; conteúdo textual já incorporado |
| T-01 | Integração Omie para puxar nº da NF é viável? | Sim — APIs NF-e Consultas, Utilitários, Pedidos de Venda, Faturamento (D-07) |
| T-02 | Intervalo de polling dos Correios? | No máximo duas vezes ao dia, em horários estratégicos |
| T-03 | Como o SalesGrid identifica tipo/qtd de dispositivos? | Campo já existe — apenas mapear (D-12) |
| P-03 | Canal de notificação de rastreamento ao cliente? | Sistema; ou e-mail/WhatsApp se sem acesso (D-30) |
