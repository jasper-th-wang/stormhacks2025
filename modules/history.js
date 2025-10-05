import { ENTRY_KEYS, HISTORY_KEY } from "../constants.js";

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
  [ENTRY_KEYS.ID]: crypto.randomUUID(),
  [ENTRY_KEYS.DATE]: new Date().toISOString(),
  [ENTRY_KEYS.WORD]: word,
  [ENTRY_KEYS.SENTENCE]: sentence,
  [ENTRY_KEYS.PARAGRAPH]: paragraph,
  [ENTRY_KEYS.DEFINITION]: definition,
  [ENTRY_KEYS.INTERPRETATION]: interpretation,
  [ENTRY_KEYS.EXAMPLE]: example,
  [ENTRY_KEYS.SOURCE_TITLE]: sourceTitle,
  [ENTRY_KEYS.SOURCE_RESOURCE]: sourceResource,
});

// Add a new history entry to the end of the history array
export const addToHistory = async (entry) => {
  const { HISTORY_KEY: history } = await chrome.storage.local.get({
    HISTORY_KEY: [],
  });
  chrome.storage.local.set({ HISTORY_KEY: [...history, entry] });
};

// Get all history entries
export const getHistory = async () =>
  (await chrome.storage.local.get({ HISTORY_KEY })).HISTORY_KEY;

// Remove history entry
export const removeFromHistory = async (id) => {
  const { HISTORY_KEY: history } = await chrome.storage.local.get({
    HISTORY_KEY: [],
  });
  chrome.storage.local.set({
    HISTORY_KEY: history.filter((entry) => entry[ENTRY_KEYS.ID] != id),
  });
};
