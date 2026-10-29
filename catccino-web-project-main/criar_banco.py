import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

print("Iniciando a leitura dos arquivos da base de conhecimento...")
# 1. Carrega os arquivos .md
loader = DirectoryLoader("knowledge_base", glob="**/*.md", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
docs = loader.load()

# 2. Quebra em pedaços menores (chunks)
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(docs)

print(f"Foram gerados {len(chunks)} pedaços de texto. Criando embeddings (isso pode demorar)...")

# 3. Cria os embeddings e SALVA no disco (pasta chroma_db)
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = Chroma.from_documents(
    documents=chunks, 
    embedding=embeddings,
    persist_directory="./chroma_db" # <--- A MÁGICA ACONTECE AQUI! Ele salva na pasta.
)

print("✅ Banco vetorial criado e salvo com sucesso na pasta 'chroma_db'!")