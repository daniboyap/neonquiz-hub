
# ⚡ NeonQuiz Hub

> **Tecnologia que resolve. Simples Assim.**

O **NeonQuiz Hub** é uma aplicação de Quiz moderna, desenvolvida com foco total em **performance mobile**, estética **Cyberpunk/Neon** e experiência de usuário fluida. Com mais de **3.000 perguntas** divididas em 21 categorias, o app utiliza técnicas avançadas de carregamento de dados para garantir que rode liso até em dispositivos mais antigos.

---

## 📱 Destaques & Funcionalidades

*   **🎨 Design Neon Premium:** Identidade visual Dark Mode com acentos em Roxo Neon (`#a855f7`), focado em contraste e legibilidade.
*   **🚀 Performance Extrema:** Arquitetura "Lazy Loading". O app carrega apenas o que é necessário. O banco de dados de perguntas é dividido em chunks e baixado sob demanda.
*   **📱 Mobile-First & PWA:** Layout responsivo, áreas de toque otimizadas e pronto para ser instalado na tela inicial (Progressive Web App).
*   **💾 Sistema de Favoritos:** Persistência de dados via `localStorage`. Seus temas preferidos ficam salvos no navegador.
*   **🧠 +3.000 Perguntas:** Banco de dados robusto cobrindo desde Lógica de Programação até Cultura Pop e História.
*   **⚡ Jogabilidade Dinâmica:** Timer de 15s, feedback visual instantâneo, barra de progresso animada e sistema de pontuação.

---

## 🛠️ Tecnologias Utilizadas

*   **Core:** React 19 (Hooks, Context, Lazy Imports).
*   **Estilização:** Tailwind CSS (Utility-first, Animações personalizadas).
*   **Animações:** Framer Motion (`AnimatePresence`, `layout` props para transições mágicas).
*   **Ícones:** Lucide React.
*   **Linguagem:** TypeScript (Tipagem estrita para `QuizQuestion`, `Category`, `GameState`).

---

## 📂 Arquitetura de Dados (O Segredo da Performance)

Para evitar que o aplicativo fique pesado ao carregar 3.000 perguntas de uma vez, utilizamos uma estratégia de **Code Splitting**:

1.  **Arquivos Separados:** Cada tema (ex: `tech_db.ts`, `history.ts`) é um módulo isolado.
2.  **Loader Inteligente (`src/data/loader.ts`):**
    *   Quando o usuário clica em "História", o sistema faz um `import()` dinâmico.
    *   O navegador baixa apenas o pequeno arquivo `.js` daquele tema.
    *   **Resultado:** O carregamento inicial do site é minúsculo (~50kb), garantindo velocidade máxima.
3.  **Algoritmo Fisher-Yates:** As perguntas são embaralhadas matematicamente em tempo real para garantir que nenhuma partida seja igual à outra.

---

## 🗂️ Estrutura do Projeto

```text
/
├── src/
│   ├── components/
│   │   ├── QuizGame.tsx       # Motor do jogo (Timer, Lógica, UI)
│   │   └── StaticPages.tsx    # Páginas 'Sobre' e 'Serviços'
│   ├── data/
│   │   ├── questions/         # 21 Arquivos .ts com os bancos de dados
│   │   └── loader.ts          # Gerenciador de downloads dinâmicos
│   ├── App.tsx                # Layout principal, Navegação e Abas
│   ├── constants.tsx          # Configuração dos Menus e Ícones
│   └── types.ts               # Interfaces TypeScript
├── index.html                 # Entry point + Configs PWA
└── index.tsx                  # Montagem React
```

---

## 🚀 Como Executar

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/neonquiz-hub.git
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
4.  **Acesse:** Abra `http://localhost:3000` (ou a porta indicada).

---

## 👨‍💻 Créditos e Desenvolvimento

Este projeto foi desenvolvido com foco em excelência técnica e visual.

*   **Desenvolvimento:** Daniel S. Farias
*   **Empresa:** DL SERVICE
*   **Contato:** (96) 99125-6601
*   **E-mail:** servicecontatoap@gmail.com

> *"Tecnologia que resolve. Simples Assim."*

---

© 2025 NeonQuiz Hub. Todos os direitos reservados.
