// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  if (message.action === 'textSelected') {
    chrome.storage.local.set({ selectedText: message.text }, () => {
      console.log('Text stored:', message.text);
        sendResponse({ status: 'ok', textReceived: message.text});
    });
    return true; // Needed for async sendResponse
  }
});
