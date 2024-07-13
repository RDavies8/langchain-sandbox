import { RunnableLambda } from "@langchain/core/runnables";

let counter = 0;

export const tinker = () => {
  console.log("hello world");
};

const retryFn = (_: any) => {
  counter++;
  console.log(`attempt with counter ${counter}`);
  console.log("Inputs: " + _);
  throw new Error("Expected error");
};

const errorFn = (error: any, input: any) => {
  console.log("Error: " + error);
  console.log("input: " + input);
  input = 3;
  throw Error("Abort");
};

const fallbackFn = RunnableLambda.from((x: any, error: any) => x + x);

const chain = RunnableLambda.from(retryFn).withFallbacks({
  fallbacks: [fallbackFn],
});
//   .withRetry({
//     stopAfterAttempt: 2,
//     onFailedAttempt: errorFn,
//   });

await chain.invoke(2);
