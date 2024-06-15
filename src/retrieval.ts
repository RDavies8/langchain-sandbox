import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { htmlToText } from "html-to-text";

export const fetchText = async (url: string) => {

    console.time('1');
    const loader = new CheerioWebBaseLoader(url);

    const html = (await loader.load())[0].pageContent;

    const htmlText = htmlToText(html);

    return htmlText;




    // const docs = await loader.load();
    // console.timeEnd('1');

    // console.time('2');
    // const splitter = new RecursiveCharacterTextSplitter();
    // const splitDocs = await splitter.splitDocuments(docs);

    // const embeddings = new OllamaEmbeddings({
    //     model: "nomic-embed-text",
    //     maxConcurrency: 5,
    // });
    // console.timeEnd('2');

    // console.time('3');
    // const vectorstore = await MemoryVectorStore.fromDocuments(
    //     splitDocs,
    //     embeddings
    // );

    // const retriever = vectorstore.asRetriever();
    // console.timeEnd('3');

    // return null;
}