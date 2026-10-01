# 🚀 TaskFlow Pro | Local-First Productivity Suite

<div align="center">

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38Bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*Uma suíte de produtividade moderna, de alta performance e arquitetura Local-First, combinando Gestão Kanban e Temporizador Pomodoro de precisão cirúrgica.*

</div>

---

## 💡 Sobre o Projeto

O **TaskFlow Pro** foi desenvolvido com foco em performance, privacidade e experiência de utilizador (*UX*). O objetivo principal foi criar uma ferramenta de produtividade robusta que funcione inteiramente no navegador do utilizador (*Local-First*), eliminando a latência de servidores externos e garantindo total soberania sobre os dados pessoais.

A aplicação integra dois pilares fundamentais da produtividade diária:
1. **Gestão de Tarefas (Kanban):** Organização visual de fluxo de trabalho com múltiplos estados, prioridades e checklists.
2. **Controlo de Foco (Pomodoro com Timestamps):** Sessões de foco profundo com sincronização temporal avançada, alertas nativos via Web Audio API e rastreio de ciclos diários.

---

## 🛠️ Principais Funcionalidades

- **🔒 Arquitetura Local-First:** Todos os dados (tarefas, configurações e histórico de ciclos) são persistidos no `localStorage` do navegador com isolamento por chaves dinâmicas, garantindo carregamento instantâneo e funcionamento offline.
- **⏱️ Temporizador Pomodoro Resiliente (Zero-Drift):** Implementado com base em marcas temporais (`Date.now()`). O temporizador mantém a precisão absoluta mesmo se o utilizador minimizar a aba, fechar o navegador ou bloquear o computador.
- **🎵 Síntese de Áudio Nativa (Web Audio API):** Alertas sonoros gerados puramente por código em tempo de execução, eliminando dependências de ficheiros de áudio externos e prevenindo erros de carregamento (*broken assets*).
- **📊 Rastreio de Ciclos Diários:** Contagem automática de sessões de foco concluídas no dia, diferenciando claramente o esforço operacional do resultado final.
- **🔄 Sincronização de Aba em Tempo Real:** Atualização dinâmica do título da aba do navegador (`document.title`) com a contagem decrescente do Pomodoro.
- **🎨 Customização e Acessibilidade:** Suporte a múltiplos temas visuais, ajuste dinâmico de escala de fonte e modo foco imersivo.
- **📤 Portabilidade de Dados:** Ferramentas integradas para exportação e importação de dados em formato JSON e relatórios consolidados.

---

## 🏗️ Decisões Arquiteturais e Engenharia

### 1. Por que Local-First?
Em aplicações de produtividade pessoal, a latência de rede é o maior inimigo da fluidez. Optar por uma arquitetura *Local-First* elimina requisições HTTP desnecessárias, garante privacidade absoluta ao utilizador e permite que a aplicação seja executada em qualquer ambiente estático de hospedagem.

### 2. Tratamento de *Drift* Temporal no Pomodoro
Abordagens tradicionais baseadas em `setInterval` de 1 segundo falham quando o navegador entra em estado de economia de energia (*throttling* em abas em segundo plano). O TaskFlow Pro resolve isso calculando o `targetEndTime` (`Date.now() + duration`) a cada tique, garantindo que o tempo real decorrido seja matematicamente exato, independentemente do comportamento da *thread* do navegador.

---

## 💻 Tecnologias Utilizadas

- **Core:** [React 18](https://react.dev/) com *functional hooks*.
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Tipagem estrita e sem uso de `any`).
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (*Design System* utilitário e responsivo).
- **Animações:** [Framer Motion](https://www.framer.com/motion/) (Transições fluidas e micro-interações).
- **Build Tool:** [Vite](https://vitejs.dev/) (Empacotador ultrarrápido).
- **Testes Automatizados:** [Vitest](https://vitest.dev/) com [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) e `jsdom`.

---

## 🧪 Testes Automatizados

O projeto conta com uma suíte de testes unitários configurada para blindar os componentes principais (como o temporizador Pomodoro) contra regressões e garantir estabilidade contínua.

Para executar os testes localmente:

```bash
# Executar os testes em modo interativo (Watch Mode)
npm run test

# Executar os testes uma única vez (Ideal parapipelines de CI/CD)
npx vitest run