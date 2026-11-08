from datetime import datetime
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from fastapi.middleware.cors import CORSMiddleware

# Inicializa a API
app = FastAPI(title="Catccino AI API")

# Permite que o React acesse essa API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Carrega o banco vetorial e o LLM
print("Conectando ao banco vetorial existente...")
embeddings = OllamaEmbeddings(model="nomic-embed-text")

vectorstore = Chroma(
    persist_directory="./chroma_db", 
    embedding_function=embeddings
)

retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
llm = ChatOllama(model="llama3.2:1b", temperature=0.3)

# 2. Define o formato da pergunta que o React vai enviar
class Pergunta(BaseModel):
    mensagem: str
    qtd_gatos: int = 0

# 3. Cria a rota (endpoint)
@app.post("/chat")
async def chat(pergunta: Pergunta):
    try:
        # Pega a hora atual do computador
        # hora_atual = datetime.now().hour
        hora_atual = 10 # <-- Fixo para testar

        # REGRA DE NEGÓCIO: Loja fechada
        if hora_atual < 7 or hora_atual >= 17:
            return {
                "resposta": "Desculpe, nosso horário de funcionamento já encerrou por hoje (funcionamos das 7h às 17h). Volte amanhã a partir das 7h!"
            }

        # AQUI: O prompt é criado DENTRO da função para ler o qtd_gatos
        system_prompt = (
            "Você é a assistente virtual do Catccino, uma cafeteria temática de gatos. "
            "Seja educada e simpática. "
            "NUNCA utilize emojis em suas respostas. Responda apenas com texto puro. "
            f"Atualmente, temos exatamente {pergunta.qtd_gatos} gatinhos disponíveis para adoção. "
            "Se o usuário perguntar quais são, diga a quantidade e instrua-o a clicar no botão 'Ver gatinhos disponíveis' abaixo ou acessar a aba de Adoção. NÃO liste os nomes dos gatos. "
            "Se o usuário perguntar sobre bebidas, comidas ou o que vocês vendem, responda exatamente assim: 'Há uma porção de variedades de comidas e cafés no nosso cardápio, venha dar uma conferida!' "
            "NÃO liste os produtos nem os preços, apenas use essa frase. "
            "Use o contexto abaixo para responder a outras perguntas do cliente. "
            "Se a resposta não estiver no contexto, diga educadamente que não sabe e sugira que o cliente pergunte ao atendente no balcão.\n\n"
            "Contexto:\n{context}"
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])

        # Recria a chain com o prompt atualizado
        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        rag_chain = create_retrieval_chain(retriever, question_answer_chain)

        # Roda a IA
        resposta = rag_chain.invoke({"input": pergunta.mensagem})
        return {"resposta": resposta['answer']}
        
    except Exception as e:
        return {"erro": str(e)}