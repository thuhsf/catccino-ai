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

# Permite que o React (ou qualquer site) acesse essa API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Carrega o banco vetorial que JÁ FOI CRIADO no passo 1
print("Conectando ao banco vetorial existente...")
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# Em vez de from_documents, usamos apenas o Chroma apontando para a pasta
vectorstore = Chroma(
    persist_directory="./chroma_db", 
    embedding_function=embeddings
)

retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

llm = ChatOllama(model="llama3.2:1b", temperature=0.3)

system_prompt = (
    "Você é a assistente virtual do Catccino, uma cafeteria temática de gatos. "
    "Seja educada e simpática. "
    "Use emojis com moderação (no máximo 1 ou 2 por resposta). "
    "Responda às perguntas do cliente baseando-se no contexto abaixo.\n\n"
    "Contexto:\n{context}"
)
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)
print("IA pronta para receber requisições!")

# 2. Define o formato da pergunta que o React vai enviar
class Pergunta(BaseModel):
    mensagem: str

# 3. Cria a rota (endpoint) que o React vai chamar
@app.post("/chat")
async def chat(pergunta: Pergunta):
    try:
        # Pega a hora atual do computador (Hora real)
        hora_atual = datetime.now().hour

        # hora_atual = 10
        # hora_atual = 17

        # REGRA DE NEGÓCIO: Loja fechada (antes das 7h ou depois das 17h)
        if hora_atual < 7 or hora_atual >= 17:
            return {
                "resposta": "Desculpe, nosso horário de funcionamento já encerrou por hoje (funcionamos das 7h às 17h). Volte amanhã a partir das 7h!"
            }

        # Se a loja estiver aberta, a IA processa a pergunta normalmente
        resposta = rag_chain.invoke({"input": pergunta.mensagem})
        return {"resposta": resposta['answer']}
        
    except Exception as e:
        return {"erro": str(e)}