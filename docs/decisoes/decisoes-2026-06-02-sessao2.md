---
tags:
  - gestao-de-ativos
  - decisoes
related:
  - "[[contexto-geral]]"
  - "[[fluxo-03-logistica-reversa]]"
  - "[[fluxo-04-manutencao-e-reparo]]"
  - "[[divisao-de-tarefas]]"
---

# Decisões — Sessão 2 — 2026-06-02

> Sessão de levantamento dos Fluxos 3 e 4
> Participantes: Amanda
> Formato: Respostas às perguntas da tarefa G-01 e G-02

---

## D-14 — Formulário CSI substitui o TaskFlow

**Decisão:** O formulário de abertura de chamados de troca e logística reversa será construído **dentro do sistema de gestão de ativos**, eliminando o TaskFlow do processo.

**Nome do formulário:** CSI — Central de Suporte Interno — Formulário de Atendimento.

**Tipos de solicitação cobertos:** Dúvida, Envio, Problema (Troca), Logística Reversa (Custo Novus Tech), Retirada de Materiais.

**Para este fluxo:** apenas os tipos **Problema (Troca)** e **Logística Reversa** disparam o fluxo de retorno de dispositivos.

**Nota de escopo:** o CSI é um módulo mais amplo que a logística reversa. O dev deve considerar que outras equipes também o usarão.

**Atualização (2026-06-03 — Amanda):**
- **Remover "Dúvida"** dos tipos de solicitação cobertos. Tipos finais: **Envio, Problema (Troca), Logística Reversa (Custo Novus Tech), Retirada de Materiais**.
- Além de Operações, o formulário será usado também pelo **CS** (Customer Success) — e potencialmente outras equipes para solicitar envios.

---

## D-15 — Bloqueio fiscal no retorno: sistema deve impedir entrada sem NF

**Decisão:** O sistema deve **bloquear** a entrada física do dispositivo no laboratório enquanto a NF de devolução não estiver registrada.

**Rationale:** A prática atual (emitir a NF após o fato) é fiscalmente irregular e compromete a rastreabilidade do ativo. A NF é o "GPS fiscal" do dispositivo.

**O que o sistema deve exibir:** Mensagem explicando o impacto fiscal e de rastreabilidade ao tentar registrar a entrada sem NF.

**Confirmação (2026-06-03 — Amanda):** ✅ **Aprovado.** O bloqueio de entrada sem NF de devolução está confirmado para implementação.

---

## D-16 — Contador de manutenções com alerta de limite

**Decisão:** O sistema deve incrementar automaticamente um `Contador de Manutenções` sempre que o dispositivo entrar em manutenção, e exibir um alerta quando o limite configurado for atingido.

**Objetivo:** Dar visibilidade sobre dispositivos com histórico de falhas recorrentes, para embasar decisões de descarte.

**Definição (2026-06-03 — Amanda) — L-09 fechada:** O limite é de **3 manutenções por dispositivo**. Após esse número, se o dispositivo **voltar a apresentar problema**, ele não segue para reparo normal — é encaminhado para **desmonte e reaproveitamento de peças**. Se não houver nenhuma peça reaproveitável, segue para **descarte / baixa**.

**Nova pendência (L-21):** O **"Desmonte / reaproveitamento de peças"** é um estado próprio e visível no sistema (distinto de Descartado)? E como as peças reaproveitadas retornam/são registradas no estoque?

---

## D-17 — Lista de peças trocadas é dinâmica

> ❌ **REVOGADA em 2026-06-10 (D-36).** Com a remoção dos laudos, não há mais registro de peças trocadas. Mantida aqui apenas como histórico.

**Decisão:** A lista de **Peças Trocadas** no laudo de manutenção não é fixa. O técnico pode adicionar itens novos além dos pré-cadastrados.

**Rationale:** Novos problemas podem surgir com o tempo. A lista fixa seria rapidamente obsoleta.

---

## D-18 — Dispositivo reprovado pode ter peças documentadas antes do descarte

