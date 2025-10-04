// When popup opens, get the stored text and display it
chrome.storage.local.get(['selectedText'], (result) => {
  if (result.selectedText) {
    document.getElementById('selectedText').textContent = result.selectedText;
  }
});
