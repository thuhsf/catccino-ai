from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
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

# 1. Carrega o RAG quando o servidor inicia
print("Carregando base de conhecimento...")
loader = DirectoryLoader("knowledge_base", glob="**/*.md", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(docs)

embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = Chroma.from_documents(documents=chunks, embedding=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

llm = ChatOllama(model="llama3.2:1b", temperature=0.3)

system_prompt = (
    "Você é a assistente virtual do Catccino, uma cafeteria temática de gatos. "
    "Seja educada, simpática e use emojis. "
    "Use o contexto abaixo para responder à pergunta do cliente. "
    "Se a resposta não estiver no contexto, diga educadamente que não sabe e "
    "sugira que o cliente pergunte ao atendente no balcão.\n\n"
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
        resposta = rag_chain.invoke({"input": pergunta.mensagem})
        return {"resposta": resposta['answer']}
    except Exception as e:
        return {"erro": str(e)}