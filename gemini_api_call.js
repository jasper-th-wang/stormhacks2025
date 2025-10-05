
/**
 * Get Word definition with context from Gemini AI
 * @param {string} word - The word to define
 * @param {string} sentence - The sentence containing the word
 * @param {string} paragraph - The paragraph for additional context
 * @returns {Promise<string>} - Formatted definition string
 */

async function getWordDefinition(word, sentence, paragraph) {

    const API_KEY = "Your_API_Key";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Please return the definition of the word: ${word}

        Use this sentence for context: ${sentence}

        Use this paragraph for context: ${paragraph}

        Return the information in this format:
        Word:

        Definition:

        Relation to context:

        20-30 word example sentence, not related to the source:`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`APIrequest failed: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        return text;

    } catch (error) {
        console.error("Error getting defintion:", error);
        return `Error: ${error.message}`;
    }
}

async function main() {
    const word = "Oblivion";
    const sentence = "Sora finds Castle Oblivion, a base for Organization XIII. Marluxia uses the memory witch Namine to mess with Sora's memories.";
    const paragraph = "Sora finds Castle Oblivion, a base for Organization XIII. Marluxia uses the memory witch Namine to mess with Sora's memories. Vexen makes a robot Riku to also mess with Sora. Sora beats up Marluxia anyways. Namine is sorry about being forced to mess with Sora's memories, but has to put him in a coma in a year to fix it, and even then he'll forget about meeting Namine.";
    
    const definition = await getWordDefinition(word, sentence, paragraph);
    console.log(definition);

}

main();

export { getWordDefinition }