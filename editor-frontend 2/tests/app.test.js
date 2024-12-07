// /**
//  * @jest-environment jsdom
//  */

// global.fetch = jest.fn(); // Mock fetch globally

// import { loadConfig, performOperation } from './app';

// describe('app.js Tests', () => {
//     beforeEach(() => {
//         // Reset fetch mock and DOM before each test
//         fetch.mockClear();
//         document.body.innerHTML = `
//             <textarea id="content" placeholder="Enter text here..."></textarea>
//             <input id="output" readonly placeholder="Result will appear here..." />
//         `;
//     });

//     describe('loadConfig', () => {
//         test('should load config.json successfully', async () => {
//             const mockConfig = { wordcountURL: "http://localhost:4002" };
//             fetch.mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => mockConfig,
//             });

//             await loadConfig();
//             expect(fetch).toHaveBeenCalledWith('config.json');
//             expect(fetch).toHaveBeenCalledTimes(1);
//         });

//         test('should throw an error if config.json cannot be loaded', async () => {
//             fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

//             await expect(loadConfig()).rejects.toThrow('Failed to load configuration');
//         });
//     });

//     describe('performOperation', () => {
//         test('should display an error message if input text is empty', async () => {
//             const outputField = document.getElementById('output');
//             const textarea = document.getElementById('content');
//             textarea.value = ''; // Simulate empty input

//             await performOperation('wordcount');
//             expect(outputField.value).toBe('Please enter some text.');
//         });

//         test('should display an error if service URL is missing', async () => {
//             const outputField = document.getElementById('output');
//             const textarea = document.getElementById('content');
//             textarea.value = 'Test input'; // Simulate valid input

//             await performOperation('nonexistentService');
//             expect(outputField.value).toBe('Error: Service URL for "nonexistentService" not found.');
//         });

//         test('should call the correct service URL with input text', async () => {
//             const mockResponse = { answer: 'Test result' };
//             fetch.mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => mockResponse,
//             });

//             // Simulate a valid configuration
//             config.wordcountURL = 'http://localhost:4002';
//             const textarea = document.getElementById('content');
//             textarea.value = 'Test input'; // Simulate valid input

//             await performOperation('wordcount');

//             expect(fetch).toHaveBeenCalledWith(
//                 'http://localhost:4002/?text=Test%20input',
//                 expect.any(Object)
//             );

//             const outputField = document.getElementById('output');
//             expect(outputField.value).toBe('Test result');
//         });

//         test('should handle backend errors gracefully', async () => {
//             fetch.mockResolvedValueOnce({
//                 ok: false,
//                 statusText: 'Internal Server Error',
//             });

//             // Simulate a valid configuration
//             config.wordcountURL = 'http://localhost:4002';
//             const textarea = document.getElementById('content');
//             textarea.value = 'Test input'; // Simulate valid input

//             await performOperation('wordcount');

//             const outputField = document.getElementById('output');
//             expect(outputField.value).toBe('Error: Service error: Internal Server Error');
//         });

//         test('should handle fetch failure gracefully', async () => {
//             fetch.mockRejectedValueOnce(new Error('Network failure'));

//             // Simulate a valid configuration
//             config.wordcountURL = 'http://localhost:4002';
//             const textarea = document.getElementById('content');
//             textarea.value = 'Test input'; // Simulate valid input

//             await performOperation('wordcount');

//             const outputField = document.getElementById('output');
//             expect(outputField.value).toBe('Error: Network failure');
//         });
//     });
// });