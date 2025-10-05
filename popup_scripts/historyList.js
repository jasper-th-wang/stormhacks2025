chrome.storage.local.get({ history: [] }, (result) => {
  const entryList = result.history;

  if (entryList.length === 0) {
    return;
  }

  // Show the title
  document.getElementById("listTitle").style.display = "block";

  // List the search history
  // TODO: make this look not terrible
  const listDiv = document.getElementById("list");

  for (const entry of entryList) {
    const div = document.createElement("div");
    const date = new Date(entry.date).toLocaleString("en-CA", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    div.textContent = `${entry.word} | ${date}`;
    listDiv.appendChild(div);
  }
});
