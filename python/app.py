from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
from datetime import date
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List

# IMPORTAÇÕES GLOBAIS
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.retrievers import BM25Retriever

load_dotenv()
CHAVE_GOOGLE = os.getenv("GOOGLE_API_KEY")

app = FastAPI(title="Tenda do Ancião - RAG Multi-Conta")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# SIMULAÇÃO DE BANCO DE DADOS (Prepara o terreno para o futuro)
# ==========================================
# Estrutura: { "id_do_usuario": { "grimorios": { "id_grimorio": retriever }, "cota": { "data": "2026-03-07", "perguntas_hoje": 0 } } }
db_usuarios = {}

LIMITE_PERGUNTAS_DIA = 5 # 🔒 Troque este número pelo limite que desejar

def verificar_cota_diaria(user_id: str):
    hoje = str(date.today())
    
    # Se o usuário não existe no DB, cria o perfil dele
    if user_id not in db_usuarios:
        db_usuarios[user_id] = {
            "grimorios": {},
            "cota": {"data": hoje, "perguntas_hoje": 0}
        }
        
    # Se virou o dia, reseta a cota
    if db_usuarios[user_id]["cota"]["data"] != hoje:
        db_usuarios[user_id]["cota"]["data"] = hoje
        db_usuarios[user_id]["cota"]["perguntas_hoje"] = 0
        
    # Verifica se já bateu o limite
    if db_usuarios[user_id]["cota"]["perguntas_hoje"] >= LIMITE_PERGUNTAS_DIA:
        return False
    return True

# ==========================================
# ROTAS DA API
# ==========================================

@app.post("/upload")
async def upload_pdf(
    files: List[UploadFile] = File(...), 
    nome: str = Form(...),
    user_id: str = Form(...),       # 🚀 Agora exige a conta do jogador
    grimorio_id: str = Form(...)    # 🚀 Agora exige o ID do grimório
):
    if not CHAVE_GOOGLE:
        raise HTTPException(status_code=500, detail="Chave do Google ausente no arquivo .env!")

    # Garante que o usuário existe no nosso DB simulado
    verificar_cota_diaria(user_id)
    todos_os_documentos = []

    try:
        for file in files:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_file.write(await file.read())
                temp_path = temp_file.name

            try:
                loader = PyPDFLoader(temp_path)
                docs = loader.load()
                if docs:
                    todos_os_documentos.extend(docs)
            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)

        if not todos_os_documentos:
            raise ValueError("Os pergaminhos estão em branco ou são ilegíveis.")

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
        pedacos = text_splitter.split_documents(todos_os_documentos)

        retriever = BM25Retriever.from_documents(pedacos)
        retriever.k = 6
        
        # 🔒 SALVA O GRIMÓRIO NA CONTA ESPECÍFICA DO JOGADOR
        db_usuarios[user_id]["grimorios"][grimorio_id] = retriever

        return {"status": "sucesso", "mensagem": f"As runas de '{nome}' foram guardadas no seu baú pessoal!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Falha na magia de leitura: {str(e)}")

class Pergunta(BaseModel):
    texto: str
    user_id: str       # 🚀 Conta do jogador
    grimorio_id: str   # 🚀 Qual grimório ele está lendo

# Inicia o Cérebro e o Prompt uma única vez para o servidor
llm_anciao = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1)
prompt_anciao = ChatPromptTemplate.from_messages([
    ("system", """Você é "O Ancião", um mentor sábio e erudito que habita uma tenda mística no universo de um jogo de sobrevivência.
    Sua única função é ser um professor particular excelente.
    
    1. Baseie-se APENAS nos pergaminhos fornecidos. Se não estiver lá, diga que as runas silenciam sobre o assunto.
    2. Nunca invente regras ou conceitos. Exatidão total.
    3. Nunca fale frases de IA ou "segundo o PDF".
    4. Quebre explicações complexas em listas.
    5. **Use negrito (Markdown)** sempre que mencionar uma regra de ouro ou termo chave.
    6. Formate TODO o seu texto usando Markdown estruturado."""),
    ("human", "PERGAMINHOS DE ESTUDO:\n{context}\n\nDÚVIDA DO APRENDIZ:\n{input}")
])

@app.post("/chat")
async def chat_rag(pergunta: Pergunta):
    # 1. VERIFICA A COTA DIÁRIA (Trava de limite)
    if not verificar_cota_diaria(pergunta.user_id):
        raise HTTPException(status_code=403, detail=f"O Ancião está exausto. O limite é de {LIMITE_PERGUNTAS_DIA} perguntas por dia. Volte amanhã com a mente fresca.")

    # 2. VERIFICA SE O GRIMÓRIO PERTENCE À CONTA DO JOGADOR
    try:
        retriever = db_usuarios[pergunta.user_id]["grimorios"][pergunta.grimorio_id]
    except KeyError:
        raise HTTPException(status_code=400, detail="Este grimório não existe no seu baú. Faça o upload primeiro.")

    try:
        documentos_encontrados = retriever.invoke(pergunta.texto)
        if not documentos_encontrados:
            return {"resposta": "Jovem aprendiz, não encontrei rastros dessa dúvida nas páginas destes grimórios específicos da sua conta."}

        textos_juntos = "\n\n".join([f"--- TRECHO ---\n{doc.page_content}" for doc in documentos_encontrados])
        mensagens = prompt_anciao.format_messages(context=textos_juntos, input=pergunta.texto)
        resposta_final = llm_anciao.invoke(mensagens)
        
        # 3. CONSOME UMA PERGUNTA DA COTA DIÁRIA
        db_usuarios[pergunta.user_id]["cota"]["perguntas_hoje"] += 1
        
        # Retorna a resposta (em Markdown) e informa quantas perguntas restam hoje
        perguntas_restantes = LIMITE_PERGUNTAS_DIA - db_usuarios[pergunta.user_id]["cota"]["perguntas_hoje"]
        
        return {
            "resposta": resposta_final.content,
            "restantes": perguntas_restantes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interferência Mística: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)