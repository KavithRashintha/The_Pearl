# main.py - Fully Updated
import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

# LangChain imports
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
pinecone_index_name = "rag-chatbot"
vectorstore = PineconeVectorStore.from_existing_index(pinecone_index_name, embeddings)
retriever = vectorstore.as_retriever()

llm = ChatGroq(temperature=0, model_name="llama-3.1-8b-instant")

prompt = ChatPromptTemplate.from_template("""
    Answer the user's question based only on the following context:
    <context>
    {context}
    </context>
    Question: {input}
""")

document_chain = create_stuff_documents_chain(llm, prompt)
retrieval_chain = create_retrieval_chain(retriever, document_chain)

class Query(BaseModel):
    query: str

@app.post("/chat")
async def chat(query: Query):
    # Use the new chain's .invoke method (replaces .run)
    response = await retrieval_chain.ainvoke({"input": query.query})
    return {"answer": response["answer"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8004)