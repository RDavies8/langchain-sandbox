import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatOpenAI } from "@langchain/openai";

import { BaseChatModel } from "@langchain/core/language_models/chat_models";


// Recommended for extraction jobs
const TEMPERATURE = 0;

export const enum LLM {
    OpenAI,
    Ollama,
}

export const getChatModel = (llm: LLM) => {
    switch (llm) {
        case LLM.OpenAI:
            return getOpenAiModel();
        // case LLM.Ollama:
        //     return getOllamaModel();
        default:
            throw new Error("LLM not specified for chat model");
    }
};

const getOpenAiModel = () => new ChatOpenAI({ temperature: TEMPERATURE });



const getOllamaModel = () => new ChatOllama({
    baseUrl: "http://localhost:11434", // Default value
    model: "gemma:2b",
    temperature: TEMPERATURE
});
