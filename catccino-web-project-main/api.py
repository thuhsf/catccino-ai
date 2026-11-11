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

retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

llm = ChatOllama(model="llama3.2:1b", temperature=0.1)

# 2. Define o formato da pergunta que o React vai enviar
class Pergunta(BaseModel):
    mensagem: str
    qtd_gatos: int = 0

# Função auxiliar para verificar se a pergunta tem a ver com o Catccino
def pergunta_e_sobre_catccino(texto):
    palavras_chave = [
        "catccino", "café", "cafe", "cardápio", "cardapio", "bebida", "comida", 
        "gato", "gatinho", "adoção", "adocao", "adotar", "ong", "horário", "horario", 
        "funcionamento", "latte", "cappuccino", "expresso", "pingado", "chocolate", 
        "chá", "cha", "bolo", "cookie", "pão", "pao", "queijo", "croissant", 
        "brownie", "misto", "empada", "sonho", "preço", "preco", "custa", "aberto", 
        "fechado", "endereço", "endereco", "localização", "localizacao", "lactose", 
        "leite", "vegetal", "oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", 
        "tchau", "até logo", "ate logo", "sair",
        "segunda", "terça", "terca", "quarta", "quinta", "sexta", "sábado", "sabado", "domingo",
        "sim", "não", "nao",
        "pix", "pagamento", "cartão", "cartao", "débito", "debito", "crédito", "credito"
    ]
    texto_lower = texto.lower()
    return any(palavra in texto_lower for palavra in palavras_chave)

