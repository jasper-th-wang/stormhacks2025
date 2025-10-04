import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(apiKey);

// Please return the defintion of the word: 
// Using this sentence for context:
// and this paragraph:
// return the informtation in this format Word: + empty line + definition: + empty line + relation to context: + empty line + example:

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Please return the defintion of the word: Oblivion. 
    Use this sentence for context: Sora finds Castle Oblivion, a base for Organization XIII. Marluxia uses the memory witch Namine to mess with Sora's memories. 
    Use this paragraph for context: Sora finds Castle Oblivion, a base for Organization XIII. Marluxia uses the memory witch Namine to mess with Sora's memories. Vexen makes a robot Riku to also mess with Sora. Sora beats up Marluxia anyways. Namine is sorry about being forced to mess with Sora's memories, but has to put him in a coma in a year to fix it, and even then he'll forget about meeting Namine.
    Return the informtation in this format:
    Word: 
    
    Definition: 
    
    Relation to context: 
    
    20-30 word example not related to the source: `
  });
  console.log(response.text);
}

main();