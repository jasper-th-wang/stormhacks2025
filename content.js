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
      text: selectedText,
    },
    (response) => {
      console.log("Message sent, response:", response);
    },
  );
  hideConfirmButton();
});

// TODO: might break for more than one word?
function getSentence(paragraph, word) {
  const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.filter((s) => s.toLowerCase().includes(word.toLowerCase()));
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
