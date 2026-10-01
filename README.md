# 🚀 TaskFlow Pro — Enterprise Agile Kanban & Productivity System

> Sistema de gestão de tarefas e produtividade de alta performance, desenvolvido com arquitetura **Local-First**, foco em usabilidade avançada e controle de fluxo de trabalho.

🔗 **Demo ao Vivo:** [https://taskflow-pro-kappa-eight.vercel.app](https://taskflow-pro-kappa-eight.vercel.app)  
📁 **Repositório:** [https://github.com/samucait-cmyk/taskflow-pro](https://github.com/samucait-cmyk/taskflow-pro)

---

## 🎯 Sobre o Projeto

O **TaskFlow Pro** é uma aplicação web moderna inspirada em sistemas corporativos de gestão ágil (como Linear e Jira). Criado com foco na experiência do usuário (UX) e em privacidade, o sistema funciona 100% de forma local no navegador (Local-First), garantindo alta velocidade, funcionamento offline e zero necessidade de infraestrutura de banco de dados backend para uso pessoal ou de pequenas equipes.

---

## ⚡ Principais Funcionalidades

- 📋 **Quadro Kanban Dinâmico:** Arraste e solte (Drag & Drop) intuitivo com transições e ordenação de tarefas.
- ⏱️ **Temporizador Pomodoro Integrado:** Alterne entre Modos de Foco e Pausas, com contador de tempo excedido (overtime) e alertas visuais.
- 🚦 **Gestão de Limites WIP (Work in Progress):** Configuração de capacidade máxima por coluna para prevenir gargalos operacionais.
- 🎨 **Seletor de Temas Profissionais:** 4 paletas visuais com persistência (*Slate Indigo*, *Midnight Emerald*, *Obsidian*, *Light*).
- 🧘 **Modo Foco (Zen Mode):** Interface limpa sem distrações para execução imersiva de atividades.
- 📊 **Dashboard de Indicadores:** Métricas em tempo real sobre taxa de conclusão, prioridades e alerta de tarefas atrasadas.
- 📁 **Exportação e Importação de Dados:** Backup e restauração rápida nos formatos **JSON** e **CSV** (compatível com Excel).
- 📱 **Interface Adaptativa & Acessibilidade:** Design responsivo para dispositivos móveis com controle dinâmico de escala de fonte (`A-` / `A+`).

---

## 🛠️ Tecnologias Utilizadas

- **Core:** React.js, Vite
- **Estilização:** Tailwind CSS
- **Animações:** Framer Motion
- **Armazenamento:** Web LocalStorage API (Local-First)
- **Hospedagem:** Vercel

---

## 💻 Como Rodar o Projeto Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/samucait-cmyk/taskflow-pro.git

# 2. Acesse a pasta do projeto
cd taskflow-pro

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev