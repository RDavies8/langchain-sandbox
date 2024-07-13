import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LLM, getChatModel } from "./chat-model.js";
import { RunnableSequence } from "@langchain/core/runnables";
import { EventSchema } from "schema/event.js";
import { EVENT_URLS } from "data/urls.js";

import "dotenv/config";
import { fetchText } from "retrieval.js";

export const run = async () => {
  const chatModel = getChatModel(LLM.OpenAI);

  // Define a custom prompt to provide instructions and any additional context.
  // 1) You can add examples into the prompt template to improve extraction quality
  // 2) Introduce additional parameters to take context into account (e.g., include metadata
  //    about the document from which the text was extracted.)
  const SYSTEM_PROMPT_TEMPLATE = `You are an expert extraction algorithm pulling information from event webpages into a structured JSON format.
    Only extract relevant information from the text.
    If you do not know the value of an attribute asked to extract, you may omit the attribute's value.
    Be sure to pay close attention to the allowed enum values.`;

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT_TEMPLATE],
    // Please see the how-to about improving performance with
    // reference examples.
    // new MessagesPlaceholder("examples"),
    ["human", "{text}"],
  ]);

  const chain = RunnableSequence.from([
    promptTemplate,
    chatModel.withStructuredOutput(EventSchema),
    //   , {
    //   name: "event",
    //   method: "jsonMode",
    // }),
    // .withRetry({
    //   stopAfterAttempt: 2,
    //   onFailedAttempt: () => console.error("Error Occurred"),
    // }),
  ]);

  const result = await chain.batch(
    await Promise.all(
      EVENT_URLS.map(async (url) => ({ text: await fetchText(url) }))
    )
  );

  // console.log(result);
};
