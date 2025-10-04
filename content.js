// This script runs on every webpage
console.log('Content script loaded');
let confirmButton = null;

// Listen for text selection
document.addEventListener('mouseup', (e) => {
  const selectedText = window.getSelection().toString().trim();
  
  // Remove old button if exists
  if (confirmButton) {
    confirmButton.remove();
  }
  
  // Only show button if text is selected
  if (selectedText.length > 0) {
    showConfirmButton(e.pageX, e.pageY, selectedText);
  }
});

function showConfirmButton(x, y, text) {
  // Create button
  confirmButton = document.createElement('button');
  confirmButton.textContent = '✓ Confirm';
  confirmButton.className = 'text-highlight-confirm';
  
  // Position it near the cursor
  confirmButton.style.left = x + 'px';
  confirmButton.style.top = (y + 10) + 'px';
  
  // When clicked, send text to extension
  confirmButton.addEventListener('click', () => {
    console.log('Selected text confirmed:', text);
    chrome.runtime.sendMessage({ 
      action: 'textSelected', 
      text: text 
    }, (response) => {
      console.log('Message sent, response:', response);
    });
    confirmButton.remove();
  });
  
  document.body.appendChild(confirmButton);
}

// Remove button if clicking elsewhere
document.addEventListener('mousedown', (e) => {
  if (confirmButton && !confirmButton.contains(e.target)) {
    confirmButton.remove();
  }
});
