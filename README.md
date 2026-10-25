# Catccino AI ☕🐈🤖

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

## 🛠️ Tecnologias de Inteligência Artificial

- **LLM:** [Ex: NVIDIA API / Ollama (Llama 3) / Hugging Face]
- **Embeddings Model:** [Ex: HuggingFaceEmbeddings / OpenAI Embeddings]
- **Vector Store:** [Ex: ChromaDB / FAISS]
- **Framework de IA:** LangChain / LlamaIndex
- **Interface/API:** [Ex: FastAPI / Streamlit / Gradio]

*(Mantida também a infraestrutura base de microsserviços em Node.js, TypeScript e Docker para os serviços legados).*

---

## 📋 Pré-requisitos e Configuração de Segurança

1. Clone o repositório:
```sh
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
