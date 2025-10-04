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
export const HISTORY_WORD_KEY = "word";
export const HISTORY_SENTENCE_KEY = "sentence";
export const HISTORY_PARAGRAPH_KEY = "paragraph";
export const HISTORY_DEFINITION_KEY = "definition";
export const HISTORY_INTERPRETATION_KEY = "interpretation";
export const HISTORY_SOURCE_TITLE_KEY = "sourceTitle";
export const HISTORY_SOURCE_RESOURCE_KEY = "sourceResource";
export const HISTORY_DATE_KEY = "date";
