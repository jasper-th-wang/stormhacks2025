// This script runs on every webpage
console.log('Content script loaded');
// Create button
let confirmButton = document.createElement('button');
document.body.appendChild(confirmButton);
confirmButton.textContent = '✓ Confirm';
confirmButton.className = 'text-highlight-confirm';
confirmButton.style.display = 'none';
let selectedText = "";

    // When clicked, send text to extension
    confirmButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ 
            action: 'textSelected', 
            text: selectedText 
        }, (response) => {
            console.log('Message sent, response:', response);
        });
        hideConfirmButton();
    });

// Listen for text selection
document.addEventListener('selectionchange', (e) => {
    const selection = window.getSelection();
    selectedText = selection.toString().trim();

    if (!selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        showConfirmButton(rect.left + window.scrollX, rect.bottom + window.scrollY);
    } else {
        hideConfirmButton();
    }

    console.log(`You've selected: ${selectedText}`)
});

function showConfirmButton(x, y) {
    // Position element below selection
    confirmButton.style.display = 'block';
    confirmButton.style.position = 'absolute';
    confirmButton.style.left = `${x}px`;
    confirmButton.style.top = `${y}px`;

}

function hideConfirmButton() {
    if (confirmButton.style.display === 'block') {
        confirmButton.style.display = 'none';
    }
}
