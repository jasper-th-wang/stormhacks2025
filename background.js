import { getWordDefinition } from "./modules/gemini_api_call.js";
import { addToHistory, makeEntry } from "./modules/history.js";

// Listen for messages from content script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("Background received message:", message);
  if (message.action === "textSelected") {
    // Send a response
    // NOTE: If we try to send this after processing it might
    // fail; sendResponse enforces a calback lifetime of ~5 seconds—no
    // way around it
    sendResponse({
      status: "ok",
      word: message.word,
      paragraph: message.paragraph,
      sentence: message.sentence,
    });

    const { definition, interpretation, example } = await getWordDefinition(
      message.word,
      message.sentence,
      message.paragraph,
    );
    // TODO: put in source title and resource once available from sender
    const entry = makeEntry(
      message.word,
      message.sentence,
      message.paragraph,
      definition,
      interpretation,
      example,
      "put source title here",
      "put source resource, e.g. example.com here",
    );
    addToHistory(entry);
  }
});
