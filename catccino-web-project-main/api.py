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

# Aumentamos para k=4 para buscar mais informações no banco
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

llm = ChatOllama(model="llama3.2:1b", temperature=0.1)

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
        hora_atual = 10  # Fixo para testar

        # REGRA DE NEGÓCIO: Loja fechada
        if hora_atual < 7 or hora_atual >= 17:
            return {
                "resposta": "Desculpe, nosso horário de funcionamento já encerrou por hoje (funcionamos das 7h às 17h). Volte amanhã a partir das 7h!"
            }

        # REGRA: Resposta fixa para adoção (ignora o banco antigo)
        if "adotar" in pergunta.mensagem.lower() or "adoção" in pergunta.mensagem.lower():
            return {
                "resposta": "Para adotar um gatinho, você precisa ter mais de 18 anos e preencher o formulário de adoção. A ONG entrará em contato em até 48h."
            }

        # REGRA: Horário de funcionamento
        if "horário" in pergunta.mensagem.lower() or "horario" in pergunta.mensagem.lower() or "funcionamento" in pergunta.mensagem.lower():
            return {
                "resposta": "O Catccino funciona de terça-feira a domingo, das 07:00 às 17:00."
            }

        # REGRA: Preço do Latte Gatinho
        if "latte" in pergunta.mensagem.lower() or "gatinho" in pergunta.mensagem.lower():
            return {
                "resposta": "O Latte Gatinho custa R$ 15,00 e é a nossa bebida mais pedida! Ele tem uma arte no café em formato de patinha."
            }

        # Prompt criado DENTRO da função para conseguir ler o qtd_gatos
        system_prompt = (
            "Você é a assistente virtual do Catccino, uma cafeteria temática de gatos. "
            "Seja educada e simpática. "
            "NUNCA utilize emojis em suas respostas. Responda apenas com texto puro. "

            "REGRAS DE CONVERSA: "
            "1. Se o usuário disser 'oi', 'olá' ou 'bom dia', responda APENAS com uma saudação amigável (ex: 'Olá! Como posso ajudar?'). NÃO adicione despedidas. "
            "2. Se o usuário disser 'tchau', 'até logo' ou 'até mais', responda APENAS com uma despedida (ex: 'Até logo! Volte sempre.'). NÃO adicione saudações. "
            "3. Se o usuário fizer qualquer outra pergunta, NÃO use saudações ou despedidas, vá direto ao ponto. "

            f"Atualmente, temos exatamente {pergunta.qtd_gatos} gatinhos disponíveis para adoção. "
            "Se o usuário perguntar especificamente sobre os gatinhos, diga a quantidade e instrua-o a clicar no botão 'Ver gatinhos disponíveis'. "

            "Se o usuário perguntar sobre bebidas, comidas ou o que vocês vendem, responda EXATAMENTE e APENAS a seguinte frase: 'Há uma porção de variedades de comidas e cafés no nosso cardápio, venha dar uma conferida!' "
            "NÃO liste os produtos, NÃO liste os preços e NÃO diga 'Selecione uma opção'. Apenas diga a frase acima. "

            "REGRA DE ITENS INEXISTENTES: Se o usuário perguntar por um item específico (ex: refrigerante, pizza, hambúrguer, suco) e esse item NÃO estiver listado no contexto do cardápio, responda EXATAMENTE: 'Não, não temos esse alimento ou essa bebida disponível no cardápio do Catccino.' NUNCA invente produtos que não estão no cardápio. "

            "REGRA DE OURO PARA PERGUNTAS ALEATÓRIAS: "
            "Se a pergunta do usuário não tiver NENHUMA relação com o Catccino, com café, com o cardápio ou com os gatinhos (por exemplo: 'O que é uma vaca?', 'Quem descobriu o Brasil?'), você deve responder EXATAMENTE a seguinte frase: "
            "'Desculpe, não tenho informações sobre isso. Sou a assistente do Catccino e só posso ajudar com dúvidas sobre a nossa cafeteria, cardápio ou adoção de gatinhos.' "
            "NÃO tente adivinhar a resposta, NÃO fale sobre gatinhos ou adoção se a pergunta não for sobre isso. "

            "Use o contexto abaixo para responder. "
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