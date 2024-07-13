import TurndownService from "turndown";
import {} from "cheerio";
import fetch from "node-fetch";

const turndownService = new TurndownService().remove([
  "script",
  "meta",
  "style",
  "head",
]);

export const fetchText = async (url: string) => {
  const response = await fetch(url);

  return turndownService.turndown(await response.text());
};
