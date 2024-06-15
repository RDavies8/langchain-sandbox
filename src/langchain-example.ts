import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LLM, getChatModel } from './chat-model.js'
import { RunnableSequence } from "@langchain/core/runnables";
import { EventSchema, Distance } from "schema/event.js";

import 'dotenv/config'
import { fetchText } from "retrieval.js";

const URL = "https://runsignup.com/Race/FL/Tallahassee/JR6222024"

export const run = async () => {


  const chatModel = getChatModel(LLM.OpenAI);


  // Define a custom prompt to provide instructions and any additional context.
  // 1) You can add examples into the prompt template to improve extraction quality
  // 2) Introduce additional parameters to take context into account (e.g., include metadata
  //    about the document from which the text was extracted.)
  const SYSTEM_PROMPT_TEMPLATE = `You are an expert extraction algorithm pulling information from event webpages.
    Only extract relevant information from the text.
    If you do not know the value of an attribute asked to extract, you may omit the attribute's value.`;

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT_TEMPLATE],
    // Please see the how-to about improving performance with
    // reference examples.
    // new MessagesPlaceholder("examples"),
    ["human", "{text}"],
  ]);

  const text = await fetchText(URL);

  const chain = RunnableSequence.from([promptTemplate, chatModel.withStructuredOutput(EventSchema)]);

  const result = await chain.invoke({ text });

  console.log(result);
};