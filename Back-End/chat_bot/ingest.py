import os
from dotenv import load_dotenv
from langchain_community.document_loaders import CSVLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore

load_dotenv()

index_name = "rag-chatbot"

def ingest_docs():
    print("Loading CSV document...")
    loader = CSVLoader(file_path='files/destinations.csv') # Ensure this path is correct
    documents = loader.load()

    print("Creating embeddings and uploading to Pinecone...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    PineconeVectorStore.from_documents(documents, embeddings, index_name=index_name)

    print("✅ CSV Document ingested successfully!")

if __name__ == '__main__':
    ingest_docs()