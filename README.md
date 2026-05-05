# PJe-MAP — Demo do Motor de Agendamento de Perícias

Protótipo de demonstração do **PJe-MAP**, um motor de agendamento automático de
perícias judiciais para a Justiça Federal no Ceará (JFCE). A aplicação simula,
em ambiente isolado, as regras de distribuição de processos a peritos, alocação
de salas e tratamento de bloqueios de localidade.

> **Aviso:** este repositório contém apenas um *demo* de interface e regras de
> negócio. **Todos os dados** (peritos, CRMs, números de processo, salas e
> agendamentos) são **fictícios**, definidos em [src/mock/data.js](src/mock/data.js),
> e não representam pessoas, processos ou unidades reais. Não há integração com
> o PJe nem com qualquer sistema de produção.

---

## Objetivo

Demonstrar, de forma visual e auditável, o fluxo de agendamento automatizado
de perícias previsto no projeto PJe-MAP, incluindo:

- Filtragem de peritos por especialidade e unidade.
- Critério de desempate por menor carga mensal de perícias.
- Alocação de salas físicas (Sede) com regra de **trava de sala** por turno.
- Tratamento de **bloqueios de localidade** (feriados, eventos).
- *Fallback* para designação manual quando não há perito disponível.

---

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **lucide-react** (ícones)

Sem dependências de back-end. Tudo executa no navegador com dados em memória.

---

## Como executar localmente

Pré-requisitos: **Node.js 18+** e `npm`.

```bash
# 1. Instalar dependências
npm install

# 2. Subir o servidor de desenvolvimento
npm run dev

# 3. (Opcional) Gerar build de produção
npm run build
npm run preview
```

A aplicação abre em `http://localhost:5173`.

---

## Estrutura do projeto

```
pje-pericias-demo/
├── bizagi/                    Diagramas BPMN do fluxo (referência)
├── src/
│   ├── components/            Componentes de layout (Header, Sidebar, etc.)
│   ├── views/                 Telas: Automação, Peritos, Salas, Agenda, Config
│   ├── engine/scheduler.js    Motor de agendamento (regras de negócio)
│   ├── mock/data.js           Dados fictícios da demonstração
│   ├── App.jsx                Composição principal e estado da aplicação
│   └── main.jsx               Ponto de entrada Vite/React
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Regras de negócio implementadas

Definidas em [src/engine/scheduler.js](src/engine/scheduler.js):

1. **Filtragem inicial** — apenas peritos com a especialidade exigida e atuação
   na unidade do processo.
2. **Desempate por carga** — quando há mais de um candidato, prevalece o de
   menor carga mensal.
3. **Janela de busca** — até 6 semanas a partir da data de referência
   (2026-03-28).
4. **Alocação de sala (Sede)** — busca a primeira sala livre na localidade do
   perito no dia/turno escolhido.
5. **Trava de sala** — se o perito já tem sala reservada naquele dia/turno, o
   novo agendamento confirma a mesma sala (evita fragmentação).
6. **Bloqueio de localidade** — feriados/eventos impedem agendamento de
   perícias presenciais (Sede) na data; consultórios particulares não são
   afetados.
7. ***Fallback*** — quando nenhuma combinação atende, o processo é encaminhado
   para designação manual.

---

## Observações institucionais

- Projeto interno da Justiça Federal no Ceará (JFCE).
- Concebido para execução em ambiente Windows + intranet, sem dependência de
  serviços externos em tempo de execução. As únicas requisições de rede são as
  fontes do Google Fonts em [index.html](index.html); podem ser substituídas
  por fontes locais em ambientes sem acesso à internet.
- Em caso de evolução para integração real com o PJe, qualquer acesso a dados
  de processos deve respeitar as APIs oficiais e os requisitos da LGPD e das
  resoluções do CNJ.
