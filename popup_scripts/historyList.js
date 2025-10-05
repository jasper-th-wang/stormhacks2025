chrome.storage.local.get({ history: [] }, async (result) => {
  const entryList = result.history.reverse();

  if (entryList.length === 0) {
    return;
  }

  // Show the title
  document.getElementById("listTitle").style.display = "block";

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // List the search history
  // TODO: make this look not terrible
  const listDiv = document.getElementById("list");

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
