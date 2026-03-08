import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# LLM
llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="llama-3.1-8b-instant"
)

# Vector DB
vector_db = None


def process_pdf(file_path):

    global vector_db

    loader = PyPDFLoader(file_path)
    documents = loader.load()

    if not documents:
        raise Exception("PDF contains no readable text")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100
    )

    docs = splitter.split_documents(documents)

    if len(docs) == 0:
        raise Exception("PDF text extraction failed")

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vector_db = FAISS.from_documents(docs, embeddings)

    return "PDF processed successfully"


# ---------------- ASK AI ---------------- #

def ask_ai(question: str):

    global vector_db

    system_prompt = """
You are CivicSense AI.

Help citizens understand:
- government schemes
- building rules
- zoning laws
- permits
- civic policies

If a PDF document is uploaded, answer based on that document.

Give clear answers in bullet points. If the question is about zoning or building rules, explain regulations and permissions required.
"""

    context = ""

    if vector_db:

        docs = vector_db.similarity_search(question, k=3)

        context = "\n".join([doc.page_content for doc in docs])

    prompt = f"""
{system_prompt}

DOCUMENT CONTEXT:
{context}

User question: {question}
"""

    response = llm.invoke(prompt)

    return response.content