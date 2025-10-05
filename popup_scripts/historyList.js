chrome.storage.local.get({ history: [] }, async (result) => {
  const entryList = result.history.reverse();
  const listDiv = document.getElementById("list");

  if (entryList.length === 0) {
    listDiv.textContent = "No history";
    return;
  }

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // List the search history
  for (const entry of entryList) {
    // Make div and have it listen to click events
    const div = document.createElement("div");
    div.className = "action";
    div.addEventListener("click", () => {
      chrome.tabs.sendMessage(tab.id, {action: "showModal", entryId: entry.id})
    });

    const date = new Date(entry.date).toLocaleString("en-CA", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    div.textContent = `${entry.word} | ${date}`;
    listDiv.appendChild(div);
  }
});
