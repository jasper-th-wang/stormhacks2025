// import nlp from "compromise";
// This script runs on every webpage
console.log("Content script loaded");
// Create button
let confirmButton = document.createElement("button");
document.body.appendChild(confirmButton);
confirmButton.textContent = "✓ Confirm";
confirmButton.className = "text-highlight-confirm";
confirmButton.style.display = "none";
let selectedText = "";

// When clicked, send text to extension
confirmButton.addEventListener("click", () => {
  const paragraph = getParagraph();
  const sentence = getSentence(paragraph, selectedText);
  console.log(`paragraph: ${paragraph}`);
  console.log(`sentence: ${sentence}`);
  chrome.runtime.sendMessage(
    {
      action: "textSelected",
      word: selectedText,
      paragraph: paragraph,
      sentence: sentence,
    },
    (response) => {
      console.log("Message sent, response:", response);
    },
  );
  hideConfirmButton();
});

// Listen for a message back after we sent the service worker the
// selection message
// TODO: use a proper display for the result. Not an alert!
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "showModal") {
    chrome.storage.local.get({ history: [] }, (result) => {
      const entry = result.history.filter(
        (entry) => (entry.id === message.entryId),
      )[0];
      const lines = [
        `word: ${entry.word}`,
        `definition: ${entry.definition}`,
        `interpretation: ${entry.interpretation}`,
        `example sentence: ${entry.example}`,
      ];
      alert(lines.join("\n\n"));
    });
  }
});

function getSentence(paragraph, word) {
  const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.filter((s) => s.toLowerCase().includes(word.toLowerCase()))[0];
}

function getParagraph() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;

  // Get the starting node of the selection
  let node = selection.getRangeAt(0).startContainer;

  // If it's a text node, get its parent element
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement;
  }

  // Traverse up the DOM tree to find the closest paragraph-like element
  while (node && node !== document.body) {
    const tagName = node.tagName?.toLowerCase();

    // Check for paragraph or paragraph-like elements
    if (
      tagName === "p" ||
      tagName === "div" ||
      tagName === "article" ||
      tagName === "section" ||
      tagName === "li"
    ) {
      return node.textContent.trim();
    }

    node = node.parentElement;
  }

  // Fallback: return the selected text if no paragraph found
  return selection.toString().trim();
}

// Listen for text selection
document.addEventListener("selectionchange", (e) => {
  const selection = window.getSelection();
  selectedText = selection.toString().trim();

  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    showConfirmButton(rect.left + window.scrollX, rect.bottom + window.scrollY);
  } else {
    hideConfirmButton();
  }

  console.log(`You've selected: ${selectedText}`);
});

function showConfirmButton(x, y) {
  // Position element below selection
  confirmButton.style.display = "block";
  confirmButton.style.position = "absolute";
  confirmButton.style.left = `${x}px`;
  confirmButton.style.top = `${y}px`;
}

function hideConfirmButton() {
  if (confirmButton.style.display === "block") {
    confirmButton.style.display = "none";
  }
}