> ❌ **REVOGADA em 2026-06-10 (D-36).** O campo de documentação de peças reaproveitadas foi removido junto com os laudos. O reprovado/sem conserto segue direto para ⚫ Descartado / Baixa. Mantida aqui apenas como histórico.

**Decisão:** Quando um dispositivo for reprovado e não tiver conserto, o sistema deve perguntar se há peças aproveitáveis. Se sim, o técnico preenche um campo documentando o que foi recuperado antes do status mudar para Descartado.

---

## D-19 — Manutenção inclui etapa "Em Trânsito" antes de voltar ao estoque

**Decisão:** Após a aprovação nos testes pelo laboratório, o dispositivo não vai diretamente para "Em Estoque". Ele passa primeiro por ⚪ **Em Trânsito** — confirmando que saiu do laboratório e chegou fisicamente à Novus Tech — e só então muda para 🟡 **Em Estoque**.

**Confirmação (2026-06-03 — Amanda) — L-14 fechada:** Esse "Em Trânsito" (RepairTech externa → Novus Tech) **usa rastreamento dos Correios** (polling, mesma lógica do Fluxo 2).

---

## D-20 — Acesso ao laudo por perfil

> ❌ **REVOGADA em 2026-06-10 (D-36).** Sem laudo, não há regra de acesso a laudo. Mantida aqui apenas como histórico.

**Decisão:**
- **Manutenção:** criar, editar e visualizar laudos.
- **Suporte / Operações:** visualizar laudos (somente leitura).
- Outros perfis: a definir com Amanda.

---

## D-21 — SalesGrid: campo de encerramento de contrato ainda não migrado

**Decisão (informação de estado atual):** O fluxo de encerramento de contratos ainda não foi migrado para o SalesGrid. Quando ocorrer, haverá um campo com valor "FECHADO", "ENCERRAMENTO" ou "CONTRATO ENCERRADO" que o sistema deve mapear para disparar o Gatilho 1 do Fluxo 3.

**Enquanto isso:** o retorno por fim de contrato deve ser iniciado manualmente pelo Suporte via formulário CSI.

---

## D-23 — Kit FlowTrack: todos os itens são rastreados individualmente

**Decisão:** Todos os itens do kit FlowTrack têm número de série próprio com etiquetas da empresa. O sistema deve rastrear **cada item individualmente** como um ativo separado. Um contrato FlowTrack cria até 10 registros de ativos no sistema (1 DataHub, 3 Hastes, 1 Celular, 1 Fone, 2 Carregadores, 2 Cabos).

**Resolução (2026-06-03 — Amanda) — L-17 fechada:**
- **Todos os seriais do kit ficam vinculados ao mesmo contrato**, para que o sistema saiba que aquele conjunto está em posse de determinado cliente.
- A falha de um **único item** (ex: só o celular ou uma haste) é tratada **manualmente por Operações**: o cliente entra em contato relatando o problema → Operações analisa → preenche o formulário (CSI) registrando que **aquele item específico** será trocado → o sistema segue o fluxo de troca normalmente para o item.

---

## D-24 — Estado "Retorno" eliminado — substituído por "Aguardando NF de Devolução"

**Decisão:** O estado "🟠 Retorno" não existe mais. Ao ser acionado o retorno (por fim de contrato ou falha em campo), o dispositivo vai diretamente para 🟠 **Aguardando NF de Devolução**.

---

## D-25 — Novo estado: "Falha em Campo"

**Decisão:** Quando o Suporte preenche o formulário CSI identificando um dispositivo com falha em campo pelo serial, o sistema muda o status para 🟠 **Falha em Campo** antes de iniciar o fluxo de NF reversa.

**Pendência (ainda aberta — L-16):** Confirmar se "Falha em Campo" aparece na interface como estado visível ou é apenas um flag/rótulo que precede "Aguardando NF de Devolução". *(Amanda não respondeu nesta rodada.)*

