import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";


import { createRetrievalChain } from "langchain/chains/retrieval";


import 'dotenv/config'



const getRetriever = async () => {

  const loader = new CheerioWebBaseLoader(
    "https://docs.smith.langchain.com/user_guide"
  );

  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);

  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    maxConcurrency: 5,
  });

  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  const retriever = vectorstore.asRetriever();

  return retriever;
}


export const run = async () => {


  const chatModel = new ChatOllama({
    baseUrl: "http://localhost:11434", // Default value
    model: "gemma:latest",
  });


  const prompt =
    ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
      <context>
      {context}
      </context>

      Question: {input}`);

  const documentChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt,
  });


  const retriever = await getRetriever();

  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });

  const result = await retrievalChain.invoke({
    input: "what is LangSmith?",
  });
  
  console.log(result.answer);
};