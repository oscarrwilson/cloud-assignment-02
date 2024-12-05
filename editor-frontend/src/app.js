const config = {};

// Load configuration dynamically
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) throw new Error('Failed to load configuration');
        Object.assign(config, await response.json());
    } catch (error) {
        alert("Error loading configuration: " + error.message);
    }
}

let activeRequest = null; // Track active requests to avoid overwriting responses

async function performOperation(type) {
    const textInput = document.getElementById('content').value.trim();
    const outputField = document.getElementById('output');

    if (!textInput) {
        outputField.value = "Please enter some text.";
        return;
    }

    const url = config[`${type}URL`]; // Map type to the corresponding service URL
    if (!url) {
        outputField.value = `Error: Service URL for "${type}" not found.`;
        return;
    }

    // Cancel any ongoing request before starting a new one
    if (activeRequest) {
        activeRequest.abort();
    }
    const controller = new AbortController();
    activeRequest = controller;

    try {
        const response = await fetch(`${url}/?text=${encodeURIComponent(textInput)}`, {
            signal: controller.signal
        });

        if (!response.ok) throw new Error(`Service error: ${response.statusText}`);

        const data = await response.json();

        // Process and display result based on operation type
        switch (type) {
            case "wordcount":
                outputField.value = data.success
                    ? `Word Count: ${data.wordCount}.`
                    : "Error: Unable to fetch word count.";
                break;

            case "charcount":
                outputField.value = !data.error
                    ? `Character Count: ${data.answer}.`
                    : "Error: Unable to fetch character count.";
                break;

            case "vowelcount":
                outputField.value = !data.error
                    ? `Vowel Count: ${data.answer}.`
                    : "Error: Unable to fetch vowel count.";
                break;

            case "punctuationcount":
                outputField.value = !data.error
                    ? `Punctuation Count: ${data.answer}.`
                    : "Error: Unable to fetch punctuation count.";
                break;

            case "avgwordlength":
                outputField.value = !data.error
                    ? `Average Word Length: ${data.answer.toFixed(2)}.`
                    : "Error: Unable to fetch average word length.";
                break;

            case "palindromedetection":
                outputField.value = !data.error
                    ? data.answer
                        ? `Palindrome Detected?: "${data.string}"`
                        : "No palindrome detected in the input text."
                    : "Error: Unable to check palindrome.";
                break;

            default:
                outputField.value = "Unsupported operation type.";
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            outputField.value = "Request cancelled.";
        } else {
            outputField.value = `Error: ${error.message}`;
            console.error("Operation failed", error);
        }
    } finally {
        if (activeRequest === controller) {
            activeRequest = null;
        }
    }
}

// Load configuration on page load
window.onload = loadConfig;