---

## D-26 — Manutenção tem duas vertentes por tipo de dispositivo

**Decisão:**
- **Prism / Nexus / Fusion** → **RepairTech** (empresa externa terceirizada). Após aprovação: ⚪ Em Trânsito → chegada via Correios → 🟡 Em Estoque.
- **FlowTrack** → **Engenharia** (sala interna da Novus Tech). Após aprovação: 🟡 Em Estoque diretamente (sem Em Trânsito).

**Processo FlowTrack:** Operações abre o kit, confere e limpa. Engenharia diagnostica, troca o que precisa e testa.

---

## D-27 — Falha em campo dispara reserva automática de substituto

**Decisão:** Quando um dispositivo é marcado como "Falha em Campo", o sistema deve reservar automaticamente um dispositivo substituto para o cliente — em paralelo com o fluxo de retorno do dispositivo com falha.

**Lógica definida:**
- **Com estoque disponível:** sistema reserva automaticamente um dispositivo do mesmo tipo e dispara o Fluxo 2 (Provisionamento e Saída) para o mesmo cliente/contrato — sem intervenção manual.
- **Sem estoque disponível:** sistema marca uma **pendência de substituição** no chamado CSI. Operações resolve quando o estoque for reabastecido.

### ⚠️ Revisão (2026-06-03 — Amanda) — substitui a lógica automática acima

A falha em campo **não dispara nada automaticamente**. Nada deve ser feito sem **prévia análise humana**. O tratamento depende do tipo de dispositivo:

**Prism / Nexus / Fusion** (monitorados remotamente via Aurora/Sentinel — sabemos se estão comunicando):
- Quando o dispositivo **deixa de comunicar por mais de 7 dias**, o sistema **dispara uma solicitação de troca para Operações analisar**.
- Operações analisa e decide o que fazer. **O sistema não reserva substituto nem inicia a logística reversa automaticamente.**

**FlowTrack** (não há monitoramento remoto):
- A falha só é detectada por **contato do cliente** (ex: haste quebrou, celular parou de carregar).
- O registro é **manual**, via preenchimento do formulário CSI.

**Impacto em D-28:** A integração com Aurora/Sentinel passa a ser usada também para **detectar a ausência de comunicação por mais de 7 dias**, e não apenas o comissionamento.

**Novas pendências:**
- **L-19:** Após a análise de Operações, a reserva do substituto é automática (com estoque → dispara Fluxo 2) ou disparada manualmente por Operações?
- **L-20:** O limite de **7 dias** sem comunicação é fixo? É configurável por tipo de dispositivo ou por cliente?

---

## D-28 — Integração com Aurora/Sentinel para comissionamento e sub-status de comunicação

**Decisão:** A transição do status **Entregue → Em Operação** para dispositivos Prism, Nexus e Fusion é feita pela integração com os sistemas internos Aurora e Sentinel. Quando o cliente instala e comissiona o dispositivo nesses sistemas, a integração detecta o evento e atualiza o status no sistema de gestão de ativos.

**Mapeamento:**
- **Aurora** → monitora dispositivos **Prism**
- **Sentinel** → monitora dispositivos **Nexus** e **Fusion**

**Sub-status de comunicação:** ao entrar em 🟢 **Em Operação**, o sistema atribui automaticamente um sub-status com base na leitura do Aurora/Sentinel:
- ✅ **Comunicando** — dispositivo transmitindo dados normalmente
- ⚠️ **Falha na Comunicação** — dispositivo registrado como em operação, mas sem transmissão

**Nota de escopo:** estas são **duas novas integrações** a ser especificadas e implementadas pelo dev. São bloqueadoras para o funcionamento do Fluxo 2C.

---

## D-22 — Não há prazo definido para devolução de dispositivos

**Decisão:** Não existe um SLA ou prazo máximo formal para o cliente devolver o dispositivo após o encerramento do contrato. O sistema não controla esse prazo — é tratativa comercial/contratual.
