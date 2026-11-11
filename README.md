# Catccino AI

Expansão do projeto **Catccino** (cafeteria temática de gatos) integrando um **Assistente Virtual Inteligente** para atendimento e auxílio ao processo de adoção responsável.

> **Projeto desenvolvido para a 1ª Unidade da disciplina de Tópicos Especiais em Inteligência Artificial (TEIA).**

---

## Sobre o Projeto & Módulo de IA

O Catccino evoluiu! A aplicação agora conta com uma **Inteligência Artificial Generativa** atuando como assistente virtual no site, além de um **Painel Administrativo** completo.

### Principais capacidades da IA:
- **Atendimento e Cardápio:** Responde a dúvidas sobre produtos, preços e horários.
- **Adoção Responsável:** Instrui sobre como adotar e ver o perfil dos gatinhos.
- **Respostas Baseadas em Contexto (RAG):** A IA não "inventa" dados; ela consulta a base de conhecimento oficial antes de responder.

### Funcionalidades do Sistema:
- **Cardápio Dinâmico:** Produtos padrão + produtos adicionados pelo administrador.
- **Carrinho e Pagamento:** Simulação de carrinho e métodos de pagamento (PIX, Cartão, Dinheiro).
- **Fluxo de Adoção:** Formulário completo, envio para análise e painel de aprovação/recusa pelo administrador.
- **Painel Administrativo (Easter Egg):** Clique **2 vezes** na logo do Catccino (na Navbar) para acessar o painel de gestão.

---

## Conceitos de IA Utilizados (Ementa)

Seguindo as diretrizes da disciplina, foram aplicados os seguintes conceitos:

- **Tokenização e Embeddings:** Transformação dos dados da base de conhecimento em vetores numéricos.
- **Banco de Dados Vetorial:** Armazenamento dos embeddings no ChromaDB para busca semântica.
- **RAG (Retrieval-Augmented Generation):** Recuperação dos trechos mais relevantes da base para alimentar a IA.
- **Engenharia de Prompt:** Estruturação de *System Prompts* para garantir respostas corteses, no tom da cafeteria e sem alucinações.
- **LLM (Large Language Model):** Modelo de linguagem responsável por sintetizar as respostas finais.

---

## Arquitetura da Solução

O projeto foi dividido em duas camadas que se comunicam via API:

1. **Back-end de IA (Python + FastAPI):** Carrega o banco vetorial, processa a pergunta, busca o contexto (RAG) e gera a resposta usando o LLM local (Ollama). Expõe a rota `/chat`.
2. **Front-end (React + Vite + Tailwind CSS):** Interface visual do site (Login, Cadastro, Cardápio, Carrinho, Adoção). Possui um componente flutuante (`ChatWidget.jsx`) que consome a API em tempo real.

---

- ## Tecnologias Utilizadas

- **LLM (Ollama / Llama 3.2 1B):** O "cérebro" que gera as respostas. Roda localmente para garantir privacidade e funcionar em máquinas com pouca RAM (como notebooks de 4GB), sem depender de internet ou APIs pagas.
- **Embeddings (nomic-embed-text):** Transforma textos e perguntas em vetores numéricos, permitindo que a IA entenda o *significado* das palavras.
- **Banco Vetorial (ChromaDB):** Armazena os vetores e faz a busca semântica rápida. É aqui que o sistema encontra o contexto certo antes de responder (Retrieval).
- **Framework (LangChain):** A união do sistema. Ele pega a pergunta, busca no ChromaDB, monta o prompt e envia para o LLM.
- **API (FastAPI + Uvicorn):** Cria o servidor que recebe as mensagens do front-end e processa toda a lógica do RAG no back-end.
- **Interface (React + Tailwind):** O site da cafeteria e o chat. Consome a API em tempo real e inclui o Painel Administrativo para gerenciar gatos, produtos e adoções.

---

## Como Executar o Projeto

### Pré-requisitos
- Python 3.10 ou superior instalado.
- Node.js (versão 18+) instalado.
- [Ollama](https://ollama.com/) instalado e rodando na máquina.

### Passo a passo (Windows)

1. **Clone o repositório:**
   ```powershell
   git clone https://github.com/thuhsf/catccino-ai.git
   cd catccino-ai/catccino-web-project-main
   ```

2. **Baixe os modelos de IA no Ollama:**
   ```powershell
   ollama pull llama3.2:1b
   ollama pull nomic-embed-text
   ```

3. **Crie o ambiente virtual e instale as dependências:**
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   pip install fastapi uvicorn langchain langchain-community langchain-ollama langchain-chroma langchain-classic chromadb python-dotenv
   ```

4. **Crie a base vetorial (Execute apenas uma vez):**
   ```powershell
   python criar_banco.py
   ```

5. **Inicie a API Python (Terminal 1):**
   ```powershell
   uvicorn api:app --reload
   ```

6. **Inicie o Front-end React (Terminal 2 - abra um novo terminal):**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

### Passo a passo (Linux)

1. **Instale as dependências do sistema (se necessário):**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv nodejs npm git -y
   ```

2. **Instale o Ollama:**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

3. **Clone o repositório:**
   ```bash
   git clone https://github.com/thuhsf/catccino-ai.git
   cd catccino-ai/catccino-web-project-main
   ```

4. **Baixe os modelos de IA no Ollama:**
   ```bash
   ollama pull llama3.2:1b
   ollama pull nomic-embed-text
   ```

5. **Crie o ambiente virtual e instale as dependências:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install fastapi uvicorn langchain langchain-community langchain-ollama langchain-chroma langchain-classic chromadb python-dotenv
   ```

6. **Crie a base vetorial (Execute apenas uma vez):**
   ```bash
   python criar_banco.py
   ```

7. **Inicie a API Python (Terminal 1):**
   ```bash
   uvicorn api:app --reload
   ```

8. **Inicie o Front-end React (Terminal 2 - abra um novo terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## Acessando o Painel Administrativo

Após rodar o projeto e abrir o site, **clique 2 vezes seguidas na logo do Catccino** (no canto superior esquerdo). Isso abrirá o painel onde você pode:
- Gerenciar os gatinhos disponíveis para adoção.
- Adicionar e remover produtos do cardápio.
- Aprovar ou recusar formulários de adoção.

---
*Projeto acadêmico — Frontend React consumindo API Python via FastAPI.*
