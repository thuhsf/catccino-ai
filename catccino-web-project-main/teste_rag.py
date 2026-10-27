import chromadb
import os

# 1. Configura o Chroma (em memória, para teste rápido)
client = chromadb.Client()
collection = client.create_collection(name="catccino_test")

# 2. Lê seus arquivos da pasta knowledge_base
documentos = []
ids = []
metadados = []

pasta = "knowledge_base"
for nome_arquivo in os.listdir(pasta):
    if nome_arquivo.endswith(".md") or nome_arquivo.endswith(".txt"):
        caminho = os.path.join(pasta, nome_arquivo)
        with open(caminho, "r", encoding="utf-8") as f:
            conteudo = f.read()
            # Para simplificar, vamos colocar o arquivo inteiro como um documento
            documentos.append(conteudo)
            ids.append(nome_arquivo)
            metadados.append({"fonte": nome_arquivo})

print(f"Carregados {len(documentos)} arquivos: {ids}")

# 3. Adiciona ao Chroma (ele gera os embeddings automaticamente)
collection.add(
    documents=documentos,
    ids=ids,
    metadatas=metadados
)

# 4. TESTE: Faz uma pergunta e vê o que ele recupera
pergunta = "Quais gatos estão disponíveis para adoção?"
print(f"\n🔍 Buscando por: '{pergunta}'")

resultados = collection.query(
    query_texts=[pergunta],
    n_results=2 # Queremos os 2 trechos mais relevantes
)

print("\n--- RESULTADO DA BUSCA SEMÂNTICA ---")
for i, doc in enumerate(resultados['documents'][0]):
    fonte = resultados['metadatas'][0][i]['fonte']
    print(f"\n📄 Fonte encontrada: {fonte}")
    print(f"Trecho: {doc[:200]}...") # Mostra só o começo