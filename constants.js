// Constants

// History entry constants. Example history entry:
//
// {
//   id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
//   date: "2025-10-04T13:00:00.000Z"
//   word: "example",
//   sentence: "This is an example sentence.",
//   paragraph: "This is the paragraph containing the sentence.",
//   definition: "Definition from Gemini in context.",
//   interpretation: "Interpretation .",
//   example: "Any extra contextual info from Gemini.",
//   sourceTitle: "Example Site Title"
//   sourceResource: "https://example.com"
// }
export const HISTORY_KEY = "history";
export const ENTRY_KEYS = {
  ID: "id",
  DATE: "date",
  WORD: "word",
  SENTENCE: "sentence",
  PARAGRAPH: "paragraph",
  DEFINITION: "definition",
  INTERPRETATION: "interpretation",
  EXAMPLE: "example",
  SOURCE_TITLE: "sourceTitle",
  SOURCE_RESOURCE: "sourceResource",
};
