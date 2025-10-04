// Constants

// History entry constants. Example history entry:
//
// {
//   word: "example",
//   sentence: "This is an example sentence.",
//   paragraph: "This is the paragraph containing the sentence.",
//   definition: "Definition from Gemini in context.",
//   interpretation: "Any extra contextual info from Gemini.",
//   sourceTitle: "Example Site Title"
//   sourceResource: "https://example.com"
//   date: "2025-10-04T13:00:00.000Z"
// }
//
// For date use ISO string generated with date.toISOString().
export const HISTORY_KEY = "history";
export const ENTRY_KEYS = {
  WORD: "word",
  SENTENCE: "sentence",
  PARAGRAPH: "paragraph",
  DEFINITION: "definition",
  INTERPRETATION: "interpretation",
  SOURCE_TITLE: "sourceTitle",
  SOURCE_RESOURCE: "sourceResource",
  DATE: "date",
};
