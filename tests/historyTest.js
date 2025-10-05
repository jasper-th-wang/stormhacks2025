import { ENTRY_KEYS, HISTORY_KEY } from "../constants.js";
import {
  addToHistory,
  getHistory,
  makeEntry,
  removeFromHistory,
} from "../modules/history.js";

// Perform some operations and log history to console after each
const testHistoryNonSync = async () => {
  const makeEntryArgs = [
    "word",
    "sentence",
    "paragraph",
    "definition",
    "interpretation",
    "example",
    "sourceTitle",
    "sourceResource",
  ];

  const testEntry1 = makeEntry(...makeEntryArgs);
  await addToHistory(testEntry1);
  const history1 = await getHistory();
  console.log(history1);

  const testEntry2 = makeEntry(...makeEntryArgs);
  await addToHistory(testEntry2);
  const history2 = await getHistory();
  console.log(history2);

  // Remove the first entry
  await removeFromHistory(testEntry1[ENTRY_KEYS.ID]);
  const history3 = await getHistory();
  console.log(history3);
};

testHistoryNonSync();