# 3. Cria a rota (endpoint)
@app.post("/chat")
async def chat(pergunta: Pergunta):
    try:
        # Pega a hora atual do computador
        # hora_atual = datetime.now().hour

        hora_atual = 10 # testar de manhã
        # hora_atual = 16 # testar de tarde
        # hora_atual = 18 # testar de noite

        # REGRA DE NEGÓCIO: Loja fechada
        if hora_atual < 7 or hora_atual >= 17:
            return {
                "resposta": "Desculpe, nosso horário de funcionamento já encerrou por hoje (funcionamos das 7h às 17h). Volte amanhã a partir das 7h!",
                "loja_fechada": True
            }

        # Verifica se a pergunta tem a ver com o Catccino
        if not pergunta_e_sobre_catccino(pergunta.mensagem):
            return {
                "resposta": "Desculpe, não tenho informações sobre isso. Sou a assistente do Catccino e só posso ajudar com dúvidas sobre a nossa cafeteria, cardápio ou adoção de gatinhos.",
                "loja_fechada": False
            }

        # REGRA: Saudação + pedido de café/comida
        if ("bom dia" in pergunta.mensagem.lower() or "boa tarde" in pergunta.mensagem.lower() or "olá" in pergunta.mensagem.lower()) and ("café" in pergunta.mensagem.lower() or "gostaria" in pergunta.mensagem.lower() or "comida" in pergunta.mensagem.lower()):
            return {
                "resposta": "Há uma porção de variedades de comidas e cafés no nosso cardápio, venha dar uma conferida!",
                "loja_fechada": False
            }

        # REGRA: Respostas curtas (sim/não)
        if pergunta.mensagem.lower().strip() in ["sim", "não", "nao"]:
            return {
                "resposta": "Entendi! Como posso ajudar você com o Catccino hoje?",
                "loja_fechada": False
            }
        
        # REGRA DE EMERGÊNCIA: Perguntas sobre nomes de gatos
        if "chamar" in pergunta.mensagem.lower() and ("gato" in pergunta.mensagem.lower() or "gata" in pergunta.mensagem.lower()):
            return {
                "resposta": "Desculpe, não tenho informações sobre isso. Sou a assistente do Catccino e só posso ajudar com dúvidas sobre a nossa cafeteria, cardápio ou adoção de gatinhos.",
                "loja_fechada": False
            }

        # REGRA: Resposta fixa para adoção
        if "adotar" in pergunta.mensagem.lower() or "adoção" in pergunta.mensagem.lower() or "adocao" in pergunta.mensagem.lower():
            return {
                "resposta": "Para adotar um gatinho, você precisa ter mais de 18 anos e preencher o formulário de adoção. A ONG entrará em contato em até 48h.",
                "loja_fechada": False
            }

        # REGRA: Horário de funcionamento
        if "horário" in pergunta.mensagem.lower() or "horario" in pergunta.mensagem.lower() or "funcionamento" in pergunta.mensagem.lower():
            return {
                "resposta": "O Catccino funciona de terça-feira a domingo, das 07:00 às 17:00.",
                "loja_fechada": False
            }

        # REGRA: Funcionamento aos domingos e segundas
        if "segunda" in pergunta.mensagem.lower() or "domingo" in pergunta.mensagem.lower():
            return {
                "resposta": "O Catccino funciona de terça-feira a domingo, das 07:00 às 17:00. Portanto, às segundas-feiras estamos fechados.",
                "loja_fechada": False
            }

        # REGRA: Preço do Latte Gatinho
        if "latte" in pergunta.mensagem.lower() or "gatinho" in pergunta.mensagem.lower():
            return {
                "resposta": "O Latte Gatinho custa R$ 15,00 e é a nossa bebida mais pedida! Ele tem uma arte no café em formato de patinha.",
                "loja_fechada": False
            }

        # REGRA: Formas de pagamento
        if "pix" in pergunta.mensagem.lower() or "pagamento" in pergunta.mensagem.lower() or "cartão" in pergunta.mensagem.lower() or "cartao" in pergunta.mensagem.lower() or "débito" in pergunta.mensagem.lower() or "debito" in pergunta.mensagem.lower() or "crédito" in pergunta.mensagem.lower() or "credito" in pergunta.mensagem.lower():
            return {
                "resposta": "Aceitamos PIX (nossa chave é catccino@hotmail.com), cartão de débito e cartão de crédito.",
                "loja_fechada": False
            }

        # Prompt criado DENTRO da função para conseguir ler o qtd_gatos
        system_prompt = (
            "Você é a assistente virtual do Catccino, uma cafeteria temática de gatos. "
            "Seja educada e simpática. "
            "NUNCA utilize emojis em suas respostas. Responda apenas com texto puro. "

            "REGRAS DE CONVERSA: "
            "1. Se o usuário disser APENAS 'oi', 'olá' ou 'bom dia' (sem mais nenhuma pergunta), responda APENAS com uma saudação amigável (ex: 'Olá! Como posso ajudar?'). NÃO faça perguntas extras e NÃO puxe assunto sobre gatos ou adoção. "
            "2. Se o usuário disser 'tchau', 'até logo' ou 'até mais', responda APENAS com uma despedida (ex: 'Até logo! Volte sempre.'). NÃO adicione saudações. "
            "3. Se o usuário fizer qualquer outra pergunta, NÃO use saudações ou despedidas, vá direto ao ponto. "

            f"Atualmente, temos exatamente {pergunta.qtd_gatos} gatinhos disponíveis para adoção. "
            "Se o usuário perguntar especificamente sobre os gatinhos, diga a quantidade e instrua-o a clicar no botão 'Ver gatinhos disponíveis'. "

            "Se o usuário perguntar sobre bebidas, comidas ou o que vocês vendem, responda EXATAMENTE e APENAS a seguinte frase: 'Há uma porção de variedades de comidas e cafés no nosso cardápio, venha dar uma conferida!' "
            "NÃO liste os produtos, NÃO liste os preços e NÃO diga 'Selecione uma opção'. Apenas diga a frase acima. "

            "REGRA DE ITENS INEXISTENTES: Se o usuário perguntar por um item específico (ex: refrigerante, pizza, hambúrguer, suco) e esse item NÃO estiver listado no contexto do cardápio, responda EXATAMENTE: 'Não, não temos esse alimento ou essa bebida disponível no cardápio do Catccino.' NUNCA invente produtos que não estão no cardápio. "

            "Use o contexto abaixo para responder. "
            "Contexto:\n{context}"
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])

        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        rag_chain = create_retrieval_chain(retriever, question_answer_chain)

        resposta = rag_chain.invoke({"input": pergunta.mensagem})
        return {"resposta": resposta['answer'], "loja_fechada": False}
        
    except Exception as e:
        return {"erro": str(e)}