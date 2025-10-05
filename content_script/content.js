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
        (entry) => entry.id === message.entryId,
      )[0];
      // DEBUG:
      // const lines = [
      //   `word: ${entry.word}`,
      //   `definition: ${entry.definition}`,
      //   `interpretation: ${entry.interpretation}`,
      //   `example sentence: ${entry.example}`,
      // ];
      // alert(lines.join("\n\n"));

      // Example usage (for testing)
      wordModal.show({
        id: entry["id"],
        word: entry["word"],
        definition: entry["definition"],
        interpretation: entry["interpretation"],
        example: entry["example"],
      });
    });
  }
});

function getSentence(paragraph, word) {
  const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.filter((s) =>
    s.toLowerCase().includes(word.toLowerCase()),
  )[0];
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

// Word Definition Modal Controller
class WordModal {
  constructor() {
    this.overlay = null;
    this.modal = null;
    this.init();
  }

  init() {
    // Create modal elements if they don't exist
    if (!document.getElementById("word-modal-overlay")) {
      this.createModal();
    }

    this.overlay = document.getElementById("word-modal-overlay");
    this.modal = this.overlay.querySelector(".word-modal");

    // Event listeners
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    const closeBtn = this.overlay.querySelector(".word-modal-close");
    closeBtn.addEventListener("click", () => this.close());

    const deleteBtn = this.overlay.querySelector(".word-modal-delete");
    deleteBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: "deleteEntry",
        entryId: this.overlay.dataset.id,
      });
      this.close();
    });

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.overlay.classList.contains("active")) {
        this.close();
      }
    });
  }

  createModal() {
    const modalHTML = `
      <div id="word-modal-overlay" class="word-modal-overlay">
        <div class="word-modal">
          <button class="word-modal-delete" id="word-modal-delete" aria-label="Close modal">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6h-4V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2ZM10 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm7 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8h10Z"/></svg>
          </button>
          <button class="word-modal-close" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="word-modal-header">
            <h2 id="word-modal-word" class="word-modal-word">Word</h2>
          </div>
          <div class="word-modal-content">
            <div class="word-modal-section">
              <h3 class="word-modal-label">Definition</h3>
              <p id="word-modal-definition" class="word-modal-text">The meaning of the word...</p>
            </div>
            <div class="word-modal-section">
              <h3 class="word-modal-label">In Context</h3>
              <p id="word-modal-interpretation" class="word-modal-text">How it's used in this context...</p>
            </div>
            <div class="word-modal-section">
              <h3 class="word-modal-label">Example</h3>
              <p id="word-modal-example" class="word-modal-text">An example sentence...</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  show(data) {
    // Update content
    document.getElementById("word-modal-word").textContent =
      data.word || "Word";
    document.getElementById("word-modal-definition").textContent =
      data.definition || "Loading...";
    document.getElementById("word-modal-interpretation").textContent =
      data.interpretation || "Loading...";
    document.getElementById("word-modal-example").textContent =
      data.example || "Loading...";

    // Show modal
    this.overlay.classList.add("active");
    this.overlay.dataset.id = data.id;
    document.body.style.overflow = "hidden";
  }

  close() {
    this.overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  update(data) {
    if (data.word)
      document.getElementById("word-modal-word").textContent = data.word;
    if (data.definition)
      document.getElementById("word-modal-definition").textContent =
        data.definition;
    if (data.interpretation)
      document.getElementById("word-modal-interpretation").textContent =
        data.interpretation;
    if (data.example)
      document.getElementById("word-modal-example").textContent = data.example;
  }
}

// Initialize modal
const wordModal = new WordModal();
