// Construct entry
export const makeEntry = (
  word,
  sentence,
  paragraph,
  definition,
  interpretation,
  example,
  sourceTitle,
  sourceResource,
) => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  word: word,
  sentence: sentence,
  paragraph: paragraph,
  definition: definition,
  interpretation: interpretation,
  example: example,
  sourceTitle: sourceTitle,
  sourceResource: sourceResource,
});

// Add a new history entry to the end of the history array
export const addToHistory = async (entry) => {
  const storageHistory = (
    await chrome.storage.local.get({
      history: [],
    })
  ).history;
  chrome.storage.local.set({ history: [...storageHistory, entry] });
};

// Get all history entries
export const getHistory = async () =>
  (await chrome.storage.local.get({ history })).history;

// Remove history entry
export const removeFromHistory = async (id) => {
  const history = await getHistory();
  chrome.storage.local.set({
    history: history.filter((entry) => entry[ENTRY_KEYS.ID] != id),
  });
};
