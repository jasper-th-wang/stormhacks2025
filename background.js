// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);
  if (message.action === "textSelected") {
    chrome.storage.local.set(
      {
        word: message.word,
        paragraph: message.paragraph,
        sentence: message.sentence,
      },
      () => {
        console.log("Text stored:", message.text);
        sendResponse({
          status: "ok",
          word: message.word,
          paragraph: message.paragraph,
          sentence: message.sentence,
        });
      },
    );
    return true; // Needed for async sendResponse
  }
});
