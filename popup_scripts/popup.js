// When popup opens, get the stored text and display it
chrome.storage.local.get(['word'], (result) => {
  if (result.word) {
      document.getElementById('word').textContent = "word: " + result.word + "\n";
  }
});
chrome.storage.local.get(['paragraph'], (result) => {
  if (result.paragraph) {
      document.getElementById('paragraph').textContent = "paragraph: " + result.paragraph + "\n";
  }
});
chrome.storage.local.get(['sentence'], (result) => {
  if (result.sentence) {
      document.getElementById('sentence').textContent = "sentence: " + result.sentence;
  }
});
