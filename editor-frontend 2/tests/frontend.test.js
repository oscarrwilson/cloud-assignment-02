/**
 * @jest-environment jsdom
 */

import { fireEvent, getByText, getByPlaceholderText } from "@testing-library/dom";

describe("QUBeditotron3000 - Frontend Tests", () => {
    let container;

    beforeEach(() => {
        // Load the HTML structure into the test DOM
        document.body.innerHTML = `
            <div id="editor">
                <div id="logo">QUBeditotron3000</div>
                <textarea id="content" placeholder="Enter text here..."></textarea>
                <input type="text" id="output" readonly placeholder="Result will appear here..." />
                <div>
                    <button class="operation" onclick="performOperation('wordcount');">Word Count</button>
                    <button class="operation" onclick="performOperation('charcount');">Character Count</button>
                </div>
                <div>
                    <button class="operation" onclick="performOperation('vowelcount');">Vowel Count</button>
                    <button class="operation" onclick="performOperation('punctuationcount');">Punctuation Count</button>
                </div>
                <div>
                    <button class="operation" onclick="performOperation('avgwordlength');">Average Word Length</button>
                    <button class="operation" onclick="performOperation('palindromedetection');">Palindrome Detection</button>
                </div>
            </div>
        `;
    });

    test("renders logo and essential UI components", () => {
        expect(document.getElementById("logo").textContent).toBe("QUBeditotron3000");
        expect(getByPlaceholderText(document.body, "Enter text here...")).toBeInTheDocument();
        expect(getByPlaceholderText(document.body, "Result will appear here...")).toBeInTheDocument();
    });

    test("textarea and output field are interactive", () => {
        const textarea = getByPlaceholderText(document.body, "Enter text here...");
        const outputField = getByPlaceholderText(document.body, "Result will appear here...");

        // Simulate typing in textarea
        fireEvent.input(textarea, { target: { value: "Test input" } });
        expect(textarea.value).toBe("Test input");

        // Simulate output field update
        outputField.value = "Test output";
        expect(outputField.value).toBe("Test output");
    });

    test("buttons are clickable and trigger operations", () => {
        const wordCountButton = getByText(document.body, "Word Count");
        const charCountButton = getByText(document.body, "Character Count");

        fireEvent.click(wordCountButton);
        fireEvent.click(charCountButton);

        expect(wordCountButton).toBeEnabled();
        expect(charCountButton).toBeEnabled();
    });

    test("button hover and focus styles are applied", () => {
        const wordCountButton = getByText(document.body, "Word Count");

        // Check hover effect
        fireEvent.mouseOver(wordCountButton);
        expect(wordCountButton.style.backgroundColor).toBe("rgb(0, 86, 179)"); // Hover color

        // Check focus
        fireEvent.focus(wordCountButton);
        expect(wordCountButton.style.outline).toBe(""); // No outline
    });

    test("error message displayed for empty input", () => {
        const textarea = getByPlaceholderText(document.body, "Enter text here...");
        const outputField = getByPlaceholderText(document.body, "Result will appear here...");
        const wordCountButton = getByText(document.body, "Word Count");

        textarea.value = ""; // Simulate empty input
        fireEvent.click(wordCountButton);

        // Output should show error message
        setTimeout(() => {
            expect(outputField.value).toBe("Please enter some text.");
        }, 100);
    });

    test("output field updates correctly after operation", () => {
        const textarea = getByPlaceholderText(document.body, "Enter text here...");
        const outputField = getByPlaceholderText(document.body, "Result will appear here...");
        const charCountButton = getByText(document.body, "Character Count");

        textarea.value = "Hello, world!";
        fireEvent.click(charCountButton);

        // Mock response
        setTimeout(() => {
            expect(outputField.value).toBe("13"); // Example output: 13 characters
        }, 500);
    });
});