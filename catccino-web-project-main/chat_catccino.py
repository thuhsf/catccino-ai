import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# 1. Carregar os arquivos e QUEBRAR em pedaços (chunks)
print("Carregando e dividindo os documentos...")
# Aqui ele vai ler todos os arquivos .md da pasta knowledge_base
loader = DirectoryLoader("knowledge_base", glob="**/*.md", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(docs)

# 2. Criar o Banco Vetorial (ChromaDB)
print("Criando banco vetorial (isso pode demorar um pouquinho)...")
# Vamos usar o modelo de embedding leve do HuggingFace para ser mais rápido
embeddings = OllamaEmbeddings(model="llama3.2:1b") 
vectorstore = Chroma.from_documents(documents=chunks, embedding=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

# 3. Configurar a Inteligência Artificial (LLM)
print("Configurando o LLM...")
llm = ChatOllama(model="llama3.2:1b", temperature=0.3)

# 4. Engenharia de Prompt
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

# 5. Montar a corrente do RAG
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# 6. Roda o Chat no terminal
print("\n🐈 Bem-vindo ao Chat do Catccino! (Digite 'sair' para encerrar)")
while True:
    pergunta = input("\nVocê: ")
    if pergunta.lower() == 'sair':
        break
    
    try:
        resposta = rag_chain.invoke({"input": pergunta})
        print(f"\n🤖 Catccino IA: {resposta['answer']}")
    except Exception as e:
        print(f"\n❌ Ops, deu um erro: {e}")