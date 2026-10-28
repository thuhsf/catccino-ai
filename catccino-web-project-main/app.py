import streamlit as st
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# 1. Configurar a página do site
st.set_page_config(page_title="Catccino AI", page_icon="🐈", layout="centered")
st.title("🐈 Catccino AI")
st.subheader("Sua assistente virtual da cafeteria temática de gatos ☕")
st.write("Pergunte sobre o nosso cardápio, horários ou sobre os gatinhos disponíveis para adoção!")

# 2. Função para carregar o RAG (com cache para não recarregar toda hora)
@st.cache_resource
def carregar_rag():
    # Carrega os documentos
    loader = DirectoryLoader("knowledge_base", glob="**/*.md", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
    docs = loader.load()
    
    # Divide em pedaços
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(docs)
    
    # Cria o banco vetorial
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    vectorstore = Chroma.from_documents(documents=chunks, embedding=embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
    
    # Configura o LLM
    llm = ChatOllama(model="llama3.2:1b", temperature=0.3)
    
    # Prompt
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
    
    # Monta a corrente
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    return rag_chain

# Mensagem enquanto carrega na primeira vez
with st.spinner("Preparando a assistente... Isso pode demorar um pouquinho na primeira vez."):
    rag_chain = carregar_rag()

# 3. Gerenciar o histórico do chat na tela
if "messages" not in st.session_state:
    st.session_state.messages = []

# Mostra as mensagens antigas
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 4. Caixa de texto para o usuário digitar
if prompt_usuario := st.chat_input("Digite sua pergunta aqui..."):
    # Mostra a pergunta do usuário na tela
    st.session_state.messages.append({"role": "user", "content": prompt_usuario})
    with st.chat_message("user"):
        st.markdown(prompt_usuario)

    # Gera a resposta
    with st.chat_message("assistant"):
        with st.spinner("Pensando..."):
            try:
                resposta = rag_chain.invoke({"input": prompt_usuario})
                texto_resposta = resposta['answer']
                st.markdown(texto_resposta)
                # Salva a resposta no histórico
                st.session_state.messages.append({"role": "assistant", "content": texto_resposta})
            except Exception as e:
                st.error(f"Ops, ocorreu um erro: {e}")