import { getWordDefinition } from "./modules/gemini_api_call.js";
import {
  addToHistory,
  removeFromHistory,
  makeEntry,
} from "./modules/history.js";

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

    // Process input
    const { definition, interpretation, example } = await getWordDefinition(
      message.word,
      message.sentence,
      message.paragraph,
    );
    const entry = makeEntry(
      message.word,
      message.sentence,
      message.paragraph,
      definition,
      interpretation,
      example,
      "put source title here", // TODO: get from message
      "put source resource, e.g. example.com here", // TODO: get from message
    );
    await addToHistory(entry);

    // Send a message back that this worked
    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "showModal",
        entryId: entry.id,
      });
    }
  } else if (message.action === "deleteEntry") {
    removeFromHistory(message.entryId);
  }
});
