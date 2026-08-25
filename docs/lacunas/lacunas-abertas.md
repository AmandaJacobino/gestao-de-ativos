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
| L-22 | A regularização de `Pendente de Nota Fiscal` é por lote ou item a item? Haverá painel/relatório de pendências fiscais para Operações/Fiscal?                                                | Provisionamento                     | Amanda + dev      |
| L-23 | Na Fase Futura (integração Omie), como será mantido o **mapeamento de-para** entre a nomenclatura de Estoque (ex: `NVT-45205`) e a Fiscal (ex: `Prism-v2-R3`)? Onde fica essa tabela de tradução? | Provisionamento / Logística Reversa | Back-end + Amanda |

### Técnicas / integração

| ID | Pergunta | Fluxo | Responsável |
|---|---|---|---|
| T-04 | Omie: o sistema apenas cria o Pedido de Venda e consulta a NF após o Fiscal emitir, ou dispara o faturamento automaticamente via API? | Provisionamento | 🔮 **Diferida — Fase Futura (Back-end)**. Nesta fase a NF é manual (nº + PDF). |
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

