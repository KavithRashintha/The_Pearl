from fastapi import FastAPI
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain.chains.question_answering import load_qa_chain
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from starlette.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

index_name = "rag-chatbot"

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

docsearch = PineconeVectorStore.from_existing_index(index_name, embeddings)

llm = ChatGroq(temperature=0, groq_api_key=os.getenv("GROQ_API_KEY"), model_name="llama3-8b-8192")
chain = load_qa_chain(llm, chain_type="stuff")

class Query(BaseModel):
    query: str

@app.post("/chat")
async def chat(query: Query):
    similar_docs = docsearch.similarity_search(query.query)

    answer = chain.run(input_documents=similar_docs, question=query.query)

    return {"answer": answer}