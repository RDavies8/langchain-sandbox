import { LLMChain  } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

const model = new OpenAI({ temperature: 0 });
const prompt = PromptTemplate.fromTemplate("What is the meaning of life?");
const chain = new LLMChain({ llm: model, prompt });
const result = await chain.call({});
console.log("Result from LLM:" + result.text);
