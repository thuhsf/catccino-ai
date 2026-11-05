# Catccino AI ☕🐈

Expansão do projeto **Catccino** (cafeteria temática de gatos) integrando um **Assistente Virtual Inteligente** focado em atendimento e auxílio ao processo de adoção responsável.

> **Projeto desenvolvido para a disciplina de Tópicos Especiais em Inteligência Artificial (TEIA).**

---

## 💡 Sobre o Projeto & Módulo de IA

O Catccino evoluiu! Além da estrutura de backend e frontend desenvolvida anteriormente, a aplicação agora conta com uma **Inteligência Artificial Generativa** atuando como assistente virtual no site.

### Principais capacidades da IA:
- **Atendimento e Cardápio:** Responde a dúvidas frequentes sobre produtos, preços, opções vegetarianas/veganas e horários de funcionamento.
- **Adoção Responsável de Gatos:** Consulta os dados de gatinhos cadastrados via ONGs parceiras, informando perfil, temperamento e instruções de como adotar.
- **Respostas Baseadas em Contexto Real (RAG):** A assistente não "inventa" dados; ela consulta a base de conhecimento oficial da cafeteria antes de responder.

---

## 🧠 Conceitos de IA Utilizados

Seguindo as diretrizes da disciplina, foram aplicados os seguintes conceitos da unidade:

- **Tokenização e Embeddings:** Transformação dos dados do cardápio, regras do local e fichas dos gatos em vetores numéricos.
- **Banco de Dados Vetorial:** Armazenamento dos embeddings para busca semântica rápida (Retrieval).
- **RAG (Retrieval-Augmented Generation):** Recuperação dos trechos mais relevantes da base de dados com base na dúvida do usuário para alimentar a IA.
- **Engenharia de Prompt:** Estruturação de prompts do sistema (System Prompts) para garantir respostas corteses, no tom de voz da cafeteria e sem alucinações.
- **LLM (Large Language Model):** Modelo de linguagem responsável por sintetizar as respostas finais.

---

## 🏗️ Arquitetura da Solução (Full-Stack)

Para atender aos requisitos da disciplina e criar uma aplicação real, o projeto foi dividido em duas camadas principais que se comunicam via API:

1. **Back-end de IA (Python + FastAPI):** Responsável por carregar o banco vetorial (ChromaDB), processar a pergunta do usuário, buscar o contexto (RAG) e gerar a resposta usando o LLM local (Ollama). Expõe uma rota `/chat` que recebe a mensagem via JSON e retorna a resposta.
2. **Front-end (React + Vite + Tailwind CSS):** A interface visual onde o cliente interage com o site da cafeteria. Foi desenvolvido um componente flutuante (`ChatWidget.jsx`) que consome a API do FastAPI em tempo real, além das telas de Login, Cadastro, Cardápio e Carrinho.

---

## 🛠️ Tecnologias de Inteligência Artificial

- **LLM:** Ollama (modelo Llama 3.2 1B rodando localmente)
- **Embeddings Model:** OllamaEmbeddings (modelo nomic-embed-text)
- **Vector Store:** ChromaDB (com persistência local para não recriar os embeddings a cada execução)
- **Framework de IA:** LangChain
- **API:** FastAPI + Uvicorn
- **Interface:** React (componente de chat) e Streamlit (versão alternativa de chat para testes isolados)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Python 3.10 ou superior instalado.
- Node.js (versão 18+) instalado.
- [Ollama](https://ollama.com/) instalado e rodando na máquina.

### Passo a passo completo

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/thuhsf/catccino-ai.git
   cd catccino-ai/catccino-web-project-main
